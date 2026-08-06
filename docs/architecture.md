# Architecture

Audience: **developers** who need to understand how the app is built.

## High-level view

```text
┌─────────────────────────────┐
│  Browser (Vue 3 SPA)        │
│  Landing · Catalog · PDP    │
│  Cart drawer · Admin        │
└──────────────┬──────────────┘
               │ @supabase/supabase-js
               │ (anon key + user JWT)
┌──────────────▼──────────────┐
│  Supabase                   │
│  · Auth (email/password)    │
│  · PostgreSQL + RLS         │
│  · Storage (product-images) │
└─────────────────────────────┘
```

There is **no custom Node/Laravel API** in this app. The SPA talks directly to Supabase. Security is enforced by **RLS policies** and Auth sessions.

## Tech stack

| Layer | Choice |
|---|---|
| UI | Vue 3.5 Composition API (`<script setup>`) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | `lucide-vue-next` |
| Build | Vite 6 |
| Backend | Supabase (Auth + Postgres + Storage) |
| Hosting | Vercel static SPA (`vercel.json` rewrites) |

## Application structure

```text
src/
├── main.ts                 # createApp bootstrap
├── App.vue                 # Shell: nav, view switcher, cart, auth, toasts
├── style.css               # Tailwind entry
├── components/
│   ├── LandingPage.vue     # Marketing homepage
│   ├── Catalog.vue         # Browse / filter / search
│   ├── ProductDetail.vue   # Product detail page
│   ├── CartDrawer.vue      # Cart slide-over + checkout toast
│   ├── AdminLogin.vue      # Sign in / sign up
│   └── AdminUpload.vue     # Product CRUD + image upload
├── types/
│   └── database.ts         # Product, ProductImage, CartItem, NewProductInput
└── utils/
    └── supabase.ts         # Supabase client singleton
```

## “Routing” model

This is a **single-page shell**, not Vue Router.

- `App.vue` holds `currentView`: `'landing' | 'catalog' | 'detail' | 'admin'`
- Navigation calls `navigateTo(...)` and swaps which component is shown
- Product detail also sets `selectedProduct`
- Vercel rewrites all paths to `index.html` for deep-link safety on deploy (client still uses view state)

## State ownership

| State | Where it lives | Notes |
|---|---|---|
| Auth session | Supabase Auth + `userSession` in `App.vue` | Listener keeps UI in sync |
| Product catalog | Fetched from Supabase into component/app refs | Public reads only `is_active = true` |
| Cart | In-memory in `App.vue` (`cartItems`) | Session-only; clears on full page reload / checkout confirm |
| Toasts | `toastMessage` in `App.vue` | Ephemeral UI feedback |
| Admin inventory | `AdminUpload.vue` | Full list including inactive (auth required) |

## Data flow examples

### Public catalog load

1. Component queries `products` with nested `product_images`
2. Filter `is_active = true` (storefront)
3. On empty/error, some views fall back to sample inventory for demos

### Admin create product

1. User must be authenticated
2. Insert row into `products`
3. Upload files to Storage bucket `product-images`
4. Insert public URLs into `product_images` (primary + sort order)
5. Refresh lists so storefront sees new active products

### Cart / checkout (current behavior)

1. Cart is client state only
2. Shipping estimate: **R450**, or **free** if subtotal **> R15,000**
3. “Checkout” is a **client-side confirmation** (toast) and cart clear — **no order table / payment gateway yet**

## Security model (summary)

- Frontend key is public by design
- Unauthenticated users: **read** active products + public images
- Authenticated users: **CRUD** products/images (RLS) and **upload/delete** storage objects
- Treat any authenticated user as an **admin** in the current schema — there is no separate `admin` role table yet

See [database.md](./database.md) for policies and tables.

## Key files to read first

1. `src/App.vue` — orchestration
2. `src/utils/supabase.ts` — client config
3. `src/types/database.ts` — domain types
4. `supabase/schema.sql` — source of truth for DB
5. `src/components/AdminUpload.vue` — write path + storage
