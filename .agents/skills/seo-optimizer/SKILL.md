---
name: seo-optimizer
description: Audit, diagnose, and improve organic search, answer-engine visibility, and generative-search citability when a user asks about SEO, AEO, GEO, crawlability, indexing, metadata, structured data, sitemaps, canonicals, search-focused content, Core Web Vitals, AI answers, ChatGPT Search, Google AI features, Bing/Copilot, Perplexity, or AI crawler controls. Not for paid ads, general UI styling, or copywriting without a discovery objective.
---

# SEO, GEO, and AEO Optimizer

Improve discovery, search presentation, answer usefulness, and evidence-backed citability without sacrificing usability, accessibility, accuracy, or the project's existing architecture. Treat AEO and GEO as extensions of sound SEO, not as separate ranking hacks.

## Choose the operating mode

- **Audit or review:** inspect and report evidence. Do not edit files unless the user also asks for fixes.
- **Diagnose:** identify the likely cause, distinguish verified facts from hypotheses, and state what external data is missing. Do not claim access to Search Console, analytics, rankings, traffic, or keyword-volume data unless it is actually available.
- **Implement or optimize:** make the smallest coherent changes that solve the requested SEO problem, following the framework's native metadata and routing conventions.
- **Content:** establish the page purpose, audience, locale, search intent, and conversion goal before drafting. Ask one concise question only when a missing choice would materially change the result.
- **AEO or GEO:** establish the target engine or surface, market, locale, URL or template, and query or answer intent. Distinguish eligibility, retrieval, citation, recommendation, and referral instead of treating them as one outcome.

Route references progressively:

- For technical audits or implementation, read [references/technical-seo.md](references/technical-seo.md).
- For keyword mapping, on-page content, or audit reporting, read [references/content-and-reporting.md](references/content-and-reporting.md).
- For AI answers, AEO, GEO, citability, generative-search measurement, or AI crawler controls, read [references/generative-and-answer-search.md](references/generative-and-answer-search.md).

Read only the references needed for the request. A GEO/AEO implementation commonly also needs the technical or content reference; an ordinary SEO task does not automatically need the generative-search reference.

## Evidence-first workflow

1. Inspect the framework, routes, rendering model, deployment configuration, existing metadata utilities, and relevant project instructions.
2. Establish the requested scope: a page, template, section, or whole site. For AEO/GEO, also record the engine or surface, market, locale, and query or answer intent. Do not silently expand a page request into a site-wide rewrite.
3. Check blocking issues before enhancements: crawl access, indexability, HTTP status, rendered content, canonical consistency, redirects, and sitemap inclusion.
4. Evaluate page meaning and search presentation: unique title, useful description, primary heading, content relevance, internal links, images, and supported structured data.
5. Prioritize findings by impact and confidence. Prefer a few evidence-backed fixes over a long generic checklist.
6. When editing, preserve existing design, business meaning, URLs, analytics, and user-visible behavior unless a change is necessary and in scope.
7. Validate the actual output: rendered HTML when possible, generated metadata, canonical URL, robots directives, sitemap entries, JSON-LD syntax, internal links, and the project's relevant tests or build checks.

## Non-negotiable constraints

- Never guarantee rankings, traffic, indexing, rich results, AI retrieval, citations, recommendations, or a specific time to impact.
- Never invent search volume, competition, conversion data, ranking positions, competitor findings, sources, authors, reviews, expertise, licenses, regulatory facts, or AI-answer observations.
- Do not use keyword stuffing, hidden text, doorway pages, misleading redirects, link schemes, fake reviews, cloaking, or scaled low-value content.
- Do not use `robots.txt` as a deindexing or canonicalization mechanism. Use an appropriate indexing directive, authentication, canonical, or redirect based on the actual goal.
- Structured data must describe content visible on the page and use a type supported for the intended search feature. Do not add ratings, prices, availability, authorship, or organizational claims that the site cannot substantiate.
- Treat social metadata such as Open Graph as useful sharing metadata, not a direct ranking guarantee.
- Prefer people-first, accurate content. Optimize clarity and usefulness rather than writing to an arbitrary word count or keyword density.
- For current search-engine behavior, policy, structured-data eligibility, or metric thresholds, verify against primary documentation before making a time-sensitive claim.
- Do not present FAQ blocks, content chunking, schema, citations, or `llms.txt` as universal AI-visibility mechanisms. Require a documented engine-specific use case and observable validation.
- Do not require an AI API, paid SEO suite, or model-generated content. Manual research, editing, and evidence collection must remain valid workflows.

## Deliverables

For an audit, report each meaningful finding with severity, evidence, impact, recommended fix, and validation method. Clearly separate observed issues from suggestions and unavailable external evidence. For AEO/GEO findings, also include engine or surface, market, locale, URL, query or intent, observed date, and the precise eligibility or visibility state.

For implementation, summarize changed routes/files, explain the search-facing result, and report validation performed. State honestly when production-only verification such as Search Console URL Inspection, field Core Web Vitals, or post-deployment crawling remains outstanding.
