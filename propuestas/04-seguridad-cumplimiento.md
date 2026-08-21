# Seguridad y cumplimiento

## Alcance y postura

La plataforma será un medio editorial afiliado, no un operador de juego. Aun así, promocionar o enlazar operadores puede estar sujeto a obligaciones del operador, del afiliado y de protección al consumidor. Los controles descritos son valores seguros de producto; no sustituyen una opinión legal aplicable al negocio y sus contratos.

Principios:

- Denegar por defecto operadores, ofertas y destinos no verificados.
- Aplicar autorización en backend y campo, no solo ocultar botones.
- Mantener evidencia de la fuente y aprobación usada al publicar.
- Minimizar datos: no perfilar visitantes ni registrar identificadores en clicks.
- Hacer que toda acción crítica sea atribuible y reversible.

## Identidades humanas

### Roles

| Capacidad | Administrador | Editor |
| --- | --- | --- |
| Ver sitios | Todos | Asignados |
| Crear y editar contenido | Sí | Sitios asignados |
| Publicar contenido | Sí | Sitios asignados, si pasa validaciones |
| Ver revisiones y auditoría editorial | Sí | Sitios asignados |
| Administrar casinos y ofertas | Sí | Campos editoriales no críticos |
| Cambiar regulación, licencia o destino | Sí | No |
| Gestionar usuarios y asignaciones | Sí | No |
| Rotar tokens y webhooks | Sí | No |
| Reintentar entregas | Sí | No |

Los permisos se calculan con el usuario autenticado y su lista de sitios. Una relación hacia otra colección también se filtra por tenant para impedir referencias cruzadas.

### Inicio de sesión con TOTP

Payload conserva usuario, contraseña y sesión. Se añade un flujo obligatorio de dos pasos:

1. Contraseña válida crea un desafío de cinco minutos en cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
2. El usuario presenta un código TOTP o un código de recuperación.
3. Solo entonces se crea la sesión administrativa.

En el primer acceso, el usuario debe registrar TOTP antes de usar el panel. El secreto TOTP se cifra con AES-256-GCM usando una clave separada de `PAYLOAD_SECRET`. Los códigos de recuperación se generan con alta entropía, se muestran una sola vez y se almacenan individualmente con hash; cada código es de un solo uso.

Controles adicionales:

- Sesión máxima inicial de ocho horas.
- Reautenticación de segundo factor durante los últimos 15 minutos para rotar secretos, cambiar regulación o administrar usuarios.
- Rate limit por cuenta y origen de red con respuesta uniforme.
- Revocación de todas las sesiones al desactivar usuario, restablecer TOTP o cambiar contraseña por un administrador.
- Recuperación de TOTP por administrador mediante procedimiento auditado; nunca revelar el secreto existente.

## Identidades de máquina

Cada sitio recibe dos secretos independientes:

- Token bearer de solo lectura para `GET /delivery/v1/sites/{siteKey}/snapshot`.
- Secreto HMAC para verificar webhooks.

El token se muestra una sola vez, se almacena con hash y se puede solapar temporalmente con el siguiente durante una rotación. El secreto HMAC debe cifrarse porque el control plane necesita usarlo para firmar. Ninguna credencial concede acceso a otro `siteKey`.

La rotación sigue este orden:

1. Crear credencial secundaria.
2. Instalarla como variable secreta del servicio correspondiente en Dokploy.
3. Confirmar healthcheck y entrega firmada.
4. Promover la nueva credencial.
5. Revocar la anterior y registrar el evento.

## Aislamiento multi-tenant

Los controles obligatorios son:

- `site` requerido en todas las colecciones distribuidas.
- Access control de Payload para `read`, `create`, `update`, `delete` y versiones.
- Field access para regulación, dominios, destinos, credenciales y estado de verificación.
- Filtros de relaciones por tenant.
- Validación de tenant en hooks antes de guardar.
- Token de delivery enlazado en servidor con un único sitio.
- Generador de snapshot que vuelve a filtrar por sitio y estado publicado.
- Pruebas negativas directas a REST/Local API, no solo pruebas del panel.

Un administrador global puede cambiar el tenant activo en el panel. Un editor no puede seleccionar ni inferir tenants que no tenga asignados.

## Auditoría

Registrar como mínimo:

