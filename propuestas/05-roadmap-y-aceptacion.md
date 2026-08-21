# Roadmap, pruebas y aceptación

## Estrategia de entrega

La implementación avanza por cortes verticales. Un sitio de demostración debe recorrer edición, aprobación, snapshot y renderizado antes de añadir toda la variedad de bloques. Colombia y Ontario no se habilitan comercialmente hasta completar revisión legal y pruebas de aislamiento.

## Fase 0: decisiones operativas y revisión legal

Entregables:

- Dominios y `siteKey` definitivos.
- Proveedor del VPS único y almacenamiento externo e independiente para backups.
- Dominio técnico de Dokploy y política de acceso para administradores de infraestructura.
- Convención de monorepo y gestor de paquetes, establecida antes del scaffold.
- Opinión legal sobre afiliación en Colombia y obligaciones contractuales en Ontario.
- Textos aprobados de disclosure, edad y juego responsable por locale.
- Inventario inicial de operadores y fuentes verificables.

Criterio de salida: las decisiones pendientes están registradas y existe autorización para implementar controles, pero todavía no para publicar ofertas.

## Fase 1: fundación del control plane

Entregables:

- Next.js + Payload con PostgreSQL.
- Docker Compose local y despliegue del stack en Dokploy sobre el VPS único.
- Traefik con dominios independientes para panel, Colombia y Ontario.
- Colecciones `Site`, `Market`, `Locale`, usuarios y auditoría.
- Roles admin/editor, alcance por tenant y TOTP obligatorio.
- MinIO para uploads con claves versionadas.
- Migraciones reproducibles y seed solo para desarrollo.

Criterios de salida:

- Un editor de Colombia no puede leer, relacionar ni modificar datos de Ontario mediante UI, REST o Local API.
- Ningún usuario entra al panel sin segundo factor.
- Backups y restauración de una base de prueba funcionan.
- Los sitios pueden verse localmente por puertos directos y por dominios `.localhost` con el perfil de proxy.

## Fase 2: dominio editorial y cumplimiento

Entregables:

- `JurisdictionPolicy`, `Page`, `Casino`, `Offer`, `Media` y `Redirect`.
- Bloques controlados y temas por tokens.
- Drafts, revisiones, preview y workflow editorial.
- Validaciones de publicación globales, Colombia y Ontario.
- Disclosure, metodología y juego responsable como contenido obligatorio.

Criterios de salida:

- Los códigos de validación definidos en seguridad tienen pruebas automatizadas.
- Un cambio de política crea una nueva versión y una cola de revisión.
- Ontario bloquea detalles públicos de bonos por defecto.
- Un destino no aprobado no puede guardarse como oferta activa.

## Fase 3: snapshots y distribución

Entregables:

- Paquete compartido de contratos.
- Generador canónico de snapshots y manifest de medios.
- Endpoint de delivery con ETag y token por sitio.
- Outbox, worker, HMAC, reintentos y dead letter.
- Almacenamiento versionado en un volumen distinto por frontend, verificación y activación atómica.
- Vista administrativa de versiones y estado de sincronización.

Criterios de salida:

- Publicar genera una única versión coherente y checksum reproducible.
- Eventos duplicados o fuera de orden no degradan la versión activa.
- Un snapshot o medio corrupto se rechaza y se conserva la versión anterior.
- Apagar Payload, PostgreSQL y MinIO no interrumpe un sitio ya sincronizado.

## Fase 4: frontend público, SEO, AEO y GEO

Entregables:

- Aplicación Next.js común con configuración por `SITE_KEY`.
- Plantillas de landing, ranking, legal, metodología y juego responsable.
- Rutas `/es`, `/en` y `/fr`, canonical, sitemap, robots y `hreflang` explícito.
- Metadata, breadcrumbs y `ItemList`.
- Campos visibles de fuentes, comprobación factual, entidades y metodología en las plantillas que los requieran.
- Política de crawlers generada por sitio, con descubrimiento de búsqueda separado de entrenamiento de modelos.
- Auditoría por plantilla con la skill `seo-optimizer` durante diseño, implementación y aceptación.
- Componentes accesibles y presupuesto de rendimiento.
- `/go/{offerSlug}` local con cola de eventos sin PII.

