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


def aggregate(df: pd.DataFrame, identity_verified: bool = False) -> tuple[list[dict], dict]:
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
        note = "Multi-select option count; denominator is all respondent records" if multi_select else "Single response count; denominator is all respondent records"
        for option, count in sorted(counts.items()):
            findings.append({"Measure": measure, "Response option": option, "Count": int(count), "% of respondents": count / denominator, "Hypothesis": hypothesis, "Counting note": note})

    answers_only = df.drop(columns=["Timestamp"], errors="ignore")
    duplicate_rows = int(df.duplicated().sum())
    unique_timestamps = int(df["Timestamp"].nunique()) if "Timestamp" in df else None
    audit = {
        "submitted_records": denominator,
        "respondent_records": denominator,
        "unique_respondents": denominator if identity_verified else None,
        "respondent_identity_verified": identity_verified,
        "exact_duplicate_rows": duplicate_rows,
        "unique_timestamps": unique_timestamps,
        "unique_answer_patterns": int(len(answers_only.drop_duplicates())),
        "date_first": str(df["Timestamp"].min()) if denominator and "Timestamp" in df else None,
        "date_last": str(df["Timestamp"].max()) if denominator and "Timestamp" in df else None,
        "missing_by_field": {column: int(count) for column, count in df.isna().sum().items() if count},
        "quality_note": (
            f"The project owner confirmed that all {denominator} records represent unique individuals. "
            f"The {duplicate_rows} identical rows reflect matching recorded answers, not duplicate respondents."
            if identity_verified
            else f"The source contains {duplicate_rows} exact duplicate rows and {unique_timestamps} unique timestamps; independent respondent identity has not been verified."
        ),
        "warning": "" if identity_verified else f"Independent respondent identity has not been verified for all {denominator} records.",
    }
    return findings, audit


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_file", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--merge-app-json", type=Path, help="Preserve other keys from an existing H6 application JSON file")
    parser.add_argument("--unique-respondents-confirmed", action="store_true", help="Record project-owner confirmation that each row belongs to a unique individual")
    args = parser.parse_args()
    frame = pd.read_excel(args.input_file) if args.input_file.suffix.lower() in {".xlsx", ".xls"} else pd.read_csv(args.input_file)
    findings, audit = aggregate(frame, identity_verified=args.unique_respondents_confirmed)
    payload = json.loads(args.merge_app_json.read_text(encoding="utf-8")) if args.merge_app_json else {}
    payload.update({"survey": findings, "surveyAudit": audit})
    args.output_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Aggregated {len(frame)} respondent records into {len(findings)} findings.")


if __name__ == "__main__":
    main()
