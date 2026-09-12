"""Aggregate a Google Forms fonio survey into the H6 application contract."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

import pandas as pd

QUESTION_MAP = {
    "Before today, had you heard of fonio or acha?": ("Awareness", "H6", False),
    "Have you ever eaten fonio?": ("Ever eaten", "H6", False),
    "Have you personally purchased fonio?": ("Purchased", "H6", False),
    "If you have purchased it, how frequently do you normally buy it?": ("Purchase frequency", "H6", False),
    "Where have you purchased or looked for fonio? Select all that apply.": ("Search/purchase channel", "H5/H6", True),
    "Which fonio product would you be most likely to buy?": ("Preferred product", "H6", False),
    "What would most encourage you to buy fonio? Select up to three.": ("Purchase motivator", "H6", True),
    "What might prevent you from purchasing fonio? Select all that apply.": ("Purchase barrier", "H6/H5/H4", True),
    "What is the most you would be willing to pay for a one-pound package of whole-grain fonio?": ("Willingness to pay", "H4/H6", False),
    "If fonio were available at an acceptable price, how likely would you be to purchase it within the next three months?": ("Three-month purchase likelihood", "H6", False),
    "Would knowing that the product supports West African farmers influence your purchasing decision?": ("Farmer-support influence", "H6", False),
    "Country of residence": ("Country of residence", "H6", False),
    "Age range": ("Age range", "H6", False),
    "Do you have a West African cultural or family connection?": ("West African connection", "H6", False),
    "Dietary preference": ("Dietary preference", "H6", False),
}


def clean_answer(value: object) -> str | None:
    if pd.isna(value):
        return None
    answer = " ".join(str(value).strip().split())
    if not answer:
        return None
    lowered = answer.casefold()
    if lowered == "yes":
        return "Yes"
    if lowered == "no":
        return "No"
    if lowered in {"uk", "u.k.", "united kingdom"}:
        return "United Kingdom"
    if lowered == "nigeria":
        return "Nigeria"
    return answer


def aggregate(df: pd.DataFrame) -> tuple[list[dict], dict]:
    denominator = len(df)
    findings: list[dict] = []
    for column, (measure, hypothesis, multi_select) in QUESTION_MAP.items():
        if column not in df.columns:
            continue
        counts: Counter[str] = Counter()
        for raw in df[column]:
            cleaned = clean_answer(raw)
            if cleaned is None:
                continue
            answers = [clean_answer(part) for part in cleaned.split(",")] if multi_select else [cleaned]
            counts.update(answer for answer in answers if answer)
        note = "Multi-select option count; denominator is all submitted records" if multi_select else "Single response count; denominator is all submitted records"
        for option, count in sorted(counts.items()):
            findings.append({"Measure": measure, "Response option": option, "Count": int(count), "% of respondents": count / denominator, "Hypothesis": hypothesis, "Counting note": note})

    answers_only = df.drop(columns=["Timestamp"], errors="ignore")
    audit = {
        "submitted_records": denominator,
        "exact_duplicate_rows": int(df.duplicated().sum()),
        "unique_timestamps": int(df["Timestamp"].nunique()) if "Timestamp" in df else None,
        "unique_answer_patterns": int(len(answers_only.drop_duplicates())),
        "date_first": str(df["Timestamp"].iloc[0]) if denominator and "Timestamp" in df else None,
        "date_last": str(df["Timestamp"].iloc[-1]) if denominator and "Timestamp" in df else None,
        "missing_by_field": {column: int(count) for column, count in df.isna().sum().items() if count},
        "warning": "All 150 submitted rows were retained at the project owner's direction. The file contains 102 exact duplicate rows and 29 unique timestamps, so the records cannot be treated as 150 independently verified respondents.",
    }
    return findings, audit


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--merge-app-json", type=Path, help="Preserve other keys from an existing H6 application JSON file")
    args = parser.parse_args()
    frame = pd.read_csv(args.input_csv)
    findings, audit = aggregate(frame)
    payload = json.loads(args.merge_app_json.read_text(encoding="utf-8")) if args.merge_app_json else {}
    payload.update({"survey": findings, "surveyAudit": audit})
    args.output_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Aggregated {len(frame)} submitted records into {len(findings)} findings.")


if __name__ == "__main__":
    main()
