# FonioFlow data architecture

The competition build uses reproducible static snapshots rather than live APIs.

1. The validated H1–H6 Excel workbooks remain the analytical source of truth.
2. `scripts/export_data.py` reads only the approved app-export and summary sheets.
3. The script writes one versionable JSON contract per hypothesis to `data/generated/`.
4. `lib/data.ts` is the single typed access point used by the screens.
5. Each screen displays evidence limitations; missing values are not silently converted to facts.

Live APIs can be added later behind the same repository interface. The React screens should not call FAOSTAT, Comtrade or retailer services directly.
