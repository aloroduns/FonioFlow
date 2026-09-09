"""Build versioned app-ready JSON contracts from the H1–H6 workbooks."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any
from openpyxl import load_workbook

SOURCE_DIR = Path("/workspace/scratch/08e3ea16d17a/outputs/08e3ea16d17a")
OUTPUT_DIR = Path(__file__).parents[1] / "data" / "generated"

def records(filename: str, sheet: str, header_row: int = 4) -> list[dict[str, Any]]:
    worksheet = load_workbook(SOURCE_DIR / filename, data_only=True)[sheet]
    headers = [cell.value for cell in worksheet[header_row]]
    return [{str(headers[i]): value for i, value in enumerate(row)
             if i < len(headers) and headers[i] is not None}
            for row in worksheet.iter_rows(min_row=header_row + 1, values_only=True)
            if any(value is not None for value in row)]

DATASETS = {
    "h1-production.json": {"production": records("FonioFlow_H1_Clean_Production_Dataset.xlsx", "App Export"), "countrySummary": records("FonioFlow_H1_Clean_Production_Dataset.xlsx", "Country Summary")},
    "h2-processing.json": {"processors": records("FonioFlow_H2_Processing_Evidence_Dataset.xlsx", "App Export"), "capacities": records("FonioFlow_H2_Processing_Evidence_Dataset.xlsx", "Capacity Observations")},
    "h3-routes.json": {"routes": records("FonioFlow_H3_Road_Route_Evidence.xlsx", "Map Export"), "roadRoutes": records("FonioFlow_H3_Road_Route_Evidence.xlsx", "Road Route Evidence")[:5]},
    "h4-prices.json": {"prices": records("FonioFlow_H4_Price_Competitiveness_Dataset_Verification_Started.xlsx", "Retail Comparison"), "retail": records("FonioFlow_H4_Price_Competitiveness_Dataset_Verification_Started.xlsx", "Retail Clean")},
    "h5-sellers.json": {"sellers": records("FonioFlow_H5_Complete_Analysis_Dataset.xlsx", "App Export"), "failures": records("FonioFlow_H5_Complete_Analysis_Dataset.xlsx", "Failure Analysis")},
    "h6-demand.json": {"availability": records("FonioFlow_H6_Trade_Consumption_and_Survey.xlsx", "App Export"), "survey": records("FonioFlow_H6_Trade_Consumption_and_Survey.xlsx", "Survey Summary")},
}

def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, payload in DATASETS.items():
        (OUTPUT_DIR / filename).write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
        print(filename, {key: len(value) for key, value in payload.items()})

if __name__ == "__main__":
    main()
