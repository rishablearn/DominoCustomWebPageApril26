# HCL Domino Login Page + Login Activity: Deployment Guide

> **Version:** 3.1.1 | **Last Updated:** 2026-10-29 | **Targets:** HCL Domino 12.0.1+ / 14.x, HCL Verse on-premises 3.2.x (developed against 3.2.7)  
> Written to documented HCL behaviour; **not yet executed on a server**. Items marked *(verify)* must be confirmed in testing. Use a non-production server first.

Placeholders used below: `<SERVER>`, `<SERVICE_ID>` (the ID that signs the agents), `<REPO_FOLDER>` (this repository on the admin workstation), `<PROXY_IP_1>`. Never put real credentials in these files.

## Contents

1. Overview
2. Requirements
3. Build `loginaudit.nsf` with the DXL installer
4. Configure, compile and sign
5. Viewer file resource
6. Login page in `domcfg.nsf`
7. Verse extension
8. Test plan
9. Production notes and go-live checklist
10. Troubleshooting
- Appendix A. Manual build (without the installer)
- Appendix B. DXL reference

---

## 1. Overview

A branded Domino login page (self-contained HTML, deployed in `domcfg.nsf`) plus a server-side **login audit**: users see their last 5 successful logins (IP, time, approximate session duration, access source, new-IP / new-device flags) in an HCL Verse **Login Activity** window and can report a sign-in as **This wasn't me**.

```
Browser --POST /names.nsf?Login--> Domino authenticates (password [+ TOTP])
        <-- redirect: /loginaudit.nsf/LoginLanding?OpenAgent&next=/verse
Browser --> LoginLanding agent   identity = server-set Remote_User (not client data)
                                 writes a LoginEvent document: server time, IP, User-Agent,
                                 access source, new-IP / new-device flags
        <-- redirect to /verse
Verse > More > Login Activity --> LoginActivityViewer.html
                                  +- GetLoginHistory  (last 5, exact user match)
                                  +- Heartbeat        (approximate session duration)
                                  +- NotMe            ("This wasn't me" report)
Nightly: PurgeLoginAudit deletes events older than the retention period.
```

### Repository layout

```
nsf/                        everything that goes INTO loginaudit.nsf
  MANIFEST.txt              what the installer imports, in order
  Forms/  Views/            DXL (*.form, *.view)
  ScriptLibraries/          LoginAuditLib.lss
  Agents/                   LoginLanding, GetLoginHistory, Heartbeat, NotMe, PurgeLoginAudit (*.lss)
  WebContent/               LoginActivityViewer.html (imported by hand as a file resource)
installer/                  Agent0_Installer_DXL.lss, runs once in a Notes client
domcfg/                     DominoEmbeddedForm.html, the login page for domcfg.nsf
verse/                      applications.json, merge-snippet.json (Verse registration)
tools/                      bump-version.sh, lint_lss.py, validate_dxl.py, build_docs.py, github-sync.sh
archive/                    EVALUATION.md (review that led to this design)
README.md  Deployment.md  Deployment.html  CHANGELOG.md  VERSION
```

Code lives in `.lss` files only (one copy). The installer imports forms and views as DXL and **generates the DXL for the script library and agents from the `.lss` files** at install time, so nothing is maintained twice.

### Design rules

| Rule | Why |
|---|---|
| Identity comes from the server (`Remote_User`), never from the browser | A client-supplied username can be forged |
| Record only after authentication (landing agent) | Entries are real, successful logins |
| Server time, server-side User-Agent parsing | Client clocks and fields are user-controlled |
| Separate database, one document per login, Readers-protected | No writes to the Domino Directory; a user sees only own events |
| Agents run as a least-privilege signer and fail closed on unknown identity | `EffectiveUserName` is the signer in that mode and is never used |
| Open-redirect and CSRF guards, input caps | Landing, NotMe and Heartbeat are reachable by any signed-in user |

### Known limitations

- Only **successful** web logins are recorded; a failed login never reaches the landing agent.
- Session duration is approximate and measured only while a heartbeat source (the viewer) is open; otherwise "Not measured".
- Notes-client, mobile-sync, API and SSO/OIDC logins that bypass the form are not recorded unless their post-login URL goes through `LoginLanding`.
- Behind a reverse proxy the real client IP depends on your proxy setup (section 9.1).

## 2. Requirements

