#!/usr/bin/env bash
# Re-export the SymNexus(x) product catalog from ModelsCore and copy it into this site:
#   ModelsCore/site_builder/export/modelscore.php → src/data/modelscore.php
#   ModelsCore/site_builder/export/icons/*.png    → public/assets/images/tasks/
# Run after any ModelsCore task change: `npm run sync:modelscore`
# (set MODELSCORE_DIR if ModelsCore is not a sibling of this repo), then commit both.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODELSCORE_DIR="${MODELSCORE_DIR:-$ROOT/../ModelsCore}"
EXPORT="$MODELSCORE_DIR/site_builder/export"

python3 "$MODELSCORE_DIR/site_builder/export_catalog.py"

cp "$EXPORT/modelscore.php" "$ROOT/src/data/modelscore.php"

# Replace the icon set wholesale so icons of removed tasks don't linger.
rm -rf "$ROOT/public/assets/images/tasks"
mkdir -p "$ROOT/public/assets/images/tasks"
cp "$EXPORT"/icons/*.png "$ROOT/public/assets/images/tasks/"

echo "Synced $(ls "$ROOT/public/assets/images/tasks" | wc -l | tr -d ' ') icons and src/data/modelscore.php"