Criterios de salida:

- El mismo artefacto de aplicación sirve ambos sitios con identidad y contenido separados.
- No aparece contenido, canonical, sitemap o media de otro tenant.
- Navegación, contenido principal y CTAs funcionan sin JavaScript del cliente.
- Una caída del servicio de analítica nunca impide la redirección afiliada.
- Cada landing responde su intención principal, conserva evidencia regulatoria verificable y no necesita contenido especial exclusivo para motores de IA.
- La política inicial permite los crawlers de descubrimiento aprobados y bloquea `GPTBot`, sin afectar el rastreo tradicional.

## Fase 5: traducción manual y operación

Entregables:

- Creación manual de variantes por locale, con copia controlada de estructura y relaciones.
- `sourceHash`, detección de cambios en el origen y revisión humana.
- Punto de extensión opcional para asistencia de IA, desactivado por defecto y sin proveedor obligatorio.
- Dashboards, alertas de delivery, edad de snapshots y expiración regulatoria.
- Backups externos cifrados, rotación de credenciales y runbooks.
- Pipeline CI/CD externo al CMS para control plane y sitios.

Criterios de salida:

- El sistema completo inicia y opera sin API keys ni acceso a servicios de IA.
- Toda traducción puede escribirse, revisarse y publicarse manualmente.
- Si se habilita asistencia de IA, su resultado es un draft y nunca se publica automáticamente.
- Cambiar la fuente invalida la revisión de traducción pendiente.
- Se completa una restauración integral ensayada.
- Se completa un rollback de aplicación sin perder el snapshot público activo.

## Matriz mínima de pruebas

### Unitarias

- Filtros de acceso por usuario, rol, tenant y campo.
- Política efectiva por fecha y rechazo de políticas superpuestas.
- Allowlist de destinos y normalización de slugs.
- Serialización canónica y SHA-256.
- Firma/verificación HMAC y ventana temporal.
- Selección de tags de revalidación.
- Evaluación de contenido obligatorio por mercado y locale.

### Integración

- Payload + PostgreSQL: drafts, versiones, relaciones y migraciones.
- Publicación + outbox en presencia de fallos transitorios.
- Endpoint de snapshot con token correcto, incorrecto y cross-tenant.
- Descarga de medios, checksum, staging y activación.
- TOTP, recovery code de un uso y revocación de sesión.
- Creación manual de traducción, copia de relaciones y cambio de fuente.
- Feature flag de IA desactivado, credencial ausente y fallo del proveedor opcional sin bloquear el flujo manual.

### End-to-end

1. Editor de Colombia crea landing, ranking y oferta verificada.
2. Publica y el sitio `/es/...` aplica la versión.
3. Editor de Ontario crea versiones en inglés y francés sin datos públicos de bono.
4. Se generan canonical, sitemap y alternates únicamente entre equivalentes.
5. Un editor intenta acceder al otro tenant por URL y API; recibe denegación.
6. Se publica con un medio corrupto; el sitio mantiene la versión anterior.
7. Se reenvía el mismo evento y luego uno más antiguo; no cambia el resultado.
8. Se apaga el contenedor del control plane; páginas, medios y `/go` siguen disponibles en los contenedores frontend.
9. Se restaura el control plane y la cola pendiente sincroniza sin intervención destructiva.
10. Se simula pérdida completa del VPS en un entorno de ensayo y se reconstruye desde backups externos.

### Seguridad

- Pruebas de IDOR y referencias cross-tenant.
- CSRF, XSS en Rich Text, upload malicioso y redirect abierto.
- Replay y manipulación de webhooks.
- Fuerza bruta de login y TOTP.
- Ausencia de secretos y PII en snapshots, logs y eventos de click.
- Rotación de token/HMAC sin corte de servicio.

### SEO, AEO, GEO, accesibilidad y rendimiento

