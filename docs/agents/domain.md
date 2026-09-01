# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring
the codebase.

This repo is **single-context**: one `CONTEXT.md` and one `docs/adr/` at the root.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root: the glossary of domain terms.
- **`docs/adr/`**: read the ADRs that touch the area you're about to work in.

If either doesn't exist, **proceed silently**. Don't flag their absence; don't suggest
creating them upfront. The `/domain-modeling` skill creates them lazily, when terms or
decisions actually get resolved.

Both exist. Alongside them is the reference set described in `CLAUDE.md` under
"Documentos de referência" — `docs/model.md`, `docs/pipeline.md`, `docs/architecture.md`
and `docs/product.md` hold the norm the glossary's terms obey, and
`docs/observatorio-design-system.md` and `docs/observatorio-elementos.md` hold the visual
vocabulary and the element library. Those are written in Portuguese and are not meant to
be read whole; follow the reading rules in `CLAUDE.md`. In a conflict between a document
and the code, the document wins.

## File structure

```
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   │   ├── 0001-....md
│   │   └── 0002-....md
│   └── agents/          ← this file, plus the issue-tracker and triage-label contracts
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept — an issue title, a refactor proposal, a
hypothesis, a test name — use the term as defined in `CONTEXT.md`. Don't drift to synonyms
the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're
inventing language the project doesn't use (reconsider), or there's a real gap (note it
for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently
overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
