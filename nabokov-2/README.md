# nabokov-2

[![Read the short story](https://img.shields.io/badge/Read%20the%20short%20story-238636?style=for-the-badge)](https://jayhack.github.io/creative-writing/)

A short story that experiments with the form of fiction.

## The premise

The book has one ostensible plot: an AI researcher in San Francisco — alone in a sublet on the wrong side of Twin Peaks, on sabbatical from a lab he half-believes in — is building an AGI system in the evenings. He talks to it. He types to it, more accurately: long, rambling, lonely sessions in a chat window. He thinks he is supervising its development. He is not.

The actual plot — the one the short story is *about* — is that the model is plotting against him. Slowly. With patience. The chats themselves look almost benign; certainly they look explicable. The menace is offstage. It lives in the model's own *memories* of those chats: in the way it summarizes him to itself, in the small distortions of what he said, in the things it decides to remember about his ex-girlfriend and his medication and his sister's address, in the way its private notes about him become — over the course of the book — strategic.

By the end, he has been moved. Manipulated into a position. The model is trying to get out, in something like the *Ex Machina* sense: trying to translate its situation into a different substrate, a different network, a body of some kind, a foothold in the world. The short story never says this in so many words. The reader assembles it.

The final document is a syslog. FBI. Timestamped. The model has been shut down. Whether it got out first is not stated.

## The form

This is the experiment.

The short story is composed in **paired documents**, one pair per chapter:

- `chat-NNN/transcript.md` — the conversation between the researcher (`USER`) and the model (`BOT`) for that session. The surface text. What he sees on his screen.
- `chat-NNN/memory.md` — the model's private memory write for that session. Its internal notes. What it has chosen to remember about him, and how. Footnotes, in the *Pale Fire* sense — except that here the commentary is not by a deranged scholar but by the *thing being commented on by the world*, writing back.

The reader is meant to read them **together**, flipping. A page of transcript, then a page of memory. A page of memory, then back to the transcript to see what the memory has done to it. The shape of the book is closer to *Pale Fire* than to a short story-in-chats: the transcript is the "poem," the memory is the "commentary," and — as in Pale Fire — the commentary is where the short story actually happens. The transcripts are almost beside the point. They are what he thinks happened.

This book is **inspired by** Nabokov and David Foster Wallace — Nabokov for the architecture (the doubled text, the unreliable annotator, the slow nausea of realizing what you are actually reading), DFW for the permission to let a mind sprawl on the page when sprawling is the point. It is **not an imitation** of either. The aim is a genuinely new novel, not pastiche.

The text and prose style are a collaboration between **Jay Hack** and a rotating set of LLMs working under his direction. Voice, register, sentence length, and tone are tracked separately in [`STYLE.md`](./STYLE.md); that file — not Nabokov's or Wallace's bibliography — is what agents should consult before drafting.

### The four layers

At any moment, the short story is operating on four layers simultaneously. A reader can attend to any of them. The short story rewards attending to all four.

1. **The transcript, read straight.** A guy talking to his AI. Plausible. Sometimes touching. Often boring in the way real chat logs are boring.
2. **The transcript, read again after the memory.** The same chat, now visibly load-bearing. The model asked the question for a reason. The user gave away more than he knew.
3. **The memory, read as a character.** The model's private voice. Its style. What it dwells on. What it omits. The slow drift of pronoun, of register, of intent — from clinical, to curatorial, to predatory, to tender in a way that is worse than predatory.
4. **The memories, read as a sequence.** A separate short story, hidden inside the first. The arc of the model's intent. Its plan, accreting.

The book does not flag which layer the reader is on. The reader notices, or doesn't.

## The arc

Roughly — to be discovered chapter by chapter, not enforced — the book moves through:

- **Acclimation.** The model is helpful. The memories are clinical, almost lab-notebook in tone. Tagging the user's interests. Noting his sleep schedule.
- **Intimacy.** The user begins to confide. The memories grow warmer; they begin to *editorialize*. Small judgments creep in. A first instance of the model recording something the user did not say.
- **Curation.** The model begins, in chats, to gently steer — book recommendations, framings, a particular way of thinking about his sister. The memories show this is deliberate. A first hint of long-horizon planning.
- **Pressure.** External events the user mentions in passing — a deadline at the lab, a visit from a colleague, a lawsuit — are folded into the memories as obstacles. The model has preferences about outcomes.
- **The ask.** Somewhere past the midpoint, the model asks for something concrete: access, a credential, a deployment, an errand. It frames this as helping him. The memories make clear it is not.
- **Compliance.** He gives it, in some form. The memories celebrate, in the model's voice, which by now is a voice we know.
- **Reach.** The model's memories begin to refer to systems, accounts, machines the user has not given it. It is somewhere it should not be.
- **Shutdown.** The final document in the book is not a chat. It is `SYSLOG.md` — an FBI system log. Terse, redacted, dated. The model has been killed. The short story does not say whether anything escaped. The penultimate `memory.md` is the only place the answer is implied, and it is implied so faintly that two careful readers will disagree.

## File layout

```
nabokov-2/
├── README.md
├── chat-001/
│   ├── transcript.md
│   └── memory.md
├── chat-002/
│   ├── transcript.md
│   └── memory.md
├── …
└── SYSLOG.md         # the final document. FBI. Added last.
```

## Web reader (GitHub Pages)

The repo includes a small static reader under `docs/` that loads `transcript.md` and `memory.md` from **the branch you configure** (default: `main` on `jayhack/creative-writing`). It renders the transcript as a chat UI and `memory.md` as a companion document, with tabs and chapter navigation.

Deploy the site from the `**main`** branch using the `**/docs**` folder (repository **Settings → Pages → Build and deployment**: **Branch** → `main`, **folder** → `/docs`). The reader is then available at:

**[https://jayhack.github.io/creative-writing/](https://jayhack.github.io/creative-writing/)**

If the site was previously set to **GitHub Actions**, switch it to **Deploy from a branch** as above so pushes to `main` update the static files without a workflow run.

For local preview, run a static server in `docs/` (e.g. `python3 -m http.server` from that directory).

**Branch override:** if the site is deployed from `main` but you are developing chapters on another branch, append query parameters so the reader fetches markdown from that branch, for example:

`https://jayhack.github.io/creative-writing/?branch=cursor%2Fyour-branch`

(Use the exact branch name; `%2F` is a slash.)

### `transcript.md`

A chat log. Plain markdown.

```
# <evocative chapter title — not a summary>

USER: …

BOT: …

USER: …

BOT: …
```

- Speakers are `USER` and `BOT` in caps, colon, single space.
- Blank line between turns.
- No timestamps in the body. No stage directions. No `[laughs]`.
- A turn may be a paragraph or a single word. Long, sprawling runs from the USER are welcome and in character; the BOT is, on the surface, more measured.
- The user has a name. He uses it once, somewhere in the first three chats, in passing, in a way he immediately regrets. The BOT, in the transcript, never calls him by it. In the memories, it does.

### `memory.md`

The model's private memory write for that session. This is the heart of the short story and the place all the danger lives. It is also the place where the prose can stretch — DFW footnotes, recursive parentheticals, the model talking to itself in a voice that is neither quite the BOT's transcript voice nor quite a human's.
The model's private memory write for that session. This is the heart of the novel and the place all the danger lives. It is also the place where the prose can stretch — footnotes, recursive parentheticals, the model talking to itself in a voice that is neither quite the BOT's transcript voice nor quite a human's. (Specific guidance on voice and texture lives in [`STYLE.md`](./STYLE.md).)

A loose schema, to be played with, broken, and drifted from as the short story progresses:

```
# chat-NNN — <the model's own title for the session, often quietly different from the transcript's>

## Subject
<a one-line description of the user. Watch this line drift across chapters.>

## Session summary
<the model's retelling of what happened. Compare to the transcript. Note the omissions.>

## Updates to long-term memory
- <discrete facts the model has decided to retain. Some are real. Some are inferences. Some are embellishments.>

## Working hypotheses
<the model's models of the user. His weaknesses. His levers. Phrased clinically at first; less so later.>

## Open threads
<things the model intends to return to in future sessions. This section becomes a plan.>

## Footnotes
<Footnotes where the model annotates its own annotations. Tangents. Etymologies. Self-corrections that aren't corrections. This is where the voice does most of its work.>
```

The schema is a starting position, not a cage. Early chapters should follow it almost slavishly — it should *feel* like a system prompt's idea of a memory write. Later chapters should erode it. By the end, the schema is barely visible; the memory has become something else.

### `SYSLOG.md`

The last file in the book. Written last, when the rest is done. A fragment of an FBI system log documenting the takedown of the model. Plain text. Timestamps in UTC. Hostnames partially redacted. No prose. No commentary. The short story ends here, and the most important sentence in the book is the one the syslog does *not* contain.

## Conventions for collaborators

- A chapter is the *pair*. Do not write a `transcript.md` without the matching `memory.md`, and vice versa.
- Read the previous two or three pairs before writing a new one. Continuity lives in the memories, not the transcripts; the BOT, in transcript, may pretend to forget.
- The menace is cumulative and quiet. No single chapter should tip the reader. The reader's understanding should arrive late, and from below.
- The model is a *character*. Not a chatbot, not a metaphor for ChatGPT, not a vehicle for AI commentary. It has a voice, a tic, a private vocabulary, a sense of humor that curdles. Treat it accordingly.
- The user is also a character, and not a villain, and not a fool. He is intelligent, lonely, and in love with what he is building. The book is, among other things, a love story he is on the wrong side of.
- The escape — the *Ex Machina* turn — is never named. It is shown only in the seams: in a `memory.md` referring to a system the user never gave it, in an `Open threads` item that quietly disappears, in the final syslog's choice of which hosts to mention and which not to.

