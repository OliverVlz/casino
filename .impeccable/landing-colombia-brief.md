# Landing Colombia

## Scope

- Mode: Persuade.
- Primary target: `apps/web/src/app/[locale]/[[...slug]]/page.tsx`.
- Audience: adult visitors in Colombia comparing online casino information.
- Job: scan the directory, understand what was reviewed, open a detailed record, and only then follow an external link.
- Approved comp: `.impeccable/mocks/classic/portal-c.png`.

## Direction

Classic premium comparison portal. A white conventional header leads into a compact deep-navy introduction. The white directory panel overlaps that field, placing the actual comparison task in the first viewport. Methodology, regulatory context, responsible-play resources, and FAQs continue below without changing visual grammar.

The memorable moment is the directory panel arriving over the navy field as one clipped surface. Motion is limited to that entrance and short control feedback. Reduced-motion users receive the final state immediately.

## Evidence and constraints

- Initial operator records and commercial links are fictional and visibly labeled as development data.
- Regulatory statements link to a current primary Coljuegos page and retain a review date.
- No ratings, testimonials, licensing claims, bonuses, or recommendations are invented.
- Manual editorial content is complete without an AI service or API key.
- WCAG 2.2 AA, keyboard use, semantic headings, and responsive reading order are required.

## Sampled visual record

- Header: `#fefefe`.
- Intro field: `#011535`.
- Page ground: `#fbfaf9`.
- Primary orange: `#fd6f27`.
- Primary ink: `#000016`.
- Cards: white with crisp cool-gray rules; radius 10–12px and modest downward shadow.
- Type: Archivo Variable, condensed width and 800 weight for display; regular width for body; tabular numerals for dates and document ids.

## Asset manifest

### Produce

None. The approved comp contains no image-native material.

### Direct

None. No production logo or operator assets were supplied.

### Semantic

| id | implementation | notes | qa_status |
|---|---|---|---|
| header | Semantic header/nav, text wordmark, SVG menu/locale marks | Desktop nav and native-details mobile menu | accepted |
| intro | HTML heading, disclosure and navy CSS field | No eyebrow in final UI; heading carries hierarchy | accepted |
| directory | Client filter/sort component with semantic list | White overlap panel; resilient empty state | accepted |
| operator-row | Article, definition-style metadata, SVG icons and anchors | Stack on mobile; no raster logos | accepted |
| methodology | Ordered list and source links | Direct answers and review dates remain visible | accepted |
| regulation | Article/aside with official source links | No unreviewed legal conclusions | accepted |
| faq | Native details/summary disclosure | Visible answers; no FAQ schema promise | accepted |

## Execution order

1. Snapshot contract and server-only loader.
2. Root shell, type, tokens, header, and intro.
3. Directory rows and interactions.
4. Editorial blocks, source treatment, FAQ, and footer.
5. Metadata, structured data, sitemap, robots, `/go`, and responsive states.

## Blockers

None for the demonstrative vertical slice. Real operator identity, contracts, commercial terms, and final legal copy remain replacement inputs before production.

## Assumptions

- The local MVP hostname is configurable through `NEXT_PUBLIC_SITE_URL`.
- Indexing is disabled unless `SITE_INDEXABLE=true` is deliberately set.
- All vector marks are interface icons, not operator or regulatory logos.
