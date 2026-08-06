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



Essential project documentation (professional set)

You already have operational docs (setup, admin, deploy). For modeling features and the system properly—now and later—you need a second layer: specification & design artifacts. Below is the full set, what each is for, and what you are still missing for SAFS Furniture.

───

1. Core documents you named

┌───────────────────────┬─────────────────────────────────────────────┬────────────────────┬─────────────────────────────┐
│ Artifact              │ What it captures                            │ When you use it    │ Your project today          │
├───────────────────────┼─────────────────────────────────────────────┼────────────────────┼─────────────────────────────┤
│ Functional            │ What the system must do (features, rules,   │ Scope, acceptance, │ Partially in README         │
│ Requirements (FR)     │ user goals)                                 │ backlog            │ features; no formal FR doc  │
├───────────────────────┼─────────────────────────────────────────────┼────────────────────┼─────────────────────────────┤
│ Non-Functional        │ How well it must do it (performance,        │ Architecture       │ Mostly missing              │
│ Requirements (NFR)    │ security, availability, UX)                 │ trade-offs, QA     │                             │
├───────────────────────┼─────────────────────────────────────────────┼────────────────────┼─────────────────────────────┤
│ ERD (Entity           │ Data model: entities, keys, relationships   │ Schema design,     │ Tables exist in SQL; no     │
│ Relationship Diagram) │                                             │ migrations         │ formal ERD                  │
├───────────────────────┼─────────────────────────────────────────────┼────────────────────┼─────────────────────────────┤
│ UML diagrams          │ Structure & behavior of software (classes,  │ Design reviews,    │ Missing                     │
│                       │ use cases, sequences, components)           │ onboarding         │                             │
├───────────────────────┼─────────────────────────────────────────────┼────────────────────┼─────────────────────────────┤
│ Flowcharts / activity │ Process steps (checkout, upload product,    │ Logic clarity,     │ Missing (behavior is only   │
│ diagrams              │ auth)                                       │ edge cases         │ in code)                    │
└───────────────────────┴─────────────────────────────────────────────┴────────────────────┴─────────────────────────────┘

These five are necessary but not sufficient for a professional, future-proof model.

───

2. What you are missing (full professional model)

A. Product & scope layer

┌──────────────────────────────────────────┬────────────────────────────────────┬────────────────────────────────────────┐
│ Document                                 │ Purpose                            │ Why it matters                         │
├──────────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤
│ Vision / Product brief                   │ Problem, market, success metrics,  │ Stops feature sprawl                   │
│                                          │ out-of-scope                       │                                        │
├──────────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤
│ Personas & user journeys                 │ Customer, admin, support paths     │ Grounds FRs in real use                │
├──────────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤
│ Use case catalog (or user stories +      │ “As a … I want … so that …” with   │ Links FR → tests → UI                  │
│ acceptance criteria)                     │ Given/When/Then                    │                                        │
├──────────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤
│ Feature backlog / roadmap                │ Now / next / later                 │ Plans new features without rewriting   │
│                                          │                                    │ the whole system                       │
├──────────────────────────────────────────┼────────────────────────────────────┼────────────────────────────────────────┤
│ Glossary                                 │ Product, SKU, Active, Featured,    │ Shared language across team            │
│                                          │ White-glove, etc.                  │                                        │
└──────────────────────────────────────────┴────────────────────────────────────┴────────────────────────────────────────┘

B. Requirements layer (expand FR / NFR)

┌──────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│ Document                         │ Contents                                                                            │
├──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Functional Requirements Spec (   │ Numbered requirements: FR-CART-01, priority, actor, description, acceptance         │
│ FRS)                             │                                                                                     │
├──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Non-Functional Requirements Spec │ Performance, security, privacy (POPIA), reliability, accessibility, browser         │
│ (NFRS)                           │ support, SEO, observability                                                         │
├──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Business rules                   │ Free shipping > R15 000, VAT messaging, only is_active on storefront, any auth user │
│                                  │ = admin (current rule)                                                              │
├──────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Constraints & assumptions        │ SPA-only, no payment gateway yet, Supabase RLS = security boundary                  │
└──────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

C. Design / modeling layer (UML + more)

┌─────────────────────────────┬────────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Diagram / doc               │ UML-ish type               │ Models                                                      │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Context diagram             │ C4 Level 1                 │ Users ↔ App ↔ Supabase ↔ Vercel                             │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Container / component       │ C4 Level 2–3 / UML         │ Vue SPA modules, Auth, DB, Storage                          │
│ diagram                     │ component                  │                                                             │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Use case diagram            │ UML use case               │ Actors vs use cases (Browse, Cart, Admin CRUD)              │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ ERD                         │ Conceptual + logical       │ products 1—N product_images; future orders, order_items     │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Class / domain model        │ UML class (light)          │ Product, CartItem, ProductImage (TS types as domain)        │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Sequence diagrams           │ UML sequence               │ Login, create product + upload image, add to cart, “        │
│                             │                            │ checkout”                                                   │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Activity / flowchart        │ UML activity               │ Happy path + error paths for admin upload, cart totals      │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ State diagrams              │ UML state                  │ Product visibility (draft/active/inactive); future Order    │
│                             │                            │ states                                                      │
├─────────────────────────────┼────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Wireframes / UI flows       │ Screens                    │ Landing → Catalog → PDP → Cart → Admin                      │
└─────────────────────────────┴────────────────────────────┴─────────────────────────────────────────────────────────────┘

