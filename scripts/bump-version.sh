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
#   VERSION                               ← central source of truth
#   login-forms/DominoEmbeddedForm.html   ← CONFIG.version, CONFIG.versionDate, footer span
#   login-forms/EnterpriseLoginForm.html  ← CONFIG.version, CONFIG.versionDate, footer span
#   login-forms/CustomLoginForm-Domino.html ← version comment header
#   config.js                             ← @version JSDoc tag
#   i18n/translations.js                  ← @version JSDoc tag
#   js/login.js                           ← @version JSDoc tag (if present)
#   README.md                             ← badge, footer Version line, Last Updated date
#   docs/*.md                             ← inline vX.Y.Z references
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
    "$ROOT/login-forms/DominoEmbeddedForm.html" \
    "$ROOT/login-forms/EnterpriseLoginForm.html"; do
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

# CustomLoginForm-Domino.html — comment header + footer span
f="$ROOT/login-forms/CustomLoginForm-Domino.html"
if [ -f "$f" ]; then
    # Comment header: <!-- Version: X.Y.Z | Date: YYYY-MM-DD | ... -->
    sedi -e "s/Version: ${OLD_VERSION}/Version: ${NEW_VERSION}/" \
         -e "s/Date: [0-9][0-9-]*/Date: ${NEW_DATE}/" \
         "$f"
    # Footer span fallback
    sedi "s/id=\"versionNumber\">${OLD_VERSION}<\/span>/id=\"versionNumber\">${NEW_VERSION}<\/span>/" "$f"
    echo "  ✅  $(basename "$f")"
fi

# ── JavaScript / config files — @version JSDoc tag ───────────────────────────
for f in \
    "$ROOT/config.js" \
    "$ROOT/i18n/translations.js" \
    "$ROOT/js/login.js"; do
    [ -f "$f" ] || continue
    sedi "s/@version [0-9][0-9.]*/@version ${NEW_VERSION}/" "$f"
    echo "  ✅  $(basename "$f")"
done

# ── README.md ─────────────────────────────────────────────────────────────────
f="$ROOT/README.md"
if [ -f "$f" ]; then
    # Badge: version-X.Y.Z-blue  (use OLD_VERSION for precision)
    sedi "s/version-${OLD_VERSION}-blue/version-${NEW_VERSION}-blue/" "$f"
    # Footer **Version:** line — generic pattern captures any version string and
    # any optional trailing annotation like "(HTML files: A.B.C)"
    sedi "s/\*\*Version:\*\* [0-9][0-9.]* *([^)]*)/\*\*Version:\*\* ${NEW_VERSION}/" "$f"
    sedi "s/\*\*Version:\*\* [0-9][0-9.]*$/\*\*Version:\*\* ${NEW_VERSION}/" "$f"
    # Footer **Last Updated:** — match both ISO (2026-07-01) and prose (July 1, 2026)
    sedi "s/\*\*Last Updated:\*\* [0-9A-Za-z ,_-]*/\*\*Last Updated:\*\* ${NEW_DATE}/" "$f"
    echo "  ✅  README.md"
fi

# ── docs/*.md — inline vX.Y.Z references ─────────────────────────────────────
for f in "$ROOT/docs/"*.md; do
    [ -f "$f" ] || continue
    sedi "s/v${OLD_VERSION}/v${NEW_VERSION}/g" "$f"
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
