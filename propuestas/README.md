# Propuestas para la plataforma de contenidos de casinos

Estado: arquitectura aprobada para documentación  
Fecha de corte: 18 de agosto de 2026

## Recomendación ejecutiva

Construir una plataforma central de contenidos con Payload, Next.js y PostgreSQL. Por costos, el MVP completo se desplegará en un solo VPS administrado con Dokploy. Cada mercado tendrá dominio y contenedor frontend independientes, pero ambos usarán el mismo código configurable y consumirán publicaciones versionadas del panel central.

La primera entrega contempla dos sitios:

- Colombia: un dominio propio con rutas `/es/...`.
- Ontario: un dominio propio con rutas `/en/...` y `/fr/...`.

Los sitios no consultarán el CMS para responder cada visita. Al publicar, el panel generará un snapshot inmutable por sitio, notificará al frontend mediante un webhook firmado y el frontend guardará localmente el contenido y los medios. Si el CMS deja de estar disponible, cada dominio seguirá sirviendo la última versión válida.

La visibilidad orgánica se trabajará de forma integrada: SEO como base de descubrimiento e indexación, AEO para responder con claridad las preguntas reales de cada mercado y GEO para mejorar la recuperabilidad y citabilidad en experiencias como Google AI, ChatGPT Search, Bing/Copilot y Perplexity. Se optimizarán condiciones verificables, sin prometer rankings, recomendaciones ni citas.

## Decisiones cerradas

| Área | Decisión |
| --- | --- |
| CMS y panel | Payload integrado con Next.js |
| Frontend público | Next.js App Router, una base configurable y varios despliegues |
| Base de datos central | PostgreSQL |
| Medios de origen | MinIO con volumen persistente y respaldo externo |
| Infraestructura inicial | Un VPS para todos los servicios, con contenedores y volúmenes separados |
| Despliegue | Dokploy; Traefik gestiona dominios, routing y HTTPS |
| Separación | Un tenant por sitio y permisos por `siteId` |
| Dominios | Separados por mercado |
| Rutas | Prefijo de idioma, sin repetir país o provincia |
| Publicación | Snapshot completo, versionado, firmado y activado de forma atómica |
| Resiliencia | Cada frontend conserva su última versión; una caída de Payload no detiene los sitios |
| Autenticación humana | Cuenta local, TOTP obligatorio y códigos de recuperación |
| Autenticación máquina | Token de lectura y secreto HMAC únicos por sitio |
| Traducciones | Creación manual por defecto; asistencia de IA opcional y desactivada |
| Visibilidad orgánica | SEO, AEO y GEO integrados, medidos por dominio, locale y superficie |
| Orquestación | Contenido y sincronización; no SSH, DNS ni despliegues desde el CMS |
| Analítica afiliada | Redirección local y eventos sin IP, cookies, user-agent ni fingerprint |

## Documentos

1. [Panorama y elección del stack](01-panorama-stack.md)
2. [Arquitectura multi-sitio en un VPS y contratos](02-arquitectura-distribuida.md)
3. [Modelo editorial, traducciones y SEO](03-modelo-editorial-seo.md)
4. [Seguridad y cumplimiento](04-seguridad-cumplimiento.md)
5. [Roadmap, pruebas y aceptación](05-roadmap-y-aceptacion.md)

El orden de lectura también es el orden recomendado para tomar decisiones de implementación. El roadmap no autoriza la publicación comercial: antes de producción, una asesoría competente debe revisar las reglas y textos regulatorios de cada mercado.

## Principios de implementación

- El CMS es la fuente de verdad editorial, pero no una dependencia de disponibilidad del sitio público.
- La separación entre sitios se aplica en API, consultas, relaciones y tokens; no solamente en la interfaz administrativa.
- Solo se distribuye contenido publicado y vigente. Los borradores se sirven exclusivamente mediante preview autenticado.
- Una publicación no se activa parcialmente: contenido, rutas y medios se validan juntos.
- La regulación se modela como datos versionados con fuente y vigencia, no como condicionales dispersos en componentes React.
- La base visual se comparte; cada sitio cambia identidad mediante tokens, configuración y bloques permitidos.
- Los cambios de infraestructura se realizan mediante CI/CD externo y procedimientos operativos auditables.
- Ninguna API key de IA es requisito de instalación u operación; todo el contenido y sus traducciones pueden crearse manualmente.
- La skill `seo-optimizer` se usa al diseñar, implementar y aceptar cada plantilla; GEO y AEO complementan el SEO y no se tratan como atajos separados.
- Payload administra contenido; Dokploy administra despliegues. Ningún editor de contenido necesita acceso a Dokploy.
- El VPS completo sigue siendo un punto único de fallo; PostgreSQL, MinIO y configuración operativa requieren backups externos.

## Alcance de esta entrega

Estos documentos constituyen la especificación de arquitectura para la implementación. El scaffold de aplicaciones, la infraestructura y el contenido comercial se ejecutarán en las fases descritas en el roadmap.
