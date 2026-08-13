# SAFS Furniture — E-Commerce Platform
## Product Vision

| Field | Value |
|---|---|
| **Document** | Product Vision (v1.0) |
| **Product** | SAFS Furniture — online furniture store |
| **Model** | Single-brand e-commerce store (SAFS sells its own furniture; no third-party vendors) |
| **Market** | South Africa (ZAR, English) |
| **Positioning** | "Handcrafted South African hardwood furniture, delivered to your door" |

---

## 1. The Problem
South African consumers shopping for quality hardwood furniture face:
- Fragmented, offline-only artisan sellers with no trustworthy online channel.
- Poor e-commerce experiences: no transparent pricing, delivery costs, or consumer-protection assurances.
- Distrust of online furniture purchases without guarantees (returns, warranties, secure payment).

## 2. The Product
SAFS Furniture is a web-based e-commerce platform where the brand itself designs, stocks, and sells handcrafted hardwood furniture. Customers browse a rich catalogue (multi-image galleries, dimensions, materials), add to cart, check out with a secure hosted payment gateway, track orders, and exercise full consumer rights (returns, cooling-off, refunds).

## 3. Target Users
| User | Need |
|---|---|
| **Consumers** | Find, compare, and buy quality furniture online with confidence: clear pricing (VAT shown), delivery estimates, secure payment, easy returns |
| **Administrators (SAFS staff)** | Manage the catalogue (products, categories, images, primary images/order), stock, orders, refunds, and legal content from one portal |

## 4. Goals & Success Criteria
| Goal | Success measure |
|---|---|
| Trustworthy purchasing | Checkout completion rate > 60% of cart starts; < 2% payment failures |
| Confident product choice | Primary image + gallery order that showcases products fully; < 1% return rate for "not as pictured" |
| Compliance by design | POPIA consent capture, CPA cooling-off & returns, ECT Act disclosures, VAT invoices — all verifiable |
| Operational efficiency | Admin manages catalogue/orders/refunds in minutes, not hours |

## 5. Guiding Principles
1. **Single brand, one source of truth** — as the seller of record, SAFS controls the full catalogue; no marketplace commission or third-party selling.
2. **Compliance first** — POPIA, CPA, ECT Act, VAT Act treated as release-blocking requirements (see requirements.md, NFR-COM).
3. **Quality imagery** — every product has ordered, non-cropped gallery images with a clear primary (cover) image.
4. **Security** — server-side payment webhooks, PCI-DSS hosted gateway, Row-Level Security on all data.
5. **Simplicity** — fewer, focused features executed well (catalogue → cart → checkout → orders), not broad ones.

---

*Linked documents: [requirements.md](requirements.md) · [../uml/uml.md](../uml/uml.md) · [../erd/entity-relationship-diagram.md](../erd/entity-relationship-diagram.md)*