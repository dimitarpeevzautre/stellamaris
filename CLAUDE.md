# CLAUDE.md

## Project Overview

Stella Maris Kennel — a bilingual (English/Bulgarian) website for a Portuguese Water Dog breeder in Sofia, Bulgaria. Built as a single-page React application deployed to GitHub Pages.

## Tech Stack

- **Language:** TypeScript (~5.8)
- **Framework:** React 19 with React Router DOM 7 (HashRouter)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (loaded via CDN)
- **Icons:** Lucide React
- **Maps:** Leaflet
- **Contact form:** Formspree

## Project Structure

```
├── components/       # Reusable UI components (Navigation, Footer, ImageCarousel, ChatWidget)
├── pages/            # Route-level page components (Home, About, OurDogs, Puppies, Contact)
├── context/          # React context providers (LanguageContext for i18n)
├── services/         # External API integrations (geminiService — currently disabled)
├── utils/            # Utility functions and data (translations)
├── public/           # Static assets (images, CNAME)
├── App.tsx           # Root component with routing
├── index.tsx         # React entry point
├── constants.ts      # Hardcoded data (dogs, litters, testimonials)
├── types.ts          # TypeScript interfaces (Dog, Litter, ChatMessage)
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

## Commands

```sh
npm install           # Install dependencies
npm run dev           # Start dev server (port 3000, host 0.0.0.0)
npm run build         # Production build to /dist
npm run preview       # Preview production build
```

There are **no test or lint commands** configured.

## Build & Deploy

- CI/CD via GitHub Actions (`.github/workflows/deploy.yml`)
- Pushes to `main` trigger build + deploy to GitHub Pages
- Build: Node.js 20 → `npm install` → `npm run build` → upload `/dist`

## Key Conventions

### Components
- Functional components typed with `React.FC`
- PascalCase filenames and component names
- camelCase for functions/variables, CONSTANT_CASE for exported constants

### Styling
- Tailwind utility classes throughout
- Custom color palette: `stella-blue` (#1e3a8a), `stella-gold` (#d4af37), `stella-cream` (#f9f7f2), `stella-sand` (#e5ddd0), `stella-dark` (#2c2c2c)
- Responsive design using Tailwind breakpoints (sm, md, lg)

### Internationalization
- Custom context-based i18n via `LanguageContext`
- Two locales: `en` (English) and `bg` (Bulgarian)
- All UI strings live in `utils/translations.ts` using dot-notation keys (e.g., `nav.home`, `home.hero_title`)
- When adding new user-facing text, add translations for both languages

### Routing
- HashRouter with five routes: `/`, `/about`, `/dogs`, `/puppies`, `/contact`

### Data
- No database — all content (dogs, litters, testimonials) is hardcoded in `constants.ts`
- Dog and litter images stored in `public/images/`

### Path Aliases
- `@/*` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`)

## Environment Variables

- `GEMINI_API_KEY` — for Gemini AI chat features (currently disabled; set in `.env.local`)

## Notes

- The `ChatWidget` component and `geminiService` are stubbed out / disabled
- Tailwind CSS and some icon libraries are loaded via CDN in `index.html`, not bundled
- No testing framework or linter is configured — run `npm run build` to verify TypeScript compilation
