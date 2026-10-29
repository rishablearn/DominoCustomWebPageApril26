# Building loginaudit.nsf with the DXL installer

> **Version:** 3.1.0 | **Last Updated:** 2026-10-29  
> Same pattern as `DominoPasswordReset-March2026`. **Not yet run on a Domino server** - use a non-production server first.

One LotusScript agent, `deploy/notes-client/Agent0_Installer_DXL.lss`, runs in the Notes client and builds `loginaudit.nsf` with `NotesDXLImporter`. It replaces the manual steps of `02-Deployment-Guide.md` sections 2.1, 2.2 and 3 (steps 1-2).

## Contents of the DXL

`deploy/dxl/MANIFEST.txt` is the single list of what is imported (`F` form, `V` view, `L` library, `A` agent; paths relative to the repository root; library order matters). Changing the design means editing these files and running the installer in `UPDATE` mode.

| File | Defines |
|---|---|
| `deploy/dxl/Forms/LoginEvent.form` | 26 fields: identity (`UserCanonical`, `UserCommon`), time (`LoginTime` date/time, `LoginTimeUTC`), network (`IP`, `RemoteAddr`, `ForwardedFor`), device (`UserAgent`, `Browser`, `OS`, `DeviceType`, `DeviceKey`), context (`AccessSource`, `AuthMethod`), flags (`FirstLogin`, `NewIP`, `NewDevice`), session (`Heartbeats` number, `LastSeen`, `EndTime`, `EndReason`), review (`NotMeFlag`, `NotMeTime`, `ReviewStatus`), `Form`, `Readers` (readers field) |
| `deploy/dxl/Forms/AuditError.form` | `ErrWhen`, `Agent`, `ErrNum`, `ErrLine`, `ErrMsg`, `Form`, `Readers` |
| `deploy/dxl/Views/LoginsByUser.view` | `(LoginsByUser)`: `SELECT Form = "LoginEvent"`; `UserCanonical` ascending, `LoginTime` descending, `IP` |
| `deploy/dxl/Views/NotMeReports.view` | `(NotMeReports)`: `SELECT Form = "LoginEvent" & NotMeFlag = "1"` |
| `deploy/dxl/Views/AuditErrors.view` | `(AuditErrors)`: `SELECT Form = "AuditError"`, newest first |
| `lotusscript/*.lss` | library and agents; the installer splits each file into options, declarations and one code element per `Sub`/`Function` (so `Sub`/`Function`/`End` lines must start in column 1 and files must be ASCII) |

