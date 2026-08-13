# SAFS Furniture — E-Commerce Marketplace Platform
## Functional & Non-Functional Requirements Specification

| Field | Value |
|---|---|
| **Document** | Requirements Specification (v1.0) |
| **Product** | SAFS Furniture — handcrafted South African hardwood furniture marketplace |
| **Type** | Multi-vendor e-commerce marketplace platform (web) |
| **Region / Jurisdiction** | South Africa (ZAR, English) |
| **Applicable Law** | POPIA, CPA (Act 68 of 2008), ECT Act (Act 25 of 2002), VAT Act (Act 89 of 1991), PCI DSS (via payment provider) |
| **Current Stack** | Vue 3 + TypeScript, Supabase (Postgres + Auth + Storage), Vite |

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional (FR) and non-functional (NFR) requirements for the SAFS Furniture platform. It is the single source of truth for what the platform must do (functions) and how well it must do it (quality attributes), including the legal/compliance obligations of operating a compliant South African e-commerce marketplace.

### 1.2 Scope
- **In scope:** marketplace storefront, vendor onboarding/portal, catalogue, search, cart, checkout, payments, orders, fulfilment, returns/refunds, reviews, customer & vendor accounts, admin dashboard, legal/compliance pages, notifications.
- **Out of scope:** physical warehousing, logistics carrier integration, mobile apps (PWA/web only in v1), advanced marketplace analytics.

### 1.3 Stakeholders
| Stakeholder | Interest |
|---|---|
| Consumers | Browse, buy, track orders, return products, safe payment |
| Vendors (handcrafters) | List products, manage stock, fulfil orders, receive payouts |
| Platform operator (SAFS) | Commission, moderation, governance, compliance |
| Administrators | Catalogue law, compliance, user/vendor management |
| Regulators | POPIA/CPA/ECT compliance, tax (SARS) obligations |

### 1.4 Definitions
| Term | Definition |
|---|---|
| Marketplace | Platform where multiple independent vendors sell to consumers |
| Vendor | Registered seller listing products on the platform |
| Consumer / Customer | Registered or guest buyer |
| Product listing | Vendor-published item with images, price, stock, specs |
| Order | Purchase commitment between consumer and vendor via platform |
| Payout | Settlement of funds owed to a vendor by the platform |
| Cooling-off | CPA right to cancel within 5 business days of delivery for goods/services |
| POPIA | Protection of Personal Information Act 4 of 2013 |

---

## 2. Marketplace Model — Key Assumptions

1. **Commission model:** platform charges a commission/fee per successful order; payout to vendor after order completion (minus commission, refunds, chargebacks).
2. **Accountability model:** platform (operator) is the responsible party (POPIA) and the seller of record for compliance purposes; vendors are operators in respect of the personal information they process.
3. **Payments:** hosted, PCI DSS-compliant payment gateway (e.g., PayFast/Peach Payments/Yoco) — platform itself never stores card data (PCI DSS scope reduction via SAQ A).
4. **Multi-vendor only on storefront:** each vendor has its own storefront page, but cart is platform-wide and checkout is split per vendor (one order per vendor, one consolidated payment).
5. **Currency & tax:** ZAR pricing; 15% VAT applied at checkout (displayed separately on invoices).

---

## 3. Functional Requirements (FR)

Requirements are grouped by module. IDs are stable. Priority: **M** = Mandatory (v1), **S** = Should (v1.1), **C** = Could (future).

### 3.1 Marketplace Vendor Model (MARK)
| ID | Requirement | Priority |
|---|---|---|
| FR-MARK-001 | The platform SHALL support multiple vendors, each with a unique vendor account, public storefront page, and vendor profile (logo, bio, rating). | M |
| FR-MARK-002 | Vendors SHALL be onboarded via an application form (business/individual details, contact, bank details for payout, personal information consent) and SHALL be approved or rejected by an administrator before listing. | M |
| FR-MARK-003 | Each product listing SHALL be owned by exactly one vendor and SHALL display vendor name, rating, and "ships in X days" on the storefront. | M |
| FR-MARK-004 | The platform SHALL display vendor terms (commission %, payout schedule, prohibited goods) and SHALL capture vendor acceptance before activation. | M |
| FR-MARK-005 | The platform SHALL support vendor suspension/deactivation by administrators; suspended vendors' listings SHALL be hidden from the storefront immediately. | M |
| FR-MARK-006 | Admin SHALL be able to view per-vendor sales, commission earned, and payout history. | S |

