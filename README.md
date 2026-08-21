# Casino Content Platform

Monorepo para un CMS editorial multi-sitio y frontends públicos por mercado. El primer vertical slice incluye el panel Payload y una landing colombiana demostrativa con el diseño clásico **opción C**. El frontend usa Tailwind CSS 4 para tokens y utilidades, con componentes shadcn locales y modificables dentro del repositorio.

## Requisitos

- Node.js 24.15 o superior.
- pnpm 11.9 o superior.
- Docker con Compose para PostgreSQL local.

## Desarrollo de la landing

```bash
pnpm install
pnpm dev:web
```

Abre `http://localhost:3000/es`. También están disponibles las fichas en `/es/casinos/:slug` y las redirecciones locales en `/go/:offerSlug`.

El contenido inicial vive en `apps/web/src/data/colombia.snapshot.json`, está marcado como ficticio y se puede editar manualmente. No se necesita una API key de IA.

Payload almacena contenido estructurado y variantes controladas. El HTML semántico, las clases Tailwind y los componentes visuales permanecen en `apps/web`; no se guardan estilos arbitrarios en el CMS.

Variables opcionales:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_INDEXABLE=false
SNAPSHOT_PATH=
```

`SITE_INDEXABLE` permanece desactivado por defecto para evitar indexar datos de demostración.

## Panel editorial

El CMS se ejecuta en el puerto 3001:

```bash
pnpm infra:up
pnpm dev:cms
```

`infra:up` levanta una instancia PostgreSQL propia del proyecto en el puerto `5433`. Se usa ese puerto para evitar colisiones con instalaciones de PostgreSQL existentes en el puerto estándar `5432`. El volumen persiste aunque se ejecute `pnpm infra:down`.

MinIO/S3 es opcional en local; solo se habilita cuando existe `S3_BUCKET`.

Variables principales:

```dotenv
DATABASE_URL=postgres://casino:casino@127.0.0.1:5433/casino_cms
PAYLOAD_SECRET=replace-with-a-long-random-secret
CMS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Copia `apps/control-plane/.env.example` como `.env.local` cuando prepares otro entorno. Este repositorio ya incluye una configuración local ignorada por Git; los secretos reales de producción no deben reutilizar esos valores.

### Editar y previsualizar Colombia

Levanta infraestructura, CMS y frontend en terminales separadas:

```bash
pnpm infra:up
pnpm dev:cms
pnpm dev:web
```

Después ejecuta una sola vez el importador idempotente:

```bash
pnpm seed
```

Entra en `http://localhost:3001/admin`, crea el primer usuario y abre **Contenido → Páginas → Casinos online en Colombia**. El botón **Live Preview** muestra la landing y actualiza el iframe cuando Payload guarda automáticamente el borrador.

En desarrollo, `http://localhost:3000/es` intenta leer la publicación directamente desde Payload y conserva el último snapshot local si el CMS no está disponible. Para guardar explícitamente una copia local de la publicación actual:

```bash
pnpm sync:colombia
```

## Validación

```bash
pnpm typecheck
pnpm lint
pnpm build
```

El frontend genera estáticamente la portada y las fichas, mientras `/go/:offerSlug` se resuelve en el servidor desde el snapshot local.
