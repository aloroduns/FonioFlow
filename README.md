# FonioFlow

FonioFlow is an interactive food-system evidence platform that examines six connected hypotheses affecting fonio’s journey from production to consumption.

The application brings fragmented agricultural, processing, logistics, pricing, sourcing, trade, and consumer evidence into one accessible decision-support tool. It helps farmers, cooperatives, buyers, researchers, development organizations, and policymakers identify where market-access bottlenecks occur and where additional evidence or investment is needed.

**Live application:** [fonio-flow.vercel.app](https://fonio-flow.vercel.app)

## Hypotheses explored

* **H1 — Production:** Is fonio production sufficient and stable?
* **H2 — Processing:** Can processors meet buyer requirements?
* **H3 — Distribution:** Can fonio reach domestic and international markets reliably?
* **H4 — Price:** Is fonio commercially competitive with alternative grains?
* **H5 — Sourcing:** Can buyers find reliable fonio sellers?
* **H6 — Demand:** Is consumer demand and domestic availability understood?

The seven-screen application includes a project overview and one interactive evidence screen for each hypothesis.

## Key features

* Country and year filtering
* Historical production trends
* Processing-facility and cooperative records
* Inland route distance and delivery-time comparisons
* Fonio and comparator-grain price analysis
* Searchable seller directory
* Trade and domestic-availability indicators
* Consumer-survey findings
* Source provenance and update dates
* Visible evidence-quality and missing-data warnings
* Live, cached, and validated-snapshot status labels

## Technology

* **Frontend:** Next.js, React and TypeScript
* **Data processing:** Python and Pandas
* **Validation:** Zod data contracts
* **Database:** PostgreSQL
* **Deployment:** Vercel
* **Testing:** Next.js build checks and automated data-contract tests

## Data sources

FonioFlow integrates evidence from:

* FAOSTAT production and producer-price datasets
* UN Comtrade trade records
* World Bank population indicators
* World Bank Logistics Performance Index
* UNCTAD country and port-connectivity datasets
* USDA FoodData Central
* Verified public processing and seller records
* Standardized road-route observations
* Fonio consumer-survey responses

Every record retains source and evidence information where available. Missing, estimated, planned, and unverified observations are identified rather than presented as confirmed facts.

## Data architecture

FonioFlow uses a hybrid architecture that balances reliability with data currency.

The application’s internal API normalizes external and project-maintained data into reusable JSON contracts. Supported datasets can be requested from live providers. If a live request fails, times out, is rate-limited, or returns invalid or empty results, the system falls back to a validated cache and then to a date-stamped project snapshot.

API responses identify their delivery status as:

* `live` — retrieved successfully from an external provider
* `cached` — returned from a previously validated response
* `static` — returned from a validated project snapshot
* `fallback active` — an alternative source was used after a live request failed

PostgreSQL maintains records that require continuing updates, including sellers, verification history, product availability, delivery coverage, wholesale inquiries, and user-submitted demand.

## Internal API endpoints

| Endpoint                   | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `/api/production`          | Production, harvested area and yield               |
| `/api/processing`          | Processing facilities, capacity and product forms  |
| `/api/routes`              | Origin–destination routes and logistics indicators |
| `/api/prices`              | Fonio and comparator-grain prices                  |
| `/api/sellers`             | Searchable approved-seller records                 |
| `/api/trade-availability`  | Trade flows and estimated domestic availability    |
| `/api/survey`              | Consumer-survey findings                           |
| `/api/demand-submissions`  | User-submitted demand                              |
| `/api/verifications`       | Protected seller-verification records              |
| `/api/wholesale-inquiries` | Protected wholesale-inquiry records                |

Example request:

```text
/api/production?country=Guinea&year=2024
```

Each response includes provenance metadata such as data status, source organization, source timestamp, retrieval date, record count, missing-data count, and warnings.

## Repository structure

```text
app/                      Next.js pages and internal API routes
components/fonioflow/     Reusable hypothesis screens
components/ui/            Accessible interface components
data/generated/           Validated JSON snapshots and data contracts
database/schema.sql       PostgreSQL database schema
lib/                      Shared types, validation and data-access modules
scripts/                  Data-cleaning and export pipelines
tests/                    Automated data-contract tests
docs/                     Methodology, architecture and deployment guides
```

## Local setup

### Requirements

* Node.js 20 or later
* npm
* Python 3.11 or later
* PostgreSQL, when maintained database records are required

### Install and run

```bash
git clone https://github.com/aloroduns/FonioFlow.git
cd FonioFlow
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Data processing

After updating an approved H1–H6 workbook, rebuild the validated application datasets with:

```bash
python scripts/export_data.py
```

To process a new survey export:

```bash
python scripts/process_survey.py INPUT.xlsx OUTPUT.json \
  --merge-app-json data/generated/h6-demand.json
```

CSV and Excel survey files are supported. Use `--unique-respondents-confirmed` only after confirming that every response row represents a different individual.

All generated changes should be reviewed before they are committed.

## Validation and testing

Run:

```bash
npm test
```

Testing covers:

* Application build integrity
* JSON contract validation
* Valid and invalid API parameters
* Empty provider responses
* Provider unavailability and timeouts
* Rate-limit fallback behavior
* Seller search
* Country and year filtering
* Mobile display
* Missing-data warnings

The complete release checklist is available in `docs/testing.md`.

## Environment configuration

Create `.env.local` from `.env.example`.

```env
DATA_PROVIDER=static
DATA_REQUEST_TIMEOUT_MS=8000
DATABASE_URL=
ADMIN_API_KEY=
UN_COMTRADE_API_KEY=
```

Use `DATA_PROVIDER=live` to enable supported live-provider requests. If the live request cannot be validated, FonioFlow automatically returns an available cached response or validated static snapshot.

Secrets such as database credentials and API keys must be stored in Vercel environment variables and must never be committed to GitHub.

## Deployment

FonioFlow is deployed on Vercel as a Next.js application.

To deploy:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Keep the detected framework preset as **Next.js**.
4. Add the required environment variables.
5. deploy the application.

Vercel runs `npm run build` for each production deployment. Updates pushed to the connected `main` branch trigger a new deployment.

## Evidence and limitations

FonioFlow is a decision-support prototype, not a real-time market guarantee.

Some public datasets are incomplete, delayed, estimated, or reported at national rather than facility level. Processing capacity, freight quotations, certification status, seller availability, and shipment-performance data remain limited in several markets.

The application addresses these limitations by:

* Separating verified and unverified records
* Identifying estimated and planned observations
* Displaying missing-data warnings
* Preserving source links and timestamps
* Using validated fallback datasets
* Avoiding conclusions that exceed the available evidence

Hypothesis results should therefore be interpreted according to their displayed evidence status.

## Competition submission

The submitted MVP uses a custom Next.js and React interface rather than Streamlit. Its reusable internal APIs support both live-provider connections and validated project snapshots.

This architecture keeps the application reliable while demonstrating how FonioFlow can develop into a continuously updated food-system intelligence platform.

## Documentation

* `docs/api-roadmap.md` — API contracts and resilience behavior
* `docs/data-dictionary.md` — field definitions and measurement units
* `docs/data-architecture.md` — system architecture and data flow
* `docs/testing.md` — automated and manual release checks
* `docs/survey-methodology.md` — H6 survey methodology and findings
* `docs/database.md` — PostgreSQL setup and maintained records
* `docs/vercel-deployment.md` — deployment and environment configuration

## Potential impact

FonioFlow makes complex food-system evidence easier to understand and use. Buyers can identify potential suppliers, cooperatives can see the information required by markets, and development partners can target documented production, processing, logistics, or visibility constraints.

With stronger facility-level, shipment-level, and market-verification data, the platform can support better investment decisions, improve market access for smallholder producers, and contribute to a more equitable and resilient fonio value chain.