### 3.2 Authentication, Accounts & Privacy (AUTH)
| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-001 | Consumers SHALL register/login with email + password (Supabase Auth), with secure session management. | M |
| FR-AUTH-002 | Password reset SHALL be supported via email link. | M |
| FR-AUTH-003 | Email verification SHALL be required before checkout/order placement. | M |
| FR-AUTH-004 | Two-factor authentication (TOTP) SHALL be available for vendor and admin accounts (mandatory for admin). | S |
| FR-AUTH-005 | Registration SHALL capture explicit, granular POPIA consent: (a) account processing, (b) marketing communications, (c) third-party/vendor sharing, with separate opt-in checkboxes and a link to the privacy policy. | M |
| FR-AUTH-006 | The platform SHALL record consent metadata (what, when, version of policy) per user. | M |
| FR-AUTH-007 | Users SHALL be able to withdraw consent at any time; withdrawal SHALL stop marketing within 5 business days and SHALL be logged. | M |
| FR-AUTH-008 | Users SHALL be able to request a copy of their personal information (data subject access request) via their account or a form. | M |
| FR-AUTH-009 | Account deletion SHALL be self-service; deletion SHALL cascade/pseudonymise personal data per retention policy (see NFR-PRI-004) while preserving transactional records for legal/tax obligations. | M |
| FR-AUTH-010 | Account lockout SHALL apply after 5 failed login attempts (rate-limiting); lockout duration ≥ 15 minutes. | M |
| FR-AUTH-011 | Guest checkout SHALL be disabled for compliance; purchase requires a registered, verified account. | M |

### 3.3 Catalogue & Product Management (CAT)
| ID | Requirement | Priority |
|---|---|---|
| FR-CAT-001 | Products SHALL support the existing schema: name, slug, category, price (ZAR), SKU, stock_quantity, material, color, width/height/depth (cm), weight, description, is_active, is_featured. | M |
| FR-CAT-002 | Vendors SHALL manage their own listings (create, edit, activate/deactivate, delete) through a vendor portal; admins SHALL manage all listings through the admin portal. | M |
| FR-CAT-003 | Each product SHALL have 1..N images with `sort_order` and exactly one `is_primary` image (first shown in catalogue and gallery). | M |
| FR-CAT-004 | Vendors SHALL be able to reorder images and set the primary image (existing admin capability extended to vendor portal). | M |
| FR-CAT-005 | Category hierarchy SHALL support parent/child categories and listing pages per category. | S |
| FR-CAT-006 | Products SHALL carry VAT-inclusive price display and the platform SHALL compute/display VAT-exclusive amount where required by law on invoices. | M |
| FR-CAT-007 | Out-of-stock products SHALL be clearly marked and SHALL not be purchasable. | M |
| FR-CAT-008 | Product descriptions SHALL include mandatory consumer info per CPA s.24: country of origin, materials, dimensions, care instructions. | M |
| FR-CAT-009 | Prohibited goods SHALL be prevented at listing time via category allow-list and admin moderation of new listings. | M |
| FR-CAT-010 | Featured products (is_featured) SHALL be manageable by admin. | M |

### 3.4 Search, Filtering & Discovery (SEA)
| ID | Requirement | Priority |
|---|---|---|
| FR-SEA-001 | Full-text product search SHALL match name, description, material, color, category, vendor name. | M |
| FR-SEA-002 | Faceted filters SHALL include category, price range, material, colour, vendor, and stock availability. | M |
| FR-SEA-003 | Search/filter results SHALL be sortable by relevance, price (asc/desc), newest, rating. | S |
| FR-SEA-004 | Search SHALL be server-side for scalability (not client-side filtering of a full fetch). | S |

