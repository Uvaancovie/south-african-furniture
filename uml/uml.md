# SAFS Furniture Store — UML Diagrams

**Source:** `vision/requirements.md` v2.0 · Renders on GitHub / VS Code (Mermaid extension) / mermaid-cli
**Model:** single-brand online store (no third-party vendors)
**Contents:** 1) Use Case · 2) Domain Class Diagram · 3) Checkout Sequence · 4) Order State Machine

---

## 1. Use Case Diagram

```mermaid
flowchart TB
    subgraph platform["SAFS Furniture Store"]
        direction TB

        subgraph storefront["Storefront"]
            BROWSE["Browse catalogue"]
            SEARCH["Search & filter"]
            VIEW["View product detail<br/>(gallery, specs, CPA info)"]
            CART["Manage cart"]
            WISHLIST["Manage wishlist"]
            CHECKOUT["Checkout & pay"]
            ORDERS["View orders / tracking"]
            RETURN["Request return / refund"]
            REVIEW["Write verified review"]
            CONSENT["Manage consents & POPIA rights<br/>(DSAR, delete account)"]
            SUPPORT["Order messaging"]
        end

        subgraph adminPortal["Admin Portal"]
            PRODUCTS["Manage products, categories &<br/>product images (reorder / primary)"]
            STOCK["Manage stock & pricing"]
            SHIPR["Configure shipping rules & zones"]
            FULFIL["Fulfil orders (process/ship/deliver)"]
            REFUNDS["Approve returns & issue refunds"]
            MODERATE["Moderate reviews"]
            CUSTOMERS["Manage customers"]
            LEGAL["Manage legal docs & versions<br/>(T&Cs, privacy, returns)"]
            AUDIT["View audit log"]
        end
    end

    consumer(["Consumer"])
    admin(["Administrator (SAFS staff)"])
    gateway["Payment Gateway (system)"]
    email["Email Service (system)"]

    consumer --> BROWSE & SEARCH & VIEW & CART & WISHLIST & CHECKOUT & ORDERS & RETURN & REVIEW & CONSENT & SUPPORT
    admin --> PRODUCTS & STOCK & SHIPR & FULFIL & REFUNDS & MODERATE & CUSTOMERS & LEGAL & AUDIT

    CHECKOUT --> gateway : "hosted payment (PCI SSP)"
    gateway -. webhook .-> CHECKOUT
    ORDERS --> email
    SUPPORT --> email
```

---

## 2. Domain Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +uuid id
        +string email
        +string name
        +string phone
        +string role "customer | admin"
        +bool email_verified
        +bool is_active
        +register()
        +requestDataCopy() DSAR
        +deleteAccount()
    }

    class Address {
        +uuid id
        +string type
        +string line1
        +string city
        +string province
        +string postal_code
        +bool is_default
    }

    class Consent {
        +uuid id
        +string consent_type
        +bool granted
        +string policy_version
        +datetime granted_at
        +revoke()
    }

    class Category {
        +uuid id
        +string name
        +string slug
        +uuid parent_id
        +int sort_order
    }

    class Product {
        +uuid id
        +string name
        +string slug
        +numeric price
        +numeric vat_rate
        +string sku
        +int stock_quantity
        +string material
        +numeric width
        +numeric height
        +numeric depth
        +numeric weight_kg
        +string country_of_origin
        +bool is_active
        +bool is_featured
        +decrementStock(qty)
    }

    class ProductImage {
        +uuid id
        +string image_path
        +string alt_text
        +int sort_order
        +bool is_primary
    }

    class CartItem {
        +uuid id
        +int quantity
        +timestamp added_at
    }

    class WishlistItem {
        +uuid id
        +timestamp created_at
    }

    class DeliveryZone {
        +uuid id
        +string province
        +string area
        +numeric fee
    }

    class Order {
        +uuid id
        +string order_number
        +string status
        +numeric subtotal
        +numeric tax
        +numeric shipping_cost
        +numeric discount
        +numeric total
        +string payment_status
        +jsonb billing_address
        +jsonb shipping_address
        +calculateTotals()
        +transitionStatus(to, actor)
    }

    class OrderItem {
        +uuid id
        +int quantity
        +numeric unit_price
        +numeric subtotal
        +string product_name
        +jsonb product_data
    }

    class OrderMessage {
        +uuid id
        +string message
        +datetime created_at
    }

    class OrderStatusHistory {
        +uuid id
        +string from_status
        +string to_status
        +uuid actor_id
        +datetime created_at
    }

    class PaymentTransaction {
        +uuid id
        +string gateway
        +string gateway_reference
        +numeric amount
        +string status
        +jsonb raw_payload
        +verifyWebhook(signature)
    }

    class ReturnRequest {
        +uuid id
        +string reason
        +string status
        +numeric refund_amount
        +approve()
        +reject()
    }

    class Refund {
        +uuid id
        +numeric amount
        +string gateway_reference
        +string status
        +executeViaGateway()
    }

    class ProductReview {
        +uuid id
        +int rating
        +string comment
        +string admin_reply
        +bool moderated
        +isVerifiedPurchaser()
    }

    class AuditLog {
        +uuid id
        +string action
        +string entity_type
        +uuid entity_id
        +jsonb old_values
        +jsonb new_values
        +string ip_address
    }

    User "1" --> "0..*" Address : has
    User "1" --> "0..*" Consent : grants
    User "1" --> "0..*" Order : places
    User "1" --> "0..*" CartItem : owns
    User "1" --> "0..*" WishlistItem : owns
    User "1" --> "0..*" ProductReview : writes
    User "1" --> "0..*" OrderMessage : posts

    Category "1" --> "0..*" Category : parents
    Category "1" --> "0..*" Product : classifies
    Product "1" --> "0..*" ProductImage : gallery
    Product "1" --> "0..*" CartItem : in
    Product "1" --> "0..*" WishlistItem : saved
    Product "1" --> "0..*" OrderItem : sold
    Product "1" --> "0..*" ProductReview : rated

    DeliveryZone "1" --> "0..*" Order : applied to

    Order "1" --> "0..*" OrderItem : contains
    Order "1" --> "0..*" OrderMessage : threads
    Order "1" --> "0..*" OrderStatusHistory : timeline
    Order "1" --> "0..*" ReturnRequest : may have
    Order "1" --> "1..*" PaymentTransaction : paid via
    OrderItem "1" --> "0..1" ProductReview : verified by
    OrderItem "1" --> "0..*" ReturnRequest : line returns

    PaymentTransaction "1" --> "0..*" Refund : reversed by
    ReturnRequest "1" --> "0..1" Refund : resolved by

    class CartService {
        +items()
        +count()
        +add(product, qty)
        +update(productId, qty)
        +remove(productId)
        +clear()
    }

    class CheckoutService {
        +validate(cart, address, zone)
        +createPaymentIntent(order)
        +handleWebhook(payload)
        +confirmOrder(payment)
    }

    class ShippingResolver {
        +calculate(items, zone)
    }

    CartService --> Order : converts to
    CheckoutService --> PaymentTransaction : creates
    CheckoutService --> Order : confirms
    CheckoutService --> ShippingResolver : uses