- HCL Domino 12.0.1+ / 14.x server; HCL Verse on-premises 3.2.x for the Login Activity window.
- A Notes client with Domino Designer and an admin ID that may create databases on `<SERVER>` (for the installer).
- `<SERVICE_ID>`: a dedicated ID that signs the design. It must be a member of the reviewer group `LocalDomainAdmins` (Readers fields also apply to agents) and listed in *Run restricted LotusScript/Java agents* on the server.
- Python 3 (optional) for `tools/lint_lss.py` and `tools/validate_dxl.py`.

## 3. Build `loginaudit.nsf` with the DXL installer

One LotusScript agent, `installer/Agent0_Installer_DXL.lss`, runs in the Notes client and builds the database with `NotesDXLImporter`. **Not yet run on a Domino server**; use a non-production server first. It never touches `names.nsf` or `domcfg.nsf`, and never imports documents.

### 3.1 What it creates

| Element | Names | Source |
|---|---|---|
| Database | `loginaudit.nsf`, title "Login Audit v3.1.0" | installer constants |
| ACL (new database only) | `-Default-` Reader (signed-in users run the agents; documents stay protected by `Readers` fields), `Anonymous` No Access, `LocalDomainServers` Manager, `LocalDomainAdmins` Editor (reviews "not me" reports, sets `ReviewStatus`), `<SERVICE_ID>` Editor with create and delete (purge agent), the running ID Manager. **No custom roles.** | installer constants |
| Forms (2) | `LoginEvent`, `AuditError` | `nsf/Forms/` |
| Views (3) | `(LoginsByUser)`, `(NotMeReports)`, `(AuditErrors)` | `nsf/Views/` |
| Script library (1) | `LoginAuditLib` | `nsf/ScriptLibraries/` |
| Agents (5) | `LoginLanding`, `GetLoginHistory`, `Heartbeat`, `NotMe`, `PurgeLoginAudit`: trigger *Action menu selection*, target None, **not** run as web user | `nsf/Agents/` |

### 3.2 Run it

1. Open a scratch NSF (not `loginaudit.nsf`) in Domino Designer: **Agents > New Agent** `Installer`, LotusScript, trigger *Action menu selection*, target *None*.
2. Paste `installer/Agent0_Installer_DXL.lss`: the lines under `'(Options)` go to Options, the `Const`/`Dim` lines to Declarations, each `Sub`/`Function` into its own entry (`Initialize` into the Initialize event). Save; a compile error means stop.
3. Set the constants at the top and replace every `<PLACEHOLDER>`:

| Constant | Set to |
|---|---|
| `TARGET_SERVER` | `<SERVER>` or `LOCAL` (this workstation) |
| `TARGET_FILE` | `loginaudit.nsf` (or a path such as `apps\loginaudit.nsf`) |
| `REPO_FOLDER` | `<REPO_FOLDER>`, the folder that **contains** `nsf`, as seen by **this workstation**, e.g. `/Users/<you>/CascadeProjects/DominoCustomWebPageApril26` or `C:\Temp\DominoCustomWebPage` |
| `SIGNER_ID` | `<SERVICE_ID>` |
| `REVIEW_GROUP` / `SERVER_GROUP` | defaults `LocalDomainAdmins` / `LocalDomainServers`; keep `REVIEW_GROUP` equal to `READER_ADMIN_GROUP` in `LoginAuditLib.lss` |
| `INSTALL_MODE` | `NEW` first install (stops if the database exists); `UPDATE` import into the existing database (same-named design is replaced, ACL unchanged unless `APPLY_ACL = True`); `CHECK` changes nothing and reports what exists |
| `INSTALL_DESIGN`, `INSTALL_CODE` | `True`, `True` (stage 1 forms and views, stage 2 library and agents) |
| `AGENTS_UNRESTRICTED` | `False`; `True` only if testing shows a restricted-operation error |

4. **Actions > Installer.** It checks the settings, that installer and files have the same version, and that every manifest file exists, all **before creating anything**. It then shows target and counts and asks to continue (default No), creates the NSF and ACL, imports stage 1 then stage 2, re-opens the database from disk and reports `Forms: 2 of 2 found` ... `Agents: 5 of 5 found`. Logs and the exact DXL sent are written to `<REPO_FOLDER>/installer_*.log` (git-ignored). **Open exactly the database it names.**
5. Continue with section 4. Delete the `Installer` agent from the scratch database.

### 3.3 Upgrade

