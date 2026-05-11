# Chainwright Docs

Astro Starlight site for the `chainwright` npm package. Managed with [Bun](https://bun.sh).

## Develop

```bash
cd docs
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## Structure

- `src/content/docs/` — markdown/MDX pages organised by section
- `src/content.config.ts` — Starlight docs collection (required by Astro 5 content layer)
- `src/assets/` — logos referenced from `astro.config.mjs`
- `src/styles/custom.css` — theme overrides (amber accent)
- `public/` — favicons and static assets served at site root
