# MODEL

An independent casino-comparison design demonstration. English / Canadian context;
six fictional operators, no real gambling, no outbound affiliate redirects, no indexing.
Casino and Gambling are separate applications and were not redesigned.

## Run locally

From the workspace root:

```powershell
pnpm install
pnpm dev:model
```

Open http://localhost:3005. The bundled, checksum-validated publication works without
the CMS or database. The hero first displays its original Blender render, then loads
the interactive GLB. Without JavaScript, WebGL or with reduced motion, its static image
and the server-rendered catalogue remain visible.

```powershell
pnpm --filter @casino/model test
pnpm --filter @casino/model typecheck
pnpm --filter @casino/model build
pnpm --filter @casino/model start
```

Routes: `/`, `/bonuses`, `/casino/aurum` (and the other demo slugs), and `/go/aurum`.
`/go/*` shows demo information and never redirects to an operator. Unknown records
return 404. Mobile navigation, FAQs and demo-offer explanations use accessible controls.

## Editorial panel and publication

MODEL is seeded as `siteKey: model`, domain `model.example`, development status.
Its pages, casinos, offers and demo policy are independent tenant records in Payload.
The normal workspace `pnpm seed` includes MODEL; existing seed behaviour is retained.
MODEL's seed only creates missing records, preserving subsequent editorial changes.

The local integration script can seed and validate MODEL alone:

```powershell
pnpm infra:up
pnpm --filter @casino/control-plane exec tsx scripts/verify-model.ts
```

It seeds twice, checks delivery authentication and checksum, edits one MODEL summary,
checks other publications remain unchanged and restores that summary. This is a local
integration check, not a production script. It skips schema push to preserve any extra
columns from other local branches. The existing database has a `sites.vertical` column
that the current repository does not define; the check deliberately does not remove it.
On a fresh database initialise the normal CMS schema first.

In the panel select **MODEL — Demo**. Catalogue filter values use the existing editable
`highlights` array, with explicit labels (no schema migration):

| Label | Example | Meaning |
| --- | --- | --- |
| `Categories:` | `Casino, Slots` | Exact comma-separated categories |
| `Payments:` | `Crypto, Card` | Exact comma-separated payment types |
| `MinDepositCAD:` | `20` | Numeric minimum deposit; missing/invalid stays unknown |
| `Order:` | `1` | Demo display order, not a quality score |
| `Bonus:` | `100% up to $200` | Fallback example headline when no offer is supplied |
| `Terms:` | `30x bonus; 14 days` | Fallback conditions |
| `Demo:` | `true` | Editorial marker; the whole app is always demo-only |

Offers are the primary source for offer headlines and conditions. Add or remove filter
categories through the catalogue data. The deposit filter means “minimum deposit at
most this amount”; unknown deposits are excluded when this filter is active.

Homepage hero, directory introduction and editorial blocks are sourced from the page
snapshot. The three copy blocks map, in order, to payment explanation, journal and
methodology; journal/methodology paragraphs use `Title|Body` for their short entries.
Keep these three copy blocks in that order. Layout and decorative assets are code-owned.

Copy `.env.example` to `.env.local`. Set `CMS_DELIVERY_TOKEN` to the existing CMS
`DELIVERY_TOKEN` (the current CMS uses a shared delivery credential). Then:

```powershell
pnpm sync:model
```

The endpoint is `/delivery/v1/sites/model/snapshot`. Sync verifies schema, MODEL identity
and checksum before atomically replacing the local file. A failed sync retains the
previous file. Rebuild to publish synced content in production; there are no per-request
CMS dependencies. `CMS_LIVE_DELIVERY=true` enables development reads with a four-second
timeout and local fallback. `SNAPSHOT_PATH` optionally points to another local publication.

This is deliberately demo content. The policy's approval note explicitly limits it to
local demonstration, not operator licensing or production regulatory approval.

## Original assets

- `assets/casino-assets.blend`: editable hero, optimised final duplicate, reusable
  materials, eight organised collections, product camera, studio lights and secondary variants.
- `assets/casino_asset_generator.py`: parametrised Blender Python generator.
- `public/models/`: six standalone GLB exports.
- `public/renders/`: 13 transparent source PNGs, corresponding WebP/AVIF derivatives
  and a provenance manifest. No stock art, operator logos or cryptocurrency logos.
- `assets/asset-report.json` and `assets/export-validation.json`: measured budgets and
  validation of the shipped files.

| GLB | Triangles | Bytes |
| --- | ---: | ---: |
| Hero token | 15,024 | 375,660 |
| Poker chip | 3,592 | 97,924 |
| Generic crypto coin | 6,136 | 167,416 |
| Dice | 4,056 | 110,712 |
| Playing card | 1,620 | 48,276 |
| Roulette | 5,656 | 150,740 |

All exports have normals, simple PBR materials, no textures, no cameras and no lights.
Blender uses Z as the face normal; glTF converts to Y-up. HeroScene rotates the imported
assembly to face the web camera. Local part offsets are retained for animation;
scales are applied during modelling and modifiers are baked for export.

Materials: `M_Obsidian` (dark ceramic), `M_Gold` (champagne metal),
`M_VioletEmission` (small violet inlays), `M_WhiteCeramic` (card and details).
Shader-only Blender features and texture-dependent effects are not required.

### Regenerate

Use a dedicated background Blender process. The generator clears its own scene, never
the scene in an already-open interactive Blender session. It overwrites generated assets
in this app; preserve hand edits separately before regeneration.

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python-exit-code 1 --python apps/model/assets/casino_asset_generator.py -- --stage hero
# Inspect public/renders/hero/front.png, angle.png and back.png before continuing.
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python-exit-code 1 --python apps/model/assets/casino_asset_generator.py -- --stage all
node apps/model/scripts/convert-renders.mjs
python apps/model/scripts/validate-assets.py
```

Change radius, thickness, edge segments, bevel and accent in `create_chip`, `create_coin`,
`create_dice`, `create_card` and `create_roulette`. The default run includes BlackGold,
BlackViolet and Gold chips, plus a violet coin variant. Preview renders use 32-sample
denoised Cycles at 1024 square; web derivatives are 640 square except the 1024 hero.
The optional frame-sequence animation is intentionally not included.

The initial hero preview washed out the ceramic and underlit the reverse. A bounded
correction lowered ceramic reflectance, made the key more directional and added a back
light. The second preview was accepted before generating secondary assets.

## Interaction and performance

One dynamically imported R3F canvas; no physics or bloom pipeline. Pixel ratio is capped
at 1.5 desktop / 1 mobile. Intersection and page-visibility listeners pause rendering.
Reduced motion bypasses the canvas. Loader failures retain the poster; a timeout and
context-loss handler also restore it. Mouse tilt is clamped to ±4° X / ±7° Y around
the base orientation. GSAP maps approximately one hero-height of desktop scroll to a
partial rotation and small translation, without pinning or intercepting wheel input.

Implementation references: [R3F Canvas](https://r3f.docs.pmnd.rs/api/canvas),
[R3F performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance),
[GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).

## Shutdown

Stop the entire pnpm/Next process tree started for this app and any CMS started for
testing, then run `pnpm infra:down`. Do not use `down -v`; keep PostgreSQL volumes.
No automatic commits, deployment or publication are performed by this implementation.
