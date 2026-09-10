# Maintainable records database

FonioFlow keeps slow-changing official statistics in validated JSON snapshots. Records that require regular human maintenance belong in PostgreSQL using `database/schema.sql`.

## Database-owned records

- suppliers and retailers;
- seller verification history and availability status;
- delivery coverage;
- wholesale inquiries and response completeness;
- consented user-submitted demand;
- source-review history.

Verification events are append-only. Updating a seller does not erase its previous verification. The application should publish only records whose latest review status is approved, while the source-review table preserves the audit trail.

## Provisioning

1. Create a PostgreSQL database in Vercel Storage, Neon, or Supabase.
2. Run `database/schema.sql` in the provider SQL console.
3. Add `DATABASE_URL` as a secret environment variable in Vercel.
4. Generate a long random `ADMIN_API_TOKEN`, add it as a sensitive Vercel variable, and never expose it in browser code.
5. Add the Neon connection string to a local `.env.local` file and run `npm run db:seed` once.
6. Keep the committed H5 JSON as the demonstration fallback.

## Initial H5 import

Because the production connection is sensitive, obtain the pooled connection string from **Neon → Connect**. Create `.env.local` in the project root with this one line (using the real value only on your computer):

```text
DATABASE_URL=postgresql://...
```

Then run:

```bash
npm run db:seed
```

`.env.local` is excluded by `.gitignore`; verify that `git status` never lists it before pushing.

Generate the administrator token locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the generated value as the sensitive `ADMIN_API_TOKEN` environment variable in Vercel Production and Preview. Do not use a `NEXT_PUBLIC_` prefix.

The import is idempotent: it updates the 25 seller identities without duplicating the original verification or source-review events. Only the 15 verified `publish_with_caveat` records receive `approved` publication status.

## Runtime behavior

- `GET /api/sellers` reads approved database records.
- If PostgreSQL is unavailable, it returns the 15 validated H5 snapshot records and a fallback warning.
- `POST /api/demand-submissions` is public, schema validated and rate limited.
- `GET /api/demand-submissions`, `/api/verifications`, and `/api/wholesale-inquiries` administrative operations require `Authorization: Bearer <ADMIN_API_TOKEN>`.
- Database responses and administrative responses use `Cache-Control: no-store` where appropriate.

No database password or connection URL belongs in Git.
