# Panorama y elección del stack

## Necesidad

La plataforma debe operar varios sitios afiliados de casinos con contenido, operadores, ofertas y reglas diferentes por jurisdicción. El equipo editorial necesita modificar páginas, títulos, rutas, medios, rankings y metadatos sin desplegar código, mientras que el sistema debe impedir publicaciones incompatibles con el mercado seleccionado.

Además del CMS tradicional, la solución necesita:

- Aislamiento por sitio y asignación de editores.
- Borradores, revisiones, preview y auditoría.
- Contenido multilingüe con publicación independiente por locale.
- Renderizado SEO desde servidor y revalidación selectiva.
- Distribución a varios dominios y despliegues frontend, aunque inicialmente compartan VPS.
- Persistencia relacional para vigencias, elegibilidad y reglas regulatorias.
- Operación propia mediante Docker.

## Alternativas evaluadas

| Alternativa | Fortalezas | Costos o riesgos | Decisión |
| --- | --- | --- | --- |
| Next.js + Payload + PostgreSQL | Panel React extensible, esquema TypeScript, API, versiones, drafts, RBAC, localización, PostgreSQL y frontend en el mismo ecosistema | Requiere construir TOTP, workflow regulatorio y distribución de snapshots | Elegida |
| Astro + EmDash | CMS integrado, esquema visual, roles, revisiones, i18n y enfoque moderno para agentes | El proyecto se declara beta preview; está acoplado a Astro y su aislamiento completo de plugins favorece Cloudflare | Observar, no usar en el MVP |
| NestJS + Vite + MongoDB | Control total y posibilidad de reutilizar ideas del backend anterior | Hay que construir panel, CMS, revisiones, preview, permisos editoriales, localización y SEO SSR | Descartada |
| NestJS + Next.js + PostgreSQL | Separación clara de backend y frontend | Duplica autenticación, modelos, despliegues y contratos antes de validar el producto | Posponer hasta que exista una necesidad real de servicios separados |
| Keycloak + CMS propio | SSO, federación y políticas centralizadas | Exceso de infraestructura para dos roles internos; no resuelve el CMS ni el workflow | Descartada para el MVP |

## Por qué Payload

Payload funciona dentro de Next.js y aporta el backend editorial y el panel administrativo. Las capacidades relevantes están disponibles como piezas configurables, no como un servicio SaaS cerrado:

