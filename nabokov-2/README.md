# nabokov-2

A novel in chats.

## Premise

A modern, Nabokov-inflected novel that unfolds entirely in two registers:

1. **`chats/`** — a sequence of conversations between a `USER` and a `BOT`. Each chat is a single file. Read in order, they form the narrative spine of the novel.
2. **`MEMORIES.md`** — the novel's index and concordance. A living document maintained as the chats accumulate: characters, motifs, recurring images, mistranslations, the bot's drifting self-conception, the user's lacunae. Think of it as the bot's *and* the author's marginalia at once — what is being remembered, what is being constructed, what is being quietly altered between sessions.

The chats are the surface; `MEMORIES.md` is the palimpsest beneath. A reader could approach the novel from either direction.

## Working directory

This is the working directory for the `nabokov-2` project. Agents collaborating here should:

- Read `STYLE.md` before writing any prose.
- Read `MEMORIES.md` before writing any new chat — it is the canonical state of the world.
- After writing a new chat, update `MEMORIES.md` to record what was added, altered, contradicted, or quietly forgotten. Contradictions are not bugs; they are material.
- Number new chats sequentially in `chats/` (e.g. `001-…md`, `002-…md`). The slug after the number should be a short, evocative phrase, not a summary.

## Structure

```
nabokov-2/
├── README.md       # this file
├── STYLE.md        # voice, conventions, dos and don'ts
├── MEMORIES.md     # the living index / concordance
└── chats/          # the chats, in order
```
