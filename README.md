# FonioFlow

FonioFlow is a seven-screen evidence explorer for testing six hypotheses about fonio market access.

## Application structure

- `app/` — Next.js entry point, metadata and global theme
- `components/fonioflow/` — one reusable screen component per hypothesis
- `components/ui/` — accessible interface primitives
- `data/generated/` — versioned JSON contracts used by the application
- `lib/` — shared types, formatting and data access
- `scripts/export_data.py` — workbook-to-JSON pipeline
- `tests/` — fast data-contract checks
- `docs/` — architecture and methodology notes

## Rebuild the data

Run `python scripts/export_data.py` after updating an approved H1–H6 workbook. Review the generated changes before committing them.

## Validate

Run `npm test` to build the application and check the data contracts.

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

Every response includes provenance metadata: `status`, `source`, `sourceTimestamp`, `retrievedAt`, record count, missing-data count and warnings. The default `DATA_PROVIDER=static` serves validated competition snapshots. Set `DATA_PROVIDER=live` in Vercel to enable supported live provider requests; failed, timed-out or invalid responses fall back to a valid in-memory cache and then the static snapshot.

## Competition scope

The MVP deliberately uses static, dated official-data snapshots. This avoids live-API failures during judging. Streamlit is not part of the competition application; the custom React interface consumes the reusable JSON contracts directly.
