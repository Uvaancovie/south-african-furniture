# Privacy & Compliance (POPIA / GDPR)

Audience: **product**, **legal**, and **developers**.

> This is a **project checklist**, not legal advice. Have a qualified person review before production launch in South Africa or the EU.

## Why this matters

SAFS Furniture targets the **South African** market. **POPIA** (Protection of Personal Information Act) applies to personal information you collect. If you serve EU customers, **GDPR** may also apply.

## What the app collects today

| Data | Where | Purpose |
|---|---|---|
| Admin email + password | Supabase Auth | Staff access |
| Product catalog data | Postgres | Commerce catalog (not personal data) |
| Product images | Supabase Storage | Catalog media |
| Cart contents | Browser memory only | Session shopping |

**Not implemented yet:** persistent customer checkout profiles, order history, marketing lists, or server-side payment data.

## Current risk notes

1. **Checkout is client-side only** — you are not yet storing customer addresses or payment details in this repo’s schema. When you add real checkout, privacy design must ship with it.
2. **Admin Auth** — treat admin accounts as privileged; limit who can sign up if the public sign-up path remains open.
3. **Public product images** — do not upload customer personal photos into the public `product-images` bucket.
4. **Secrets** — never commit service role keys or real user passwords to git (including `admin/login.md`-style notes in public repos).

## POPIA-oriented checklist (product)

When you add real orders or accounts, plan for:

| Requirement | Implementation direction for *this* stack |
|---|---|
| Lawful processing & purpose | Document why each field is collected |
| Explicit consent | Active checkboxes for terms + marketing (never pre-checked) |
| Minimum data | Collect only what fulfillment needs |
| Security safeguards | RLS, HTTPS, least-privilege keys, auth on writes |
| Retention | Define how long orders/messages are kept; add delete jobs if needed |
| Access / correction | Process for customers to request data access or deletion |
| Operator agreements | Contracts with Supabase / Vercel as operators |

## Suggested future schema (when orders exist)

If you introduce orders in Supabase, prefer consent columns on the order (or customer) record, for example:

```sql
-- Example only — not applied yet
alter table public.orders
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists terms_accepted boolean not null default false;
```

UI rules:

- Terms checkbox **required** before place order
- Marketing checkbox **optional**, default **unchecked**
- Store the boolean values with the order timestamp and version of terms text if possible

## Frontend consent pattern (Vue)

When building checkout, use explicit opt-in — not pre-checked boxes:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const termsAccepted = ref(false)
const marketingConsent = ref(false) // must start false
</script>

<template>
  <label class="flex items-start gap-2">
    <input v-model="termsAccepted" type="checkbox" required />
    <span>I accept the Terms of Service and Privacy Policy</span>
  </label>

  <label class="flex items-start gap-2">
    <input v-model="marketingConsent" type="checkbox" />
    <span>Send me product updates and offers (optional)</span>
  </label>
</template>
```

## Privacy policy & notices

Before public launch, publish:

- Privacy policy (what you collect, why, who you share with, retention)
- Terms of service
- Cookie notice if you add analytics cookies beyond essential storage

Link them in the footer and at checkout.

## Incident response (lightweight)

1. Revoke compromised keys in Supabase
2. Force password resets for affected admins
3. Review Auth and Storage logs
4. Document what data was exposed
5. Notify as required under POPIA/GDPR timelines

## Related docs

- [Architecture](./architecture.md)
- [Database](./database.md)
- [Admin guide](./admin-guide.md)
