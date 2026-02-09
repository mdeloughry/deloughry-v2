# deloughry.co.uk

Personal website with brutalist/glitch aesthetic. Astro 5 SSR with Node adapter.

## Commands

```bash
npm run dev          # Start dev server (port 4321)
npm run build        # Build (runs prisma generate first)
npm run preview      # Preview production build
npm run format       # Format with Prettier
npm run validate:recipes  # Validate .cook recipe files
```

## Architecture

```
src/
├── pages/           # Astro pages (SSR, prerender = true for static)
│   ├── api/         # Server endpoints
│   ├── playlists/   # Spotify playlist pages
│   ├── recipes/     # Cooklang recipe pages
│   └── og-image/    # Dynamic OG image generation
├── components/      # Astro/React components
├── content/post/    # MDX blog posts
├── recipes/         # .cook files (Cooklang format)
├── lib/             # Utilities (spotify, cooklang parser, auth)
├── data/models/     # Prisma data access (connects to API)
└── styles/global.css  # Design system tokens
```

## Key Patterns

- **Design System:** Brutalist/glitch aesthetic with CRT effects. CSS variables in `global.css`. Font: JetBrains Mono.
- **Colors:** Chartreuse accent (#DAFF01), cyan (#00D9FF), red (#FF4757), purple (#C7A3FF)
- **SSR Mode:** `output: "server"` with Node adapter. Use `export const prerender = true` for static pages.
- **Spotify Data:** Fetched from separate API (`deloughry-api`) at build time for playlists.
- **Recipes:** Written in Cooklang format (`.cook` files in `src/recipes/`)

## Gotchas

- Build requires `prisma generate` first (handled by npm run build)
- Playlist pages fetch from `API_URL` env var at build time
- OG images generated via Satori/resvg-js - exclude from Vite optimizeDeps
- The site is dark-only (no light mode)
