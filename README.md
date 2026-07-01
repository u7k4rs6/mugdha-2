# Mugdha Digital Flagship

Next.js 15 rebuild of the Mugdha saree house site. See /docs for the product, architecture, security and frontend specs. The exported design lives in /reference as the visual source of truth, not shipped in the app.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The embedded Sanity Studio is at http://localhost:3000/studio.

## Status

Step 3 of the build: content lives in Sanity. The homepage fetches from a Sanity dataset through `/lib/data.ts`; components are unchanged from Step 2 and still only receive typed props from `/lib/types.ts`.

## Environment

Copy `.env.local.example` to `.env.local` and fill in real values. Never commit `.env.local`.

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`: read-only, safe to expose, needed by both the app and the embedded Studio.
- `SANITY_API_WRITE_TOKEN`: server only. Needed to run the migration script and for any server-side write.
- `SANITY_REVALIDATE_SECRET`: server only. The shared secret a Sanity webhook must send to `/api/revalidate`.

## First-time Sanity setup

1. `npx sanity login`, then `npx sanity init` in this repo (reuse an existing project or create one). Make sure a `development` dataset exists in addition to `production`:
   ```bash
   npx sanity dataset create development
   ```
2. Add your local and deployed URLs to CORS origins, with credentials, so the embedded Studio can talk to the API:
   ```bash
   npx sanity cors add http://localhost:3000 --credentials
   ```
3. Fill in `.env.local` (see above). Default `NEXT_PUBLIC_SANITY_DATASET` to `development` for local work.
4. Seed content from the local placeholder data:
   ```bash
   npm run migrate
   ```
   This is idempotent (safe to rerun) and prints a report of any saree whose source photo could not be fetched and needs to be resupplied.
5. Point a Sanity webhook (Settings -> API -> Webhooks) at `/api/revalidate` with the same `SANITY_REVALIDATE_SECRET`, so edits in Studio revalidate the live site. See the comment in `app/api/revalidate/route.ts` for the exact webhook configuration.
