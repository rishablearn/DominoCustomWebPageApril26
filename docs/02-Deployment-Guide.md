# Deployment Guide and Test Plan

> **Version:** 3.1.0 | **Last Updated:** 2026-10-29  
> Written to documented HCL behaviour; **not yet executed on a server**. Items marked *(verify)* must be confirmed in testing.

Placeholders: `<SERVER>`, `<SERVICE_ID>` (agent signer; must be a member of `LocalDomainAdmins`). Never put real credentials in these files.

---

## 1. Login page in DOMCFG.NSF

1. Domino Administrator → **File → Application → New**, template *Domino Web Server Configuration (DOMCFG5.NTF)*, file `domcfg.nsf`.
2. ACL: `Anonymous = Reader` (the login form must be readable before sign-in), `LocalDomainServers = Manager`.
3. Designer → `domcfg.nsf` → new form **`$$LoginUserForm`** → paste all of `login-forms/DominoEmbeddedForm.html` → select all → **Text → Pass-Thru HTML** (text turns green) → save.
4. Notes client → `domcfg.nsf` → **Create → Sign In Form Mapping**: *Login form database* = `domcfg.nsf`, *Login form name* = `$$LoginUserForm`.
5. `tell http restart`.

After every edit of the HTML: repeat step 3 (re-paste as Pass-Thru HTML), then `tell http restart`.

## 2. Create `loginaudit.nsf`

> **Recommended: use the DXL installer.** `lotusscript/Installer/Agent0_Installer_DXL.lss` performs sections 2.1 (ACL), 2.2 (views, plus the forms `LoginEvent` and `AuditError`) and 3 steps 1-2 (script library and the 5 agents) in one run. Follow [`04-DXL-Install.md`](04-DXL-Install.md), then continue here at **section 3 step 3 (recompile and sign)**. Sections 2.1-2.2 and 3 steps 1-2 below are the **manual alternative** and a reference for what the installer creates. Do not do both: the installer replaces same-named design elements.
>
> Still manual after the installer: recompile + sign (3.3), server security (3.4), `LoginAuditLib` constants (8), `PurgeLoginAudit` schedule (3), viewer file resource (4), database property (2.3), login page (1).

Manual: Domino Administrator → new blank database `loginaudit.nsf`, title "Login Audit".

### 2.1 ACL (installer: new database only; `APPLY_ACL = True` re-applies it)

| Entry | Level | Roles | Notes |
|---|---|---|---|
| `-Default-` | Reader | – | Lets signed-in users run the agents and load the viewer page; documents stay protected by `Readers` fields |
| `Anonymous` | No Access | – | Landing/history are only used after login |
| `<SERVICE_ID>` | Editor | – | Agent signer. Needs *Delete documents* for the purge agent. **Must be a member of `LocalDomainAdmins`** (Readers fields also apply to agents) |
| `LocalDomainAdmins` | Editor | – | Reviews "not me" reports and can close them (set `ReviewStatus`). Can read all events |
| `LocalDomainServers` | Manager | – | |

**No custom roles are used.** Event documents have a `Readers` field containing only the user and the group `LocalDomainAdmins` (constant `READER_ADMIN_GROUP` in `LoginAuditLib.lss`). If you prefer not to put the signer in that group, put the signer's name in `EXTRA_READER` instead.

### 2.2 Views

All created with Designer → New View (names include the parentheses; hidden from menus).

**`(LoginsByUser)`** — required by every agent  
Selection: `SELECT Form = "LoginEvent"`

| Col | Formula | Sort |
|---|---|---|
| 1 | `UserCanonical` | **Ascending** |
| 2 | `LoginTime` | **Descending** |
| 3 | `IP` | none |

Column 2 descending is what makes "newest first" work. Do not change these two columns.

**`(NotMeReports)`** — for reviewers (`LocalDomainAdmins`)  
Selection: `SELECT Form = "LoginEvent" & NotMeFlag = "1"` — columns: `ReviewStatus`, `UserCanonical`, `LoginTime` (descending), `IP`.

**`(AuditErrors)`** — Selection: `SELECT Form = "AuditError"` — columns: `ErrWhen` (descending), `Agent`, `ErrNum`, `ErrMsg`.

Forms `LoginEvent` and `AuditError` (fields as in `01-Overview.md`) let admins open an event and set `ReviewStatus` to `CLOSED`. **The installer creates them** (`dxl/Forms/`); if you build by hand they are optional. `Readers` is a *readers* field on both forms, so opening and saving an event in the Notes client keeps it protected.

### 2.3 Database properties

Advanced tab: tick *Don't maintain unread marks*. No full-text index is needed. **The installer does not set this property** (DXL import does not replace database properties), so do it by hand either way.

## 3. Script library and agents

In `loginaudit.nsf` (Designer). **Steps 1-2 are done by the DXL installer** (`04-DXL-Install.md`); do them by hand only if you do not use it.

