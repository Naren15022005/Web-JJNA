# ARIS Systems — Sitio Web

Sitio web corporativo de **ARIS Systems**, estudio de desarrollo de software a
medida. Una sola página (one-page) con secciones de servicios, tecnologías,
proyectos, equipo y contacto.

## 🧱 Stack

Construido con tecnología web moderna, **sin frameworks de UI**:

- **HTML5** semántico.
- **CSS moderno** — variables (custom properties), Grid/Flexbox, `clamp()`,
  `backdrop-filter`, animaciones y media queries responsive.
- **JavaScript vanilla** organizado en **ES Modules** (sin librerías).
- **[Vite](https://vitejs.dev/)** como envoltura de desarrollo y bundler
  (dev server con HMR + build optimizado). No hay framework ni Tailwind.
- **Vercel** para el despliegue.
- **Font Awesome** y **Google Fonts** (Space Grotesk + Inter) vía CDN.

## 🚀 Puesta en marcha

Requisitos: **Node.js 18+** (probado en Node 24).

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Build de producción → carpeta dist/
npm run build

# 4. Previsualizar el build de producción
npm run preview
```

> ℹ️ Como el JavaScript usa ES Modules, el sitio debe servirse por HTTP
> (`npm run dev`). Abrir `index.html` directamente con `file://` no funciona
> porque el navegador bloquea los módulos por seguridad (CORS).

## 📁 Estructura

```
Web-JJNA/
├── index.html             # Entrada / marcado de la página
├── vite.config.js         # Configuración de Vite
├── vercel.json            # Configuración de despliegue en Vercel
├── package.json
└── src/
    ├── css/
    │   └── jjna.css        # Estilos (sistema de diseño + componentes)
    ├── img/                # Logo e imágenes de proyectos
    └── js/
        ├── main.js         # Punto de entrada: arranca los módulos
        └── modules/
            ├── navigation.js   # Menú móvil, scroll suave, nav activa
            ├── whatsapp.js     # Botones de contacto por WhatsApp
            ├── animations.js   # Reveal on scroll + optimizaciones táctiles
            ├── modals.js       # Modales de servicios y proyectos
            ├── carousel.js     # Carrusel de proyectos (flechas + dots + autoplay)
            └── focus-trap.js   # Utilidad de accesibilidad para los modales
```

Cada módulo expone una función `init…()` y `main.js` los inicializa cuando el
DOM está listo.

## 🎨 Sistema de diseño

La paleta y los tokens viven como variables CSS en `:root` (ver `src/css/jjna.css`):

```css
:root {
    --bg-primary:   #1A1A1A;  /* Jet Black  */
    --bg-secondary: #222526;  /* Onyx       */
    --bg-card:      #353A3E;  /* Graphite   */
    --accent-primary:  #E0E0E0; /* Platinum */
    --accent-secondary:#BFBFBF; /* Ash      */
    /* …más tokens (radios, sombras, transiciones, helpers RGB) */
}
```

## ☁️ Despliegue en Vercel

El proyecto está listo para Vercel (preset *Vite* autodetectado). La
configuración explícita está en `vercel.json`:

- **Build command:** `npm run build`
- **Output directory:** `dist`

Cada *push* a la rama principal genera un despliegue automático.

## ♿ Accesibilidad

- Navegación por teclado y focos visibles (`:focus-visible`).
- Focus trap en los modales y cierre con `Escape`.
- Etiquetas ARIA y textos alternativos en imágenes.
- Respeta `prefers-reduced-motion` y `prefers-contrast`.
