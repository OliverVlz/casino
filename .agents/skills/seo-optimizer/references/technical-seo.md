# Technical SEO

Use this reference for code audits, indexing diagnosis, metadata implementation, migrations, and performance-related SEO.

## Inspect in this order

### 1. Discovery, response, and rendering

- Confirm important URLs return the intended HTTP status and do not pass through unnecessary redirect chains.
- Confirm the preferred protocol, hostname, trailing-slash policy, and URL casing are consistent.
- Determine whether essential page content and links are present in rendered HTML. For JavaScript applications, distinguish source HTML, server-rendered output, and client-only content.
- Check that navigation links use crawlable anchors and stable URLs.

### 2. Crawling and indexing controls

- Inspect `robots.txt`, page-level robots metadata, and `X-Robots-Tag` headers where applicable.
- Remember that `robots.txt` controls crawling, not reliable removal from the index. A crawler must be able to access a page to see its `noindex` directive.
- Confirm production pages are not accidentally blocked and non-public environments are protected appropriately.
- Check authentication, error pages, soft-404 behavior, faceted URLs, search-result pages, and parameterized duplicates according to site needs.

Primary references:

- [Crawling and indexing overview](https://developers.google.com/search/docs/crawling-indexing)
- [Robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Robots meta and X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

### 3. Canonicals, redirects, and sitemaps

- Use one self-referential canonical for an indexable canonical page.
- Keep canonical signals aligned across HTML or headers, redirects, internal links, hreflang, and sitemap entries.
- Use permanent server-side redirects when retiring or consolidating URLs. Preserve query parameters only when they remain meaningful.
- Include absolute, preferred, indexable canonical URLs in sitemaps. Exclude redirected, duplicate, blocked, `noindex`, error, and utility URLs.
- Do not assume a sitemap guarantees crawling, indexing, or ranking.

Primary references:

- [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### 4. Page metadata and semantics

- Give each indexable page a descriptive, context-appropriate title and a useful, page-specific meta description.
- Do not enforce arbitrary character counts as search-engine requirements. Favor accurate summaries and review how templates behave with real content.
- Confirm a meaningful primary heading, logical heading hierarchy, descriptive anchor text, useful image alternatives, and visible content matching the page's purpose.
- Set canonical and locale metadata through the framework's supported server-rendering or prerendering mechanism when available.
- Add Open Graph and equivalent sharing metadata when useful, while keeping claims about SEO impact precise.

Primary references:

- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Search appearance](https://developers.google.com/search/docs/appearance)
- [Snippet and meta-description guidance](https://developers.google.com/search/docs/appearance/snippet)
- [Image SEO](https://developers.google.com/search/docs/appearance/google-images)

### 5. Structured data

- Choose the Google-supported feature that truthfully matches the page's main visible content; do not add schema merely because Schema.org defines a type.
- Prefer JSON-LD when it fits the project.
- Supply required properties and substantiated recommended properties. Values must match the visible page and canonical URL.
- Avoid fake ratings, hidden content, irrelevant entities, or markup that implies unsupported ownership, licensing, price, availability, or identity.
- Validate syntax and feature eligibility. Explain that valid markup does not guarantee a rich result.

Primary references:

- [Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

### 6. Page experience and Core Web Vitals

- Use field data when available and label lab measurements as diagnostic rather than representative of every user.
- Investigate LCP, INP, and CLS at the 75th percentile. Verify current thresholds before presenting them as authoritative.
- Diagnose the actual cause: server latency, render-blocking resources, image sizing/loading, font behavior, JavaScript work, hydration, layout reservation, or third-party code.
- Do not trade away primary content, accessibility, or required functionality merely to improve a synthetic score.

Primary reference: [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)

### 7. International and regulated content

- For localized pages, confirm unique URLs, correct language, consistent canonicals, reciprocal hreflang, and an optional `x-default` where appropriate.
- Do not infer legal eligibility, licenses, geographic availability, age restrictions, or regulated claims. Preserve or request authoritative business information.

## Verification

Use the project's existing tools and framework conventions. Depending on scope, verify generated HTML, response headers, redirect behavior, `robots.txt`, sitemap XML, canonical targets, JSON-LD parsing, broken internal links, mobile rendering, and relevant build/tests. Production Search Console and field-performance checks remain follow-up work unless access is provided.
