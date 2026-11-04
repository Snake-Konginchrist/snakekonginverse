# Snake Konginverse

The personal website of Snake Konginchrist (斯黄), featuring products, research, novels, creative work, and personal notes. It also serves as a customizable multilingual personal website template.

[English](README.md) | [简体中文](README.zh-CN.md)

**[Live website](https://snakekongin.com) · [Customization](docs/CUSTOMIZATION.md) · [Development](DEVELOPMENT.md) · [Changelog](CHANGELOG.md)**

The detailed guides linked below are currently written in Chinese.

## Features

- **Personal website**: home, practice, inquiry, creations, journal, and about pages, with project showcases, social links, and contact information.
- **Content management**: a Payload CMS dashboard for projects, articles, composable pages, drafts, authenticated previews, and version history.
- **Novel reader**: a bookshelf with covers, book directories, chapter navigation, Markdown, GFM tables, and LaTeX formulas. Import chapters in bulk from local Markdown files.
- **Ten languages**: English by default, automatic browser language detection, and a persistent manual language selection. Authors maintain content translations; novels retain their original language.
- **Reading experience**: responsive layouts, light and dark themes, keyboard focus indicators, and a skip-to-content link.
- **Self-hosting**: PostgreSQL, Cloudflare R2, and deployment with Node.js, systemd, and Nginx. Optional GitHub Actions deployment is included.
- **Optional analytics**: Microsoft Clarity and Google Analytics 4, loaded only when configured.

Site search, comments, public registration, automatic URL redirects, and email delivery are not currently included. Without an email adapter, password reset emails are written to the server logs rather than delivered.

## Tech stack

Next.js 16.4.5, React 19.3, TypeScript 7, Tailwind CSS 4.3, Payload CMS 3.93.0, Lexical, PostgreSQL, and Cloudflare R2. Development tools include pnpm, Oxlint, Prettier, and Playwright.

`package.json` and `pnpm-lock.yaml` define the dependency versions. GraphQL stays on the Payload-compatible 16.x release line.

## Quick start

### Requirements

- Node.js `^22.23.4 || >=24.22.1`.
- pnpm `12.9.1`.
- A PostgreSQL database and a database user with permission to create tables.
- A Cloudflare R2 bucket with object read/write credentials scoped to that bucket. Local development also requires R2 configuration.

### Install and configure

```bash
git clone https://github.com/Snake-Konginchrist/snakekonginverse.git
cd snakekonginverse
pnpm install --frozen-lockfile
cp .env.example .env
```

Create a PostgreSQL database, for example with `createdb snakekonginverse_db`, and set the actual database user, password, and database name in `.env`. You can choose your own database and user names. URL-encode special characters in passwords.

| Variable                                                               | Purpose                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL`                                                         | PostgreSQL connection URL                                                            |
| `PAYLOAD_SECRET`                                                       | CMS secret; generate one with `openssl rand -hex 32`                                 |
| `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Media storage; see [R2 configuration](docs/R2_STORAGE.md)                            |
| `APP_HOST`, `APP_PORT`                                                 | Local bind address and port; the example uses `127.0.0.1:3000`                       |
| `NEXT_PUBLIC_SITE_URL`                                                 | Website URL: `http://localhost:3000` locally, or your own HTTPS domain in production |
| `CLARITY_PROJECT_ID`, `GA4_MEASUREMENT_ID`                             | Optional analytics identifiers                                                       |

Preserve existing environment settings when updating an installation. Never commit a real `.env` file.

### Initialize and run

```bash
pnpm r2:check
pnpm cms:types
pnpm cms:importmap
pnpm db:migrate
pnpm seed
pnpm dev
```

Open the [website](http://localhost:3000) or the [admin dashboard](http://localhost:3000/admin). Create your administrator account on the first dashboard visit, before exposing the site publicly.

`pnpm seed` adds initial pages and site settings without creating administrators or sample projects. Repeated runs preserve edited content. The home and about pages use brand layouts maintained in code; see the [customization guide](docs/CUSTOMIZATION.md) to adapt them.

Both development and production use versioned migrations by default. Schema push is enabled only when `PAYLOAD_DB_PUSH=true` is explicitly set; use this option only with a disposable development database.

## Usage and customization

Manage projects, articles, custom pages, media, novels, and chapters in the dashboard. Custom pages can use paths such as `/lab/notes`; built-in sections and management routes are reserved. Public visitors can read published content only, and draft previews require an administrator session.

To reuse the template, replace the brand, personal information, social accounts, text in all ten languages, and images, then configure your own database, R2 bucket, and domain. The repository contains the author's personal website content; installation does not automatically replace it with your information.

- [Customization](docs/CUSTOMIZATION.md): where to edit branding, text, pages, images, and settings.
- [Novel import](docs/NOVELS.md): one Markdown file per chapter, a persistent manifest, and bulk import.
- [Development and debugging](DEVELOPMENT.md): local execution, database migrations, and troubleshooting.
- [Contributing](CONTRIBUTING.md): change scope, generated files, and verification requirements.

## Common commands

```bash
pnpm dev             # Development server; stop with Ctrl+C
pnpm check           # Lint, types, unit tests, and handwritten file length checks
pnpm format:check    # Formatting checks
pnpm build           # Production build
pnpm start           # Run the production build after configuration and migrations
```

Browser tests require a running website:

```bash
pnpm exec playwright install chromium
TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e
TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:cms
pnpm test:novels
```

CMS and novel integration checks create temporary database records and R2 objects, then clean them up. Run them in a dedicated development environment.

## Deployment and maintenance

- [Ubuntu deployment](docs/DEPLOYMENT.md)
- [GitHub Actions deployment](docs/AUTO_DEPLOYMENT.md)
- [Cloudflare R2](docs/R2_STORAGE.md)
- [Clarity and GA4](docs/ANALYTICS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Object storage allowance reference](docs/OBJECT_STORAGE.md): figures retain their original research date; check providers for current allowances.

Adapt the example domains, paths, accounts, and bucket names to your environment. Media is persisted in R2; back up the database, media, and environment files together.

`patches/payload@3.93.0.patch` fixes REST requests that omit a locale not receiving the default locale when content fallback is disabled. `pnpm install` applies it automatically. Verify the related regression checks when upgrading Payload before removing the patch.

## Support

If this project is useful to you, consider supporting its development and creative work through [Ko-fi](https://ko-fi.com/snake_konginchrist) or [Buy Me a Coffee](https://www.buymeacoffee.com/snakekongin).

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=Snake-Konginchrist/snakekonginverse&type=Date)](https://www.star-history.com/#Snake-Konginchrist/snakekonginverse&Date)

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE) (`GPL-3.0-only`).

Copyright (C) 2026 Snake Konginchrist.

Third-party dependencies and assets remain subject to their respective licenses and notices.
