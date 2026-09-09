# Live API roadmap

## Competition mode

The application currently uses dated JSON snapshots generated from the validated workbooks. This is the default because it is reproducible and does not depend on third-party uptime during judging.

## Provider boundary

Screens obtain data through `lib/data.ts`. Future integrations should update this layer or add server-side provider modules; screens should not call external services directly.

## Recommended order after the competition

1. **Database API** — store cleaned snapshots, source metadata, access dates and verification states in PostgreSQL or another managed database.
2. **FAOSTAT provider** — refresh production, harvested area and yield on a scheduled job.
3. **UN Comtrade provider** — refresh HS 100840 trade records and retain the raw response plus query parameters.
4. **Supplier administration workflow** — verified sellers submit or update records; a reviewer approves them before publication.
5. **Retailer integrations** — add only where an official API or authorized feed exists. Do not scrape unstable retail pages as the main production pipeline.

## Server-side pattern

```text
External API
    → server-side connector
    → raw response archive
    → validation and normalization
    → database/snapshot
    → shared data repository
    → React screen
```

API keys belong in hosted environment variables and `.env.local`, never in Git. Add caching, retry limits, rate-limit handling, source timestamps and a fallback to the last valid snapshot before enabling a live provider in the public application.

## Suggested endpoints

- `GET /api/production?year=2024&country=Guinea`
- `GET /api/processors?country=Senegal`
- `GET /api/routes?origin=Mali&destination=France`
- `GET /api/prices?grain=Fonio`
- `GET /api/sellers?market=United%20Kingdom`
- `GET /api/availability?country=Guinea&year=2024`

These are FonioFlow-owned endpoints. They shield the interface from changes in external response formats.
