---
description: bump project version across all files
---

## Bump Version

Run this workflow whenever the project version needs to increase (bug fix, feature, or release).

### Step 1 — Decide the new version

Follow [Semantic Versioning](https://semver.org):

| Change type | Example |
|-------------|---------|
| Bug fix / patch | `2.5.0` → `2.5.1` |
| New feature (backwards-compatible) | `2.5.x` → `2.6.0` |
| Breaking change | `2.x.x` → `3.0.0` |

The current version is always in the `VERSION` file at the project root.

### Step 2 — Run the bump script

```bash
chmod +x scripts/bump-version.sh
./scripts/bump-version.sh NEW_VERSION
```

Example:
```bash
./scripts/bump-version.sh 2.5.1
```

The script updates **all** of the following in one shot:

| File | What changes |
|------|-------------|
| `VERSION` | New version number |
| `login-forms/DominoEmbeddedForm.html` | `CONFIG.version`, `CONFIG.versionDate`, footer `<span id="versionNumber">` |
| `login-forms/EnterpriseLoginForm.html` | Same as above |
| `login-forms/CustomLoginForm-Domino.html` | Version comment header |
| `config.js` | `@version` JSDoc tag |
| `i18n/translations.js` | `@version` JSDoc tag |
| `js/login.js` | `@version` JSDoc tag |
| `README.md` | Badge, **Version:** line, **Last Updated:** date |
| `docs/*.md` | Inline `vX.Y.Z` references |

### Step 3 — Add a changelog entry

In `README.md`, add a new `### Version X.Y.Z (Month YYYY)` section at the top of the Changelog with bullet points describing what changed.

### Step 4 — Re-deploy HTML forms

After a version bump, the HTML forms must be **re-pasted** into Domino Designer:

1. Open `domcfg.nsf` in Designer → open the `$$LoginUserForm` form
2. Select all (Ctrl+A) → Delete
3. Paste updated HTML (Ctrl+V)
4. Select all (Ctrl+A) → **Text → Pass-Thru HTML** (turns green)
5. Save → `tell http restart`

Repeat for any other deployed form (`EnterpriseLoginForm`, etc.).

### Step 5 — Commit

```bash
git add -A
git commit -m "chore: bump version to X.Y.Z"
git push origin main
```