Copy the matching `Agent0_Installer_DXL.lss` (its `INSTALLER_VERSION` must equal the `' Version` header of `LoginAuditLib.lss`), set `INSTALL_MODE = "UPDATE"`, run, then recompile and re-sign. **Same-named design elements are replaced**, including the constants in `LoginAuditLib`: back up the NSF and re-apply your production constants afterwards. Event documents are untouched.

## 4. Configure, compile and sign

1. **Constants.** In Designer open script library `LoginAuditLib` and edit the constants at the top (production values: section 9): `TRUSTED_PROXIES`, `SECURITY_MAILBOX`, `AUTH_METHOD_LABEL`, `RETENTION_DAYS`, `ALERT_ON_NEW_SIGNIN`, `READER_ADMIN_GROUP`, `EXTRA_READER`. Keep `PURGE_DRY_RUN = True` in `PurgeLoginAudit` until you have read its log.
2. **Recompile and sign.** Designer: *Tools > Recompile All LotusScript*, then select all design elements and sign with `<SERVICE_ID>` (*Tools/File > Sign*). Freshly imported agents are unsigned; Notes reports "Document is not signed" until this is done.
3. **Schedule the purge agent.** `PurgeLoginAudit` is imported as an Action-menu agent. Change it to *On schedule > Daily, 02:00, run on server*, *Which documents* = None.
4. **Server security.** Server document > **Security** > add `<SERVICE_ID>` to *Run restricted LotusScript/Java agents* (the agents use only standard Notes classes). `tell http restart`.
5. **Database property.** Advanced tab: tick *Don't maintain unread marks* (the DXL import does not set database properties).

> **Agent triggers.** The installer imports the web agents with *Action menu selection* and target None (the pattern used in `DominoPasswordReset-March2026`); this also answers `?OpenAgent`. If testing shows HTTP 500 on `?OpenAgent`, change the trigger to *On schedule > Never*. Any event trigger makes `?OpenAgent` return HTTP 500.
>
> **Why "run as web user" is off.** The agents run as the signer, so they can write although users only have Reader access. The user is identified from `Remote_User`, not from the run-as setting. Do **not** change the code to use `EffectiveUserName`.

## 5. Viewer file resource

Designer > `loginaudit.nsf` > **Resources > Files > New File Resource** > `nsf/WebContent/LoginActivityViewer.html`, name `LoginActivityViewer.html`, MIME `text/html`. URL: `https://<SERVER>/loginaudit.nsf/LoginActivityViewer.html`. The page and the agents share one origin, so no CORS setup is needed; the page uses only `textContent` and makes no external requests.

## 6. Login page in `domcfg.nsf`

1. Domino Administrator > **File > Application > New**, template *Domino Web Server Configuration (DOMCFG5.NTF)*, file `domcfg.nsf`.
2. ACL: `Anonymous = Reader` (the form must be readable before sign-in), `LocalDomainServers = Manager`.
3. Designer > `domcfg.nsf` > new form **`$$LoginUserForm`** > paste all of `domcfg/DominoEmbeddedForm.html` > select all > **Text > Pass-Thru HTML** (text turns green) > save.
4. Notes client > `domcfg.nsf` > **Create > Sign In Form Mapping**: *Login form database* = `domcfg.nsf`, *Login form name* = `$$LoginUserForm`.
5. `tell http restart`.

**Turn the audit on.** In `DominoEmbeddedForm.html`, inline `DominoLoginConfig`:

```javascript
features: { enableLoginAudit: true, /* ... */ },
loginAudit: {
    enable: true,
    landingUrl: "/loginaudit.nsf/LoginLanding?OpenAgent",
    defaultNext: "/verse"          // where users land if no RedirectTo
},
debug: { showStatusPanel: false }  // true only while configuring
```

Re-paste as Pass-Thru HTML after every edit, then `tell http restart`. The form then sets `RedirectTo` to the landing agent; the browser sends **no** tracking data.
**Rollback:** set `features.enableLoginAudit = false`, re-paste. Data stays in `loginaudit.nsf`.

## 7. Verse extension

Adds **Login Activity** to the Verse navbar *More* menu (`com.ibm.action.link`, order 96500; order values 96000-96999 place a link in the *More* menu; `link` must be an absolute HTTPS URL). It opens a window with the user's last 5 sign-ins, a **This wasn't me** button and a **Sign out** button.

