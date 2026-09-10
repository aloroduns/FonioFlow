# FonioFlow data API

## Stable application endpoints

| Endpoint | External provider | Default fallback |
|---|---|---|
| `GET /api/production` | FAOSTAT QCL | `h1-production.json` |
| `GET /api/processing` | Curated research | `h2-processing.json` |
| `GET /api/routes` | Curated trade and road evidence | `h3-routes.json` |
| `GET /api/prices` | Curated price observations | `h4-prices.json` |
| `GET /api/sellers` | Verified seller research | `h5-sellers.json` |
| `GET /api/trade-availability` | FAOSTAT, UN Comtrade and World Bank | `h6-demand.json` |
| `GET /api/survey` | Aggregated exploratory survey | `h6-demand.json` |

## Response contract

Successful endpoints return `{ data, meta }`. `meta` contains `status`, `source`, `sourceTimestamp`, `retrievedAt`, `recordCount`, `missingDataCount` and `warnings`. An empty filtered result is a valid HTTP 200 response with `data: []`. An invalid year returns HTTP 400.

| Endpoint | Optional query parameters |
|---|---|
| `/api/production` | `country`, `year` |
| `/api/processing` | `country` |
| `/api/routes` | `origin`, `destination` |
| `/api/prices` | `grain` |
| `/api/sellers` | `q`, `market` |
| `/api/trade-availability` | `country`, `year` |
| `/api/survey` | `measure` |

## Maintained-record endpoints

| Endpoint | Method | Access | Purpose |
|---|---|---|---|
| `/api/sellers` | GET | Public | Search approved database sellers; H5 snapshot fallback |
| `/api/verifications` | POST | Administrator | Append a seller verification event |
| `/api/wholesale-inquiries` | GET, POST | Administrator | Review or append standardized supplier inquiries |
| `/api/demand-submissions` | POST | Public | Record consented, non-identifying demand evidence |
| `/api/demand-submissions` | GET | Administrator | Review recent demand submissions |

Administrative requests must send `Authorization: Bearer <ADMIN_API_TOKEN>`. Write bodies are strictly validated with Zod; unknown fields are rejected. Public demand writes are limited to five requests per source address per minute. Never embed the administrator token in a client component or `NEXT_PUBLIC_` variable.

The UI and future clients should call these FonioFlow endpoints rather than provider URLs. This keeps provider response formats, keys and failures out of interface components.

## Provider mode

`DATA_PROVIDER=static` is the safe competition default. It serves reviewed snapshots deterministically.

`DATA_PROVIDER=live` enables external refreshes where connectors exist. Live production requests require a country or year filter. Live trade-and-availability requests require both a supported country and year. Other endpoints continue serving curated snapshots because no reliable public live provider covers them.

## Reliability behavior

1. Fetch with an abort timeout.
2. Normalize provider fields to FonioFlow contracts.
3. Validate the normalized response with Zod.
4. Save a short-lived in-memory copy after successful validation.
5. Return the valid cache when a subsequent provider request fails.
6. Return the reviewed static snapshot if no valid cache exists.

The `meta.status` field is always one of `live`, `cached` or `static`. Warnings explain provider failures and fallback use. Missing values remain `null`; they are not silently presented as observed zeroes.

## Availability calculation

```text
estimated domestic availability tonnes = production + imports - exports
availability kg per person = estimated domestic availability tonnes × 1,000 / population
```

If an import or export flow is absent, the calculation uses zero only as an explicit operational assumption and records a missing-data warning.

## Vercel environment variables

Copy the keys from `.env.example` into Vercel Project Settings. Keep API keys secret. The World Bank connector requires no key. UN Comtrade can use its public preview endpoint but an approved subscription key provides more dependable limits. FAOSTAT base URL and key remain configurable so the connector can track provider portal changes without altering the application contract.
