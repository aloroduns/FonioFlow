# Testing checklist

## Automated checks

Run `npm test`. The suite builds every route, validates all six snapshot contracts, checks documented endpoints and confirms the resilience and interface-status implementation.

## Release test matrix

| Scenario | Procedure | Expected result |
|---|---|---|
| Valid response | Open `/api/production?country=Guinea&year=2024` | HTTP 200, one record, complete `meta` |
| Provider unavailable | Use live mode with an invalid provider base URL in local testing | Snapshot returned with `Fallback active` warning |
| Empty result | Open `/api/sellers?q=does-not-exist` | HTTP 200, empty `data`, record count 0 |
| Incorrect year | Open `/api/production?year=abc` | HTTP 400 after validation |
| Rate limiting | Mock provider HTTP 429 | Cache or validated snapshot returned with warning |
| Mobile | Test 375 × 812 and 390 × 844 in browser device mode | No horizontal page overflow; status fields stack |
| Seller search | Search `France`, then a nonsense string | Matching cards, then empty-result message |
| Year slider | Move 2015–2024 and select Guinea | year, indicators and chart remain synchronized |

Before release, verify all seven tabs on the Vercel preview deployment and record pass/fail, tester, browser and test date.
