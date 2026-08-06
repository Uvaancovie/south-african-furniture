# Contributing to Documentation

Audience: **everyone** who updates this project.

## Golden rule

**If the product behavior changes, update the docs in the same change.**

## Where to put content

| Content type | Location |
|---|---|
| Project overview, install quickstart | Root `README.md` |
| Deep guides by audience | `docs/*.md` |
| Docs index & ownership | `docs/README.md` |
| SQL source of truth | `supabase/schema.sql` (+ docs/database.md summary) |
| One-off local secrets | Password manager — **not** the repo |

## Style guide

1. **One audience per page** (developer vs admin vs customer)
2. **Short sentences and numbered steps** for procedures
3. **Use real UI labels** from the app (“Admin”, “Catalog”, “Active”)
4. **Tables** for options, env vars, and checklists
5. **No secrets** (keys, passwords, private tokens)
6. **Link related pages** at the bottom
7. Prefer **present tense**: “Click Save”, not “You will click Save”

## Markdown conventions

```markdown
# Page title

Audience: **developers**

## Section

1. Step one
2. Step two

| Column | Meaning |
|---|---|
| A | B |

> Callout for warnings

`inline code` for files, commands, and field names
```

## Review checklist before merge

- [ ] Steps tested on a clean machine or fresh browser profile when possible
- [ ] Screenshots only if they stay current (optional; avoid noisy binaries)
- [ ] Links resolve (relative paths under `docs/`)
- [ ] Matches current code in `src/` and `supabase/schema.sql`
- [ ] README table of contents / docs index updated if you added a new page

## Suggested ownership on a small team

| Change type | Primary author | Reviewer |
|---|---|---|
| New feature UX | Developer or tech writer | PM or support |
| Setup / architecture | Developer | Second developer |
| Admin procedures | Developer + support | Admin user try-through |
| Release notes / bugs | QA | Developer |
| Privacy / legal copy | PM | Legal / compliance |

## Release notes template

Create `docs/releases/YYYY-MM-DD.md` when you start shipping versions:

```markdown
# Release YYYY-MM-DD

## Added
- ...

## Changed
- ...

## Fixed
- ...

## Docs
- ...
```

## AI / agent notes

This repo may contain large agent context files (`AGENTS.md`, `AI-LLM-CONTEXT.md`). Those are for tooling, not end-user docs. Human-facing documentation belongs under **`docs/`** and the root **README**.
