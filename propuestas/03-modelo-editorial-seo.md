# Modelo editorial, traducciones, SEO, AEO y GEO

## Mercados y rutas iniciales

| Sitio | Market | Locales | Rutas |
| --- | --- | --- | --- |
| Colombia | `co` | `es-CO` | `/es/...` |
| Ontario | `ca-on` | `en-CA`, `fr-CA` | `/en/...`, `/fr/...` |

El dominio identifica el mercado y el primer segmento identifica el idioma. No se publicarán variantes sin prefijo. Las URLs se almacenan como `locale + slug`; el dominio se resuelve desde `Site` y nunca se escribe dentro del contenido enriquecido.

## Entidades

Todas las entidades distribuidas incluyen `site`, timestamps, autor y estado editorial. Los slugs son únicos por `site + locale`.

### Site

Representa un dominio y un despliegue público.

```ts
interface Site {
  id: string
  key: string
  name: string
  canonicalOrigin: string
  market: string
  locales: string[]
  defaultLocale: string
  enabledBlocks: BlockType[]
  theme: ThemeTokens
  status: 'provisioning' | 'active' | 'suspended'
  crawlerPolicy: CrawlerPolicy
  delivery: DeliveryConfiguration
}
```

`canonicalOrigin` debe ser HTTPS, no incluir path y estar en una lista administrativa aprobada. Los secretos de delivery no forman parte de las respuestas normales del CMS.

`CrawlerPolicy` expresa intención de producto, no nombres o rangos IP congelados en la base de datos:

```ts
interface CrawlerPolicy {
  searchDiscovery: 'allow' | 'disallow'
  aiTraining: 'allow' | 'disallow'
}
```

En producción, el valor inicial será `searchDiscovery: allow` y `aiTraining: disallow`: se permite descubrimiento en buscadores y respuestas con fuentes, pero no se habilita por defecto el crawler de entrenamiento de OpenAI. El frontend traduce esta intención a las directivas vigentes después de verificar la documentación oficial del proveedor. Staging y preview permanecen autenticados y fuera de indexación.

### Market

Define la jurisdicción editorial, no geolocaliza usuarios.

Campos mínimos:

- Código estable (`co`, `ca-on`).
- País y subdivisión opcional.
- Moneda informativa.
- Edad mínima.
- Autoridades y directorios oficiales.
- Recursos de juego responsable.
- Locales permitidos.

### Locale

Define código BCP 47, etiqueta editorial, ruta, idioma de la interfaz y locale de fallback. El fallback ayuda a editar, pero nunca se indexa como si fuera una traducción real: una página solo entra al sitemap de un locale cuando existe y está publicada en ese locale.

### JurisdictionPolicy

Regla versionada que controla publicación.

```ts
interface JurisdictionPolicy {
  id: string
  site: string
  market: string
  version: number
  effectiveFrom: string
  effectiveTo?: string
  reviewStatus: 'draft' | 'legally_reviewed' | 'superseded'
  lastReviewedAt: string
  reviewedBy?: string
  sourceLinks: string[]
  minimumAge: number
  publicBonusMode: 'blocked' | 'informational' | 'allowed'
  requireAffiliateDisclosure: boolean
  requireOperatorVerification: boolean
  requiredDisclosures: LocalizedDisclosure[]
  responsibleGamblingResources: LocalizedResource[]
}
```

Solo puede existir una política efectiva y legalmente revisada por sitio y momento. Los administradores gestionan estos campos; los editores solamente los consultan.

### Page

Contiene la landing, rankings y páginas institucionales del MVP.

Campos principales:

- `site`, `locale`, `slug` y `translationGroup`.
- Tipo: `landing`, `ranking`, `legal`, `methodology`, `responsible-gambling`.
- Título, resumen y bloques controlados.
- SEO: title, description, canonical override restringido, imagen social y directivas de indexación.
- Descubrimiento: intención principal, preguntas o decisiones reales que resuelve la página y entidades mencionadas de forma inequívoca.
- Procedencia: fuentes primarias, fecha de comprobación factual y autor o revisor cuando sean verdaderos y aplicables.
- `editorialStatus`: `draft`, `in_review`, `approved`.
- `contentOrigin`: `manual`, `ai_assisted` o `imported`, únicamente para auditoría.
- Estado de Payload: `draft` o `published`.
- Política con la que fue aprobada y fecha de última revisión.
- Conjunto explícito de equivalencias para `hreflang`.

Las revisiones completas de casinos y las guías editoriales extensas quedan fuera del MVP, aunque el modelo permite añadir tipos de página después.

