#!/usr/bin/env bash
# =============================================================================
# tools/bump-version.sh - set the project version everywhere in one command.
#   tools/bump-version.sh 3.2.0
# Updates: VERSION, header of nsf/ScriptLibraries/*.lss and nsf/Agents/*.lss,
#          INSTALLER_VERSION in installer/Agent0_Installer_DXL.lss, version of
#          nsf/WebContent/LoginActivityViewer.html and domcfg/DominoEmbeddedForm.html,
#          Version / Last Updated lines of README.md and Deployment.md,
#          then rebuilds Deployment.html.
# Then: add the entry to CHANGELOG.md, run tools/lint_lss.py and tools/validate_dxl.py.
# =============================================================================
set -euo pipefail
NEW_VERSION="${1:-}"
usage() { echo "Usage: $0 NEW_VERSION   (MAJOR.MINOR.PATCH, e.g. $0 3.2.0)"; echo "Current version: $(tr -d '[:space:]' < "$(dirname "$0")/../VERSION")"; }
case "$NEW_VERSION" in -h|--help|"") usage; exit 0 ;; esac
[[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "ERROR: '$NEW_VERSION' is not a version like 3.2.0" >&2; usage >&2; exit 1; }
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OLD_VERSION="$(tr -d '[:space:]' < "$ROOT/VERSION")"
NEW_DATE="$(date +%Y-%m-%d)"
[ "$OLD_VERSION" != "$NEW_VERSION" ] || { echo "Already at v$NEW_VERSION - nothing to do."; exit 0; }
echo "Bumping v$OLD_VERSION -> v$NEW_VERSION ($NEW_DATE)"

sedi() { if sed --version >/dev/null 2>&1; then sed -i "$@"; else sed -i '' "$@"; fi; }

for f in "$ROOT"/nsf/ScriptLibraries/*.lss "$ROOT"/nsf/Agents/*.lss; do
  sedi "s/^' Version  : [0-9][0-9.]*/' Version  : ${NEW_VERSION}/" "$f"; echo "  ${f#$ROOT/}"
done

f="$ROOT/installer/Agent0_Installer_DXL.lss"
sedi "s/^Const INSTALLER_VERSION = \"[0-9][0-9.]*\"/Const INSTALLER_VERSION = \"${NEW_VERSION}\"/" "$f"; echo "  ${f#$ROOT/}"

f="$ROOT/nsf/WebContent/LoginActivityViewer.html"
[ -f "$f" ] && sedi "s/Login Activity Viewer v[0-9][0-9.]*/Login Activity Viewer v${NEW_VERSION}/" "$f" && echo "  ${f#$ROOT/}"

f="$ROOT/domcfg/DominoEmbeddedForm.html"
if [ -f "$f" ]; then
  sedi -e "s/version: \"${OLD_VERSION}\"/version: \"${NEW_VERSION}\"/" \
       -e "s/versionDate: \"[0-9][0-9-]*\"/versionDate: \"${NEW_DATE}\"/" \
       -e "s/id=\"versionNumber\">${OLD_VERSION}<\/span>/id=\"versionNumber\">${NEW_VERSION}<\/span>/" \
       -e "s/id=\"versionDate\">[0-9][0-9-]*<\/span>/id=\"versionDate\">${NEW_DATE}<\/span>/" "$f"
  echo "  ${f#$ROOT/}"
fi

for f in "$ROOT/README.md" "$ROOT/Deployment.md"; do
  sedi -e "s/\*\*Version:\*\* [0-9][0-9.]*/**Version:** ${NEW_VERSION}/" \
       -e "s/\*\*Last Updated:\*\* [0-9][0-9-]*/**Last Updated:** ${NEW_DATE}/" "$f"; echo "  ${f#$ROOT/}"
done

printf '%s\n' "$NEW_VERSION" > "$ROOT/VERSION"; echo "  VERSION"
python3 "$ROOT/tools/build_docs.py" && echo "  Deployment.html (rebuilt)"
echo "Done. Next: CHANGELOG.md entry, tools/lint_lss.py ., tools/validate_dxl.py nsf"
