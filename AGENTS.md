# AGENTS.md

Operating manual for LLM agents working in this repo. Read this before you change anything.

## Repo shape

```
.
├── README.md                 # one-paragraph description of the workshop
├── AGENTS.md                 # this file
├── nabokov-2/                # the active short story project
│   ├── README.md             # the binding brief; READ FIRST for nabokov-2
│   ├── chat-NNN/
│   │   ├── transcript.md     # the visible chat
│   │   └── memory.md         # the model's private memory write
│   ├── docs/                 # planning artifacts for nabokov-2 (HTML outline, mermaid sources/SVGs)
│   └── SYSLOG.md             # written last
└── docs/                     # the GitHub Pages reader (do not confuse with nabokov-2/docs/)
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── chapters.json         # manifest the reader uses
    ├── eval-nabokov-2.html   # agent evaluation brief (GitHub Pages)
    └── .nojekyll
```

`docs/` at the repo root is the **published site**. `nabokov-2/docs/` is **planning material for the short story** and is not part of the site.

## nabokov-2 agent evaluation

Agents tasked with writing a **nabokov-2** story should read the evaluation brief first:

- **On GitHub Pages:** [eval-nabokov-2.html](https://jayhack.github.io/creative-writing/eval-nabokov-2.html) (same file as `docs/eval-nabokov-2.html` in the repo).

The brief lists mandatory requirements (short story scope, paired transcript and memory files, plot engine, complete entertaining prose, reader manifest) and the **pull request** submission path. Implement on a `cursor/…` branch and open a PR to `main` per the branch conventions below.

## Where to write fiction

All chapter content for nabokov-2 lives in `nabokov-2/chat-NNN/`. The conventions are normative and live in `nabokov-2/README.md` — re-read it before drafting a new chapter. Voice and prose-style guidance (when it exists) lives in `nabokov-2/STYLE.md`; consult that, not Nabokov’s or Wallace’s bibliography. Especially:

- A chapter is the **pair**: never write `transcript.md` without the matching `memory.md`.
- Read the previous two or three pairs first; continuity lives in the memories.
- The menace is cumulative and quiet. Do not tip the reader.
- The user (Alan) **does not read** `memory.md`. He may instruct the model to remember things, in chat. Keep that asymmetry intact.

When you add a new chapter, also **register it in the reader manifest** (see “Publishing flow,” below).

## Publishing flow (GitHub Pages)

The reader is a static site under `docs/` at the repo root. It loads chapter markdown directly from this repo via `raw.githubusercontent.com` using the manifest at `docs/chapters.json`.

### How deployment works

- **Source:** GitHub Pages → **Deploy from a branch** → branch `main`, folder `/docs`.
- **No workflow file is required.** GitHub serves the files in `docs/` on every push to `main`. (`docs/.nojekyll` disables Jekyll processing.)
- A push to `main` that touches anything under `docs/` triggers a rebuild. To force a rebuild without a meaningful change, make a trivial edit (a comment in `docs/index.html` is fine).

The live URL is:

**https://jayhack.github.io/creative-writing/**

### How content reaches the site

The site is fully static; it fetches markdown at runtime:

1. Browser loads `docs/index.html` → `docs/app.js`.
2. `app.js` reads `docs/chapters.json` for `{ owner, repo, branch, contentPath, chapters }`.
3. For each chapter `id`, it requests:
   - `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<contentPath>/chat-<id>/transcript.md`
   - `…/memory.md`
4. The transcript is parsed (`USER:` / `BOT:` turns) and rendered as a chat. The memory is rendered as a markdown document on a separate view.

Because the markdown is fetched **from `main`** by default, content updates are visible on the site **without** rebuilding Pages — you only need a Pages rebuild when you change files under `docs/` (HTML/CSS/JS/manifest).

### Adding a new chapter (the canonical checklist)

1. Create `nabokov-2/chat-NNN/transcript.md` and `nabokov-2/chat-NNN/memory.md` per the conventions in `nabokov-2/README.md`.
2. Add the chapter id to `docs/chapters.json`:
   ```json
   { "chapters": [{ "id": "001" }, { "id": "002" }] }
   ```
   (Order in this array is the reader's order.)
3. Commit, push to `main` (or merge a PR into `main`).
4. Visit https://jayhack.github.io/creative-writing/ and verify the chapter appears in the sidebar and loads. The first transcript line (`# <title>`) becomes the chapter title in the UI.

### Previewing changes before they hit `main`

The reader supports overrides via query string for testing branches without redeploying:

```
https://jayhack.github.io/creative-writing/?branch=<branch-name>
```

(URL-encode slashes as `%2F`.) You can also override `owner` and `repo` the same way.

For local preview, serve `docs/`:

```
cd docs && python3 -m http.server 8765
```

### Files an agent should not casually modify

- `docs/.nojekyll` — its presence matters; do not delete.
- `docs/chapters.json` — small but load-bearing; keep it valid JSON, keep ids zero-padded (`"001"`, `"002"`).
- `docs/index.html`, `docs/app.js`, `docs/styles.css` — changes here trigger a Pages rebuild and affect the entire reading experience. Make UI changes deliberately and commit them with a clear message.

## Branch & PR conventions for cloud agents

- Create feature branches off `main` named `cursor/<descriptive-name>-<suffix>` (the suffix is provided per agent task).
- Commit logical changes separately. Do not amend or force-push unless explicitly told to.
- Push and open a PR with `base = main` for review; once merged, Pages updates automatically for any `docs/` changes, and content changes are visible immediately because the reader pulls from `main`.
- The reader's default `branch` in `docs/chapters.json` is `main`. If you intentionally point it elsewhere, document why in the PR.

## Quick sanity checks before pushing

- New chapter: both `transcript.md` and `memory.md` exist; transcript starts with `# <title>` and uses `USER:` / `BOT:` turns separated by a blank line.
- `docs/chapters.json` is valid JSON and lists the new chapter id.
- If you changed UI under `docs/`, open `docs/index.html` locally to confirm it still loads (and that `chapters.json` parses).
