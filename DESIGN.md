---
name: Juego Claro
description: Directorio editorial multi-mercado con una comparación clara, verificable y responsable.
colors:
  primary-navy: "#011535"
  primary-orange: "#fd6f27"
  link-blue: "#125df5"
  status-green: "#16833b"
  paper: "#fbfaf9"
  surface: "#ffffff"
  ink: "#000016"
  muted: "#566174"
  rule: "#dce1e8"
  rule-strong: "#c6ced9"
  focus: "#0a62ff"
typography:
  display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(2.5rem, 3vw, 3rem)"
    fontWeight: 860
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(1.35rem, 2vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.25
rounded:
  control: "8px"
  record: "11px"
  panel: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  lg: "28px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.primary-orange}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.link-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  directory-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px 28px 18px"
  directory-record:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.record}"
    padding: "15px 18px"
---

# Design System: Juego Claro

## Overview

**Creative North Star: "El portal editorial claro"**

Juego Claro adopta la familiaridad de un directorio clásico y la disciplina de una publicación editorial. La interfaz es sobria, densa y orientada a tareas: primero ubica al visitante en su mercado, luego presenta registros comparables y finalmente explica fuentes, método y contexto regulatorio.

La personalidad nace del contraste entre una banda azul marino compacta, superficies blancas e ivory y un acento naranja reservado para acciones primarias. No se emplea imaginería de casino, espectáculo visual ni señales de confianza inventadas; la información y su trazabilidad son el material principal.

Los tokens se exponen mediante Tailwind CSS 4 y los primitives reutilizables siguen el modelo de shadcn: código local, tipado y adaptable, no una dependencia visual cerrada. El CSS específico se conserva para composiciones propias como el directorio y su reflujo responsive.

**Key Characteristics:**

- Cabecera convencional, estable y fácil de escanear.
- Tipografía Archivo condensada y pesada en títulos, regular en lectura prolongada.
- Reglas nítidas, profundidad ambiental moderada y datos alineados.
- Azul para navegación, naranja para la salida principal y verde solo para estados.
- Un único código visual adaptable a múltiples mercados e idiomas.

## Colors

La paleta combina una base editorial fría con un acento comercial controlado.

### Primary

- **Azul tinta institucional:** campo de introducción, pie de página, marcas y numeración.
- **Naranja de decisión:** acción primaria y la segunda parte del wordmark; su escasez mantiene la jerarquía.

### Secondary

- **Azul de enlace:** vínculos, contornos de acciones secundarias e iconos informativos.
- **Verde de estado:** únicamente para estados editoriales positivos o vigentes.

### Neutral

- **Papel marfil:** fondo continuo de la lectura.
- **Superficie blanca:** directorio, fichas y controles.
- **Tinta casi negra:** texto de máxima jerarquía.
- **Gris editorial:** texto secundario y metadatos.
- **Reglas frías:** bordes y divisores que organizan datos sin competir con ellos.

**The Scarce Orange Rule.** El naranja identifica la acción principal; no se convierte en color de fondo decorativo ni en un indicador genérico.

**The Evidence Color Rule.** El verde comunica estado, nunca reputación, puntuación o recomendación.

## Typography

**Display Font:** Archivo Variable (con fallback sans-serif)  
**Body Font:** Archivo Variable (con fallback sans-serif)

**Character:** una sola familia variable produce una voz coherente. Los títulos usan ancho condensado, peso alto y espaciado deliberado; el cuerpo recupera proporción regular para leer fuentes, condiciones y advertencias sin fatiga.

### Hierarchy

- **Display:** reservado al único encabezado principal de una página.
- **Headline:** títulos de directorio y secciones editoriales.
- **Title:** nombres de registros, subtítulos de tarjetas y títulos de detalle.
- **Body:** contenido descriptivo; las líneas extensas se mantienen dentro de una medida cómoda.
- **Label:** metadatos, botones, selectores y avisos compactos; las fechas y códigos usan numerales tabulares.

**The One Display Rule.** Cada página tiene un solo momento tipográfico de escala display; el resto de la jerarquía desciende con claridad.