```
Verse navbar > More > "Login Activity"
        +--> https://<SERVER>/loginaudit.nsf/LoginActivityViewer.html   (file resource, section 5)
                +- GET  /loginaudit.nsf/GetLoginHistory?OpenAgent
                +- POST /loginaudit.nsf/Heartbeat?OpenAgent     (every 60 s while open)
                +- POST /loginaudit.nsf/NotMe?OpenAgent
```

1. **No existing `applications.json`:** edit `verse/applications.json`, replace `YOUR_DOMINO_SERVER` with your host name.
2. **You already have one:** it is a JSON **array**. Add the object from `verse/merge-snippet.json` (after replacing `YOUR_DOMINO_SERVER`) as one more element and validate the JSON.
3. **Provider (Domino `notes.ini`)**, local file:

```ini
VOP_Extensibility_Data_Provider_Name=localFileProvider
VOP_Extensibility_Applications_Json_FilePath=<PATH_ON_SERVER>/applications.json
```

or HTTP:

```ini
VOP_Extensibility_Data_Provider_Name=httpDataProvider
VOP_Extensibility_Applications_Json_URL=https://<SERVER>/verse/applications.json
```

Restart HTTP (`tell http restart`) after changing `notes.ini`. Later edits to `applications.json` should not need a restart *(verify on your deployment)*.

**Test:** Verse > **More** > **Login Activity** opens a window (allow pop-ups); your sign-ins are listed newest first with the current one tagged *This device*; after 3+ minutes **Refresh** shows "approx. N min (active)". Then run section 8.

**Session duration.** Measured by the viewer's heartbeat while it is open and by **Sign out**, which ends the session record before redirecting to Domino's logout. Verse 3.2.7 documents no always-on background extension point; do not use `modifyOnSend` (it blocks sending if it does not answer within 30 seconds).

**Security.** Only the signed-in user's events are shown (exact canonical-name match). "This wasn't me" and heartbeat calls need a custom request header, and the event must belong to the caller. Stored: login time, IP, User-Agent (browser/OS), access source; no passwords, tokens or cookies. See HCL's [Verse security practices](https://opensource.hcltechsw.com/Verse-Extension-Documentation/docs/best-security-practices/).

---

## 8. Test plan (testing environment: native Domino auth, no proxy)

Run in order. Use two test users (A, B) and two browsers.

**8.0 Quick flow check.** Open `https://<SERVER>/loginaudit.nsf/LoginLanding?OpenAgent&next=/verse` while signed in: you are redirected to `/verse` and a `LoginEvent` appears in `(LoginsByUser)`.

**8.1 Diagnostics first.** Temporarily set `DIAG_MODE = True` in `LoginLanding`, re-save/sign, open the landing URL signed in. Confirm: `Remote_User (raw)` is the user (not blank/Anonymous), `Caller (canonical)` is `CN=.../O=...`, `Remote_Addr` is your client IP, `X-Forwarded-For` is empty. `EffectiveUserName` should show the **signer** — that confirms run-as-signer. Set `DIAG_MODE = False` again, re-sign.

| # | Test | Expected |
|---|---|---|
| 1 | Sign in via the login page as A | Lands on `/verse`; 1 new event for A with your IP, correct browser/OS, `FirstLogin=1`, `NewIP=0`, `NewDevice=0`, server time |
| 2 | Reload landing URL within 15 s | No second event (dedupe) |
| 3 | Sign in as A from a second browser on the same machine | New event, `NewDevice=1`, `NewIP=0` |
| 4 | Sign in as A with a wrong password | **No** event |
| 5 | Open Login Activity in Verse as A | Table shows A's events, newest first; "This device" tag on the current one; no events from B |
| 6 | Same as B | Only B's events |
| 7 | `GetLoginHistory?OpenAgent` while signed out (private window) | `{"ok":false,"reason":"auth","events":[]}` |
| 8 | `LoginLanding?OpenAgent&next=https://evil.example` (signed in) | Redirects to `/verse`, not to the external site. Also try `next=//evil.example` and `next=/%5Cevil` |
| 9 | Heartbeat without header: browser address bar `…/Heartbeat?OpenAgent` | `{"ok":false,"reason":"bad_request"}` |
| 10 | Keep the viewer open 3+ min, Refresh | Duration shows "≈ N min (active)" for the current session |
| 11 | In DevTools run `fetch('/loginaudit.nsf/Heartbeat?OpenAgent&end=1',{method:'POST',headers:{'X-Requested-With':'LoginAudit'},credentials:'same-origin'}).then(r=>r.text()).then(console.log)` | `state":"ended"`; viewer shows final duration |
| 12 | Press **This wasn't me** on an A event | Event flagged; appears in `(NotMeReports)` with `ReviewStatus=OPEN`; mail sent if `SECURITY_MAILBOX` set |
| 13 | As B, `POST NotMe` with A's event UNID | `{"ok":false,"reason":"not_found"}`; A's event unchanged |
| 14 | `POST NotMe` without the `X-Requested-With` header | `bad_request` |
| 15 | Log in as A where the Person's name differs in case/format | Event stored under the canonical name; history still found |
| 16 | Open the DB views in a browser as B (`/loginaudit.nsf/(LoginsByUser)?OpenView`) | B sees **no** documents of A (Readers) |
| 17 | Purge agent with `PURGE_DRY_RUN = True` | Agent log reports counts, deletes nothing. Then set old `LoginTime` on a test doc, set `False`, run: only that doc deleted; an `OPEN` report is kept |
| 18 | Break the view name (rename `(LoginsByUser)`), sign in | User still lands on `/verse`; an `AuditError` doc is written |
| 19 | Many rapid landing requests (e.g. 20 reloads) | No more than one event per 15 s per IP+device |

