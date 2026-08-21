# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router for the public sites and the Payload admin application, Payload CMS, PostgreSQL, MinIO-compatible object storage, pnpm workspaces, Docker Compose for local infrastructure, and Dokploy/Traefik for deployment. This stack was explicitly selected in the architecture proposals.

## Users

- Adult visitors in Colombia and Ontario who need clear, jurisdiction-specific information for comparing regulated online casinos.
- Editors who create, translate, review, and publish localized pages, casino records, offers, disclosures, and responsible-gambling content for assigned sites.
- Administrators who manage all sites, users, regulatory policy, operator verification, publication status, and delivery credentials.

The visitor description is inferred from the approved directory and regulatory requirements; detailed personas remain open.

## Product Purpose

Provide a central editorial system for independently branded casino-directory sites while keeping each public site fast, search-friendly, jurisdiction-aware, and able to serve its last valid publication when the CMS is unavailable.

Success means editors can safely publish market-specific content without cross-tenant leakage, and visitors can understand what is verified, how listings are evaluated, what commercial relationship exists, and which responsible-gambling rules apply.

## Positioning

A resilient, regulation-first directory: the central CMS is the editorial source of truth, while each market serves a local, versioned publication with explicit methodology, provenance, and jurisdiction controls.

## Operating Context

- MVP markets: Colombia at `/es/...`; Ontario at `/en/...` and `/fr/...` on separate domains.
- One central Payload panel manages multiple sites through tenant-scoped collections and permissions.
- Publishing produces site-specific snapshots; public sites do not query Payload for every request.
- Content and translations are authored manually by default. Optional AI assistance can only create drafts and is disabled unless deliberately configured.
- Production rules and factual regulatory copy require competent legal review.

## Capabilities and Constraints

- Editable pages, routes, localized metadata, controlled content blocks, casino records, offers, media, redirects, policies, and publication history.
- PostgreSQL is the central database. MongoDB, NestJS, Keycloak, EmDash, and infrastructure orchestration from Payload are outside the MVP.
- Search visibility combines SEO, AEO, and GEO without promising rankings, citations, recommendations, or traffic.
- Search discovery and AI training crawler policies are independent; search is allowed and model training is blocked by default.
- No API key for AI, paid SEO platform, operator integration, or analytics provider is required to run the system.
- Public click events must exclude IP addresses, cookies, user-agent strings, and fingerprints.

## Brand Commitments

No final public brand name, logo, photography, or operator assets have been supplied. Development content must be visibly fictional and must not imply real licensing, rankings, customers, endorsements, or commercial terms.

The product voice is direct, calm, transparent, and specific about evidence and limitations. It avoids casino-floor hype, gamification, urgency, and guaranteed outcomes.

The public landing uses a familiar comparison-portal structure: conventional header, short introductory hero, visible casino listing, then methodology, regulation, responsible-play content, FAQs, and footer. `https://bangerbrewing.com/` and `https://manifestboston.org/` are craft references for hierarchy, scanning density, and the relationship between hero and listing; their brands, copy, claims, logos, ratings, and operator data are not reusable assets. The earlier “Observatorio de evidencia” comps were rejected.

## Evidence on Hand

- Architecture and acceptance documents in `propuestas/`.
- SEO, AEO, and GEO operating guidance in `.agents/skills/seo-optimizer/`.
- No verified casino catalog, legal approval, customer research, testimonials, traffic data, keyword volumes, or production brand assets are available yet.

## Product Principles

- Regulation and provenance are visible product features, not footer disclaimers.
- Market separation is enforced in data access, publishing, URLs, and media.
- The public experience remains available from its last valid local publication.
- Manual editorial work is complete on its own; optional AI never becomes an operational dependency.
- Search and answer visibility follow people-first content and verifiable evidence rather than engine-specific tricks.

## Accessibility & Inclusion

Public templates and admin customizations target WCAG 2.2 AA, keyboard operation, resilient responsive layouts, readable Spanish, English, and French content, and reduced-motion support. Age and responsible-gambling information must remain prominent and understandable.