### 3.5 Product Detail & Gallery (PDT)
| ID | Requirement | Priority |
|---|---|---|
| FR-PDT-001 | Product detail page SHALL display: primary image gallery (ordered by sort_order), thumbnails, zoom/fullscreen lightbox with keyboard navigation, price, stock status, material, dimensions, colour, description, delivery estimate, vendor card (name, rating, storefront link). | M |
| FR-PDT-002 | Product detail page SHALL display CPA-required information: seller name & registration, country of origin, cooling-off rights notice, warranty status. | M |
| FR-PDT-003 | Related products SHALL be shown (same category / featured). | S |

### 3.6 Cart (CAR)
| ID | Requirement | Priority |
|---|---|---|
| FR-CAR-001 | Cart SHALL be persisted per-user (server-side) — not only session — and survive logout/login and device change. | M |
| FR-CAR-002 | Cart SHALL hold items from multiple vendors; each line shows vendor, product, image, price, quantity, subtotal. | M |
| FR-CAR-003 | Quantity updates SHALL validate against stock and cap at available stock. | M |
| FR-CAR-004 | Cart SHALL display shipping estimate and total including VAT. | M |
| FR-CAR-005 | Cart SHALL notify the user when an item's price has changed since added, before checkout. | S |
| FR-CAR-006 | Cart abandonment SHALL support recovery emails (opt-in only, POPIA-consented marketing). | C |

### 3.7 Shipping & Delivery Zones (SHP)
| ID | Requirement | Priority |
|---|---|---|
| FR-SHP-001 | Shipping cost SHALL be calculated per delivery zone/province using configurable base fee, per-item surcharge, weight surcharge, and free-shipping threshold. | M |
| FR-SHP-002 | Delivery estimate (3–5 days baseline) SHALL be shown at product level and recalculated at checkout against the selected zone. | M |
| FR-SHP-003 | Vendors SHALL define their shipping rules (cost, coverage) per province or delegate to platform defaults. | S |
| FR-SHP-004 | Out-of-coverage destinations SHALL be blocked with a clear message. | M |

### 3.8 Checkout & Payments (CHK)
| ID | Requirement | Priority |
|---|---|---|
| FR-CHK-001 | Checkout SHALL collect: billing address, shipping address, delivery zone, notes; addresses SHALL be validated (SA postal format and province). | M |
| FR-CHK-002 | Checkout SHALL split into one order per vendor (sub-order), with one consolidated payment transaction. | M |
| FR-CHK-003 | Order totals SHALL break down subtotal, VAT (15%), shipping, discount, total — all in ZAR. | M |
| FR-CHK-004 | Checkout SHALL display platform terms, vendor terms, returns/cooling-off statement, and require explicit acceptance before payment. | M |
| FR-CHK-005 | Payment SHALL be processed via a PCI DSS-compliant hosted gateway (card, mobile payment, EFT); the platform SHALL NOT store PAN/CVV. | M |
| FR-CHK-006 | Payment SHALL be confirmed via webhook/notification (server-side, verified with signature), never by client-side callback alone. | M |
| FR-CHK-007 | Order SHALL only be created/confirmed after payment success (replacing the current auto `paid_at = now()` behaviour). | M |
| FR-CHK-008 | Failed/cancelled payments SHALL return the user to checkout with the cart intact and an error message. | M |
| FR-CHK-009 | Stock SHALL be decremented transactionally at order confirmation; insufficient stock SHALL abort checkout for that line. | M |
| FR-CHK-010 | An order confirmation email with a VAT-compliant PDF invoice SHALL be sent on confirmation. | M |

### 3.9 Orders & Fulfilment (ORD)
| ID | Requirement | Priority |
|---|---|---|
| FR-ORD-001 | Order statuses SHALL be: pending → confirmed → processing → shipped → delivered, plus cancelled/refunded and failure states. | M |
| FR-ORD-002 | Customers SHALL view order history and detail (items, totals, status timeline, tracking info, invoices) in their account. | M |
| FR-ORD-003 | Vendors SHALL see and update status only for orders containing their items (processing/shipped). | M |
| FR-ORD-004 | Status transitions SHALL notify the customer by email (confirmation, shipped, delivered) and SHALL be logged with timestamp + actor. | M |
| FR-ORD-005 | Customers SHALL be able to cancel an order before fulfilment (full refund) per CPA cooling-off. | M |
| FR-ORD-006 | Order messages SHALL support customer↔vendor↔admin communication, persisted and visible to all parties. | M |
| FR-ORD-007 | Admin SHALL have full order oversight, including refund/partial-refund actions. | M |

