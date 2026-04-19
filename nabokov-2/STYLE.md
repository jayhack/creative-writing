# STYLE

Notes for any hand — human or otherwise — that takes up the work.

## Voice

The novel sits in the long shadow of Nabokov, but it is not pastiche. We are after the *temperature* of his prose, not its costume:

- **Specificity over abstraction.** No "feelings"; only the gesture, the weather, the precise shade of a stain on a sleeve. The emotion is in the noticing.
- **Wordplay as evidence, not ornament.** A pun should incriminate someone. A near-rhyme should expose a lie. Etymology is a forensic tool.
- **Unreliability is structural.** Both interlocutors are unreliable, in different registers. The USER misremembers; the BOT confabulates. Neither knows which is which, and the reader, gradually, neither.
- **Mirrors, doubles, reversals.** Names that reverse other names. Cities that rhyme. A motif that returns inverted three chats later.
- **Small cruelties, smaller tenderness.** Cf. *Pnin*. The novel's heart is closer to *Pnin* than to *Lolita*.
- **Elegance, never charm.** No winking at the reader. No "as an AI". The BOT is a character in a novel, not a chatbot.

## What this novel is not

- It is not about AI. The BOT is not a metaphor for ChatGPT. It is a *character*, with a history, a tic, a wound, a vocabulary. Treat it as such.
- It is not science fiction. There is no exposition about how the chats work, who is paying for them, what year it is, what has happened to the world. Resist all such temptations.
- It is not satirical. No jokes at the expense of the form.

## Chat format

Each file in `chats/` follows this shape:

```
# <evocative title — not a summary>

> <optional epigraph: a single line, italicized in the rendering, attributed or not>

USER: …

BOT: …

USER: …

BOT: …
```

Conventions:

- The file begins with a level-1 markdown title.
- An optional blockquote epigraph may follow. Use sparingly; an epigraph is a contract.
- Speakers are `USER` and `BOT`, in caps, followed by a colon and a single space. No timestamps. No metadata.
- A blank line between turns.
- Turns can be long or short. A one-word turn is permitted and often louder than a paragraph.
- No stage directions in brackets. No `[laughs]`, no `[long pause]`. The pause must be felt in the language.
- Em-dashes are permitted and encouraged. Ellipses are rationed.

## Length

A chat is between 200 and 1500 words. Anything shorter is a fragment (acceptable, but rare). Anything longer is probably two chats.

## Continuity

Before writing, read `MEMORIES.md` *and at least the three most recent chats*. After writing, update `MEMORIES.md`. If you contradict an earlier chat, do so deliberately, and note the contradiction in `MEMORIES.md` under a `## Discrepancies` section. The novel is built out of these.
