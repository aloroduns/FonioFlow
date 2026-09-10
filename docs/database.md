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
4. Keep the committed H5 JSON as the demonstration fallback until database endpoints are enabled and tested.

No database password or connection URL belongs in Git.
