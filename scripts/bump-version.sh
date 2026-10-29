#!/usr/bin/env bash
# =============================================================================
# bump-version.sh
# Update the project version number across ALL files in one command.
#
# Usage:
#   ./scripts/bump-version.sh <NEW_VERSION>
#   ./scripts/bump-version.sh 2.5.1
#
# What it updates:
#   VERSION                               <- central source of truth
#   login-forms/DominoEmbeddedForm.html   <- CONFIG.version, CONFIG.versionDate, footer spans
#   lotusscript/{ScriptLibraries,Agents}/*.lss <- "Version  : X.Y.Z" header line
#   lotusscript/Installer/Agent0_Installer_DXL.lss <- INSTALLER_VERSION
#   verse-extension/LoginActivityViewer.html <- "v X.Y.Z" header comment
#   README.md                             <- Version / Last Updated lines
#   docs/*.md                             <- Version / Last Updated lines and inline vX.Y.Z
# =============================================================================

set -euo pipefail

NEW_VERSION="${1:-}"
if [ -z "$NEW_VERSION" ]; then
    echo "Usage: $0 NEW_VERSION   (e.g. $0 2.5.1)"
    exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_FILE="$ROOT/VERSION"

if [ ! -f "$VERSION_FILE" ]; then
    echo "ERROR: VERSION file not found at $VERSION_FILE"
    exit 1
fi

OLD_VERSION="$(tr -d '[:space:]' < "$VERSION_FILE")"
NEW_DATE="$(date +%Y-%m-%d)"

if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
    echo "Already at v$NEW_VERSION — nothing to do."
    exit 0
fi

echo "========================================"
echo " Bumping  v$OLD_VERSION  →  v$NEW_VERSION"
echo " Date     $NEW_DATE"
echo "========================================"
echo ""

# sedi: portable in-place sed (macOS BSD vs Linux GNU)
sedi() {
    if sed --version 2>/dev/null | grep -q GNU 2>/dev/null; then
        sed -i "$@"
    else
        sed -i '' "$@"
    fi
}

# ── HTML login forms ──────────────────────────────────────────────────────────
for f in \
    "$ROOT/login-forms/DominoEmbeddedForm.html"; do
    [ -f "$f" ] || continue
    # 1. CONFIG object: version and versionDate fields
    sedi -e "s/version: \"${OLD_VERSION}\"/version: \"${NEW_VERSION}\"/" \
         -e "s/versionDate: \"[0-9][0-9-]*\"/versionDate: \"${NEW_DATE}\"/" \
         "$f"
    # 2. Hardcoded footer fallback spans (overwritten by JS at runtime, but kept in sync)
    sedi -e "s/id=\"versionNumber\">${OLD_VERSION}<\/span>/id=\"versionNumber\">${NEW_VERSION}<\/span>/" \
         -e "s/id=\"versionDate\">[0-9][0-9-]*<\/span>/id=\"versionDate\">${NEW_DATE}<\/span>/" \
         "$f"
    echo "  ✅  $(basename "$f")"
done

# ── LotusScript agents/library — header "Version  : X.Y.Z" ────────────────────
for f in "$ROOT/lotusscript/ScriptLibraries/"*.lss "$ROOT/lotusscript/Agents/"*.lss; do
    [ -f "$f" ] || continue
    sedi "s/^' Version  : [0-9][0-9.]*/' Version  : ${NEW_VERSION}/" "$f"
    echo "  ✅  ${f#$ROOT/}"
done

# ── DXL installer — INSTALLER_VERSION constant ────────────────────────────────
f="$ROOT/lotusscript/Installer/Agent0_Installer_DXL.lss"
if [ -f "$f" ]; then
    sedi "s/^Const INSTALLER_VERSION = \"[0-9][0-9.]*\"/Const INSTALLER_VERSION = \"${NEW_VERSION}\"/" "$f"
    echo "  ✅  lotusscript/Installer/Agent0_Installer_DXL.lss"
fi

# ── Verse viewer — header comment ─────────────────────────────────────────────
f="$ROOT/verse-extension/LoginActivityViewer.html"
if [ -f "$f" ]; then
    sedi "s/Login Activity Viewer v[0-9][0-9.]*/Login Activity Viewer v${NEW_VERSION}/" "$f"
    echo "  ✅  $(basename "$f")"
fi

# ── README.md ─────────────────────────────────────────────────────────────────
f="$ROOT/README.md"
if [ -f "$f" ]; then
    # Footer **Version:** line — generic pattern captures any version string and
    # any optional trailing annotation like "(HTML files: A.B.C)"
    sedi "s/\*\*Version:\*\* [0-9][0-9.]*/**Version:** ${NEW_VERSION}/" "$f"
    # Footer **Last Updated:** — match both ISO (2026-07-01) and prose (July 1, 2026)
    sedi "s/\*\*Last Updated:\*\* [0-9A-Za-z ,_-]*/\*\*Last Updated:\*\* ${NEW_DATE}/" "$f"
    echo "  ✅  README.md"
fi

# ── docs/*.md — inline vX.Y.Z references ─────────────────────────────────────
for f in "$ROOT/docs/"*.md; do
    [ -f "$f" ] || continue
    sedi -e "s/v${OLD_VERSION}/v${NEW_VERSION}/g" \
         -e "s/\*\*Version:\*\* [0-9][0-9.]*/**Version:** ${NEW_VERSION}/" \
         -e "s/\*\*Last Updated:\*\* [0-9][0-9-]*/**Last Updated:** ${NEW_DATE}/" "$f"
    echo "  ✅  docs/$(basename "$f")"
done

# ── VERSION file — write new version last ─────────────────────────────────────
printf '%s\n' "${NEW_VERSION}" > "$VERSION_FILE"
echo "  ✅  VERSION → ${NEW_VERSION}"

echo ""
echo "========================================"
echo " Done!  All files are now v${NEW_VERSION}"
echo "========================================"
echo ""
echo "Suggested commit:"
echo "  git add -A && git commit -m \"chore: bump version to ${NEW_VERSION}\""
