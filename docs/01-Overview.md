# Project Overview

> **Version:** 3.1.0 | **Compatible:** HCL Domino 12.0.1+ / 14.x, HCL Verse on-prem 3.2.x | **Last Updated:** 2026-10-29

## What this is

1. A custom Domino login page (`login-forms/DominoEmbeddedForm.html`): branding, 18 languages with RTL, dark/light theme, configurable CAPTCHA (math or alphanumeric canvas, with audio), TOTP step for Domino MFA, accessibility (WCAG 2.1 AA). All CSS/JS inline — deploy as one Pass-Thru HTML form in `DOMCFG.NSF`.
2. A **login audit** in a separate database `loginaudit.nsf`, written by agents, shown to the user in HCL Verse.
3. A **DXL installer** (`lotusscript/Installer/Agent0_Installer_DXL.lss`) that builds `loginaudit.nsf` (database, ACL, forms, views, script library, agents) from this repository in one run - see [`04-DXL-Install.md`](04-DXL-Install.md).

## Repository layout

```
lotusscript/                  ALL LotusScript, nothing else
  ScriptLibraries/            LoginAuditLib.lss
  Agents/                     LoginLanding, GetLoginHistory, Heartbeat, NotMe, PurgeLoginAudit (.lss)
  Installer/                  Agent0_Installer_DXL.lss  (one-shot installer, runs in a Notes client)
dxl/                          DXL design of loginaudit.nsf
  MANIFEST.txt                what is imported, in order (forms, views, library, agents)
  Forms/  Views/              *.form, *.view
login-forms/                  login page (Pass-Thru HTML for $$LoginUserForm in DOMCFG.NSF)
verse-extension/              LoginActivityViewer.html + applications.json / merge-snippet.json
scripts/                      bump-version.sh, lint_lss.py, validate_dxl.py (developer tools)
docs/                         01 overview, 02 deployment + tests, 03 Verse, 04 DXL install
```

Code stays in `.lss` files (one copy). The installer reads `dxl/MANIFEST.txt`, imports the form and view DXL as is, and **generates the script library and agent DXL from the `.lss` files** at install time, so DXL for agents and library is never hand-maintained and cannot drift from the code.

## Design elements of `loginaudit.nsf`

| Kind | Name | Created by | Used by |
|---|---|---|---|
| Form | `LoginEvent`, `AuditError` | installer (DXL) | agents write documents with `Form` = these names; admins open them to set `ReviewStatus` |
| View | `(LoginsByUser)` | installer (DXL) | every agent (col 1 `UserCanonical` ascending, col 2 `LoginTime` **descending**) |
| View | `(NotMeReports)`, `(AuditErrors)` | installer (DXL) | reviewers (`LocalDomainAdmins`) |
| Script library | `LoginAuditLib` | installer (built from `.lss`) | all agents (`Use "LoginAuditLib"`) |
| Agents | `LoginLanding`, `GetLoginHistory`, `Heartbeat`, `NotMe`, `PurgeLoginAudit` | installer (built from `.lss`) | web (`?OpenAgent`) and schedule |
| File resource | `LoginActivityViewer.html` | **by hand** (guide 02 section 4) | Verse window |
| Login form | `$$LoginUserForm` in `domcfg.nsf` | **by hand** (guide 02 section 1) | sign-in |

## Design rules

| Rule | Why |
|---|---|
| Identity comes from the server (`Remote_User`), never from the browser | A client-supplied username can be forged |
| Record only after authentication (landing agent) | Entries are real, successful logins |
| Server time, server-side User-Agent parsing | Client clocks and fields are user-controlled |
| Separate database, one document per login, Readers-protected | No writes to the Domino Directory; user sees only own events |
| Agents run as a least-privilege signer, fail closed on unknown identity | `EffectiveUserName` is the signer in that mode and is never used |
| Open-redirect and CSRF guards, input caps | Landing/NotMe/Heartbeat are reachable by any signed-in user |

## Event fields (`Form = "LoginEvent"`)

`UserCanonical`, `UserCommon`, `LoginTime` (date/time, server), `LoginTimeUTC` (ISO text), `IP`, `RemoteAddr`, `ForwardedFor`, `UserAgent`, `Browser`, `OS`, `DeviceType`, `DeviceKey`, `AccessSource`, `AuthMethod`, `FirstLogin`, `NewIP`, `NewDevice`, `Heartbeats`, `LastSeen`, `EndTime`, `EndReason`, `NotMeFlag`, `NotMeTime`, `ReviewStatus`, `Readers`.

## Where to read next

- [`04-DXL-Install.md`](04-DXL-Install.md) — build `loginaudit.nsf` with the DXL installer (recommended)
- [`02-Deployment-Guide.md`](02-Deployment-Guide.md) — login page, configuration, signing, test plan, production notes (also the manual build)
- [`03-Verse-Extension.md`](03-Verse-Extension.md) — Login Activity window in Verse
- [`../EVALUATION.md`](../EVALUATION.md) — what was wrong with the previous tracking and why it changed
