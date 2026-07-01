# Mugdha Digital Flagship, Security and Access

Version 1.0.

## 1. Secrets and environment
- All secrets live in Vercel environment variables and .env.local, never in the client bundle or the repo.
- Sanity read uses a public project id and dataset (read-only, safe to expose). Any Sanity write token is server-only, used only in build or serverless routes, never shipped to the browser.
- The Google Maps or Mapbox key is restricted by HTTP referrer to the Mugdha domains, so a leaked key cannot be abused elsewhere.
- The WhatsApp number is intentionally public, since it is a link target. It still lives in siteSettings so it is changed in one place, not hardcoded.
- Scrub the exported HTML before committing: remove the placeholder 919999999999 and any test keys so nothing sensitive lands in git history.

## 2. Access control (team scale)
- Sanity Studio uses role-based access. Mugdha content editors get the editor role: add and edit catalogue, stores, and content, with no code and no project settings.
- Deploy and env access (Vercel, Sanity admin) is limited to the owner and named developers.
- Use the development Sanity dataset for testing, so editors and tests never mutate production content.

## 3. Data and privacy
- Commerce runs on WhatsApp, so no payment data touches the site. This keeps the site out of PCI scope, a deliberate security win for v1.
- The only personal data collected is the newsletter email. Store it in a dedicated provider or a protected Sanity dataset, with a clear consent line at the form and a way to unsubscribe.
- No user accounts in v1, so no credentials to protect.

## 4. Application hardening
- HTTPS everywhere (Vercel default), HSTS on.
- Content Security Policy: allow only the needed origins (self, Sanity CDN, Maps, analytics). Avoid inline script beyond what is required, and nonce the rest.
- The next.config image domains allowlist is limited to the Sanity CDN and any approved sources, so the image component cannot be pointed at arbitrary hosts.
- Basic rate limiting or a simple bot check on the newsletter and any form endpoint, to prevent spam.
- Keep dependencies current, enable Dependabot or equivalent, and review before merge.

## 5. Operational
- The Sanity revalidation webhook is authenticated with a shared secret, so only real content changes can trigger a rebuild.
- Backups: Sanity retains content history and supports dataset export. Schedule periodic exports.
- Least privilege on every token and every human account.
