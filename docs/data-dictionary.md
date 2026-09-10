# FonioFlow data dictionary

All quantities retain the units shown below. Missing observations remain `null` or carry a missing-data flag; they are not silently treated as observed zeroes.

| Domain | Field | Type / unit | Meaning |
|---|---|---|---|
| Production | `country`, `year` | text, integer | Reporting country and reference year |
| Production | `production_tonnes` | tonnes | Reported fonio output |
| Production | `area_harvested_ha` | hectares | Harvested fonio area |
| Production | `yield_kg_ha` | kg/ha | Reported or estimated yield |
| Processing | `record_id`, `name` | text | Stable evidence record and initiative name |
| Processing | `processing_stages` | text | Documented operations performed |
| Processing | `capacity_evidence` | text | Capacity claim with its qualification |
| Routes | `origin_location`, `destination_port` | text | Candidate inland origin and overseas gateway |
| Routes | `estimated_cost_usd`, `estimated_days` | USD, days | Nullable route estimates—not assumed observations |
| Prices | `Average USD/kg` | USD/kg | Mean of comparable retail observations |
| Sellers | `verification_status` | text | Human review state of a seller record |
| Sellers | `availability_status` | text | Availability observed on the verification date |
| Availability | `estimated_domestic_availability_tonnes` | tonnes | Production + imports − exports |
| Availability | `availability_kg_per_person` | kg/person | Estimated availability divided by population |
| Survey | `% of respondents` | decimal fraction | Share of the 28-response exploratory sample |
| API metadata | `status` | live/cached/static | Provenance state of the returned records |
| API metadata | `sourceTimestamp` | date/text | Reference date supplied by the source or snapshot |
| API metadata | `missingDataCount` | integer | Returned records containing missing fields or flags |
| API metadata | `warnings` | text array | Provider, fallback and evidence warnings |
