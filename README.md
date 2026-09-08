# Portfolio

A personal portfolio and blog built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, shadcn/ui (Radix), Motion and Phosphor icons.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` to enable the optional integrations:

| Variable | Used for |
| --- | --- |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | "Now playing / Last played" line in the hero (hidden when unset) |
| `UMAMI_API_URL`, `UMAMI_WEBSITE_ID`, `UMAMI_API_TOKEN` | "You're the Nth visitor" footer counter (hidden when unset) |
| `NEXT_PUBLIC_UTTERANCES_REPO`, `NEXT_PUBLIC_UTTERANCES_LABEL` | Blog comments via utterances |

## Where things live

- `src/app` — routes: `/`, `/work`, `/blog`, `/blog/[slug]` (+ `/embed` used by link hover previews), `/blog/feed.xml`, `/projects`, `/resume`, `/gears`, `/setup`, `/terminal`, `/books`, `/movies`, `/api/search`, `/api/visitors`, sitemap and robots.
- `src/components/common` — site chrome: navbar (Ctrl/⌘+K search, theme toggle with the `D` shortcut), footer, bottom fade, random quote card, toaster.
- `src/components/home` — hero (copy-email micro interaction, Spotify line), expandable experience cards with hover-revealing tech badges, link cards.
- `src/components/blog` — blog list with blur-siblings hover effect and floating thumbnail preview, post page (Instrument Serif headings, floating table-of-contents pill, share dialog, comments), MDX component set (code frames with copy, zoomable pictures, social cards, tables, todos, mermaid, excalidraw), command-palette search.
- `src/data` — all content: experiences, projects, gears, books, movies, socials and blog posts. Post metadata is in `src/data/posts/index.json`; each post body is compiled MDX (`compiledSource`) rendered by the small runtime in `src/components/blog/mdx/runtime.tsx`.

## Customising

- Site name, description, keywords and canonical URL live in `src/lib/site.ts` — start there.
- Page content is plain data in `src/data`: `experiences.tsx`, `projects.ts`, `gears.tsx`, `books.ts`, `movies.ts`, `socials.tsx`, `setup.ts`, `terminal.ts`.
- Blog posts are the entries in `src/data/posts/index.json` plus one `<slug>.json` per post.
- Swap the avatar and OG images in `public/assets` and `public/meta`.

## Notes

- Colours, radii and fonts (Hanken Grotesk body, Geist Mono code, Instrument Serif blog headings, JetBrains Mono code blocks) are defined as CSS variables in `src/app/globals.css`.
- Images are served unoptimised, so the responsive `-mobile`/`-tablet`/`.webp` variants in `public/blog` are used directly.