Record the actual results; anything that differs from "Expected" is a defect to fix before production.

Verify on the **server console** after test 1: `tell http` shows no agent errors; Domino log has no "Agent signer not allowed to run" messages.


---

## 9. Production notes

### 9.1 Reverse proxy / WAF — real client IP

- By default Domino exposes the proxy's address in `Remote_Addr`. The code reads `X-Forwarded-For` **only** when `Remote_Addr` is in `TRUSTED_PROXIES`, then takes the right-most address that is not a trusted proxy.
- In `LoginAuditLib`: `Const TRUSTED_PROXIES = "<PROXY_IP_1>,<PROXY_IP_2>"`. Leave empty in testing.
- The proxy must **append** to (or overwrite) `X-Forwarded-For`, and Domino's HTTP port must accept traffic **only from the proxy** (firewall), otherwise anyone could spoof the header.
- Confirm with `DIAG_MODE = True` through the proxy: `Remote_Addr` = proxy IP, `X-Forwarded-For` present, `Client IP (computed)` = the real user.
- The older `$WS*` "connector header" approach: community reports say Domino 12.0.1 changed its behaviour. Do not rely on it; check HCL's current documentation for your version *(verify)*. Domino's IP allow/deny lists have been reported not to see the real client IP behind a proxy *(verify)*.
- Domino's own `HTTP_LOG_ACCESS_XFORWARDED_FOR` setting only affects Domino's access log, not CGI variables.

### 9.2 MFA (TOTP) and OIDC

