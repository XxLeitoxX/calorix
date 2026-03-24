# Calorix

Calorix es una aplicación web SPA para calcular calorías y macronutrientes en tiempo real.  
Permite buscar alimentos, agregarlos al calculador, ajustar cantidades y visualizar resumen nutricional con una experiencia mobile-first.

Además incluye una capa SEO escalable con páginas dinámicas de alimentos y páginas de keywords long-tail para captar tráfico orgánico.

---

## Descripción funcional

- Búsqueda de alimentos usando USDA FoodData Central.
- Cálculo en tiempo real de:
  - Calorías
  - Proteínas
  - Carbohidratos
  - Grasas
- Selector de idioma EN / ES.
- Compartir plan por URL.
- Páginas SEO dinámicas:
  - `/food/:slug`
  - `/:slug` (keywords long-tail)
- Páginas legales:
  - `/privacy`
  - `/disclaimer`
  - `/cookies`

---

## Arquitectura del proyecto

La arquitectura está separada por responsabilidades:

- `src/components/`
  - Componentes de UI reutilizables.
  - Incluye `ui/` con primitives estilo shadcn (`Button`, `Card`, `Input`, `Progress`).
- `src/context/`
  - Estado global del calculador (`CalorieContext`).
- `src/hooks/`
  - Lógica reutilizable: búsqueda, debounce, animaciones, SEO meta.
- `src/pages/`
  - Vistas de ruta: Home, FoodPage, SEOPage, páginas legales.
- `src/services/`
  - Integración con API USDA.
- `src/data/`
  - Catálogo SEO de alimentos y estructuras auxiliares.
- `src/utils/`
  - Utilidades de formateo y motor de keywords SEO.
- `scripts/`
  - Generación de `sitemap.xml` y `robots.txt` en build.

---

## Lenguaje y tecnologías usadas

- **Lenguaje principal:** JavaScript (ES Modules)
- **Framework UI:** React 19
- **Build tool:** Vite
- **Routing:** React Router DOM
- **Estilos:** Tailwind CSS
- **Componentes UI base:**
  - Radix UI (`@radix-ui/react-slot`, `@radix-ui/react-progress`)
  - class-variance-authority
  - clsx + tailwind-merge
- **Iconografía:** lucide-react

---

## Librerías principales

- `react`
- `react-dom`
- `react-router-dom`
- `tailwindcss`
- `tailwindcss-animate`
- `@radix-ui/react-progress`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

---

## SEO técnico implementado

- Meta title y description dinámicos por página.
- JSON-LD básico en Home, FoodPage y SEOPage.
- Generación automática de:
  - `public/sitemap.xml`
  - `public/robots.txt`
- Enlazado interno entre páginas de alimentos y keywords.
- Soporte multilenguaje EN / ES.

---

## Configuración del entorno

1. Copia `.env.example` a `.env`.
2. Define tu API key USDA:

```env
VITE_USDA_API_KEY=tu_api_key_aqui
```

---

## Scripts disponibles

- `npm run dev` — entorno de desarrollo
- `npm run lint` — análisis estático con ESLint
- `npm run build` — build de producción (incluye `prebuild` para SEO files)
- `npm run preview` — previsualización del build

---

## Branding

- Marca: **Calorix**
- Estilo: fitness + SaaS minimalista
- Paleta:
  - Primario: `#22c55e` / `#16a34a`
  - Acento: `#3b82f6`
  - Fondo: `#f8fafc`
  - Texto: `#0f172a`

Logo actual: `src/assets/img/logo/logo.png` (configurable en `src/config/branding.js`).