1. **Shared Code → Script Libraries → New** — name `LoginAuditLib`, language LotusScript → paste `lotusscript/ScriptLibraries/LoginAuditLib.lss` → save. **Edit the constants at the top** (see §8 for production values).
2. **Shared Code → Agents → New** for each agent below. Paste the file; save.

| Agent name | Source | Trigger | Run as web user |
|---|---|---|---|
| `LoginLanding` | `LoginLanding.lss` | On Schedule → **Never** | **Unchecked** |
| `GetLoginHistory` | `GetLoginHistory.lss` | On Schedule → **Never** | **Unchecked** |
| `Heartbeat` | `Heartbeat.lss` | On Schedule → **Never** | **Unchecked** |
| `NotMe` | `NotMe.lss` | On Schedule → **Never** | **Unchecked** |
| `PurgeLoginAudit` | `PurgeLoginAudit.lss` | Schedule → Daily, 02:00, run on server | n/a |

> **Installer difference:** the installer imports every agent with trigger *Action menu selection*, target *None*, *Run as web user* off. This is the same pattern as `DominoPasswordReset-March2026` and also answers `?OpenAgent` from the web. If testing shows HTTP 500 on `?OpenAgent`, switch the trigger to *On Schedule → Never* as in the table. **`PurgeLoginAudit` must be changed by hand to Schedule → Daily 02:00, run on server** (the installer cannot set the schedule).

Common settings: *Which documents should it act on* = **None**. Any "On event" trigger makes `?OpenAgent` return HTTP 500.

> **Why "run as web user" is unchecked:** the agents run as the signer, so they can write to the database even though users only have Reader access. The user's identity is taken from `Remote_User`, not from the run-as setting. Do **not** change the code to use `EffectiveUserName`.

3. **Recompile and sign every design element** (library + agents) with `<SERVICE_ID>`: Designer → *Tools → Recompile All LotusScript*, then select all → *Tools/File → Sign*. Required after the installer too: freshly imported agents are unsigned (Notes reports "Document is not signed" until then). The signer must also be a member of `LocalDomainAdmins` (section 2.1).
4. Server security: in the Server document → **Security** → add `<SERVICE_ID>` to *Run restricted LotusScript/Java agents* (these agents use only standard Notes classes). Restart HTTP: `tell http restart`.

## 4. Verse viewer file

Designer → `loginaudit.nsf` → **Resources → Files → New File Resource** → `verse-extension/LoginActivityViewer.html`, name `LoginActivityViewer.html`, MIME `text/html`. URL: `https://<SERVER>/loginaudit.nsf/LoginActivityViewer.html`. Register in Verse: [`03-Verse-Extension.md`](03-Verse-Extension.md).

## 5. Turn it on in the login page

In `DominoEmbeddedForm.html` (inline `DominoLoginConfig`):

```javascript
features: { enableLoginAudit: true, /* ... */ },
loginAudit: {
    enable: true,
    landingUrl: "/loginaudit.nsf/LoginLanding?OpenAgent",
    defaultNext: "/verse"          // where users land if no RedirectTo
},
debug: { showStatusPanel: false }  // true only while configuring
```

Re-deploy the form (§1 step 3). The form now sets `RedirectTo` to the landing agent; the browser sends **no** tracking data.

---

## 6. Event flow checks (quick)

Open `https://<SERVER>/loginaudit.nsf/LoginLanding?OpenAgent&next=/verse` while signed in → redirect to `/verse`, and a `LoginEvent` appears in `(LoginsByUser)`.

---

## 7. Test plan — TESTING environment (native Domino auth, no proxy)

Run in order. Use two test users (A, B) and two browsers.

**7.0 Diagnostics first.** Temporarily set `DIAG_MODE = True` in `LoginLanding`, re-save/sign, open the landing URL signed in. Confirm: `Remote_User (raw)` is the user (not blank/Anonymous), `Caller (canonical)` is `CN=.../O=...`, `Remote_Addr` is your client IP, `X-Forwarded-For` is empty. `EffectiveUserName` should show the **signer** — that confirms run-as-signer. Set `DIAG_MODE = False` again, re-sign.

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

## 8. PRODUCTION notes

### 8.1 Reverse proxy / WAF — real client IP

- By default Domino exposes the proxy's address in `Remote_Addr`. The code reads `X-Forwarded-For` **only** when `Remote_Addr` is in `TRUSTED_PROXIES`, then takes the right-most address that is not a trusted proxy.
- In `LoginAuditLib`: `Const TRUSTED_PROXIES = "<PROXY_IP_1>,<PROXY_IP_2>"`. Leave empty in testing.
- The proxy must **append** to (or overwrite) `X-Forwarded-For`, and Domino's HTTP port must accept traffic **only from the proxy** (firewall), otherwise anyone could spoof the header.
- Confirm with `DIAG_MODE = True` through the proxy: `Remote_Addr` = proxy IP, `X-Forwarded-For` present, `Client IP (computed)` = the real user.
- The older `$WS*` "connector header" approach: community reports say Domino 12.0.1 changed its behaviour. Do not rely on it; check HCL's current documentation for your version *(verify)*. Domino's IP allow/deny lists have been reported not to see the real client IP behind a proxy *(verify)*.
- Domino's own `HTTP_LOG_ACCESS_XFORWARDED_FOR` setting only affects Domino's access log, not CGI variables.