### 3.10 Returns, Refunds & Consumer Protection (RET)
| ID | Requirement | Priority |
|---|---|---|
| FR-RET-001 | The platform SHALL support consumer returns: online return request with reason, vendor approval flow, return shipping arrangement. | M |
| FR-RET-002 | CPA cooling-off (5 business days from delivery, for goods) SHALL be stated on the product page, checkout, and in order confirmation. | M |
| FR-RET-003 | Refunds SHALL flow: refund to customer (original payment method via gateway) and reversal of vendor payout/commission. | M |
| FR-RET-004 | Dispute escalation SHALL be supported: unresolved vendor↔customer disputes route to platform admin mediation. | S |
| FR-RET-005 | Warranty claims SHALL be presented per vendor (warranty terms displayed on listing; claim via support form). | S |

### 3.11 Reviews & Ratings (REV)
| ID | Requirement | Priority |
|---|---|---|
| FR-REV-001 | Verified purchasers SHALL rate (1–5) and review products and vendors after delivery. | M |
| FR-REV-002 | Only purchasers of that item SHALL review it (verified badge shown). | M |
| FR-REV-003 | Vendors SHALL be able to reply to reviews; abuse SHALL be reportable and modifiable by admin. | S |
| FR-REV-004 | Aggregate ratings SHALL be shown on product cards and vendor storefronts. | S |

### 3.12 Vendor Payouts (PAY)
| ID | Requirement | Priority |
|---|---|---|
| FR-PAY-001 | Vendor payout SHALL be calculated per order: gross − commission − refunds − chargebacks; payout after delivery confirmation + x days. | M |
| FR-PAY-002 | Payout history and statements SHALL be visible in the vendor portal (CSV export). | S |
| FR-PAY-003 | Payout failures (invalid bank details) SHALL alert the vendor and block further onboarding of new listings until resolved. | S |

### 3.13 Wishlist (WIS)
| ID | Requirement | Priority |
|---|---|---|
| FR-WIS-001 | Registered users SHALL add/remove products to a persistent wishlist, visible in a drawer. | M |
| FR-WIS-002 | Stock/price changes on wishlisted items SHALL be surfaced to the user. | S |

### 3.14 Admin Portal (ADM)
| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-001 | Admin SHALL manage categories, products (all vendors), orders, customers, vendors, and images — extending the existing AdminUpload inventory. | M |
| FR-ADM-002 | Admin SHALL manage vendors: approve/reject applications, suspend, set commission terms. | M |
| FR-ADM-003 | Admin SHALL moderate listings, reviews, and disputes. | M |
| FR-ADM-004 | Admin SHALL manage legal content (T&Cs, privacy policy, returns policy) with version control for consent records. | S |
| FR-ADM-005 | Admin audit log SHALL record all administrative actions (who, what, when). | M |

### 3.15 Notifications & Communications (NOT)
| ID | Requirement | Priority |
|---|---|---|
| FR-NOT-001 | Transactional emails SHALL be sent for: order confirmation (+invoice), shipping, delivery, returns, password reset, verification. | M |
| FR-NOT-002 | Marketing emails SHALL only be sent to consenting users and SHALL include opt-out/unsubscribe (POPIA). | M |
| FR-NOT-003 | Email frequency and content SHALL be configurable; preference centre in account. | S |