## Layout

El contenido usa un contenedor máximo de 1328 px con márgenes laterales fluidos. En escritorio, la banda introductoria termina detrás del directorio: el panel blanco se superpone 54 px para conectar contexto y tarea. Los registros se distribuyen en marca, resumen, metadatos y acciones; las secciones editoriales posteriores usan una relación aproximada de dos tercios y un tercio.

En anchos intermedios, los registros pasan a dos columnas y los metadatos ocupan una fila completa. A 680 px, cabecera, contenido y pie reducen sus márgenes a 14 px por lado; cada registro se apila, los metadatos se convierten en pares etiqueta/valor y las acciones conservan dos columnas de igual peso. La lectura y el orden DOM no cambian entre breakpoints.

## Elevation & Depth

La profundidad es ambiental, no ornamental. El panel principal recibe una sombra amplia y tenue; cada registro tiene una sombra más corta. El hover eleva apenas los registros y botones únicamente en dispositivos que realmente soportan hover.

### Shadow Vocabulary

- **Panel ambiental:** separa el directorio de la banda azul y del papel.
- **Registro bajo:** mantiene cada ficha individual sin convertir el listado en una cuadrícula flotante.

**The Flat Content Rule.** Las secciones editoriales permanecen casi planas; la mayor profundidad pertenece al directorio, porque representa la tarea principal.

## Shapes

Los controles usan esquinas suavemente curvas; registros y paneles aumentan el radio solo unos pocos píxeles. Las píldoras quedan restringidas a pequeños avisos de estado o desarrollo. Los bordes son de un píxel y las siluetas permanecen rectangulares, sin recortes decorativos.

## Components

### Buttons

- **Shape:** control compacto con radio moderado y altura táctil consistente.
- **Primary:** naranja, texto oscuro y una sombra breve; se reserva para continuar hacia el destino.
- **Secondary:** superficie blanca, contorno azul y texto azul; abre la ficha interna.
- **Hover / Focus:** desplazamiento vertical mínimo en hover y anillo azul de 3 px en `focus-visible`.

### Cards / Containers

- **Corner Style:** radio de panel para agrupaciones y radio ligeramente menor para registros.
- **Background:** superficie blanca sobre papel marfil.
- **Shadow Strategy:** profundidad ambiental solo en el panel principal y los registros interactivos.
- **Border:** reglas frías de un píxel.
- **Internal Padding:** aumenta de control a registro y de registro a panel.

### Inputs / Fields

- **Style:** superficie blanca, regla fuerte y radio de control.
- **Focus:** comparte el anillo visible de enlaces y botones.
- **Disabled:** conserva la estructura, reduce opacidad y elimina expectativa de interacción.

### Navigation

La navegación de escritorio centra enlaces de texto y separa el selector de locale. En móvil se reemplaza por un control nativo `details/summary`, accesible con teclado y sin depender de JavaScript para abrirse.

### Directorio editorial

Es el componente distintivo: una lista de artículos comparables, no una tabla visual rígida. Cada fila conserva nombre, resumen, documento, estado, fecha y dos acciones; en móvil esos mismos datos cambian de disposición sin cambiar de significado.

## Do's and Don'ts

### Do:

- **Do** mantener el listado y su contexto de mercado dentro del primer viewport de escritorio.
- **Do** usar SVG semánticos y discretos para acciones y metadatos.
- **Do** mostrar fuente, fecha de revisión y naturaleza demostrativa donde correspondan.
- **Do** respetar `prefers-reduced-motion` y limitar la animación al ingreso del panel y feedback corto.

### Don't:

- **Don't** introducir gradientes, efectos de casino, fondos fotográficos o texturas que compitan con la información.
- **Don't** usar estrellas, trofeos, testimonios o sellos visuales para insinuar reputación no demostrada.
- **Don't** convertir cada bloque en una tarjeta flotante; la jerarquía depende de que el directorio sea la superficie dominante.
- **Don't** usar texto oculto, páginas por variación de consulta ni recursos visuales como sustituto de evidencia editorial.