- **TOTP:** configure Domino MFA on the server (see HCL docs); in the login form set `features.enableMFA = true`, `mfa.enable = true`. Domino enforces MFA; the login form is only the UI. In `LoginAuditLib` set `AUTH_METHOD_LABEL = "Domino password + TOTP"` (a label — the server's policy is authoritative).
- **OIDC / SAML:** these flows normally do **not** go through the custom form, so the landing agent is not called automatically. To record those logins, the post-login start URL must be `/loginaudit.nsf/LoginLanding?OpenAgent&next=/verse` (for example the entry link users open, or an IdP/proxy post-login redirect). The agent identifies the user by `Remote_User` as long as the Domino session exists *(verify with your OIDC setup)*. Set `AUTH_METHOD_LABEL` accordingly.

### 9.3 Go-live checklist

- [ ] `loginaudit.nsf` built (DXL installer, section 3, or Appendix A), recompiled and signed; installer agent deleted from the scratch database
- [ ] section 8 test plan passed in a staging copy
- [ ] `TRUSTED_PROXIES` set and verified with `DIAG_MODE`; `DIAG_MODE = False`; status panel off
- [ ] `ALERT_ON_NEW_SIGNIN` decision made (mail to the user on new IP/device; needs mail routing) — default `False`
- [ ] `SECURITY_MAILBOX` set to the review mailbox; `LocalDomainAdmins` members know they review `(NotMeReports)`
- [ ] `RETENTION_DAYS` decided (180 = 6 months, 365 = 1 year); **legal/privacy review** of storing IP + User-Agent (personal data in many jurisdictions), user notice, access/erasure process
- [ ] `PurgeLoginAudit` scheduled (Daily 02:00, on the server)
- [ ] `PURGE_DRY_RUN` run once, log reviewed, then set `False` and re-sign
- [ ] Signer ID is a dedicated service ID with the minimum rights above
- [ ] Verse extension deployed and tested (section 7)
- [ ] Rollback: set `features.enableLoginAudit = false` in the form (users then redirect as before) and re-paste; data stays in `loginaudit.nsf`

### 9.4 Known behaviour to explain to users and stakeholders

- Only **successful** web logins are listed; failed attempts are not shown.
- Duration is approximate and measured only while the Login Activity page (or another heartbeat source) is open; otherwise "Not measured".
- Options to measure duration better, to evaluate later: derive last-activity from the Domino web access log database, or a Verse widget/extension page that stays loaded — Verse 3.2.7 documents no always-on background extension point, and the hidden `modifyOnSend` iframe is not suitable (it blocks sending if it does not answer in 30 s).

---

## 10. Troubleshooting

| Symptom | Likely cause | Verify / fix |
|---|---|---|
| Landing returns the login form HTML | Agent URL not reachable for signed-in user | DB ACL `-Default-` must be Reader or higher |
| HTTP 500 on `?OpenAgent` | Agent trigger is not *On Schedule → Never* | Change trigger, re-sign |
| Redirect works, no event written | Remote_User blank, or signer lacks access | Run `DIAG_MODE`; check `(AuditErrors)`; signer needs Editor access and membership of `LocalDomainAdmins` (or `EXTRA_READER`) |
| `AuditError`: "View (LoginsByUser) not found" | View name wrong or not created | Appendix A.1 exact name with parentheses |
| History empty but events exist | Events saved under a different canonical name, or Readers excludes user | Compare `UserCanonical` with the DIAG canonical name |
| Newest event not first | View column 2 not sorted descending | Appendix A.1 |
| Installer: "this installer is vX but the project files are vY" | Installer and repository are different versions | Copy `installer/Agent0_Installer_DXL.lss` from the same commit |
| Installer: `warning ... id 7118/12051` in `installer_*.log` | Compile error in the library; agents cascade | Fix the first error, re-run with `INSTALL_MODE = "UPDATE"` |
| After `UPDATE`, constants are back to defaults | `LoginAuditLib` was replaced | Re-apply `TRUSTED_PROXIES`, `SECURITY_MAILBOX`, `RETENTION_DAYS`; recompile; re-sign |
| Heartbeat always `no_session` | IP/device differs from login (e.g. VPN switch, different browser), or gap > 60 min | Expected; duration then stays "Not measured" |
| Everyone shows the proxy IP | `TRUSTED_PROXIES` empty or wrong | section 9.1 |
| Viewer shows "not signed in" | Viewer opened without a session | Sign in to Verse first |
| Installer: "this installer is vX but the project files are vY" | Installer and repository are different versions | Copy `installer/Agent0_Installer_DXL.lss` from the same commit |
| Installer: "contains non-ASCII characters" | A `.lss` file has a non-ASCII character | Keep `.lss` ASCII (`python3 tools/lint_lss.py .`) |
| Installer: `warning ... id 7118/12051` in `installer_*.log` | Compile error in the library; the agents cascade | Fix the first error (the library), re-run with `INSTALL_MODE = "UPDATE"` |
| Installer: `fatalerror ... Unexpected <element>` | DXL breaks the DTD | `python3 tools/validate_dxl.py nsf` names the file and element |
| Installer: ACL setup failed | Message shows why | Delete the database and re-run `NEW`, or `UPDATE` with `APPLY_ACL = True` |
| After an `UPDATE`, constants are back to defaults | `LoginAuditLib` was replaced | Re-apply `TRUSTED_PROXIES`, `SECURITY_MAILBOX`, `RETENTION_DAYS`; recompile; re-sign |
| "Document is not signed" when running an agent | Imported agents are unsigned | Section 4: recompile and sign |
| `?OpenAgent` returns HTTP 500 | Agent trigger is an event trigger, or unsigned | Section 4 (trigger note), re-sign |
| No "Login Activity" in Verse More menu | `applications.json` not loaded | Section 7: check the `notes.ini` provider lines and path, restart HTTP, hard-refresh Verse |
| Viewer window blank / 404 | File resource missing or wrong database | URL must be `/loginaudit.nsf/LoginActivityViewer.html` (section 5) |
| Viewer: "history is temporarily unavailable" | Agent error | Check the `(AuditErrors)` view |
| Viewer: pop-up blocked | Browser setting | Allow pop-ups for the Domino server |

---

## Appendix A. Manual build (without the installer)

Use this only if you do not use the installer; do **not** do both (the installer replaces same-named design elements). Create `loginaudit.nsf` (title "Login Audit") in Domino Administrator, set the ACL as in section 3.1, then:

### A.1 Views

Designer > New View; the names include the parentheses (hidden from menus).

**`(LoginsByUser)`**, required by every agent. Selection `SELECT Form = "LoginEvent"`:

| Col | Formula | Sort |
|---|---|---|
| 1 | `UserCanonical` | **Ascending** |
| 2 | `LoginTime` | **Descending** |
| 3 | `IP` | none |

Column 2 descending makes "newest first" work; do not change these two columns.

**`(NotMeReports)`**, for reviewers: `SELECT Form = "LoginEvent" & NotMeFlag = "1"`; columns `ReviewStatus`, `UserCanonical`, `LoginTime` (descending), `IP`.
**`(AuditErrors)`**: `SELECT Form = "AuditError"`; columns `ErrWhen` (descending), `Agent`, `ErrNum`, `ErrMsg`.

### A.2 Forms

`LoginEvent` and `AuditError` are optional by hand (they let admins open an event and set `ReviewStatus` to `CLOSED`). Fields are listed in Appendix B; `Readers` must be a *readers* field.

### A.3 Library and agents

1. **Shared Code > Script Libraries > New**, name `LoginAuditLib`, paste `nsf/ScriptLibraries/LoginAuditLib.lss`, edit the constants, save.
2. **Shared Code > Agents > New** for each agent (paste the file from `nsf/Agents/`), *Which documents* = **None**:

| Agent | Trigger | Run as web user |
|---|---|---|
| `LoginLanding`, `GetLoginHistory`, `Heartbeat`, `NotMe` | On schedule > **Never** | **Unchecked** |
| `PurgeLoginAudit` | On schedule > Daily 02:00, run on server | n/a |

3. Recompile, sign and secure the server as in section 4.

## Appendix B. DXL reference

`nsf/MANIFEST.txt` is the single list of what is imported (`F` form, `V` view, `L` library, `A` agent; paths relative to `nsf/`; library order matters). To change the design, edit these files and run the installer in `UPDATE` mode.

| File | Defines |
|---|---|
| `nsf/Forms/LoginEvent.form` | 26 fields: `UserCanonical`, `UserCommon`, `LoginTime` (date/time, server), `LoginTimeUTC`, `IP`, `RemoteAddr`, `ForwardedFor`, `UserAgent`, `Browser`, `OS`, `DeviceType`, `DeviceKey`, `AccessSource`, `AuthMethod`, `FirstLogin`, `NewIP`, `NewDevice`, `Heartbeats` (number), `LastSeen`, `EndTime`, `EndReason`, `NotMeFlag`, `NotMeTime`, `ReviewStatus`, `Form`, `Readers` (readers) |
| `nsf/Forms/AuditError.form` | `ErrWhen`, `Agent`, `ErrNum`, `ErrLine`, `ErrMsg`, `Form`, `Readers` |
| `nsf/Views/LoginsByUser.view` | `(LoginsByUser)`: `UserCanonical` ascending, `LoginTime` descending, `IP` |
| `nsf/Views/NotMeReports.view` | `(NotMeReports)` |
| `nsf/Views/AuditErrors.view` | `(AuditErrors)`, newest first |
| `nsf/ScriptLibraries/*.lss`, `nsf/Agents/*.lss` | the installer splits each file into options, declarations and one code element per `Sub`/`Function`; `Sub`/`Function`/`End` lines must start in column 1 and files must be ASCII |

Rules checked by `tools/validate_dxl.py`: `<run>` holds plain text only; no whitespace between tags inside `par`, `field`, `code`, `column`; field types `text`, `number`, `datetime`, `names`, `keyword`, `richtext`, `readers`; a view is its `selection` code followed by columns. The importer uses *replace else create* for design and **ignores documents and ACL**.

Run before every release: `python3 tools/lint_lss.py .` and `python3 tools/validate_dxl.py nsf`. Release: `bash tools/bump-version.sh X.Y.Z`, add the entry to `CHANGELOG.md`, `bash tools/github-sync.sh -m "release: vX.Y.Z"`.