### 8.2 MFA (TOTP) and OIDC

- **TOTP:** configure Domino MFA on the server (see HCL docs); in the login form set `features.enableMFA = true`, `mfa.enable = true`. Domino enforces MFA; the login form is only the UI. In `LoginAuditLib` set `AUTH_METHOD_LABEL = "Domino password + TOTP"` (a label — the server's policy is authoritative).
- **OIDC / SAML:** these flows normally do **not** go through the custom form, so the landing agent is not called automatically. To record those logins, the post-login start URL must be `/loginaudit.nsf/LoginLanding?OpenAgent&next=/verse` (for example the entry link users open, or an IdP/proxy post-login redirect). The agent identifies the user by `Remote_User` as long as the Domino session exists *(verify with your OIDC setup)*. Set `AUTH_METHOD_LABEL` accordingly.

### 8.3 Go-live checklist

- [ ] `loginaudit.nsf` built (DXL installer, `04-DXL-Install.md`, or manually), recompiled and signed; installer agent deleted from the scratch database
- [ ] §7 test plan passed in a staging copy
- [ ] `TRUSTED_PROXIES` set and verified with `DIAG_MODE`; `DIAG_MODE = False`; status panel off
- [ ] `ALERT_ON_NEW_SIGNIN` decision made (mail to the user on new IP/device; needs mail routing) — default `False`
- [ ] `SECURITY_MAILBOX` set to the review mailbox; `LocalDomainAdmins` members know they review `(NotMeReports)`
- [ ] `RETENTION_DAYS` decided (180 = 6 months, 365 = 1 year); **legal/privacy review** of storing IP + User-Agent (personal data in many jurisdictions), user notice, access/erasure process
- [ ] `PurgeLoginAudit` scheduled (Daily 02:00, on the server)
- [ ] `PURGE_DRY_RUN` run once, log reviewed, then set `False` and re-sign
- [ ] Signer ID is a dedicated service ID with the minimum rights above
- [ ] Verse extension deployed and tested (`03-Verse-Extension.md`)
- [ ] Rollback: set `features.enableLoginAudit = false` in the form (users then redirect as before) and re-paste; data stays in `loginaudit.nsf`

### 8.4 Known behaviour to explain to users and stakeholders

- Only **successful** web logins are listed; failed attempts are not shown.
- Duration is approximate and measured only while the Login Activity page (or another heartbeat source) is open; otherwise "Not measured".
- Options to measure duration better, to evaluate later: derive last-activity from the Domino web access log database, or a Verse widget/extension page that stays loaded — Verse 3.2.7 documents no always-on background extension point, and the hidden `modifyOnSend` iframe is not suitable (it blocks sending if it does not answer in 30 s).

---

## 9. Troubleshooting

| Symptom | Likely cause | Verify / fix |
|---|---|---|
| Landing returns the login form HTML | Agent URL not reachable for signed-in user | DB ACL `-Default-` must be Reader or higher |
| HTTP 500 on `?OpenAgent` | Agent trigger is not *On Schedule → Never* | Change trigger, re-sign |
| Redirect works, no event written | Remote_User blank, or signer lacks access | Run `DIAG_MODE`; check `(AuditErrors)`; signer needs Editor access and membership of `LocalDomainAdmins` (or `EXTRA_READER`) |
| `AuditError`: "View (LoginsByUser) not found" | View name wrong or not created | §2.2 exact name with parentheses |
| History empty but events exist | Events saved under a different canonical name, or Readers excludes user | Compare `UserCanonical` with the DIAG canonical name |
| Newest event not first | View column 2 not sorted descending | §2.2 |
| Installer: "this installer is vX but the project files are vY" | Installer and repository are different versions | Copy `Agent0_Installer_DXL.lss` from the same commit (`04-DXL-Install.md`) |
| Installer: `warning ... id 7118/12051` in `installer_*.log` | Compile error in the library; agents cascade | Fix the first error, re-run with `INSTALL_MODE = "UPDATE"` |
| After `UPDATE`, constants are back to defaults | `LoginAuditLib` was replaced | Re-apply `TRUSTED_PROXIES`, `SECURITY_MAILBOX`, `RETENTION_DAYS`; recompile; re-sign |
| Heartbeat always `no_session` | IP/device differs from login (e.g. VPN switch, different browser), or gap > 60 min | Expected; duration then stays "Not measured" |
| Everyone shows the proxy IP | `TRUSTED_PROXIES` empty or wrong | §8.1 |
| Viewer shows "not signed in" | Viewer opened without a session | Sign in to Verse first |