### 3.16 Marketplace Trust & Legal Pages (LEG)
| ID | Requirement | Priority |
|---|---|---|
| FR-LEG-001 | The platform SHALL publish, and keep current: Terms & Conditions, Privacy Policy (POPIA), Returns & Cooling-off Policy, Seller Terms, and Cookie Policy. | M |
| FR-LEG-002 | ECT Act compliance SHALL be met: business name, registration number, physical address, contact details, and membership/code of conduct details displayed on the site footer and T&Cs. | M |
| FR-LEG-003 | T&Cs SHALL be accepted at registration and at checkout, with acceptance recorded (ECT Act). | M |
| FR-LEG-004 | Cookie consent banner SHALL be displayed with accept/decline options (functional vs non-functional cookies). | M |
| FR-LEG-005 | Invoice/CRN SHALL meet VAT Act requirements (seller details, VAT number, date, line items, VAT split). | M |

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance (NFR-PER)
| ID | Requirement | Target |
|---|---|---|
| NFR-PER-001 | Storefront page load (catalogue, product detail, home) | ≤ 2.5 s on mid-range mobile (3G/4G) for HTTP response + first content |
| NFR-PER-002 | TTFB (server response) for catalogue/page data | ≤ 400 ms p95 |
| NFR-PER-003 | Checkout order creation (after payment webhook) | ≤ 2 s p95 |
| NFR-PER-004 | Search results | ≤ 500 ms p95 |
| NFR-PER-005 | Image heavy pages (gallery) SHALL lazy-load below-the-fold images; primary image ≤ 200 KB (WebP/AVIF, responsive srcset). | — |
| NFR-PER-006 | Concurrent users: platform SHALL sustain 1,000 concurrent sessions without degradation; 5,000 for v1.2 scale target. | — |
| NFR-PER-007 | API/database query p95 for catalogue queries | ≤ 500 ms with caching |

### 4.2 Scalability & Elasticity (NFR-SCA)
| ID | Requirement |
|---|---|
| NFR-SCA-001 | The data layer SHALL scale independently of the web tier (Supabase/Postgres horizontal scale, connection pooling). |
| NFR-SCA-002 | Asset delivery SHALL use a CDN with edge caching for images (Supabase Storage + CDN). |
| NFR-SCA-003 | Caching SHALL be used for catalogue (read-heavy, write-light); cache invalidation on product change ≤ 60 s. |
| NFR-SCA-004 | Bulk operations (payout runs, email queues) SHALL be processed asynchronously via queues. |

### 4.3 Availability & Reliability (NFR-AVL)
| ID | Requirement | Target |
|---|---|---|
| NFR-AVL-001 | Platform availability | ≥ 99.5% monthly uptime |
| NFR-AVL-002 | Maintenance windows SHALL be min 1 notification; planned downtime ≤ 2 h/quarter. | — |
| NFR-AVL-003 | Checkout SHALL be resilient to gateway outages: payment intents queued/retried, user informed. 0 data loss on webhook. | — |
| NFR-AVL-004 | Backup: automated daily full + point-in-time recovery; RPO ≤ 24 h, RTO ≤ 4 h. | — |
| NFR-AVL-005 | Graceful degradation: catalogue readable during checkout outage and vice versa. | — |

### 4.4 Security (NFR-SEC)
| ID | Requirement |
|---|---|
| NFR-SEC-001 | All traffic SHALL be HTTPS/TLS 1.2+; HSTS enabled; no mixed content. |
| NFR-SEC-002 | OWASP Top 10 SHALL be addressed: parameterised queries (via Supabase client), output encoding (XSS), CSRF protection on state-changing routes, strict CORS, secure session cookies (HttpOnly, Secure, SameSite), rate limiting on auth endpoints. |
| NFR-SEC-003 | Row-Level Security (RLS) SHALL be enabled on Supabase for all tables, with policies: users read/write their own data; vendors read/write their own listings & orders; admin via service role only. RLS off is a release blocker. |
| NFR-SEC-004 | Auth SHALL use Supabase Auth with email verification, bcrypt password hashing (default), and session expiry. |
| NFR-SEC-005 | Admin and vendor accounts SHALL require 2FA (TOTP). |
| NFR-SEC-006 | API keys/service role secrets SHALL live in server-side env vars only, never client bundle. |
| NFR-SEC-007 | Payment card data SHALL never touch platform servers; PCI DSS via SAQ A (hosted gateway). |
| NFR-SEC-008 | File uploads (product images) SHALL be validated: type allow-list (jpeg/png/webp), size limits, malware scan, served from isolated storage with signed URLs where non-public. |
| NFR-SEC-009 | Security headers SHALL be set: CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy. |
| NFR-SEC-010 | Dependency vulnerabilities SHALL be scanned (npm audit / Dependabot) and critical CVEs patched ≤ 7 days. |
| NFR-SEC-011 | Failed webhook deliveries SHALL be retried with exponential backoff; payloads signed (HMAC) and verified. |