### Casino

Es un casino visible dentro de un sitio concreto. Se duplica por tenant cuando la ficha regulatoria o comercial difiere entre mercados.

Campos principales:

- Nombre editorial y razón social del operador.
- Dominio oficial permitido.
- Logo y textos localizados.
- `site`, mercado y locales disponibles.
- Estado regulatorio: `unverified`, `verified`, `suspended`, `rejected`.
- Identificador de autorización, fuente oficial, fecha de verificación y próximo vencimiento de revisión.
- Características comprobables utilizadas en rankings.
- Avisos o limitaciones por mercado.

Un editor no puede cambiar estado regulatorio, fuente, razón social o dominio permitido.

### Offer

Representa el enlace afiliado y sus condiciones, no un bloque de texto libre.

```ts
interface Offer {
  id: string
  site: string
  casino: string
  slug: string
  locale: string
  destinationUrl: string
  campaign?: string
  validFrom: string
  validTo?: string
  status: 'draft' | 'active' | 'paused' | 'expired'
  publicPresentation: 'hidden' | 'cta_only' | 'details'
  termsSummary?: string
  lastVerifiedAt: string
}
```

`destinationUrl` debe usar HTTPS y un hostname incluido en la allowlist del casino o de su red de tracking aprobada. Ontario utiliza `publicPresentation: hidden` o `cta_only` por defecto; la presentación de detalles exige aprobación regulatoria explícita.

### Media

Extiende uploads de Payload con:

- Tenant propietario.
- Texto alternativo por locale.
- Créditos y fuente.
- Restricciones de uso.
- Hash y variantes generadas.
- Estado de distribución.

El snapshot contiene únicamente medios referenciados por contenido publicado del sitio.

### Redirect

Hay dos categorías separadas:

- `internal`: redirecciones `301` por cambios de slug, siempre dentro del dominio del sitio.
- `affiliate`: administradas mediante `Offer` y resueltas por `/go/{offerSlug}` con `302`.

No se aceptan patrones regex escritos desde el panel durante el MVP. Origen y destino se normalizan y validan para evitar ciclos o redirecciones abiertas.

### Publication

Registra el resultado inmutable de publicar un sitio:

- `site`, versión, actor y fecha.
- Política regulatoria aplicada.
- Hash del payload.
- Conteo de entidades y medios.
- Estado de generación y entrega.
- Tags de caché afectados.
- Resultado de cada instancia frontend consumidora.

Una publicación no modifica su snapshot. Cualquier corrección crea una nueva versión.

## Bloques permitidos

El editor compone páginas con bloques tipados:

| Bloque | Propósito | Restricciones principales |
| --- | --- | --- |
| `hero` | Encabezado y propuesta de valor | Un H1, CTA opcional a una oferta aprobada |
| `ranking` | Lista ordenada de casinos | Relaciones, metodología y fecha de revisión obligatorias |
| `comparisonTable` | Comparación de atributos | Columnas predefinidas; sin HTML arbitrario |
| `richText` | Contenido editorial | Sanitizado; headings desde H2; enlaces validados |
| `faq` | Preguntas y respuestas reales del usuario | Texto informativo, sin prometer rich result, respuesta de IA ni cita |
| `affiliateDisclosure` | Relación comercial | No eliminable en páginas comerciales |
| `responsibleGambling` | Edad, riesgo y ayuda | Contenido cargado desde la política vigente |
| `methodology` | Criterios y actualización | Requerido cuando existe ranking |
| `cta` | Acción afiliada | Solo selecciona una `Offer`, nunca recibe una URL libre |

No se permite insertar JavaScript, iframes arbitrarios o estilos globales desde Rich Text. Los embeds futuros requerirán un bloque con proveedor y orígenes aprobados.

## Tema configurable

`ThemeTokens` controla identidad sin permitir código:

- Logotipo claro y oscuro.
- Colores semánticos con validación de contraste.
- Familias tipográficas preinstaladas.
- Radios, espaciado y densidad dentro de escalas cerradas.
- Variantes preconstruidas de header, footer, cards y hero.

El frontend define los componentes. Payload solamente elige valores y variantes. Un tema inválido bloquea la publicación.

## Workflow editorial

```text
draft -> in_review -> approved -> published
            ^             |
            +-------------+ correcciones
```

