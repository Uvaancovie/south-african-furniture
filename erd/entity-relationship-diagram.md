# SAFS Furniture Marketplace — Entity Relationship Diagram

**Source:** `vision/requirements.md` v1.0
**Stack target:** Supabase (Postgres) — `uuid` primary keys, `jsonb` for flexible payloads, `numeric` for money.

> Legend: ★ = exists in current prototype/schema · † = new for marketplace (v1.0)

---

## Mermaid ERD

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : "has billing/shipping"
    USERS ||--o{ USER_CONSENTS : "gives"
    USERS ||--o| VENDOR_PROFILES : "is vendor"
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CART_ITEMS : owns
    USERS ||--o{ WISHLIST_ITEMS : owns
    USERS ||--o{ PRODUCT_REVIEWS : writes
    USERS ||--o{ VENDOR_REVIEWS : writes
    USERS ||--o{ ORDER_MESSAGES : posts
    USERS ||--o{ AUDIT_LOGS : "performs action"

    VENDOR_PROFILES ||--o{ PRODUCTS : lists
    VENDOR_PROFILES ||--o{ SHIPPING_RULES : defines
    VENDOR_PROFILES ||--o{ VENDOR_PAYOUTS : receives
    VENDOR_PROFILES ||--o{ VENDOR_REVIEWS : "receives rating"

    CATEGORIES ||--o{ CATEGORIES : "parent_id self-ref"
    CATEGORIES ||--o{ PRODUCTS : classifies

    PRODUCTS ||--o{ PRODUCT_IMAGES : "ordered gallery"
    PRODUCTS ||--o{ CART_ITEMS : "added to"
    PRODUCTS ||--o{ WISHLIST_ITEMS : "saved as"
    PRODUCTS ||--o{ ORDER_ITEMS : "sold as"
    PRODUCTS ||--o{ PRODUCT_REVIEWS : rated

    DELIVERY_ZONES ||--o{ SHIPPING_RULES : "per vendor fee"
    DELIVERY_ZONES ||--o{ ORDERS : "selected zone"

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ ORDER_MESSAGES : threads
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "state timeline"
    ORDERS ||--o{ RETURNS : "may have"
    ORDERS ||--|{ PAYMENT_TRANSACTIONS : paid via
    ORDERS ||--o{ EMAIL_LOGS : "notified about"

    ORDER_ITEMS ||--o{ PRODUCT_REVIEWS : "verified by"
    ORDER_ITEMS ||--o{ RETURNS : "line returns"

    PAYMENT_TRANSACTIONS ||--o{ REFUNDS : "refunded via"

    RETURNS ||--o{ REFUNDS : "resolved by"

    LEGAL_DOCUMENTS ||--o{ USER_CONSENTS : "consented version"

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        varchar phone
        timestamp email_verified_at
        varchar role "customer | vendor | admin"
        boolean is_active
        varchar two_factor_secret
        timestamp created_at
        timestamp updated_at
    }

    ADDRESSES {
        uuid id PK
        uuid user_id FK
        varchar type "billing | shipping"
        varchar line1
        varchar line2
        varchar city
        varchar province
        varchar postal_code
        varchar country "default ZA"
        boolean is_default
        timestamp created_at
    }

    USER_CONSENTS {
        uuid id PK
        uuid user_id FK
        uuid legal_document_id FK
        varchar consent_type "account | marketing | vendor_sharing"
        boolean granted
        varchar policy_version
        timestamp granted_at
        timestamp revoked_at
    }

    VENDOR_PROFILES {
        uuid id PK
        uuid user_id FK UK
        varchar business_name
        varchar registration_number
        varchar country_of_origin
        varchar description
        varchar logo_url
        numeric commission_rate "0.00 - 1.00"
        varchar bank_account_token "encrypted / tokenised"
        varchar fica_status "pending | verified"
        varchar status "pending | approved | suspended"
        timestamp approved_at
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        varchar name
        varchar slug UK
        text description
        uuid parent_id FK "null = root"
        int sort_order
        boolean is_active
        timestamp created_at
    }

    PRODUCTS {
        uuid id PK
        uuid vendor_id FK
        uuid category_id FK
        varchar name
        varchar slug UK
        text description
        numeric price "ZAR, VAT-inclusive"
        numeric vat_rate "0.15"
        varchar sku UK
        int stock_quantity
        varchar material
        varchar color
        numeric width
        numeric height
        numeric depth
        numeric weight_kg
        varchar country_of_origin
        varchar warranty_info
        boolean is_active
        boolean is_featured
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        varchar image_path
        varchar alt_text
        int sort_order
        boolean is_primary
        timestamp created_at
    }

    CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        int quantity
        timestamp added_at
        "UNIQUE (user_id, product_id)"
    }

    WISHLIST_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        timestamp created_at
        "UNIQUE (user_id, product_id)"
    }

    DELIVERY_ZONES {
        uuid id PK
        varchar province
        varchar area
        numeric km_from_base
        numeric base_fee
        boolean is_active
    }

    SHIPPING_RULES {
        uuid id PK
        uuid vendor_id FK
        uuid delivery_zone_id FK
        numeric fee
        numeric free_above "null = never free"
        boolean is_active
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid delivery_zone_id FK
        varchar order_number UK "ORD-XXXXXXXXXX"
        varchar status "pending | confirmed | processing | shipped | delivered | cancelled | refunded"
        numeric subtotal
        numeric tax "VAT 15%"
        numeric shipping_cost
        numeric discount "default 0"
        numeric total
        varchar currency "ZAR"
        jsonb billing_address
        jsonb shipping_address
        text notes
        varchar payment_status "unpaid | paid | refunded"
        timestamp paid_at
        timestamp placed_at
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid vendor_id FK
        int quantity
        numeric unit_price
        numeric subtotal
        varchar product_name "snapshot"
        jsonb product_data "slug, sku snapshot"
        timestamp created_at
    }

    ORDER_MESSAGES {
        uuid id PK
        uuid order_id FK
        uuid user_id FK "customer | vendor | admin"
        text message
        timestamp created_at
    }

    ORDER_STATUS_HISTORY {
        uuid id PK
        uuid order_id FK
        varchar from_status
        varchar to_status
        uuid actor_id FK
        varchar actor_role
        timestamp created_at
    }

    PAYMENT_TRANSACTIONS {
        uuid id PK
        uuid order_id FK
        varchar gateway "payfast | peach | yoco"
        varchar gateway_reference UK
        numeric amount
        varchar status "initiated | succeeded | failed | refunded"
        jsonb raw_payload "webhook body"
        timestamp created_at
    }

    RETURNS {
        uuid id PK
        uuid order_id FK
        uuid order_item_id FK
        uuid user_id FK
        text reason
        varchar status "requested | approved | rejected | refunded"
        numeric refund_amount
        text resolution_notes
        timestamp created_at
        timestamp resolved_at
    }

    REFUNDS {
        uuid id PK
        uuid payment_transaction_id FK
        uuid return_id FK
        uuid order_id FK
        numeric amount
        varchar gateway_reference
        varchar status "initiated | succeeded | failed"
        uuid initiated_by FK "staff"
        timestamp created_at
    }

    PRODUCT_REVIEWS {
        uuid id PK
        uuid order_item_id FK UK "one verified review per purchase"
        uuid product_id FK
        uuid user_id FK
        int rating "1-5"
        text comment
        text vendor_reply
        boolean moderated
        timestamp created_at
    }

    VENDOR_REVIEWS {
        uuid id PK
        uuid order_id FK
        uuid vendor_id FK
        uuid user_id FK
        int rating
        text comment
        timestamp created_at
    }

    VENDOR_PAYOUTS {
        uuid id PK
        uuid vendor_id FK
        date period_start
        date period_end
        numeric gross
        numeric commission
        numeric refunds
        numeric net
        varchar status "pending | paid | failed"
        varchar bank_reference
        timestamp paid_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        varchar actor_role
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb old_values
        jsonb new_values
        varchar ip_address
        timestamp created_at
    }

    LEGAL_DOCUMENTS {
        uuid id PK
        varchar doc_type "terms | privacy | returns | seller_terms"
        varchar version
        text content
        timestamp effective_date
        uuid published_by FK
    }

    EMAIL_LOGS {
        uuid id PK
        uuid user_id FK
        uuid order_id FK "optional"
        varchar template
        varchar subject
        varchar status "queued | sent | failed"
        timestamp sent_at
    }
```

---

## Key design decisions (from requirements.md)

| # | Decision | Rationale |
|---|---|---|
| 1 | `orders` is customer-level; `order_items.vendor_id` splits fulfilment per vendor (FR-CHK-002) | One consolidated payment, one order per vendor for fulfilment |
| 2 | `product_images.is_primary` + `sort_order` (FR-CAT-003, FR-CAT-004) | Primary image drives catalogue cards; sort_order drives gallery order |
| 3 | `user_consents` links to a `legal_documents` version (FR-AUTH-006) | POPIA requires proving *which* policy version was accepted, with timestamps |
| 4 | `order_items.product_name/product_data` snapshots (existing pattern) | Price/name changes must not rewrite historical invoices |
| 5 | `payment_transactions.raw_payload` + `gateway_reference` UK (FR-CHK-006) | Webhook replay protection and audit for PCI SAQ A |
| 6 | `returns` links to `order_item_id` and creates `refunds` via `payment_transactions` (FR-RET-001..003) | CPA cooling-off refunds flow back through the gateway |
| 7 | `vendor_profiles.commission_rate` + `vendor_payouts` (FR-PAY-001..003) | Net payout = gross − commission − refunds |
| 8 | `audit_logs` immutable (NFR-OBS-003) | Admin/vendor actions traceable for regulatory requests |
| 9 | `cart_items` server-side (FR-CAR-001) | Requirements move cart from session/ref-based to persisted per user |
| 10 | `order_status_history` (FR-ORD-004, FR-ORD-007) | Every state change has actor + timestamp |

## Current prototype diff to target schema

| Current (prototype) | Target | Change |
|---|---|---|
| `products` (no vendor) | + `vendor_id` FK | Multi-vendor (FR-MARK-003) |
| `product_images` (image_url, is_primary, sort_order) | + `alt_text` | Accessibility (NFR-ACC-002) |
| `orders.user_id` + `order_items` | + `vendor_id`, `payment_status`, statuses | Marketplace split + payment lifecycle |
| `delivery_zones.fee` | `base_fee` + `shipping_rules` per vendor | Vendor shipping delegation (FR-SHP-003) |
| (none) | `vendor_profiles`, `payouts`, `returns`, `refunds`, `user_consents`, `audit_logs`, `legal_documents`, `reviews`, `cart_items`, `wishlist_items` | Marketplace + compliance entities |
| `orders.paid_at = now()` (auto) | `payment_transactions` driven by gateway webhook | FR-CHK-005..007 |