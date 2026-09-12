# FonioFlow

FonioFlow is a seven-screen evidence explorer for testing six hypotheses about fonio market access.

## Application structure

- `app/` — Next.js entry point, metadata and global theme
- `components/fonioflow/` — one reusable screen component per hypothesis
- `components/ui/` — accessible interface primitives
- `data/generated/` — versioned JSON contracts used by the application
- `database/schema.sql` — PostgreSQL schema for records requiring maintenance
- `lib/` — shared types, formatting and data access
- `scripts/export_data.py` — workbook-to-JSON pipeline
- `tests/` — fast data-contract checks
- `docs/` — architecture and methodology notes

## Rebuild the data

Run `python scripts/export_data.py` after updating an approved H1–H6 workbook. Review the generated changes before committing them.

For a new Google Forms survey export, run `python scripts/process_survey.py INPUT.csv OUTPUT.json --merge-app-json data/generated/h6-demand.json`, review the audit block, then replace `data/generated/h6-demand.json` with the approved output. The survey processor retains missing values and records duplication indicators.

## Validate

Run `npm test` to build the application and check the data contracts. Follow `docs/testing.md` for the browser and failure-mode release matrix.

## Deploy to Vercel

Push the repository to GitHub, import it from the Vercel dashboard and keep the detected framework preset as **Next.js**. Vercel will run `npm run build` automatically. No application environment variables are required for the current snapshot-based MVP.

## Internal API

The application exposes normalized JSON endpoints:

- `/api/production?country=Guinea&year=2024`
- `/api/processing?country=Mali`
- `/api/routes?origin=Guinea&destination=France`
- `/api/prices?grain=Fonio`
- `/api/sellers?q=flour&market=France`
- `/api/trade-availability?country=Guinea&year=2024`
- `/api/survey?measure=Awareness`
- `/api/demand-submissions`
- `/api/verifications` (administrator)
- `/api/wholesale-inquiries` (administrator)

Every response includes provenance metadata: `status`, `source`, `sourceTimestamp`, `retrievedAt`, record count, missing-data count and warnings. The screens display this as **Live data**, **Validated snapshot**, or **Fallback active**. The default `DATA_PROVIDER=static` serves validated competition snapshots. Set `DATA_PROVIDER=live` in Vercel to enable supported live provider requests; failed, rate-limited, timed-out or invalid responses fall back to a valid in-memory cache and then the static snapshot.

## Documentation

- `docs/api-roadmap.md` — endpoints, query parameters and resilience behavior
- `docs/data-dictionary.md` — field meanings and units
- `docs/data-architecture.md` — data-flow architecture diagram
- `docs/testing.md` — automated and manual release checks
- `docs/survey-methodology.md` — H6 cleaning rules, findings and duplication disclosure
- `docs/database.md` — maintained-record database setup
- `docs/vercel-deployment.md` — deployment and environment variables

The committed files in `data/generated/` are the backup demonstration dataset. They keep every screen functional when an external provider is unavailable.

## Competition scope

The MVP deliberately uses static, dated official-data snapshots. This avoids live-API failures during judging. Streamlit is not part of the competition application; the custom React interface consumes the reusable JSON contracts directly.