DXL rules checked by `deploy/scripts/validate_dxl.py`: `<run>` holds plain text only; no whitespace between tags inside `par`, `field`, `code`, `column`; field types `text`, `number`, `datetime`, `names`, `keyword`, `richtext`, `readers`; view = `selection` code then columns. The importer runs with `REPLACE_ELSE_CREATE` for design, and **ignores documents and ACL** (the ACL comes from the installer's own `SetupACL`).

## What it creates

| Element | Names | Source |
|---|---|---|
| Database + ACL (new DB only) | `loginaudit.nsf`, "Login Audit v3.1.0"; `-Default-` Reader, `Anonymous` No Access, `LocalDomainServers` Manager, `LocalDomainAdmins` Editor, signer Editor (create + delete), running ID Manager | installer constants |
| Forms (2) | `LoginEvent`, `AuditError` | `deploy/dxl/Forms/` |
| Views (3) | `(LoginsByUser)` (col 1 `UserCanonical` asc, col 2 `LoginTime` **desc**, col 3 `IP`), `(NotMeReports)`, `(AuditErrors)` | `deploy/dxl/Views/` |
| Script library (1) | `LoginAuditLib` | `lotusscript/LoginAuditLib.lss` |
| Agents (5) | `LoginLanding`, `GetLoginHistory`, `Heartbeat`, `NotMe`, `PurgeLoginAudit` (Action menu, target None, **not** run as web user) | `lotusscript/*.lss` |

The list and library order are in `deploy/dxl/MANIFEST.txt`. The `.lss` files are the only copy of the code; the installer builds the DXL from them. It never touches `names.nsf` or `domcfg.nsf`.

## Not done by the installer

| Item | Where |
|---|---|
| Login page in `domcfg.nsf` | `02-Deployment-Guide.md` section 1 |
| Edit constants in `LoginAuditLib` (`TRUSTED_PROXIES`, `SECURITY_MAILBOX`, `RETENTION_DAYS` ...) | section 8 |
| **Recompile all LotusScript and sign everything** with the service ID | section 3 step 3 |
| `PurgeLoginAudit` schedule: Daily 02:00, run on server (imported as Action-menu agent; stays in dry-run until you change `PURGE_DRY_RUN`) | section 3 |
| Verse viewer file resource `LoginActivityViewer.html` | section 4 |
| Server document: *Run restricted LotusScript/Java agents* for the signer | section 3 step 4 |
| Database property *Don't maintain unread marks* | section 2.3 |

## Run it

1. Open a scratch NSF (not `loginaudit.nsf`) in Domino Designer: **Agents > New Agent** `Installer`, LotusScript, trigger *Action menu selection*, target *None*.
2. Paste `Agent0_Installer_DXL.lss` (lines under `'(Options)` into Options; `Const`/`Dim` into Declarations; each `Sub`/`Function` into its own entry, `Initialize` into the Initialize event). Save; a compile error means stop.
3. Set the constants at the top:

| Constant | Set to |
|---|---|
| `TARGET_SERVER` | `<SERVER>` or `LOCAL` |
| `TARGET_FILE` | `loginaudit.nsf` (or a path) |
| `REPO_FOLDER` | repository root as seen by **this workstation** (contains `deploy` and `lotusscript`), e.g. `/Users/<you>/CascadeProjects/DominoCustomWebPageApril26` |
| `SIGNER_ID` | `<SIGNER_ID>`: service ID that signs the design; **must be a member of `LocalDomainAdmins`** (Readers fields apply to agents) |
| `REVIEW_GROUP` / `SERVER_GROUP` | defaults `LocalDomainAdmins` / `LocalDomainServers`; keep `REVIEW_GROUP` equal to `READER_ADMIN_GROUP` in `LoginAuditLib.lss` |
| `INSTALL_MODE` | `NEW` first; `UPDATE` to replace same-named design (ACL unchanged unless `APPLY_ACL = True`); `CHECK` changes nothing and lists what exists |

4. **Actions > Installer**. It checks settings, versions and that every manifest file exists **before creating anything**, shows target and counts, and asks to continue (default No). Then it creates the NSF and ACL, imports forms and views (stage 1), then the library and agents (stage 2), re-opens the database from disk and reports `Forms: 2 of 2 found` ... `Agents: 5 of 5 found`. Stage logs and the exact DXL sent: `<REPO_FOLDER>/installer_*.log` (git-ignore them).
5. Recompile, sign, schedule the purge agent, import the viewer, then run the test plan (`02-Deployment-Guide.md` section 7). Delete the `Installer` agent.

## Upgrade

Copy the matching `Agent0_Installer_DXL.lss` (its `INSTALLER_VERSION` must equal the `' Version` header of `LoginAuditLib.lss`), set `INSTALL_MODE = "UPDATE"`, run, recompile, re-sign. **Local edits to same-named design are replaced**, including the constants in `LoginAuditLib`: back up the NSF and re-apply your production constants. Existing event documents are untouched (documents are never imported).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| "this installer is vX but the project files are vY" | Copy the installer from the same commit |
| "contains non-ASCII characters" | Keep `.lss` ASCII (`python3 deploy/scripts/lint_lss.py .`) |
| `warning ... id 7118/12051` in the import log | Compile error; fix the first one (the library), re-run `UPDATE` |
| `fatalerror ... Unexpected <element>` | DXL breaks the DTD; run `python3 deploy/scripts/validate_dxl.py deploy/dxl` |
| ACL setup failed | Message shows why; delete the DB and rerun `NEW`, or `UPDATE` with `APPLY_ACL = True` |
| `?OpenAgent` returns the login form | `-Default-` must be Reader or higher; agents must be signed |
| History empty, events exist | Signer is not in `LocalDomainAdmins` (Readers field) |

Before packaging a change, run both checks: `python3 deploy/scripts/lint_lss.py .` and `python3 deploy/scripts/validate_dxl.py deploy/dxl`.