- Crawl de cada dominio y locale con enlaces rotos, canonicals y códigos HTTP.
- Validación XML de sitemaps y alternates recíprocos.
- Renderizado sin hidratación para contenido crítico.
- Verificación de la política de crawlers contra documentación oficial vigente, incluyendo la separación entre `OAI-SearchBot` y `GPTBot`.
- Auditoría de intención, entidades, fuentes, fechas y citabilidad por mercado y locale con `seo-optimizer`.
- Benchmark manual repetible de consultas por superficie, registrando fecha y URL citada sin tratar una observación aislada como ranking.
- Confirmación de que no se requiere `llms.txt`, schema especial, API de IA ni herramienta SEO de pago para aprobar el sitio.
- Lighthouse en plantillas representativas y medición posterior con datos de campo.
- Navegación por teclado, landmarks, headings, labels, focus y contraste.

## Observabilidad y alertas

Alertar cuando:

- La versión publicada no ha sido aplicada después de 15 minutos.
- Un evento llega a dead letter.
- El snapshot activo supera la edad editorial definida para el sitio.
- Una verificación de casino o política vence en 30, 14 o 7 días.
- Un backup falla o no se completa una copia dentro de 24 horas.
- Un sitio no está ready o no puede resolver una oferta activa.

Métricas iniciales:

- Duración y resultado de generación de snapshot.
- Latencia e intentos por delivery.
- Versión central frente a versión aplicada.
- Tamaño de snapshot y bytes de medios nuevos.
- Estado y antigüedad de backups.
- Clicks agregados por sitio/oferta/día, sin dimensiones de usuario.
- Referidos agregados desde superficies de búsqueda o IA y citas exportadas desde herramientas propias del motor, únicamente cuando exista acceso autorizado.

## Rollout

1. Desplegar el proyecto completo en un entorno staging de Dokploy con datos ficticios.
2. Desplegar dos contenedores frontend desde la misma imagen y asignarles dominios diferentes.
3. Ejecutar matriz de aislamiento, fallos y restauración.
4. Cargar políticas revisadas y contenido institucional.
5. Desplegar producción sin CTAs afiliados y verificar SEO técnico, AEO, GEO y controles de crawlers por dominio y locale.
6. Habilitar primero un conjunto pequeño de casinos verificados por mercado.
7. Observar delivery, errores y redirecciones.
8. Ampliar catálogo solo después de una revisión conjunta editorial, técnica y legal.

El rollback de contenido consiste en publicar una nueva versión basada en una revisión anterior. No se edita el snapshot activo ni se rebobina silenciosamente la auditoría.

## Definition of Done del MVP

El MVP está terminado cuando:

- Existe un panel central con admin/editor, TOTP, auditoría y aislamiento probado.
- Colombia y Ontario operan en dominios y contenedores separados dentro del mismo VPS, usando el mismo frontend.
- Las rutas y locales acordados producen metadata y sitemaps correctos.
- Las plantillas públicas superan la auditoría SEO/AEO/GEO sin garantías de ranking o cita y sin depender de una API key de IA.
- Landing, ranking, páginas legales, metodología y juego responsable son editables.
- Solo casinos, ofertas y destinos verificados pueden publicarse.
- Snapshots y medios se aplican atómicamente y sobreviven a la caída central.
- Webhooks son firmados, idempotentes y reintentables.
- `/go` funciona localmente y no almacena PII.
- Las traducciones funcionan manualmente sin ninguna integración de IA.
- Cualquier asistencia opcional de IA produce drafts que requieren revisión humana.
- Backups externos y restauración han sido ensayados.
- Los textos y reglas regulatorias de producción tienen aprobación documentada.

## Fuera del MVP

- Aprovisionamiento de VPS, DNS o certificados desde Payload.
- Alta disponibilidad o tolerancia a la pérdida completa del VPS sin interrupción.
- Keycloak o SSO corporativo.
- Aplicaciones frontend independientes por país.
- Dependencia obligatoria de IA o publicación automática de traducciones.
- Personalización por perfil, fingerprint o geolocalización forzada.
- Cuentas de jugadores, depósitos o funcionalidades de operador.
- Reviews extensas y biblioteca completa de guías.
- Alta disponibilidad multi-instancia; se diseñará cuando la carga real la justifique.
