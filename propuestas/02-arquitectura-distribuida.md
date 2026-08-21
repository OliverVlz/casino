# Arquitectura multi-sitio en un VPS y contratos

## Topología

```text
Editores
   |
   | HTTPS + contraseña + TOTP
   v
+----------------------- VPS único --------------------------+
| Dokploy                                                   |
|   Traefik: dominios, HTTPS y routing                      |
|   Panel técnico + PostgreSQL interno de Dokploy           |
|                                                           |
| Casino Platform                                           |
|   control-plane: Next.js + Payload                        |
|   app-postgres: contenido, usuarios y auditoría           |
|   minio: medios de origen                                 |
|   worker: snapshots, outbox y entregas                    |
|   site-colombia: Next.js, SITE_KEY=colombia               |
|     volumen: snapshot y medios locales                    |
|   site-ontario: Next.js, SITE_KEY=ontario                 |
|     volumen: snapshot y medios locales                    |
|                                                           |
| Backup cifrado -------------------------------------------+----> almacenamiento externo
+-----------------------------------------------------------+
        |                  |                    |
 panel.ejemplo.com  casinos-colombia.com  casinos-ontario.com
                            /es/...          /en/... y /fr/...
```

El control plane mantiene el estado editorial. Los dos contenedores públicos mantienen modelos de lectura inmutables y no reciben escrituras de contenido desde Internet. Comparten servidor físico por costos, pero no proceso, variables, caché, snapshot ni volumen de contenido.

## Componentes del VPS único

### Dokploy y Traefik

Dokploy administra despliegues, variables, dominios, logs y redeploys. Traefik termina TLS y dirige cada host al puerto interno correcto. No se instala Caddy en producción.

| Host público | Servicio | Puerto interno |
| --- | --- | --- |
| `deploy.ejemplo.com` | Panel técnico de Dokploy | Administrado por Dokploy |
| `panel.ejemplo.com` | `control-plane` | `3000` |
| `casinos-colombia.com` | `site-colombia` | `3000` |
| `casinos-ontario.com` | `site-ontario` | `3000` |

PostgreSQL, la consola de MinIO, el worker y los endpoints internos de entrega no se publican como dominios abiertos. Traefik no enruta `/delivery/*` desde el host público del panel; los frontends lo consumen por `http://control-plane:3000` dentro de Docker. El acceso a Dokploy se limita a administradores técnicos y se protege independientemente de las cuentas editoriales de Payload.

Dokploy mantiene su propia base PostgreSQL para configuración operativa. `app-postgres` es una instancia lógica separada para la plataforma y no comparte credenciales, esquema ni ciclo de backup con la base interna de Dokploy.

### Aplicación Payload

Contiene:

- Panel editorial.
- Colecciones y control de acceso multi-tenant.
- Preview autenticado.
- Endpoint de delivery de snapshots.
- Hooks que solicitan una publicación después de validar el contenido.
- Vista de estado de sincronización por sitio.

### PostgreSQL

Es la fuente de verdad para contenido, usuarios, regulación, publicaciones, auditoría y outbox. Toda publicación y creación de evento de distribución ocurre en una transacción lógica: si no queda registrado el evento, la publicación no se considera lista para distribuir.

### MinIO

Almacena originales y derivados editoriales. Los objetos publicados usan claves versionadas; nunca se sobrescribe un archivo ya distribuido. Un snapshot referencia la ruta, tamaño, tipo MIME y SHA-256 de cada objeto.

### Worker de distribución

Procesa la outbox, genera snapshots, entrega webhooks y registra intentos. No dispone de credenciales de Dokploy, SSH, DNS ni del proveedor de VPS.

## Componentes de cada sitio

- Una imagen Docker de la aplicación Next.js común.
- Configuración de servidor con `SITE_KEY`, dominio, URL de delivery, token de lectura y secreto HMAC.
- Un volumen persistente para snapshots versionados, puntero activo, medios y cola local de analítica.
- Un endpoint privado de sincronización y endpoints públicos de contenido.
- Un healthcheck que distingue salud de aplicación y frescura editorial.

El tema, navegación y bloques habilitados llegan en el snapshot; el código ejecutable llega exclusivamente por CI/CD.

### Comunicación interna

Aunque los usuarios acceden por dominios HTTPS, los servicios del mismo Compose se comunican por la red Docker privada:

```text
control-plane -> http://site-colombia:3000/api/cms/revalidate
control-plane -> http://site-ontario:3000/api/cms/revalidate

site-colombia -> http://control-plane:3000/delivery/v1/sites/colombia/snapshot
site-ontario  -> http://control-plane:3000/delivery/v1/sites/ontario/snapshot
```

Cada `Site` diferencia:

