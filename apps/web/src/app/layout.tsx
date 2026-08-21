import '@fontsource-variable/archivo/wdth.css'
import './globals.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { getSiteUrl } from '@/lib/snapshot'

const metadataBase = getSiteUrl()

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Juego Claro',
    template: '%s | Juego Claro',
  },
  description: 'Directorio editorial multi-mercado para comparar información de casinos online.',
  applicationName: 'Juego Claro',
  category: 'Editorial directory',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#011535',
}

const designContract = `
THESIS: A familiar comparison portal makes evidence and the directory—not casino spectacle—the first task.
OWN-WORLD: White and ivory surfaces, #011535 navy, #fd6f27 orange, Archivo typography, crisp rules, modest shadows.
STORY: The visitor sees the market context, scans demonstrative records, understands review status, then opens a record or external destination.
FIRST VIEWPORT: Conventional white header, compact navy intro, and a wide white directory panel overlapping the field with three horizontal rows.
FORM: Canonical comparison portal, approved option C, seed 4d95ba9c.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
`.trim()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO">
      <body>
        {/* Direction contract 4d95ba9c — mirrored into emitted markup below. */}
        <template
          data-design-contract="4d95ba9c"
          dangerouslySetInnerHTML={{ __html: `<!-- ${designContract} -->` }}
        />
        <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
        <div id="contenido-principal">{children}</div>
      </body>
    </html>
  )
}