- Editor: crea, traduce, revisa y puede publicar contenido de sus sitios.
- Administrador: las mismas capacidades, además de usuarios, regulación, operadores, destinos y secretos.
- Un documento solo puede pasar a `approved` si valida contra la política efectiva.
- Publicar vuelve a ejecutar todas las validaciones; no se confía en una aprobación antigua.
- Cambiar una política marca el contenido afectado como `review_required`, pero no lo despublica automáticamente. El administrador recibe una cola de revisión y decide la acción segura.

## Traducción manual y asistencia opcional

La traducción manual forma parte del núcleo del CMS y no necesita servicios externos ni API keys. El editor puede crear una variante desde cualquier documento fuente; el sistema copia la estructura y las relaciones permitidas en un nuevo draft para que el texto se escriba manualmente.

Flujo principal:

1. El editor elige un documento fuente y un locale destino permitido.
2. El sistema crea un draft nuevo, conserva relaciones no traducibles y registra `sourceHash`.
3. El editor redacta manualmente título, metadata y bloques.
4. Otro editor, o el mismo según el workflow aprobado, revisa texto, enlaces, términos regulatorios y ajuste visual.
5. Si cambió el documento fuente desde `sourceHash`, la traducción queda `source_changed` y debe reconciliarse.
6. La publicación es manual.

La asistencia de IA es una extensión opcional detrás de `AI_ASSISTANCE_ENABLED=false`. Con el valor predeterminado `false`:

- No se exige `OPENAI_API_KEY` ni una credencial de otro proveedor.
- El CMS inicia, edita, traduce, publica y distribuye contenido normalmente.
- No aparece ninguna acción de generación en el panel.
- Los despliegues y pruebas principales no realizan solicitudes a servicios de IA.

Si en el futuro se habilita, se implementará mediante un adaptador de proveedor y salida estructurada. La respuesta se guardará como un draft ordinario con `contentOrigin: ai_assisted`; nunca sustituirá contenido publicado ni podrá publicarse automáticamente. Un fallo, cuota agotada o ausencia temporal del proveedor devolverá un error no bloqueante y permitirá continuar redactando manualmente.

Incluso con la extensión habilitada, no se enviarán secretos, destinos de tracking, notas legales internas o datos de usuarios. Los campos no traducibles, relaciones e IDs se conservan desde el origen.

## SEO técnico

### Canonical y rutas

- Toda URL indexable tiene canonical absoluto hacia sí misma.
- Query strings de campaña no cambian el canonical.
- Cambiar un slug crea un redirect interno `301` desde la ruta anterior.
- Slugs se normalizan en minúsculas y segmentos seguros; no se traducen automáticamente sin revisión.

### Hreflang

Los alternates se generan únicamente cuando:

- Las páginas comparten `translationGroup`.
- Ambas están publicadas.
- El administrador las marcó como equivalentes regulatorias.
- Cada URL devuelve `200` y canonical propio.

