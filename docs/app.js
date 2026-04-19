/**
 * nabokov-2 reader — loads markdown from the repo via raw.githubusercontent.com
 * Hash routes: #/001/chat | #/001/memory
 * Query overrides: ?branch=main&owner=jayhack&repo=creative-writing
 */

import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.0/+esm";

const state = {
  config: null,
  chaptersMeta: [],
  chapterTitles: {},
  cache: new Map(),
};

const $ = (id) => document.getElementById(id);

function getQueryOverrides() {
  const p = new URLSearchParams(window.location.search);
  return {
    owner: p.get("owner") || undefined,
    repo: p.get("repo") || undefined,
    branch: p.get("branch") || undefined,
  };
}

function rawUrl(path) {
  const { owner, repo, branch } = state.config.github;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

async function fetchText(path) {
  const url = rawUrl(path);
  if (state.cache.has(url)) return state.cache.get(url);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  const text = await res.text();
  state.cache.set(url, text);
  return text;
}

function parseTranscript(md) {
  const lines = md.split("\n");
  let title = "";
  let i = 0;
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    i = 1;
    while (i < lines.length && lines[i].trim() === "") i++;
  }
  const rest = lines.slice(i).join("\n").trim();
  const turns = [];
  const blocks = rest.split(/\n\n(?=USER:|BOT:)/);
  for (const b of blocks) {
    const m = b.match(/^(USER|BOT):\s*([\s\S]*)$/);
    if (m) turns.push({ role: m[1].toLowerCase(), text: m[2].trim() });
  }
  return { title, turns };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineCode(md) {
  return md.replace(/`([^`]+)`/g, "<code>$1</code>");
}

function formatBubbleText(text) {
  const parts = [];
  let pos = 0;
  const re = /```(?:[a-zA-Z0-9_-]*\n)?([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > pos) {
      parts.push({ kind: "text", s: text.slice(pos, m.index) });
    }
    parts.push({ kind: "code", s: m[1].replace(/\n$/, "") });
    pos = m.index + m[0].length;
  }
  if (pos < text.length) parts.push({ kind: "text", s: text.slice(pos) });
  if (parts.length === 0) parts.push({ kind: "text", s: text });

  return parts
    .map((p) => {
      if (p.kind === "code") {
        return `<pre class="bubble-pre"><code>${escapeHtml(p.s)}</code></pre>`;
      }
      const escaped = escapeHtml(p.s);
      return `<span class="bubble-inline">${inlineCode(escaped).replace(/\n/g, "<br />")}</span>`;
    })
    .join("");
}

function renderChat(turns) {
  const el = $("messages");
  el.innerHTML = turns
    .map((t) => {
      const side = t.role === "user" ? "user" : "bot";
      const label = t.role === "user" ? "You" : "Bot";
      return `
        <div class="msg ${side}">
          <div class="avatar" aria-hidden="true">${label === "You" ? "U" : "B"}</div>
          <div class="bubble">${formatBubbleText(t.text)}</div>
        </div>`;
    })
    .join("");
}

function showToast(msg, isError) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.toggle("error", !!isError);
  t.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.add("hidden"), 5200);
}

function setView(mode) {
  const isMem = mode === "memory";
  $("panel-chat").classList.toggle("hidden", isMem);
  $("panel-chat").toggleAttribute("hidden", isMem);
  $("panel-memory").classList.toggle("hidden", !isMem);
  $("panel-memory").toggleAttribute("hidden", !isMem);
  $("tab-transcript").classList.toggle("active", !isMem);
  $("tab-transcript").setAttribute("aria-selected", String(!isMem));
  $("tab-memory").classList.toggle("active", isMem);
  $("tab-memory").setAttribute("aria-selected", String(isMem));
  if (!isMem) $("chat-scroll").scrollTop = 0;
  else $("memory-body").parentElement.scrollTop = 0;
}

function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return { id: parts[0], view: parts[1] === "memory" ? "memory" : "chat" };
  }
  if (parts.length === 1) return { id: parts[0], view: "chat" };
  return { id: state.chaptersMeta[0]?.id || "001", view: "chat" };
}

function setHash(id, view) {
  const v = view === "memory" ? "memory" : "chat";
  window.location.hash = `#/${id}/${v}`;
}

async function loadManifest() {
  const res = await fetch("./chapters.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Missing docs/chapters.json");
  const manifest = await res.json();
  const q = getQueryOverrides();
  manifest.github = {
    owner: q.owner || manifest.github.owner,
    repo: q.repo || manifest.github.repo,
    branch: q.branch || manifest.github.branch,
  };
  state.config = manifest;
  state.chaptersMeta = manifest.chapters || [];
}

