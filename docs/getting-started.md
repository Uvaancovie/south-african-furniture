# Getting Started

Audience: **developers** setting up SAFS Furniture locally.

## Prerequisites

- Node.js **18+** (20+ recommended)
- npm (or pnpm / yarn)
- A [Supabase](https://supabase.com) project

## 1. Clone and install

```bash
git clone <your-repo-url>
cd furniture
npm install
```

## 2. Environment variables

Copy the example file:

```bash
cp .env.example .env
```

Set:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → `anon` / publishable key |

Example shape (use **your** values):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

> Only use the **anon / publishable** key in the frontend. Never put the **service role** key in Vite env vars — it would be exposed in the browser bundle.

## 3. Database and storage

In the Supabase dashboard → **SQL Editor**, run the full script:

```text
supabase/schema.sql
```

That creates:

- `products` and `product_images` tables
- Indexes
- Row Level Security (RLS) policies
- Public `product-images` storage bucket + policies

## 4. Create an admin user

Pick one:

1. **In-app:** open Admin → use **Create Admin Account** (sign-up form), or
2. **Dashboard:** Supabase → Authentication → Users → Add user

Store credentials in a password manager — do **not** commit them to git.

## 5. Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 6. Verify the happy path

| Step | Expected |
|---|---|
| Open home | Landing page with hero, categories, featured products |
| Catalog | Active products load from Supabase (or sample fallback if empty) |
| Admin (signed out) | Login / sign-up form |
| Admin (signed in) | Product list + create/edit form |
| Upload product + image | Appears in catalog when `is_active` is true |
| Add to cart | Cart drawer updates count and totals |

## Useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run types:check` | Vue/TS type check (`vue-tsc`) |

## Next reading

- [Architecture](./architecture.md)
- [Database](./database.md)
- [Admin guide](./admin-guide.md)
- [Deployment](./deployment.md)