- Actor humano o credencial de máquina.
- Acción, entidad, tenant, timestamp UTC y resultado.
- Cambios relevantes antes/después, excluyendo secretos y cuerpos sensibles.
- Publicación, política aplicada, snapshot y checksum.
- Rotación/revocación de credenciales.
- Uso de código de recuperación y restablecimiento de TOTP.
- Reintentos y confirmaciones de delivery.

Los logs de auditoría son append-only desde la aplicación y solo los administradores pueden leerlos. El MVP establece una retención de tres años para auditoría administrativa, sujeta a confirmación legal y de privacidad.

## Seguridad de aplicación e infraestructura

- TLS en todos los hosts; PostgreSQL y consola de MinIO sin exposición pública.
- Traefik es el único punto público de entrada y sus reglas de dominio se administran mediante Dokploy.
- El panel de Dokploy es exclusivamente técnico, usa credenciales distintas a Payload y no se asigna a editores.
- Imágenes Docker fijadas por versión, no por `latest`.
- Secretos fuera del repositorio y de snapshots.
- Política de Content Security Policy sin `unsafe-eval`; orígenes explícitos para imágenes.
- `frame-ancestors 'none'` para el panel y protección CSRF en operaciones autenticadas.
- Límites de tamaño y MIME, análisis de archivos y nombres generados para uploads.
- Backups cifrados con credenciales diferentes a producción.
- Backup separado de los datos de aplicación y de la configuración interna de Dokploy.
- Actualización y escaneo de dependencias dentro del CI/CD.
- Logs estructurados sin contraseñas, TOTP, recovery codes, tokens, destinos afiliados completos o contenido de snapshots.

Los proxies de sitios públicos deben desactivar access logs con IP o anonimizarlos y conservarlos solamente durante el periodo mínimo de seguridad definido. Esta regla es independiente de los clicks afiliados, donde no se almacena IP bajo ninguna circunstancia.

## Privacidad y analítica

El evento permitido para un click es:

```ts
interface AffiliateClickEvent {
  eventId: string
  siteKey: string
  offerId: string
  pageId?: string
  market: string
  campaign?: string
  occurredAt: string
}
```

Quedan prohibidos en este flujo:

- IP o hash de IP.
- User-agent.
- Cookie o identificador persistente.
- Fingerprint.
- Referrer completo.
- Email, cuenta de jugador o datos proporcionados al operador.

Las conversiones se importarán como agregados o IDs de click proporcionados por la red afiliada cuando exista un contrato y especificación. No se intentará identificar al jugador. Cualquier herramienta futura de analítica, consentimiento o personalización requiere una evaluación de privacidad separada.

## Reglas de publicación globales

Toda página comercial debe:

- Identificar claramente la relación afiliada.
- Mostrar edad mínima y mensaje de riesgo aplicables.
- Enlazar recursos de juego responsable del mercado.
- Enlazar solamente destinos aprobados del casino.
- Mostrar fecha de revisión y metodología cuando incluya ranking.
- Evitar promesas de ganancia, seguridad financiera o recuperación de pérdidas.
- Evitar diseño o lenguaje dirigido a menores.

La relación comercial debe ser visible antes del primer CTA significativo. Para Canadá, el Competition Bureau señala que las conexiones materiales, incluidas comisiones, deben declararse de forma clara y prominente; un enlace o código por sí solo puede no ser suficiente. Fuente: [Influencer marketing and the Competition Act](https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/influencer-marketing-and-competition-act).

