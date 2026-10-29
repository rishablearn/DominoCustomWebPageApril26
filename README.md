# HCL Domino Custom Login Page + Login Activity (HCL Verse)

**Version:** 3.1.0  
**Last Updated:** 2026-10-29
**Targets:** HCL Domino 12.0.1+ / 14.x, HCL Verse on-premises 3.2.x (developed against 3.2.7)

A branded login page for HCL Domino that is **self-contained HTML** (embedded in `DOMCFG.NSF`, no MIME setup), plus a **server-side login audit**: users see their last 5 successful logins — IP address, login time, session duration (approximate), access source, new-IP/new-device flags — in an HCL Verse "Login Activity" window, and can report a sign-in as "This wasn't me".

> Status: written and statically reviewed, **not yet run on a Domino server**. Follow the test plan in [`docs/02-Deployment-Guide.md`](docs/02-Deployment-Guide.md) §7 before production.

## How it works

```
Browser ──POST /names.nsf?Login──▶ Domino authenticates (password [+ TOTP])
        ◀── redirect: /loginaudit.nsf/LoginLanding?OpenAgent&next=/verse
Browser ──▶ LoginLanding agent   identity = server-set Remote_User (not client data)
                                 writes LoginEvent doc: server time, IP, User-Agent,
                                 access source, new-IP / new-device flags
        ◀── redirect to /verse
Verse ▸ More ▸ Login Activity ──▶ LoginActivityViewer.html
                                  ├─ GetLoginHistory  (last 5, exact user match)
                                  ├─ Heartbeat        (approx. session duration)
                                  └─ NotMe            ("This wasn't me" report)
Nightly: PurgeLoginAudit deletes events older than the retention period.
```

Only **successful** logins are recorded: a failed login never reaches the landing agent.

## What is in the repo

| Path | Purpose |
|---|---|
| `login-forms/DominoEmbeddedForm.html` | The login page (paste into `$$LoginUserForm` as Pass-Thru HTML). Config block at the top. |
| `lotusscript/LoginAuditLib.lss` | Script library: config constants, identity, IP, UA parsing, JSON helpers |
| `lotusscript/LoginLanding.lss` | Records the login, then redirects |
| `lotusscript/GetLoginHistory.lss` | JSON for the viewer |
| `lotusscript/Heartbeat.lss` | Session-duration heartbeat / explicit end |
| `lotusscript/NotMe.lss` | "This wasn't me" report |
| `lotusscript/PurgeLoginAudit.lss` | Scheduled retention job (dry-run by default) |
| `deploy/notes-client/Agent0_Installer_DXL.lss` | One-shot installer (Notes client) that builds `loginaudit.nsf`: ACL, 2 forms, 3 views, library, 5 agents via DXL import |
| `deploy/dxl/` | `MANIFEST.txt`, form + view DXL |
| `deploy/scripts/` | `lint_lss.py`, `validate_dxl.py` |
| `verse-extension/` | Viewer page + `applications.json` / `merge-snippet.json` |
| `docs/` | Overview (incl. `04-DXL-Install.md`), deployment + test plan, Verse extension guide |
| `EVALUATION.md` | Review that led to this design |

## Quick start

1. Deploy the login page → `docs/02-Deployment-Guide.md` §1.
2. Create `loginaudit.nsf` (ACL, roles, views), script library and agents → §2–§4.
3. Turn on `loginAudit` in the login form config → §5.
4. Deploy the Verse extension → `docs/03-Verse-Extension.md`.
5. Run the test plan → §7. Production reverse proxy / TOTP / OIDC notes → §8.

## Known limitations (read before promising features)

- **Session duration is approximate and only measured while a heartbeat source is open.** Verse 3.2.7 documents no always-on background extension point, so a session with no heartbeat shows "Not measured" (never a guess).
- **Only logins through this web form (or any flow that ends at `LoginLanding`) are recorded.** Notes-client, mobile-sync, API and SSO/OIDC logins that bypass the form are not, unless their post-login URL is routed through the landing agent.
- **Behind a reverse proxy the real client IP depends on your proxy setup** (see §8); the trusted-proxy list must be configured.
- Agents were written to the documented LotusScript/Domino behaviour; exact server behaviours marked *(verify)* in the docs must be confirmed in testing.

## Changelog

### 3.1.0 (2026-10-29)
- **New:** DXL installer (`deploy/notes-client/Agent0_Installer_DXL.lss`) building `loginaudit.nsf` (ACL, forms `LoginEvent`/`AuditError`, views `(LoginsByUser)`/`(NotMeReports)`/`(AuditErrors)`, library, 5 agents); `docs/04-DXL-Install.md`; `deploy/scripts/` checks.
- **Docs:** `01-Overview` (layout, design-element table), `02-Deployment-Guide` (installer vs manual steps, signing, purge schedule, troubleshooting), `03-Verse-Extension`, `04-DXL-Install` (DXL contents, rules, upgrade).
- **Repo:** `DominoPasswordReset-March2026/` is a reference copy with its own repo; it is git-ignored and no longer tracked (it had been committed by mistake as an empty submodule pointer).
- **Tooling:** `github-sync.sh` no longer commits a folder that has its own `.git` (new nested repos are unstaged with a warning and the `.gitignore` command to use); it also reports an already tracked one.
- **Fixed:** `.lss` sources are ASCII-only (em dashes in comments); `JsonEscape` now escapes `<` and `>` as `\u003c`/`\u003e` (the replace was a no-op).

### 3.0.0 (2026-10-28)
- **New:** server-side login audit (`loginaudit.nsf`), successful logins only, server time, trusted-proxy aware IP, parsed User-Agent, access source, new-IP/new-device flags, approximate duration, "This wasn't me", retention purge.
- **Changed:** Verse viewer rewritten (reads only the new agent; no `localStorage` fallback).
- **Security:** removed the anonymous client-triggered tracking agent (forgeable, attempt-only) and the partial-name history lookup; debug output removed; login page no longer sends tracking data.
- **Removed:** modular login form and its `config.js`/`js`/`css`/`i18n`/`samples`/`preview-server.js`, `EnterpriseLoginForm.html`, `DominoEmbeddedForm-AlphaCaptcha.html` (alpha CAPTCHA remains a config option), `names.nsf` Person-document storage, last-login `localStorage` banner.
- Client-side session-warning timer disabled by default (not tied to the real Domino session).

Earlier history: see git log (2.x).
