# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). Current version: `VERSION`. Change it everywhere with `bash tools/bump-version.sh X.Y.Z`, then add the entry here.

## [Unreleased]

## [3.2.0] - 2026-10-29

### Changed
- **Login Activity viewer** (`nsf/WebContent/LoginActivityViewer.html`): the user's name is now a prominent header line (common name, full name as tooltip) with "Your last N successful sign-ins" below it. The name was grey on the dark header (the generic `.sub` colour won over `.hdr .sub`).
- **Login page** (`domcfg/DominoEmbeddedForm.html`) is more compact: card 360 px wide (was 420), padding 26 px (was 48), smaller logo, title, fields and button, no hover lift, tighter footer. Mobile keeps 16 px inputs (no iOS zoom).

### Added
- Information row below the form: chips **Sign-in tracking / MFA / CAPTCHA: On|Off** and, when tracking is on, one sentence telling users that sign-ins are recorded (time, IP, browser) and where to review them. Driven by the existing `features.enableLoginAudit`, `loginAudit.enable`, `features.enableMFA` / `mfa.enable` and `features.enableCaptcha` settings. English text is built in; other languages fall back to English until `auditChip*` / `auditInfoText` keys are added to their `strings`.

## [3.1.2] - 2026-10-29

### Fixed
- **Installer: `582 You are not authorized to perform that operation`** on every form and view. `SetupACL` set each ACL entry to an exact level, so when `SIGNER_ID` was the same person as the ID running the installer (written in another name format) the Manager entry was lowered to Editor and the import lost design rights. ACL entries are now only raised, never lowered (`EnsureLevel`); the signer is compared as a Notes name; the running ID must still be Manager before `-Default-` is lowered.
- The installer now checks the running ID's access level **before** importing and stops with the level and the fix when it is below Designer. A 582 in the importer log now says what to check.
- Recovery for a database already locked out by 3.1.0/3.1.1: Deployment.md section 10.

## [3.1.1] - 2026-10-29

### Fixed
- **3.1.0 did not compile on import** (importer: `7118 Unexpected: list; Expected: Identifier` in `LoginAuditLib`, then `12051 Syntax Error` on all 5 agents, which cascade from the library). Cause: a variable named `list` in `IsTrustedProxy`; `List` is a LotusScript keyword. Renamed to `proxyList`. Do not deploy 3.1.0.
- `PurgeLoginAudit`: variable `log` shadowed the built-in `Log` function; renamed to `auditLog` (not reported yet, would have failed next).
- Installer: the version in an `.lss` header is the first word after the colon, so a trailing note can no longer cause "header Version is 3.1.0 but project version is 3.1.0".

### Changed
- `tools/lint_lss.py` rejects LotusScript keywords and built-in function names used as variable or parameter names (`list`, `log`, `left`, `name`, `date`, ...) and header lines with text after the version number.

## [3.1.0] - 2026-10-29

### Added
- DXL installer `installer/Agent0_Installer_DXL.lss`: creates `loginaudit.nsf` with ACL, forms `LoginEvent` / `AuditError`, views `(LoginsByUser)` / `(NotMeReports)` / `(AuditErrors)`, script library `LoginAuditLib` and 5 agents. Forms and views are DXL files; the library and agents are generated from the `.lss` files at install time.
- `tools/lint_lss.py`, `tools/validate_dxl.py` (static checks), `tools/build_docs.py` (Deployment.html).

### Changed
- **Repository reorganized:** `nsf/` (everything imported into `loginaudit.nsf`: `MANIFEST.txt`, `Forms/`, `Views/`, `ScriptLibraries/`, `Agents/`, `WebContent/`), `installer/`, `domcfg/` (login page, was `login-forms/`), `verse/` (was `verse-extension/`, viewer moved to `nsf/WebContent/`), `tools/` (scripts and `github-sync.sh`), `archive/` (EVALUATION.md).
- **Documentation reduced to one guide:** `Deployment.md` (and `Deployment.html`, generated) replaces `docs/01-Overview`, `02-Deployment-Guide`, `03-Verse-Extension`, `04-DXL-Install`. The changelog moved here from the README.
- `tools/github-sync.sh` never commits a folder that has its own `.git` (unstages it with a warning and the `.gitignore` command).
- `DominoPasswordReset-March2026/` (reference project with its own repo) is git-ignored and no longer tracked; it had been committed as an empty submodule pointer.

### Fixed
- `.lss` sources are ASCII-only (em dashes in comments).
- `JsonEscape` escapes `<` and `>` as `<` / `>` (the replace calls were no-ops).

## [3.0.0] - 2026-10-28

### Added
- Server-side login audit (`loginaudit.nsf`): successful logins only, server time, trusted-proxy aware IP, parsed User-Agent, access source, new-IP / new-device flags, approximate duration, "This wasn't me", retention purge.

### Changed
- Verse viewer rewritten (reads only the new agent; no `localStorage` fallback). Client-side session-warning timer disabled by default.

### Security
- Removed the anonymous client-triggered tracking agent (forgeable, attempt-only) and the partial-name history lookup; debug output removed; the login page no longer sends tracking data.

### Removed
- Modular login form and its `config.js` / `js` / `css` / `i18n` / `samples` / `preview-server.js`, `EnterpriseLoginForm.html`, `DominoEmbeddedForm-AlphaCaptcha.html` (alpha CAPTCHA remains a config option), `names.nsf` Person-document storage, last-login `localStorage` banner.

Earlier history: see git log (2.x).