### 4.5 Privacy & Data Protection — POPIA (NFR-PRI)
| ID | Requirement |
|---|---|
| NFR-PRI-001 | Personal information SHALL only be processed for lawful bases (consent, contract, legal obligation, legitimate interest) with documented records of processing. |
| NFR-PRI-002 | Data minimisation: SHALL only collect fields required for the function (delivery, tax, payout). |
| NFR-PRI-003 | Access control: least privilege on all roles; staff access to customer data restricted and audited. |
| NFR-PRI-004 | Retention SHALL follow a published schedule: account data until deletion request; transactional records ≥ 5 years (SARS/VAT); consent records ≥ 5 years; marketing opt-outs retained indefinitely. Data SHALL be pseudonymised/deleted per schedule. |
| NFR-PRI-005 | DSAR handling: cost-free copy of data within 30 days; deletion within 30 business days where no legal basis to retain. |
| NFR-PRI-006 | Security measures SHALL include 256-bit encryption at rest (storage, backups) and TLS in transit. |
| NFR-PRI-007 | Cross-border transfers SHALL be documented (e.g., Supabase hosting region: South Africa or adequacy-approved region); Information Officer designated and registered. |
| NFR-PRI-008 | Breach response: detect, contain, notify Information Regulator and affected parties per POPIA timelines; incident playbook maintained. |
| NFR-PRI-009 | Third-party processors (payment gateway, email provider, hosting) SHALL be governed by written agreements (Section 20/21 POPIA). |

### 4.6 Usability & UX (NFR-UX)
| ID | Requirement |
|---|---|
| NFR-UX-001 | 80% of core journeys (search → detail → cart → checkout → order confirmation) completable by first-time users without assistance. |
| NFR-UX-002 | Checkout SHALL have ≤ 5 steps; each step SHALL clearly show progress. |
| NFR-UX-003 | All forms SHALL show inline validation with clear error messages and focus management. |
| NFR-UX-004 | Mobile-first design; core flows usable thumbs-only on ≥ 360 px viewports. |
| NFR-UX-005 | Loading states (skeleton) and empty states SHALL be provided for all data views. |

### 4.7 Accessibility (NFR-ACC)
| ID | Requirement | Target |
|---|---|---|
| NFR-ACC-001 | The platform SHALL conform to WCAG 2.2 Level AA. | — |
| NFR-ACC-002 | All images SHALL have alt text; interactive elements keyboard-operable with visible focus. | — |
| NFR-ACC-003 | Colour contrast ≥ 4.5:1 for text; no information conveyed by colour alone (e.g., stock states). | — |
| NFR-ACC-004 | Forms: labelled inputs, error announcements (ARIA live), logical tab order. | — |
| NFR-ACC-005 | Lightbox/carousel SHALL support keyboard (arrows, Esc) and SHALL not trap focus. | — |

### 4.8 Compliance & Legal (NFR-COM)
| ID | Requirement |
|---|---|
| NFR-COM-001 | **CPA:** display seller information, refunds/cooling-off (5 business days), express warranties, and price accuracy controls (CPA s.24, s.24(3), s.44, s.55). |
| NFR-COM-002 | **ECT Act:** business identity disclosure, T&C acceptance records (timestamp, version, IP), electronic contract integrity. |
| NFR-COM-003 | **POPIA:** see §4.5; Information Officer, PAIA manual published. |
| NFR-COM-004 | **VAT Act:** 15% VAT on invoices with valid tax invoice fields; VAT number displayed. |
| NFR-COM-005 | **PCI DSS:** hosted gateway, SAQ A scope; quarterly compliance evidence retained. |
| NFR-COM-006 | All price/stock/product claims SHALL be truthful on listing (correct description, no false scarcity). |