```

---

## 3. Checkout Sequence Diagram (payment webhook flow)

```mermaid
sequenceDiagram
    autonumber
    actor C as Consumer
    participant FE as Checkout UI (Vue)
    participant API as Platform Backend (Supabase Edge/Functions)
    participant GW as Payment Gateway
    participant DB as Postgres
    participant Q as Email Queue

    C->>FE: Submit billing, shipping, zone, accept terms
    FE->>API: POST /checkout (validate)
    API->>API: Validate stock, calc totals (subtotal+15% VAT+shipping)
    API->>DB: Reserve stock (transactional)
    API->>GW: Create payment intent (amount, ref)
    GW-->>API: payment_url + reference
    API-->>FE: redirect URL
    FE->>GW: Hosted payment page (PCI: no card data here)
    GW->>GW: Collect & process payment
    GW-->>API: Webhook (signed payload)
    API->>API: Verify HMAC signature + idempotency (gateway_reference)
    API->>DB: Insert order + order_items (single order)
    API->>DB: Confirm payment_transactions (status=succeeded)
    API->>DB: Decrement stock, set paid_at, payment_status=paid
    API->>Q: Enqueue OrderConfirmation (PDF VAT invoice)
    API-->>GW: 200 OK (ack)
    GW-->>FE: Redirect customer to /orders/{id}
    FE->>C: Order confirmation + invoice download
```

---

## 4. Order State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending : payment intent created
    Pending --> Confirmed : webhook payment success
    Pending --> Cancelled : payment failed / timeout
    Confirmed --> Processing : SAFS staff start fulfilment
    Processing --> Shipped : courier handover (email sent)
    Shipped --> Delivered : POD confirmed
    Shipped --> ReturnRequested : CPA cooling-off (5 business days)
    Delivered --> ReturnRequested : defect / warranty claim
    ReturnRequested --> Refunded : approved + gateway refund
    ReturnRequested --> Rejected : denied, no refund
    Refunded --> [*]
    Rejected --> [*]
    Confirmed --> Cancelled : customer cancels pre-fulfilment
    Cancelled --> Refunded : money-back (if paid)
```

---

## Rendering tips

- **GitHub / GitLab:** Mermaid renders natively in markdown.
- **VS Code:** install "Mermaid Preview" extension; or use the Markdown preview with mermaid support.
- **CLI (PNG/SVG export):** `npx @mermaid-js/mermaid-cli -i uml/uml.md -o uml.svg`
- **draw.io / Lucidchart import:** paste the class diagram or ERD code into the "Insert > Advanced > Mermaid" option if supported; otherwise convert via mermaid.live.