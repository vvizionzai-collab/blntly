# BLNTLY

BLNTLY is a dark-first, responsive, installable 21+ local-delivery experience for tobacco wraps, papers, cigars, vaping products, and hookah supplies from licensed retailers.

The canonical brand is the lowercase `blntly` wordmark with a red-to-blue transition. This build uses:

- red `#F43F4F`
- blue `#3478F6`
- near-black `#07080B`
- panel black `#101218`
- off-white `#F7F8FB`

## What is implemented

- Responsive public marketing website
- Mandatory 21+ entry gate
- Installable progressive web app manifest and offline shell
- Interactive customer discovery screen
- Product-category filtering
- Working local cart and totals
- Active-order tracking experience
- Profile, loyalty, and age-verification status
- Customer, driver, merchant, and admin role presentations
- AI-support chat interaction
- Keyboard, touch, responsive, and reduced-motion support
- Production health endpoint at `/api/health`
- Build, lint, and rendered-output tests

The interface is a production-ready prelaunch experience. Live ordering stays intentionally disabled until regulated providers, licenses, taxes, and jurisdiction rules are connected.

## Five-phase build method

### 1. Discovery and canon recovery

Recovered the locked name, logo direction, color system, four platform roles, 21+ rule, rewards, driver incentive, masked communication, order state machine, and earlier infrastructure choices. Unverified details were not treated as canon.

### 2. Product and compliance architecture

Mapped the customer, driver, merchant, and admin experiences. Defined the order state machine as `CREATED → AGE_VERIFIED → PAYMENT_AUTHORIZED → MERCHANT_ACCEPTED → PREPARING → READY → PICKED_UP → EN_ROUTE → DELIVERY_ID_VERIFIED → DELIVERED`, with exception states for cancellation, failure, refund, and compliance hold.

### 3. Visual and interaction system

Applied the locked lowercase red-to-blue wordmark, dark-mode-first presentation, clear 21+ messaging, accessible contrast, touch targets, mobile navigation, restrained motion, and a unified website/app component system.

### 4. Production build

Built the public website and installable mobile PWA from one responsive codebase. Added customer discovery, cart, tracking, rewards, partner roles, AI assistance, app manifest, service worker, icons, and a health API.

### 5. Verification and launch preparation

Ran lint, production compilation, artifact validation, and rendered-output testing. Prepared the environment contract and separated regulated integrations so providers can be replaced without rebuilding the user experience.

## Production architecture

### Customer

- Account, identity, and age verification
- Address eligibility and jurisdiction checks
- Store and catalog discovery
- Cart, taxes, fees, payment authorization
- Live order tracking
- Delivery ID re-verification
- Loyalty, support, refunds, and receipts

### Driver

- Identity and background-check status
- Availability and offer queue
- Transparent earnings before acceptance
- Navigation and masked communication
- Pickup confirmation
- Government-ID scan and recipient match
- Refusal, incident, and return-to-store workflows
- Eight-month performance milestone and 2% incentive rule

### Merchant

- Business, license, and location approval
- Product catalog and real-time inventory
- Pricing, hours, taxes, and restricted-SKU controls
- Order acceptance and preparation timers
- Staff roles and audit history
- Payout, reconciliation, and compliance reporting

### Admin

- Merchant, driver, and customer risk review
- License-expiration monitoring
- Jurisdiction rules and restricted zones
- Verification failure and fraud queues
- Incident, refund, and appeal operations
- System health, audit logs, and analytics

## Required live integrations

The `.env.example` file defines the required contracts. Provider selection must occur after written approval for tobacco/ENDS processing and the intended launch jurisdiction.

- Independent age and identity verification
- High-risk/regulated-goods payment processor
- Maps, geocoding, routing, and geofencing
- Masked calling/SMS and transactional email
- Push notifications
- AI support provider with escalation to a human
- PostgreSQL-compatible database and Redis-compatible queue/cache
- Authentication with MFA and role-based access controls
- Secure object storage for permitted compliance artifacts

Do not hard-wire Stripe for live tobacco sales. Tobacco and e-cigarette businesses appear on Stripe's restricted-business materials and require explicit eligibility review; some Stripe support materials state that regulated age-restricted items are not currently supported.

## Compliance gates before accepting an order

1. Confirm the merchant's active licenses for the exact location and products.
2. Confirm the customer's identity, residential address, and age through an independent service.
3. Confirm the delivery address is inside an allowed jurisdiction and operating window.
4. Validate every SKU against federal, state, county, and city restrictions.
5. Calculate required excise, sales, and local taxes.
6. Authorize payment through an approved regulated-goods processor.
7. Require an adult recipient and valid government photo ID at delivery.
8. Prevent unattended drop-off, substitution to an unverified recipient, or delivery after failed verification.
9. Preserve the required audit and delivery records under the retention policy approved by counsel.

Primary regulatory references:

- FDA Tobacco 21: https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/tobacco-21
- ATF PACT Act: https://www.atf.gov/alcohol-tobacco/prevent-all-cigarette-trafficking-pact-act
- ATF delivery-sale age verification: https://www.atf.gov/alcohol-tobacco/prevent-all-cigarette-trafficking-pact-act/tobacco-sellers-reporting-shipping-and-tax-compliance-requirements
- California licensing guide: https://cdtfa.ca.gov/taxes-and-fees/cigarette-and-tobacco-products/getting-started.htm
- California delivery-sale law: https://cdtfa.ca.gov/lawguides/vol3/ctptl/ctptl-30101-7.html

This project is not legal advice. Launch counsel should approve the operating model in every service area.

## Local use

Requirements: Node.js 22.13 or newer.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Quality gates

```bash
npm run lint
npm run test
npm run validate:artifact
```

## Deployment checklist

- [ ] Form operating entity and obtain required federal, state, and local registrations
- [ ] Approve launch city/county with tobacco counsel
- [ ] Execute merchant agreements and verify every participating license
- [ ] Complete age-verification vendor contract and privacy review
- [ ] Obtain written payment-processor approval for the exact product mix
- [ ] Connect tax and excise-tax calculation/reporting
- [ ] Connect maps, messaging, notifications, and support escalation
- [ ] Replace demo catalog and location with approved live data
- [ ] Complete penetration test, accessibility audit, privacy review, and incident plan
- [ ] Complete driver policy, insurance, training, and ID-refusal workflows
- [ ] Run a controlled pilot before public launch