### 4.9 Compatibility & Environments (NFR-COM2)
| ID | Requirement |
|---|---|
| NFR-COM2-001 | Supported browsers SHALL be current 2 versions: Chrome, Edge, Firefox, Safari (incl. iOS Safari). |
| NFR-COM2-002 | Responsive layout SHALL work ≥ 360 px width; no horizontal scroll on core pages. |
| NFR-COM2-003 | The platform SHALL be installable as PWA (offline shell for catalogue) by v1.2. | C |

### 4.10 Maintainability (NFR-MAI)
| ID | Requirement |
|---|---|
| NFR-MAI-001 | Code SHALL follow the conventions in AGENTS.md (TypeScript strict, PascalCase components, typed routes); shared types in `src/types/`. |
| NFR-MAI-002 | Automated tests SHALL cover: unit (≥ 70% coverage of business logic), integration (API + RLS policies), E2E for core journeys (catalogue, cart, checkout, admin). |
| NFR-MAI-003 | CI SHALL run lint, typecheck, and tests on every PR; deploys gated on green CI. |
| NFR-MAI-004 | Feature flags SHALL gate high-risk rollouts (checkout, payouts). |
| NFR-MAI-005 | Logging SHALL be structured (JSON) with request IDs; < 1 h to trace a user journey from logs. |

### 4.11 Monitoring, Observability & Audit (NFR-OBS)
| ID | Requirement |
|---|---|
| NFR-OBS-001 | Metrics SHALL be collected: latency, error rate, conversion funnel, gateway webhook success rate, queue depth. |
| NFR-OBS-002 | Alerts SHALL fire on: error rate > 1%, checkout failure > 2%, availability breach, webhook outage > 15 min. |
| NFR-OBS-003 | Immutable audit log SHALL record: admin actions, vendor actions, status changes, consent changes, payment events (amount, status, reference — never card data). |
| NFR-OBS-004 | Audit logs retained ≥ 5 years and exportable for regulatory request. |

---

## 5. Prioritisation Summary (MoSCoW)

| Priority | Count | Notes |
|---|---|---|
| **Must** (v1) | All FR-MARK-001..006, FR-AUTH-001..011, CAT, PDT-001..003, CAR, SHP, CHK, ORD, RET-001..004, REV-001..002, WIS, ADM, NOT, LEG, all NFR | Release-blocking |
| **Should** (v1.1) | FR-SEA-003..004, FR-PAY-002..003, REV-003..004, ADM-004, RET-005, US-* | Soon after launch |
| **Could** | FR-CAR-006, NFR-COM2-003, marketplace analytics | Backlog |

---

## 6. Requirements Traceability Matrix (Top Compliance Items)

| Requirement | Source / Law | Test Type |
|---|---|---|
| FR-AUTH-005, 006, 007 | POPIA (consent) | E2E + unit |
| FR-AUTH-008, 009; NFR-PRI-005 | POPIA (DSAR, deletion) | E2E + unit |
| FR-LEG-002, 003 | ECT Act | E2E + content audit |
| FR-RET-002, FR-LEG-001 | CPA (cooling-off) | E2E |
| FR-CHK-005, 006, 007; NFR-SEC-007 | PCI DSS / payment | Integration (webhook) |
| FR-CHK-010, FR-LEG-005 | VAT Act (invoice) | Snapshot test of PDF |
| NFR-SEC-003, 004 | Security / Supabase RLS | Integration test per table |
| NFR-PRI-004, 008 | POPIA (retention, breach) | Process test + policy review |

---

## 7. Open Items & Assumptions

1. Payment provider not yet chosen — FR-CHK-005..006 assume hosted gateway with webhooks (PayFast / Peach Payments / Yoco recommended for SA).
2. Payouts require banking verification (FICA/KYC) for vendors — process to be defined with legal.
3. Marketplace commission % and payout schedule TBD (config values).
4. VAT treatment of marketplace fees vs resale model needs SARS/tax advice — selling-of-record model assumed.
5. Current prototype makes orders with `paid_at = now()` and no payment step — FR-CHK-007 explicitly replaces this.

---

*End of specification — extend `vision/vision.md` with product vision, then link: `See [requirements.md](requirements.md)`.*