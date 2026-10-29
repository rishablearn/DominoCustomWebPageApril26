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
chmod +x tools/bump-version.sh
./tools/bump-version.sh NEW_VERSION
```

Example:
```bash
./tools/bump-version.sh 3.2.0
```

The script updates **all** of the following in one shot:

| File | What changes |
|------|-------------|
| `VERSION` | New version number |
| `domcfg/DominoEmbeddedForm.html` | `CONFIG.version`, `CONFIG.versionDate`, footer `<span id="versionNumber">` |
| `nsf/ScriptLibraries/*.lss`, `nsf/Agents/*.lss` | `Version  :` header line |
| `installer/Agent0_Installer_DXL.lss` | `INSTALLER_VERSION` |
| `nsf/WebContent/LoginActivityViewer.html` | Header comment version |
| `README.md`, `Deployment.md` | **Version:** and **Last Updated:** lines |
| `Deployment.html` | Rebuilt from `Deployment.md` |

### Step 3 — Add a changelog entry

In `CHANGELOG.md`, add a `## [X.Y.Z] - YYYY-MM-DD` section under `[Unreleased]`, then run `python3 tools/lint_lss.py .` and `python3 tools/validate_dxl.py nsf`.

### Step 4 — Re-deploy HTML forms

After a version bump, the HTML forms must be **re-pasted** into Domino Designer:

1. Open `domcfg.nsf` in Designer → open the `$$LoginUserForm` form
2. Select all (Ctrl+A) → Delete
3. Paste updated HTML (Ctrl+V)
4. Select all (Ctrl+A) → **Text → Pass-Thru HTML** (turns green)
5. Save → `tell http restart`

Also re-save and re-sign any changed LotusScript library/agents in `loginaudit.nsf` (re-run the installer in `UPDATE` mode, see `Deployment.md` section 3.3).

### Step 5 — Commit

```bash
tools/github-sync.sh -m "release: vX.Y.Z"
```