async function ensureChapterTitle(id) {
  if (state.chapterTitles[id]) return state.chapterTitles[id];
  const path = `${state.config.contentPath}/chat-${id}/transcript.md`;
  const md = await fetchText(path);
  const { title } = parseTranscript(md);
  state.chapterTitles[id] = title || `Chapter ${id}`;
  return state.chapterTitles[id];
}

async function loadChapter(id, view) {
  const base = state.config.contentPath;
  const tPath = `${base}/chat-${id}/transcript.md`;
  const mPath = `${base}/chat-${id}/memory.md`;

  const [tMd, mMd] = await Promise.all([fetchText(tPath), fetchText(mPath)]);
  const parsed = parseTranscript(tMd);
  $("session-title").textContent = parsed.title || `Chat ${id}`;
  renderChat(parsed.turns);

  const memHtml = marked.parse(mMd, { headerIds: false });
  $("memory-body").innerHTML = memHtml;

  setView(view === "memory" ? "memory" : "chat");

  const idx = state.chaptersMeta.findIndex((c) => c.id === id);
  $("btn-prev").disabled = idx <= 0;
  $("btn-next").disabled = idx < 0 || idx >= state.chaptersMeta.length - 1;
  $("btn-next-chapter").disabled = $("btn-next").disabled;

  const title = parsed.title || (await ensureChapterTitle(id));
  $("chapter-pill").textContent = `Chapter ${id} · ${title}`;

  document.querySelectorAll(".chapter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === id);
  });
}

function buildSidebar() {
  const nav = $("chapter-nav");
  nav.innerHTML = "";
  state.chaptersMeta.forEach((ch) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chapter-btn";
    btn.dataset.id = ch.id;
    btn.innerHTML = `<span class="num">Chapter ${ch.id}</span><span class="name" data-title="${ch.id}">…</span>`;
    btn.addEventListener("click", () => setHash(ch.id, "chat"));
    nav.appendChild(btn);
  });

  state.chaptersMeta.forEach(async (ch) => {
    try {
      const title = await ensureChapterTitle(ch.id);
      const span = nav.querySelector(`[data-title="${ch.id}"]`);
      if (span) span.textContent = title;
    } catch {
      const span = nav.querySelector(`[data-title="${ch.id}"]`);
      if (span) span.textContent = "(load error)";
    }
  });
}

function wireUi() {
  $("tab-transcript").addEventListener("click", () => {
    const { id } = parseHash();
    setHash(id, "chat");
  });
  $("tab-memory").addEventListener("click", () => {
    const { id } = parseHash();
    setHash(id, "memory");
  });
  $("btn-to-memory").addEventListener("click", () => {
    const { id } = parseHash();
    setHash(id, "memory");
  });
  $("btn-back-chat").addEventListener("click", () => {
    const { id } = parseHash();
    setHash(id, "chat");
  });
  $("btn-prev").addEventListener("click", () => {
    const { id } = parseHash();
    const idx = state.chaptersMeta.findIndex((c) => c.id === id);
    if (idx > 0) setHash(state.chaptersMeta[idx - 1].id, "chat");
  });
  $("btn-next").addEventListener("click", () => {
    const { id } = parseHash();
    const idx = state.chaptersMeta.findIndex((c) => c.id === id);
    if (idx >= 0 && idx < state.chaptersMeta.length - 1) {
      setHash(state.chaptersMeta[idx + 1].id, "chat");
    }
  });
  $("btn-next-chapter").addEventListener("click", () => {
    $("btn-next").click();
  });

  window.addEventListener("hashchange", () => {
    route().catch((e) => showToast(e.message, true));
  });
}

async function route() {
  if (!state.config) await loadManifest();
  const { id, view } = parseHash();
  if (!state.chaptersMeta.some((c) => c.id === id)) {
    showToast(`Unknown chapter ${id}`, true);
    return;
  }
  const gh = state.config.github;
  $("repo-link").href = `https://github.com/${gh.owner}/${gh.repo}/tree/${gh.branch}/nabokov-2`;
  $("source-hint").textContent = `${gh.owner}/${gh.repo}@${gh.branch}`;
  await loadChapter(id, view);
}

async function boot() {
  try {
    await loadManifest();
    if (!window.location.hash || window.location.hash === "#") {
      const first = state.chaptersMeta[0]?.id;
      if (first) {
        const url = new URL(window.location.href);
        url.hash = `#/${first}/chat`;
        history.replaceState(null, "", url.toString());
      }
    }
    buildSidebar();
    wireUi();
    $("repo-link").href = `https://github.com/${state.config.github.owner}/${state.config.github.repo}`;
    await route();
  } catch (e) {
    console.error(e);
    showToast(e.message || String(e), true);
    $("session-title").textContent = "Error loading reader";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