You do not need every UML diagram for every feature. Prefer: use case + sequence + ERD + activity for complex flows; class diagrams only when domain grows.

D. Technical architecture layer

┌───────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────┐
│ Document                          │ Purpose                                                                            │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ Software Architecture Document (  │ Style (SPA + BaaS), boundaries, security model, key decisions                      │
│ SAD)                              │                                                                                    │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ ADRs (Architecture Decision       │ Short “we chose X because Y” (e.g. no Vue Router, session cart, Supabase direct    │
│ Records)                          │ from client)                                                                       │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ API / data contract               │ Even without REST: Supabase table contracts, RLS matrix, Storage paths             │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ Security model                    │ Threats, RLS matrix, who can write, secrets handling                               │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ Environment & config matrix       │ Local / staging / prod env vars and URLs                                           │
├───────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┤
│ Deployment & runbook              │ You partly have this in docs/deployment.md                                         │
└───────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────┘

E. Quality & change layer

┌────────────────────────────┬─────────────────────────────────────────────────────────────────────────────┐
│ Document                   │ Purpose                                                                     │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ Test plan / test cases     │ Maps to FR acceptance criteria (your troubleshooting smoke list is a start) │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ Traceability matrix        │ FR → diagram → code module → test                                           │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ Change log / release notes │ What shipped when                                                           │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ Risk register              │ e.g. “any authenticated user is admin”, “no real orders”                    │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ Privacy / DPIA notes       │ You started this in docs/privacy-compliance.md                              │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────────────┘

───

3. Recommended “professional minimum” for this project

For a mid-size SPA like SAFS Furniture, aim for this living set (not a 200-page binder):

docs/
  specs/
    01-vision-and-scope.md
    02-functional-requirements.md      ← FR
    03-non-functional-requirements.md  ← NFR
    04-business-rules.md
    05-use-cases.md                    ← or user stories
  design/
    01-system-context.md               ← C4 / context
    02-erd.md                          ← ERD (+ mermaid)
    03-use-case-diagram.md
    04-flows/                          ← flowcharts per feature
       checkout.md
       admin-product-upload.md
       auth.md
    05-sequences/                      ← UML sequence (mermaid)
       create-product.md
       add-to-cart.md
  architecture/
    01-architecture-overview.md
    02-security-model.md
    adr/
       0001-spa-supabase-direct.md
       0002-in-memory-cart.md
  quality/
    test-plan.md
    traceability-matrix.md
  releases/
    ...

Plus your existing operational docs (getting-started, admin-guide, etc.).

Rule of thumb:
• Specs answer what & why
• Design diagrams answer how it behaves & how data relates
• Architecture + ADRs answer why we built it this way
• Tests + traceability prove it still matches the model

───

4. How each artifact helps new features

When you add something (e.g. real orders + POPIA consent):

┌──────┬──────────────────────┬────────────────────────────────────────────────────┐
│ Step │ Artifact             │ Action                                             │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 1    │ Vision / scope       │ Confirm in-scope                                   │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 2    │ FR + use cases       │ Write FR-ORDER-01…, acceptance criteria            │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 3    │ NFR                  │ Add payment security, retention, email reliability │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 4    │ Business rules       │ Order statuses, stock decrement, free shipping     │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 5    │ ERD                  │ Add orders, order_items, consent fields            │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 6    │ Sequence + flowchart │ Place order end-to-end                             │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 7    │ State diagram        │ pending → paid → shipped → delivered               │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 8    │ ADR                  │ “Orders in Supabase vs external payment provider”  │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 9    │ Security model       │ Who can read whose orders                          │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 10   │ Test cases + matrix  │ Link FR → tests → components                       │
├──────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 11   │ User/admin guides    │ Update operational docs                            │
└──────┴──────────────────────┴────────────────────────────────────────────────────┘

That pipeline is how you comprehensively model features instead of only coding them.

───

5. UML: which diagrams are essential vs optional

┌─────────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ Essential for most features                     │ Optional / as needed                        │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ Use case (or equivalent stories)                │ Full class diagram of every Vue component   │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ Sequence (for multi-step or multi-system flows) │ Deployment diagram (simple if only Vercel)  │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ Activity / flowchart (branching logic)          │ Package diagram                             │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ ERD (any data change)                           │ Timing diagrams                             │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ Component / C4 context (once, then update)      │ Exhaustive state charts for every UI widget │
└─────────────────────────────────────────────────┴─────────────────────────────────────────────┘

Practical format: Mermaid in Markdown (lives in git, reviews in PRs, no Visio lock-in).

