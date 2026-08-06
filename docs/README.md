# SAFS Furniture — Documentation

This folder is the **source of truth** for project documentation beyond the root [README](../README.md).

---

## Who writes what

| Role | Owns | Typical docs |
|---|---|---|
| **Technical Writer** (or you, in a small team) | Clarity, structure, consistency | User guides, admin guides, release notes |
| **Developers** | Technical accuracy | Architecture, setup, schema, APIs, code comments |
| **Product Managers** | Goals & scope | Feature descriptions, acceptance criteria, roadmap notes |
| **QA Engineers** | Edge cases & known issues | Troubleshooting, test checklists, release notes |
| **Support / Ops** | Real-world usage | FAQ, support runbooks, admin how-tos |

On a small team, one person often wears several of these hats. Use the table as a **checklist of audiences**, not as a hiring plan.

---

## Documentation map

| Doc | Audience | Purpose |
|---|---|---|
| [getting-started.md](./getting-started.md) | Developers | Install, env, Supabase, first run |
| [architecture.md](./architecture.md) | Developers | How the app is structured |
| [database.md](./database.md) | Developers / Ops | Schema, RLS, storage |
| [admin-guide.md](./admin-guide.md) | Admins / Support | Manage products & images |
| [storefront-user-guide.md](./storefront-user-guide.md) | End users / Support | Browse, cart, checkout |
| [deployment.md](./deployment.md) | Developers / Ops | Vercel & static hosting |
| [troubleshooting.md](./troubleshooting.md) | QA / Support / Devs | Common failures & fixes |
| [privacy-compliance.md](./privacy-compliance.md) | PM / Legal / Devs | POPIA / GDPR notes for this app |
| [contributing-docs.md](./contributing-docs.md) | Everyone | How to add or update docs |

---

## How to keep docs healthy

1. **Update docs in the same PR as the feature** — if behavior changes, docs change.
2. **Write for one audience per page** — do not mix admin steps with internal architecture.
3. **Prefer short pages** over one giant file.
4. **Never commit secrets** (service role keys, real passwords, private URLs with tokens).
5. **Link from README** — the root README stays a high-level overview; deep detail lives here.

---

## Suggested writing workflow

```text
1. Identify audience (developer / admin / customer / support)
2. List the top 5 questions that audience asks
3. Draft steps with real UI labels and file paths from this repo
4. Have a second person (or yourself next day) follow the steps from scratch
5. Fix gaps, then merge
```

---

## Current project snapshot

| Item | Value |
|---|---|
| **Product** | SAFS Furniture — South African hardwood storefront |
| **Stack** | Vue 3 + TypeScript + Tailwind CSS v4 + Vite + Supabase |
| **Backend** | Supabase Auth, PostgreSQL, Storage |
| **Hosting** | Vercel (SPA) |
| **Currency** | ZAR |