Ontario puede enlazar `en-CA` y `fr-CA`. Colombia no se enlaza automáticamente con Ontario solo por tratar el mismo tema. Se puede declarar un `x-default` para un selector real de mercado, pero no para redirigir automáticamente por IP. La estrategia sigue las recomendaciones de Google para [sitios multirregionales y multilingües](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

### Sitemap y robots

- Un índice de sitemap por dominio y un sitemap por tipo de contenido.
- Solo URLs publicadas, indexables y vigentes.
- `lastmod` proviene del cambio editorial real, no del momento de cada request.
- Admin, preview, APIs, `/go/` y healthchecks se excluyen de indexación.
- Los entornos que no sean producción responden `noindex` globalmente.

### Metadata y datos estructurados

- Título, description, Open Graph y tarjetas sociales por locale.
- `Organization`, `WebSite` y `BreadcrumbList` cuando correspondan.
- `ItemList` para describir rankings sin prometer resultados enriquecidos.
- No usar `Product`, estrellas o `AggregateRating` si la página no cumple las políticas de Google o la valoración no está respaldada por metodología y datos reales.
- El bloque FAQ mejora semántica y accesibilidad, pero no se promete un FAQ rich result.

### Calidad y rendimiento

- HTML principal renderizado en servidor y disponible sin JavaScript.
- Imágenes con dimensiones, `srcset`, lazy loading fuera del hero y formatos modernos.
- No cargar scripts de redes afiliadas en la página; el tracking se resuelve en `/go`.
- Objetivo inicial por plantilla en móvil: LCP menor a 2.5 s, CLS menor a 0.1 e INP menor a 200 ms en el percentil 75, sujeto a medición con tráfico real.
- WCAG 2.2 AA como criterio de componentes, navegación por teclado y contraste.

## AEO y GEO

### Relación con SEO

- SEO establece rastreo, indexación, comprensión y presentación en buscadores.
- AEO procura que las preguntas y decisiones reales del usuario tengan respuestas claras, completas y verificables.
- GEO mejora las condiciones para que una fuente elegible pueda recuperarse y citarse en una respuesta generativa.

El orden de trabajo será `elegibilidad -> comprensión -> evidencia -> citabilidad -> medición`. Estar indexado no garantiza ser recuperado o citado; una cita tampoco implica ranking, autoridad, recomendación ni tráfico.

### Preparación editorial

- Cada landing declara una intención principal por mercado y locale, responde el asunto central de forma temprana y desarrolla después evidencia, matices y condiciones.
- Encabezados, tablas, listas, definiciones y FAQ se usan cuando ayudan a la persona, no para fragmentar artificialmente el contenido.
- Nombres de casinos, operadores, jurisdicciones, autoridades y productos son consistentes entre texto, medios, metadata y datos estructurados.
- Afirmaciones regulatorias o comerciales muestran fuente primaria, fecha efectiva o de verificación y responsable de revisión cuando corresponda.
- Ranking, metodología, relación afiliada y criterios de elegibilidad permanecen visibles y diferenciados.
- No se crean páginas de bajo valor para cada variante de keyword, prompt o consulta derivada.

### Política de crawlers

La implementación verificará las fuentes oficiales antes de modificar `robots.txt` o el WAF. No se almacenan versiones completas de user-agent ni rangos IP, porque cambian con el tiempo.

| Superficie | Control actual a verificar | Política inicial |
| --- | --- | --- |
| Google Search, AI Overviews y AI Mode | Rastreo e indexación normales de Google Search; no existe crawler ni schema GEO especial | Permitir en producción indexable |
| ChatGPT Search | `OAI-SearchBot` | Permitir descubrimiento |
| Entrenamiento de modelos OpenAI | `GPTBot`, independiente de Search | Bloquear por defecto |
| Fetch solicitado por un usuario de ChatGPT | `ChatGPT-User`; no define elegibilidad para Search | Tratar como acceso solicitado por usuario según política vigente |
| Perplexity Search | `PerplexityBot` | Permitir descubrimiento |
| Fetch solicitado por un usuario de Perplexity | `Perplexity-User` | Tratar por separado del rastreo automático |
| Bing y Microsoft Copilot | Rastreo, índice y controles soportados por Bing | Permitir en producción indexable |

Fuentes operativas: [Google Search para IA generativa](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [OpenAI Crawlers](https://developers.openai.com/api/docs/bots), [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) y [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

`robots.txt` controla rastreo, no desindexación ni canonicalización. Una regla solo se publica después de revisar el archivo completo, el comportamiento del WAF, los entornos afectados y la política de privacidad.

### `llms.txt`, schema y generación con IA

- No se crea `llms.txt` por defecto ni se presenta como factor de ranking o citación. Google declara que no lo usa para Search ni para sus funciones generativas.
- Solo se evaluará si una superficie objetivo documenta un uso concreto, el usuario quiere soportarla, el archivo puede mantenerse y no expone borradores ni contenido de otro tenant.
- No existe schema universal para respuestas de IA. Los datos estructurados continúan describiendo contenido visible y funciones de búsqueda soportadas.
- La investigación, redacción, revisión y medición pueden ser completamente manuales; GEO/AEO no habilitan ni requieren una API key de IA.

### Medición

La observación se separa por dominio, locale, superficie, consulta y fecha:

- Elegibilidad técnica e indexación.
- Recuperación comprobable cuando la plataforma ofrece evidencia.
- Citas y páginas citadas en reportes propios del motor.
- Recomendaciones observadas, sin inferirlas a partir de una cita.
- Referidos agregados desde superficies de IA cuando exista una fuente analítica legítima.

Se usarán exports manuales o acceso autorizado a Search Console, Bing Webmaster Tools, logs verificados y analítica agregada. Un conjunto pequeño y estable de consultas manuales servirá como observación repetible, no como un ranking universal. Ninguna medición exige automatización, API de IA ni una herramienta SEO de pago.

## Disclosure y metodología

Toda página con rankings u ofertas muestra, antes del primer CTA significativo:

- Que el sitio puede recibir comisión.
- Que la comisión no determina por sí sola la evaluación.
- Enlace a la metodología y fecha de última revisión.
- Edad mínima y enlace visible de juego responsable.

La metodología define criterios, fuentes, proceso de verificación, manejo de relaciones comerciales y frecuencia de revisión. No se permiten frases de independencia que contradigan la relación afiliada.
