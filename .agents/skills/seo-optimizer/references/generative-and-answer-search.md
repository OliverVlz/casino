# Generative and Answer Search

Use this reference for AEO, GEO, AI-answer visibility, citability, generative-search measurement, and AI crawler controls. It complements technical SEO and people-first content; it does not replace either.

## Outcome model

- **SEO** establishes discovery, crawlability, indexability, understanding, and useful search presentation.
- **AEO** makes a page's real questions and decisions easy to answer accurately for people and answer systems.
- **GEO** improves the conditions under which an eligible source can be retrieved, understood, and cited by a generative experience.

Evaluate outcomes in this order:

```text
eligibility -> understanding -> evidence -> citability -> measurement
```

Keep the states distinct:

- `eligible`: the surface can access and consider the URL;
- `retrievable`: there is evidence that the engine or its index can retrieve it;
- `cited`: an observed answer referenced the URL;
- `recommended`: the answer endorsed or selected the entity, which is not implied by a citation;
- `referred`: measurable traffic reached the site from the surface.

Indexing does not guarantee retrieval or citation. A citation does not prove ranking, authority, recommendation, or future visibility.

## Establish scope and evidence

Record the target engine or surface, market, locale, page or template, and query or answer intent. For regulated topics, also record the jurisdiction and effective policy date.

Before changing crawler controls or making platform-specific claims, verify the current primary documentation. Crawler names, behavior, IP ranges, reporting features, and opt-out semantics can change. Never copy versioned user-agent strings or IP ranges into long-lived guidance; link to the provider's current source instead.

Prefer this evidence order:

1. Official crawler, webmaster, and search documentation.
2. Rendered pages, response headers, `robots.txt`, sitemaps, server logs, and verified webmaster exports.
3. Repeatable observations captured with engine, query, locale, account or mode, URL, and date.
4. Third-party studies or tools, clearly labeled as indirect evidence.

## Crawler and discovery matrix

Treat these roles independently and verify them before implementation:

| Surface | Discovery control | Current role | Implementation rule |
|---|---|---|---|
| Google Search AI features | Google Search crawling and index eligibility | AI Overviews and AI Mode build on Search systems; there is no special GEO crawler or schema requirement | Apply normal Google Search controls and verify current Search Console eligibility |
| ChatGPT Search | `OAI-SearchBot` | Automatic search discovery and inclusion | Allow only if ChatGPT Search visibility is desired; verify official IP sources when configuring a WAF |
| OpenAI model training | `GPTBot` | Content that may be used for foundation-model training | Decide separately from search; allowing search does not require allowing training |
| User-requested OpenAI fetch | `ChatGPT-User` | A fetch initiated by a user action, not automatic search crawling | Do not use it to infer ChatGPT Search eligibility; provider documentation notes that user fetches may not follow ordinary robots rules |
| Perplexity Search | `PerplexityBot` | Automatic search discovery and linking, not foundation-model training according to current provider documentation | Allow only if Perplexity discovery is desired; use current official IP sources for WAF rules |
| User-requested Perplexity fetch | `Perplexity-User` | A fetch initiated by a user action | Treat separately from automatic crawling and verify current control behavior |
| Bing and Microsoft AI surfaces | Bing search crawling, indexing, and supported content-owner controls | Bing/Copilot citations can be reported in Bing Webmaster Tools where available | Verify Bing controls and measure citations separately from ranking or authority |

Primary references:

- [Google guidance for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

Remember that `robots.txt` governs crawling, not reliable deindexing or canonicalization. Inspect existing rules, WAF behavior, rendered content, and intended privacy policy before changing it.

## Answer and citation readiness

- Answer the page's primary question or decision clearly and early, then provide the evidence and nuance the subject requires.
- Use descriptive headings, lists, comparison tables, definitions, and FAQs only when they improve human comprehension. Do not fragment prose into artificial micro-sections for machines.
- Keep entity names, operators, jurisdictions, products, authors, and organizational relationships unambiguous and consistent across text, media, metadata, and structured data.
- Place evidence near material claims. Prefer primary sources, stable URLs, source titles, publication or effective dates, and a truthful last-review date.
- Publish original analysis, methodology, verified facts, or first-hand experience when available. A generic synthesis of existing pages is weak evidence of distinct value.
- Separate factual evaluation from commercial placement. Make affiliate relationships, ranking methodology, eligibility limits, and conflicts visible.
- Use structured data only when it truthfully describes visible content and supports an intended search feature. There is no universal AI schema.
- Cover related questions when they help the audience complete the task. Do not create a separate low-value page for every prompt or query-fan-out variation.

For multilingual or multi-market content, keep locale, currency, availability, licensing, minimum age, and responsible-gambling information explicit. Do not treat translations or superficially similar regulatory pages as equivalent without editorial and legal review.

## `llms.txt` policy

Do not create `llms.txt` by default or describe it as a ranking or citation factor. Google states that it does not use `llms.txt` for Search or its generative features.

Consider it only when all of the following are true:

- a target service officially documents a concrete use for it;
- the user wants that service supported;
- the file can be maintained with the canonical site content;
- it exposes no private, draft, tenant-crossing, or regulated material;
- success can be checked independently.

## Measurement

Use available first-party evidence without making an API key mandatory:

- Search Console generative-AI reporting and ordinary Search performance when available;
- Bing Webmaster Tools AI Performance: total citations, cited pages, grounding-query samples, and trends;
- verified crawler logs and aggregate referral analytics;
- a small, stable, manually executable query set per market and locale.

Manual checks are snapshots, not rankings. Record the engine or surface, query, locale, account or mode when relevant, answer date, cited URL, and observed result. Repeat them over time before describing a trend. Do not merge unlike surfaces into a composite score unless the user supplies a transparent model.

## Reporting contract

For every material AEO/GEO finding, provide:

| Field | Content |
|---|---|
| Surface | Engine and feature evaluated |
| Context | Market, locale, URL or template, and query or intent |
| State | Eligible, retrievable, cited, recommended, referred, or not verifiable |
| Evidence | Rendered output, rule, log, export, observed answer, source, and observation date |
| Severity | Blocker, High, Medium, or Low |
| Confidence | Confirmed, Likely, or Needs external data |
| Recommendation | Specific change consistent with the existing stack and editorial policy |
| Validation | Local or post-deployment proof, with unavailable external access stated explicitly |

Never fabricate an observation to fill the contract. If no external engine or webmaster evidence is available, report the state as `not verifiable` and provide the manual verification step.
