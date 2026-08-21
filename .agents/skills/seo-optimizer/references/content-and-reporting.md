# SEO Content and Reporting

Use this reference for search-intent analysis, keyword mapping, on-page recommendations, content briefs, rewrites, and audit reports.

## Search intent and keyword evidence

- Start with the page's real audience, offering, locale, and desired action.
- Map one clear primary intent to each important page. Avoid creating multiple near-duplicate pages solely for slight keyword variations.
- Treat live search results, Search Console exports, analytics, keyword tools, and customer research as evidence only when actually available.
- If current keyword demand or competitors matter, research them with current sources. Do not infer numerical search volume or difficulty from intuition.
- Separate branded, informational, commercial, navigational, and transactional intent when that distinction changes page design or content.

## People-first on-page content

- Make the page answer its primary intent clearly and early while preserving the brand voice.
- Use the main topic naturally in the title, heading, introductory context, and relevant supporting sections when it improves clarity. Do not optimize to a fixed keyword density.
- Prefer original experience, evidence, examples, policies, product facts, and expert review over generic summaries.
- Add author, organization, source, update, or review information only when truthful and useful.
- Use descriptive internal links that help users continue a task or understand related material. Avoid repetitive exact-match anchors.
- Write concise, differentiated titles and meta descriptions that accurately set expectations. Do not promise outcomes the page cannot deliver.
- Optimize images with useful filenames and context-sensitive alt text. Decorative images should use empty alternative text where appropriate for accessibility.

Primary references:

- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Guidance for AI features in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Reporting format

Keep reports decision-oriented. For each material finding, provide:

| Field | Content |
|---|---|
| Severity | Blocker, High, Medium, or Low |
| Confidence | Confirmed, Likely, or Needs external data |
| Evidence | URL, route, selector, file, response, rendered output, or supplied metric |
| Impact | What discovery, indexing, understanding, presentation, or user behavior may be affected |
| Recommendation | Specific corrective action, sized to the existing stack |
| Validation | How to prove the fix locally and, when needed, after deployment |

Order findings by expected impact, not by discovery order. Deduplicate symptoms that share one root cause. Avoid composite SEO scores unless the user supplies a scoring model or requests one with a transparent methodology.

Finish with:

- changes implemented or recommended;
- checks actually performed;
- external evidence still needed, such as Search Console coverage, query data, backlinks, field Core Web Vitals, or post-deployment crawl results.