- `publicOrigin`: dominio público utilizado en canonical, sitemap y preview.
- `deliveryWebhookUrl`: dirección interna a la que el worker entrega eventos.

Los tokens y firmas siguen siendo obligatorios en la red interna. Estar dentro de Docker no sustituye autenticación ni aislamiento por tenant.

## Desarrollo local

Dokploy no se instala en cada computadora. El repositorio ofrecerá Docker Compose con los mismos servicios de aplicación y dos formas de acceso.

Modo directo:

```text
http://localhost:3000/admin  -> Payload
http://localhost:3001/es     -> Colombia
http://localhost:3002/en     -> Ontario inglés
http://localhost:3002/fr     -> Ontario francés
```

Modo proxy local, activado con un perfil Compose de Traefik:

```text
http://panel.localhost/admin
http://colombia.localhost/es
http://ontario.localhost/en
http://ontario.localhost/fr
```

Las URLs internas conservan los nombres de servicio (`control-plane`, `site-colombia`, `site-ontario`). En desarrollo, `publicOrigin` se reemplaza con los dominios `.localhost` y todos los sitios responden `noindex`.

## Modelo de publicación

1. Un editor guarda un borrador y solicita revisión o publicación.
2. El backend carga la política vigente del sitio y ejecuta las validaciones regulatorias.
3. Si el documento es válido, Payload crea una `Publication` con versión monotónica por sitio.
4. El generador reúne solamente documentos publicados, vigentes y pertenecientes al sitio.
5. El JSON se serializa de forma canónica y se calcula SHA-256 sobre `payload`.
6. Se crea un `DeliveryEvent` en la outbox.
7. El worker envía el webhook al frontend correspondiente.
8. El frontend solicita el snapshot con su token, descarga los medios faltantes y valida hashes.
9. El frontend escribe todo en un directorio de staging y cambia el puntero `current` de forma atómica.
10. Next.js invalida las etiquetas recibidas y el endpoint devuelve la versión aplicada.

Una publicación con un medio faltante, checksum incorrecto o versión anterior no reemplaza la copia activa.

## Contratos compartidos

Las definiciones vivirán posteriormente en un paquete TypeScript común. Los tipos base son:

```ts
type SiteKey = string
type SnapshotVersion = string

interface PublicationSnapshot<TPayload = SitePayloadV1> {
  schemaVersion: 1
  siteKey: SiteKey
  version: SnapshotVersion
  generatedAt: string
  payloadSha256: string
  payload: TPayload
}

interface SitePayloadV1 {
  site: PublishedSiteConfig
  policies: PublishedJurisdictionPolicy[]
  pages: PublishedPage[]
  casinos: PublishedCasino[]
  offers: PublishedOffer[]
  redirects: PublishedRedirect[]
  media: PublishedMediaManifestItem[]
}

interface PublishedMediaManifestItem {
  id: string
  sourcePath: string
  publicPath: string
  mimeType: string
  bytes: number
  sha256: string
}

interface DeliveryEvent {
  eventId: string
  siteKey: SiteKey
  snapshotVersion: SnapshotVersion
  tags: string[]
  issuedAt: string
}
```

`SnapshotVersion` será un ULID generado al publicar. Su orden lexicográfico permite rechazar eventos atrasados. `schemaVersion` cambia únicamente cuando el consumidor necesita una migración incompatible.

## API de snapshots

### Lectura

```http
GET /delivery/v1/sites/{siteKey}/snapshot
Authorization: Bearer {site-scoped-token}
If-None-Match: "{snapshot-version}"
```

Reglas:

- El token contiene internamente un único `siteKey`; solicitar otro sitio devuelve `403`.
- La API nunca devuelve drafts, secretos, notas internas ni destinos sin vigencia.
- La respuesta usa `ETag` igual a la versión.
- Si el consumidor ya tiene la versión vigente, devuelve `304`.
- Si el sitio no tiene una publicación inicial completa, devuelve `409 site_not_initialized`.

### Respuestas

```http
200 OK
Content-Type: application/json
ETag: "01J..."
```

```json
{
  "schemaVersion": 1,
  "siteKey": "ca-on",
  "version": "01J...",
  "generatedAt": "2026-08-18T20:00:00.000Z",
  "payloadSha256": "...",
  "payload": {}
}
```

Los errores siguen `{ "error": { "code": string, "message": string } }` y no incluyen stack traces.

## Webhook de revalidación

```http
POST /api/cms/revalidate
Content-Type: application/json
X-CMS-Event-Id: {eventId}
X-CMS-Timestamp: {unix-seconds}
X-CMS-Signature: v1={hex-hmac-sha256}
```

La firma se calcula sobre:

```text
{timestamp}.{raw-request-body}
```

El receptor debe:

- Comparar la firma en tiempo constante.
- Rechazar timestamps con más de cinco minutos de diferencia.
- Guardar `eventId` y responder de forma idempotente a duplicados.
- Rechazar un `siteKey` distinto de `SITE_KEY`.
- Ignorar sin error una versión anterior a la activa.
- Validar que cada tag pertenezca a un conjunto permitido; nunca ejecutar rutas recibidas como código.

Respuesta exitosa:

```json
{
  "status": "applied",
  "siteKey": "ca-on",
  "snapshotVersion": "01J...",
  "appliedAt": "2026-08-18T20:00:04.000Z"
}
```

Un duplicado devuelve `200` con `status: "already_applied"`. Una sincronización en curso devuelve `202`. Un fallo verificable devuelve `503` para permitir reintento y mantiene el snapshot anterior.

## Outbox y reintentos

Estados: `pending`, `delivering`, `delivered`, `retrying`, `dead_letter`.

- Cada evento tiene restricción única por `eventId`.
- Un worker bloquea filas con una estrategia que evite doble procesamiento.
- Se realizan ocho intentos con backoff exponencial y jitter.
- Después del último intento, el evento queda en `dead_letter` y aparece en el panel.
- Un administrador puede reintentar; no puede editar el cuerpo de un evento existente.
- Si se publica una versión más reciente, sigue siendo posible entregar el evento anterior, pero el sitio lo reconocerá como obsoleto.

## Activación local y recuperación

El volumen del sitio conserva como mínimo las dos últimas versiones válidas:

```text
/data/content/
  snapshots/{version}/snapshot.json
  media/{sha256}/{filename}
  state/current.json
  state/applied-events.log
  analytics/pending/
```

La actualización escribe un archivo temporal, hace `fsync`, renombra y solo entonces actualiza `current.json`. Los medios se direccionan por hash, por lo que pueden compartirse entre versiones y limpiarse cuando ninguna de las dos versiones conservadas los referencia.

Al iniciar, la aplicación debe:

1. Cargar y verificar el snapshot activo.
2. Si está corrupto, intentar la versión anterior.
3. Declararse no saludable si no existe ninguna versión válida.
4. Intentar sincronización en segundo plano sin bloquear el contenido válido existente.

## Redirecciones afiliadas

`GET /go/{offerSlug}` se resuelve con la oferta local publicada. El flujo es:

1. Comprobar sitio, vigencia, estado del casino y destino permitido.
2. Crear un evento mínimo con `eventId`, `siteKey`, `offerId`, `pageId` opcional, `market`, `campaign` opcional y timestamp.
3. Encolar el evento localmente sin registrar IP, cookies, cabeceras del navegador o fingerprint.
4. Responder con redirección `302` al destino permitido, aunque la analítica central no esté disponible.
5. Vaciar la cola por lotes hacia un endpoint central independiente del flujo de redirección.

El destino nunca se toma de un parámetro de query y no se permite una redirección abierta.

## Salud y observabilidad

Cada sitio expondrá:

- `/api/health/live`: proceso funcionando.
- `/api/health/ready`: snapshot válido cargado.
- `/api/health/content`: versión, fecha de publicación, última sincronización y estado; protegido para monitoreo.

El panel mostrará por sitio:

- Versión publicada en control.
- Versión confirmada por frontend.
- Último intento y último éxito.
- Edad del snapshot activo.
- Evento en dead letter, si existe.

No se enviarán contenido, tokens ni destinos afiliados a logs de error.

## Backups y objetivos operativos

- PostgreSQL: backup cifrado nocturno y archivado incremental suficiente para un RPO objetivo de 15 minutos.
- MinIO: versionado de objetos y réplica cifrada diaria a un proveedor o ubicación independiente.
- Dokploy: export o backup de su configuración y PostgreSQL interno para reconstruir dominios y despliegues.
- Retención inicial: 7 copias diarias, 5 semanales y 12 mensuales.
- Prueba de restauración trimestral documentada.
- RTO objetivo del control plane: 4 horas.
- La caída del contenedor de control no debe interrumpir sitios que ya tengan un snapshot válido.
- La caída del VPS completo interrumpe todos los dominios; el objetivo es restaurarlo desde backups externos, no prometer alta disponibilidad en el MVP.

## Límites intencionales

- Payload no crea VPS, contenedores, DNS o certificados.
- Payload no almacena claves SSH.
- El alta de un sitio requiere crear/configurar su servicio y dominio en Dokploy, y después registrar origen, endpoint y credenciales en Payload.
- Los cambios de código se distribuyen por CI/CD; los cambios de contenido, por snapshots.
- Separar un frontend hacia otro VPS será una migración operativa futura: se cambia `deliveryWebhookUrl` y el despliegue, sin modificar el modelo editorial.