Example ERD (current system):

 ┌─────────────────────┐
 │      products       │
 ├─────────────────────┤
 │ uuid id PK          │
 │ text name           │
 │ text slug UK        │
 │ decimal price       │
 │ boolean is_active   │
 │ boolean is_featured │
 └──────────┬──────────┘
            │
            │1 has 0..*
 ┌────────────────────┐
 │   product_images   │
 ├────────────────────┤
 │ uuid id PK         │
 │ uuid product_id FK │
 │ text image_url     │
 │ boolean is_primary │
 └────────────────────┘

Example use cases:


                ┌───────────────┐
            ┌──▶│ BrowseCatalog │
            │   └───────────────┘
            │
            │   ┌─────────────┐
            ├──▶│ ViewProduct │
┌──────────┐│   └─────────────┘
│ Customer ├┤
└──────────┘│   ┌────────────┐
            ├──▶│ ManageCart │
            │   └────────────┘
            │
            │   ┌─────────────────┐
            └──▶│ CheckoutConfirm │
                └─────────────────┘


                ┌──────────────┐
            ┌──▶│ Authenticate │
            │   └──────────────┘
            │
┌───────┐   │   ┌──────────────┐
│ Admin ├───┼──▶│ CRUDProducts │
└───────┘   │   └──────────────┘
            │
            │   ┌──────────────┐
            └──▶│ UploadImages │
                └──────────────┘

───

6. Functional vs non-functional (examples for your app)

Functional (examples)
• FR-CAT-01: System shall list only products where is_active = true on the public catalog.
• FR-CART-02: System shall set shipping to R0 when subtotal > R15 000, else R450.
• FR-ADM-03: Authenticated user shall create a product with zero or more images.

Non-functional (examples)
• NFR-PERF-01: Catalog first meaningful paint under 3s on broadband for ≤100 products.
• NFR-SEC-01: Service role key never shipped in the client bundle.
• NFR-PRIV-01: Marketing consent default false; no pre-checked marketing boxes.
• NFR-A11Y-01: Primary flows usable via keyboard; images have alt text where provided.
• NFR-COMPAT-01: Support last two Chrome/Edge/Firefox/Safari versions.

───

7. Gap analysis: what you have vs what you need

┌────────────────────────────────────────────────────┬─────────────────────────┐
│ Area                                               │ Status                  │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ README / feature narrative                         │ Strong                  │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Getting started / deploy / admin / troubleshooting │ Strong (docs/)          │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Privacy checklist                                  │ Started                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Formal FR / NFR                                    │ Missing                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ ERD (diagram + future orders)                      │ Missing (SQL only)      │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ UML use case / sequence / activity                 │ Missing                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Flowcharts for cart, admin upload, auth            │ Missing                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Vision, glossary, business rules                   │ Missing / scattered     │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ ADRs                                               │ Missing                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Security model as a doc                            │ Implicit in schema only │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Test plan + traceability                           │ Smoke list only         │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ UI wireframes / IA                                 │ Missing                 │
├────────────────────────────────────────────────────┼─────────────────────────┤
│ Roadmap for “real checkout / orders”               │ Missing                 │
└────────────────────────────────────────────────────┴─────────────────────────┘

So: you are strong on how to run the app, weak on how the system is specified and designed as a model. That is exactly what hurts future feature work and handovers.

───

8. Suggested priority order (do this next)

Phase 1 — Foundation (1–2 days)
1. Vision & scope (in/out)
2. Functional requirements (current system as-is)
3. Non-functional requirements
4. ERD (as-is) + known future entities
5. Use case list + one use-case diagram

Phase 2 — Behavior (2–3 days)
6. Flowcharts: auth, catalog browse, cart/checkout, admin product+image
7. Sequence diagrams for the same four
8. Business rules sheet
9. Security model + 2–3 ADRs

Phase 3 — Quality & future (ongoing)
10. Test plan mapped to FRs
11. Traceability matrix
12. Per-feature pack: FR slice + ERD delta + sequence + tests

───

9. One-page “feature pack” template (use for every new feature)

Feature: <name>
1. Goal / persona
2. FR IDs + acceptance criteria
3. NFR impacts
4. Business rules
5. ERD changes
6. UI screens / flow
7. Sequence diagram
8. Security / privacy
9. Test cases
10. Docs to update (admin guide, user guide, README)
11. ADR if architectural

If every feature ships with that pack, you comprehensively model the product for “now and future reference.”

───

Bottom line

Essential for professional modeling:
FR, NFR, ERD, key UML (use case + sequence + activity), plus scope/vision, business rules, architecture/ADRs, security, tests, and traceability.

You are not missing “more README.” You are missing a specification & design set that sits above code and operational guides.

───

I can implement Phase 1 in docs/specs/ and docs/design/ next (vision, FR, NFR, ERD with Mermaid, use cases)—filled from the real SAFS Furniture behavior so it matches the codebase. Say if you want that scaffold written into the repo now.