- [Panel administrativo](https://payloadcms.com/docs/admin/overview) generado desde el modelo de contenido y extensible con componentes React.
- [Versiones y borradores](https://payloadcms.com/docs/versions/overview) con historial, restauración, preview y publicación programada.
- [Control de acceso](https://payloadcms.com/docs/access-control/overview) por operación, documento y campo.
- [Localización](https://payloadcms.com/docs/configuration/localization) para contenidos en varios idiomas.
- [Plugin multi-tenant](https://payloadcms.com/docs/plugins/multi-tenant) para filtrar documentos, relaciones y usuarios por tenant.
- [Adaptador PostgreSQL](https://payloadcms.com/docs/database/postgres) con migraciones apoyadas en Drizzle.

El plugin multi-tenant será una base, no el único control. Todas las colecciones distribuidas tendrán `site`, y las funciones de acceso añadirán el alcance permitido del usuario o token. Las consultas del frontend nunca confiarán en un `siteId` enviado por un navegador.

## Por qué no EmDash todavía

EmDash es la alternativa conceptualmente más cercana a un WordPress moderno. Ofrece admin, roles, contenido estructurado, revisiones, publicación programada e internacionalización dentro de Astro. Su enfoque de esquema visual y herramientas para agentes es atractivo.

No se elige para esta primera versión porque el [repositorio oficial](https://github.com/emdash-cms/emdash) aún lo identifica como beta preview. Para un producto con reglas regulatorias, aislamiento entre sitios y publicación afiliada, se prioriza la trayectoria y extensibilidad actual de Payload. Esta decisión debe revisarse cuando EmDash alcance una versión estable y exista experiencia verificable de operación en producción.

## Por qué PostgreSQL

El contenido editable puede parecer documental, pero el dominio tiene relaciones y restricciones fuertes:

- Un casino puede estar disponible en varios mercados, pero con estado regulatorio diferente.
- Una oferta pertenece a un casino y puede tener vigencias y destinos distintos por sitio.
- Una política regulatoria tiene versiones, fuentes, fecha efectiva y bloqueos de publicación.
- Una publicación agrupa un conjunto coherente de páginas, entidades y medios.
- Los eventos de distribución requieren idempotencia, orden y estados de entrega.

PostgreSQL permite restricciones, transacciones y consultas relacionales para estos casos. Payload conserva la ergonomía de documentos y bloques sobre el adaptador SQL. MongoDB no aporta una ventaja suficiente que compense modelar manualmente la consistencia entre ofertas, mercados y versiones.

## Next.js frente a Vite con React

Vite es excelente como compilador y servidor de desarrollo, pero su guía de SSR es deliberadamente de bajo nivel. Para este proyecto habría que seleccionar e integrar por separado routing de servidor, metadata, sitemap, caching, preview y revalidación.

Next.js ya proporciona:

- App Router y renderizado desde servidor.
- [Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) por página.
- Caching, snapshots consumidos en servidor y [revalidación por etiquetas](https://nextjs.org/docs/app/getting-started/revalidating).
- [Despliegue propio](https://nextjs.org/docs/app/guides/self-hosting) en un proceso Node o contenedor.

Cada sitio público ejecutará una sola instancia Next.js en su propio contenedor. Esto evita mezclar caché o snapshots entre tenants. Si más adelante un sitio escala a varias instancias, se añadirá un handler compartido y coordinación de tags como indica la guía de self-hosting.

## Dokploy y Traefik

La producción inicial utilizará Dokploy sobre un único VPS. Dokploy es el panel técnico de despliegue; Payload sigue siendo el panel editorial. Son responsabilidades diferentes:

- Payload administra páginas, casinos, ofertas, regulación, usuarios editoriales y publicaciones.
- Dokploy administra imágenes/contenedores, variables de entorno, dominios, logs y redeploys.
- Traefik, instalado por Dokploy, recibe los dominios y dirige cada solicitud al servicio correcto.

La [arquitectura oficial de Dokploy](https://docs.dokploy.com/docs/core/architecture) incluye su aplicación, una base PostgreSQL interna y Traefik. Esa base interna no se reutilizará para Payload. La aplicación tendrá su propio PostgreSQL y sus propios backups.

Los dominios se configurarán desde la interfaz de Dokploy, que añade las reglas de Traefik al despliegue Compose. Para servicios Docker Compose, un cambio de dominio requiere redeploy según la [documentación de dominios](https://docs.dokploy.com/docs/core/docker-compose/domains).

No se instalará Caddy en producción: Traefik ya ocupa la capa de reverse proxy y TLS. Ejecutar ambos para los mismos puertos añadiría complejidad sin aportar valor al MVP.

En desarrollo no se necesita Dokploy. Docker Compose ejecutará los mismos servicios y ofrecerá dos modos:

- Puertos directos: panel `localhost:3000`, Colombia `localhost:3001` y Ontario `localhost:3002`.
- Perfil de proxy local con Traefik: `panel.localhost`, `colombia.localhost` y `ontario.localhost`.

## Autenticación sin Keycloak

Payload administrará las cuentas editoriales. Se añadirá un segundo paso TOTP obligatorio y códigos de recuperación. Los administradores podrán gestionar usuarios y campos regulatorios; los editores trabajarán y publicarán únicamente en sus sitios asignados.

Keycloak volverá a evaluarse solo si aparece alguno de estos requisitos:

- Integración con un directorio corporativo existente.
- Más aplicaciones internas que deban compartir sesión.
- Federación con clientes u organizaciones externas.
- Políticas de identidad que no resulte razonable mantener en Payload.

## Decisión de arquitectura

Adoptar un monorepo TypeScript futuro con cuatro unidades conceptuales:

- Aplicación de control: Next.js + Payload.
- Aplicación pública: Next.js configurable y desplegable varias veces.
- Paquete de contratos: snapshots, webhooks, locales y estados compartidos.
- Paquete de diseño: bloques, tokens y componentes comunes.

El gestor de paquetes se elegirá al crear el scaffold, después de establecer una convención en el repositorio raíz. Esta propuesta no incluye comandos de instalación porque todavía no existe un lockfile ni un campo `packageManager` que determine esa decisión.