En Colombia, la SIC también recomienda que el consumidor pueda identificar cuándo está ante un mensaje comercial y conocer la relación que lo origina. Fuente: [Guía de buenas prácticas en publicidad a través de influenciadores](https://www.sic.gov.co/noticias/sic-publishes-influencer-advertising-good-practices-guide).

## Colombia

### Fuentes de referencia

- [Decreto 240 de 2026](https://www.suin-juriscol.gov.co/viewDocument.asp?id=30056195).
- [Resolución 20231000019054 de 2023](https://www.suin-juriscol.gov.co/viewDocument.asp?id=30050294) sobre publicidad de operadores autorizados.
- [Derechos y deberes de los jugadores](https://coljuegos.gov.co/publicaciones/306328/derechos-y-deberes/).
- [Toma el Control](https://tomaelcontrol.coljuegos.gov.co/) como recurso de juego responsable.

El Decreto 240 de 2026 contiene una formulación amplia: operación, servicios, contenidos, software, pagos y promoción o publicidad de juegos por Internet solo pueden realizarse por y para personas jurídicas autorizadas, y terceros deben abstenerse de apoyar operadores no autorizados. Por ello, el CMS no debe interpretar una simple presencia comercial como prueba suficiente.

### Política segura inicial

- Bloquear todo casino hasta que un administrador registre razón social, autorización vigente, fuente oficial, dominio y revisión legal de la relación afiliada.
- No permitir publicar un destino hacia un operador no autorizado o con verificación vencida.
- Identificar claramente la marca y operador promovidos.
- Mostrar `18+`, advertencia de riesgo y enlace a juego responsable.
- Prohibir claims engañosos, gratuidad equívoca y premios en efectivo presentados de forma incompatible con la norma aplicable.
- Exigir que un asesor confirme si la estructura contractual del afiliado satisface el requisito de actuar “por y para” un operador autorizado antes del lanzamiento.

El sistema implementa el bloqueo técnico; el administrador conserva evidencia de la decisión legal. Sin estado `legally_reviewed`, el sitio colombiano no puede tener una publicación comercial inicial.

## Ontario

### Fuentes de referencia

- [Directorio de operadores y sitios regulados de iGaming Ontario](https://www.igamingontario.ca/en/operator/operators).
- [Matriz de notificación de Internet Gaming](https://www.agco.ca/sites/default/files/agco_internet_gaming_notification_matrix_august_2023-ua.pdf), que incluye afiliados de marketing entre terceros proveedores reportables.
- [Informe de AGCO 2023-24](https://www.agco.ca/sites/default/files/2025-01/AGCO%20Annual%20Report%202023-24%20%28EN%29.pdf), que describe la prohibición de publicidad pública amplia de bonos, créditos e incentivos.
- [ConnexOntario](https://connexontario.ca/our-services/gambling-treatment/) para ayuda relacionada con juego problemático.

### Política segura inicial

- Aceptar únicamente operador y dominio que aparezcan en el directorio vigente de iGaming Ontario.
- Guardar fecha, URL y evidencia de la última verificación; una revisión expirada bloquea nuevas publicaciones.
- Registrar que la relación afiliada fue aprobada por el operador y evaluada como proveedor de marketing cuando corresponda.
- Configurar `publicBonusMode: blocked`: no mostrar importes, códigos, créditos, bonos ni incentivos al público.
- Permitir CTA neutro hacia el sitio aprobado sin describir el incentivo.
- Mostrar `19+`, relación afiliada y recursos de juego responsable en inglés y francés.
- No usar marcas o logos de AGCO/iGaming Ontario en el sitio editorial sin permiso expreso y revisión de sus condiciones de uso.

Los cambios futuros de la norma deben crear una nueva versión de `JurisdictionPolicy`; no se edita retroactivamente la política usada por publicaciones anteriores.

## Validaciones antes de publicar

El backend produce errores bloqueantes con código estable:

| Código | Condición |
| --- | --- |
| `POLICY_NOT_REVIEWED` | No existe política vigente con revisión legal |
| `OPERATOR_NOT_VERIFIED` | Casino sin aprobación o con verificación vencida |
| `DESTINATION_NOT_ALLOWED` | Host de oferta fuera de allowlist |
| `PUBLIC_BONUS_BLOCKED` | Contenido de Ontario intenta exponer un incentivo |
| `REQUIRED_DISCLOSURE_MISSING` | Falta disclosure afiliado, edad o juego responsable |
| `METHODOLOGY_MISSING` | Ranking sin metodología y fecha de revisión |
| `LOCALE_INCOMPLETE` | Falta texto obligatorio en el locale publicado |
| `MEDIA_NOT_DISTRIBUTABLE` | Medio sin derechos, alt o variante válida |
| `CROSS_TENANT_REFERENCE` | Relación entre tenants diferentes |

Los errores se muestran junto al campo o bloque responsable. No existe un botón de “publicar de todas formas”. Una excepción legal se implementa como una nueva política revisada, con fuente y auditoría.

## Respuesta a incidentes

- Revocar inmediatamente credenciales comprometidas por sitio.
- Suspender un casino u oferta y generar una publicación de emergencia que retire sus CTAs.
- Mantener un procedimiento para forzar sincronización de todos los sitios afectados.
- Preservar auditoría y snapshots involucrados.
- Evaluar obligaciones contractuales o regulatorias antes de comunicar externamente.
- Documentar causa, impacto, corrección y controles preventivos.
