# Project Evaluation — Domino Embedded Login + Verse Login History

Scope: `DominoEmbeddedForm.html`, `lotusscript/LoginTracker.lss` (v1.4.0), `lotusscript/GetLoginHistory.lss` (v1.0.0), `verse-extension/LoginActivityViewer.html`, `docs/`.
Basis: static code review only. Nothing was run against a Domino server. Items marked **(verify)** depend on your server/proxy setup.

## 1. Verdict

The login page itself is solid. The **tracking design does not meet the requirement** and has security flaws. Tracking is triggered from the browser by an anonymous POST, so it records *attempts* (not logins), can be forged, and has no session duration or access source. Keep the UI, rebuild the tracking back end.

## 2. Requirement coverage

| Requirement | Today | Gap |
|---|---|---|
| Last 5 logins | Last 5 **attempts** (`status` is always `ATTEMPT`) | Failed and successful logins are indistinguishable. Entries are written before authentication. |
| IP address | `REMOTE_ADDR`, `X-Forwarded-For` only if empty | Behind a proxy/WAF this is the proxy IP **(verify)**. X-Forwarded-For is spoofable unless trusted proxies are defined. |
| Login time | Client-supplied `ts` (LoginTracker.lss line 299) | Browser clock and user-controllable. Must be server time. |
| Session duration | **Missing** | No end time, heartbeat or logout capture. |
| Access source | **Missing** | Only browser name, platform and screen size, parsed client-side. No channel (Verse, iNotes, other) and no server-side User-Agent. |
| Help spot unauthorized access | **Missing** | No new-IP/new-device flag, no "not me" action, no alert on suspicious success. |

## 3. Defects in current code (fix or replace)

| # | Severity | Finding |
|---|---|---|
| 1 | High | The `LogLoginAttempt` agent is anonymous (DOMCFG ACL Anonymous = Reader) and trusts the POSTed `username`. Anyone can write entries to any user's record. Five-entry rotation lets an attacker flush real history with junk. |
| 2 | High | `GetLoginHistory.lss` line 108 uses `GetDocumentByKey(currentUser, False)`, a **partial** match on the common name. A user "John" could match "John Smith" and see that person's history. Use an exact canonical-name key. |
| 3 | High | `DEBUG_MODE = True` is the shipped default (line 177). It returns every CGI variable to anonymous callers, which may include cookies **(verify)**. The login form also ships `showStatusPanel: true`. |
| 4 | Medium | Strategy C scans every Person doc on each anonymous request (lines 358–421). It is a DoS vector and a username-enumeration timing oracle. |
| 5 | Medium | Client fields are not sanitized or length-limited. A `\|` in `browser`/`tz` corrupts the pipe-delimited record. |
| 6 | Medium | `ErrorHandler` ends with `Resume Next` (line 536). After an error it continues and can re-print headers or write partial data. |
| 7 | Medium | ACL contradiction: both agents live in `DOMCFG.NSF`. `LoginTracker.lss` requires Anonymous = Reader, while `GetLoginHistory` docs say Anonymous = No Access. Both cannot be true. |
| 8 | Medium | Writing every login to the Person doc in `names.nsf` causes directory replication on every login, save conflicts, and needs Editor rights for the signer on the directory. |
| 9 | Low | The "last login" banner and Verse fallback read `localStorage`. This is per-browser, unverified and misleading as security evidence. |
| 10 | Low | CAPTCHA and the session-timeout warning are client-side only. They are not security controls, and the timer is not tied to the real Domino session. |

## 4. What to drop

Nothing has been deleted. Confirm before removal (per change-control policy).

| Item | Why |
|---|---|
| `login-forms/CustomLoginForm-Domino.html`, `config.js`, `js/login.js`, `css/login.css`, `i18n/translations.js`, `samples/*`, `preview-server.js` | Modular alternative needing MIME setup (~5,000 lines). Request is to focus on the Embedded HTML. |
| `login-forms/EnterpriseLoginForm.html` | Alternative form. Move any wanted feature (e.g. quick links) into the Embedded form config. |
| `login-forms/DominoEmbeddedForm-AlphaCaptcha.html` | Duplicate. Alpha CAPTCHA and split layout are already config options in `DominoEmbeddedForm.html`. |
| `login-forms/DominoEmbeddedForm-CentralBankOfIndia.html` | Customer-specific. It is gitignored but is in the folder and in git history (commits `cb654e7`, `36c52bf`, removed in `5c56446`). A remote `origin/main` exists, so check whether those commits were pushed, and keep customer material out of this project. |
| `localStorage` banner and fallback | See finding 9. Replace with the server-side history. |
| `names.nsf` Person-doc storage, Strategy C scan, pubnames.ntf subform steps (README Phase 1) | Replaced by a dedicated audit database. |
| README sections for dropped forms | README is 1,677 lines and duplicates `docs/`. Consolidate into one deployment guide. |

## 5. What to add

### 5.1 Capture (authoritative, no client trust)

- Point the form's `RedirectTo` at a landing agent (e.g. `/loginaudit.nsf/LoginLanding?OpenAgent`) that runs **as the authenticated web user** and then redirects to Verse. Identity then comes from the session, not from a POSTed username, which closes findings 1 and 4.
- The landing agent records SUCCESS using server time, `REMOTE_ADDR`, `HTTP_USER_AGENT` (parsed server-side), and the redirect/referrer for access source.
- Failed attempts are not visible to an agent. If needed, source them from the Domino web log or a DSAPI/auditing approach **(verify option with your admins)**. Treat this as an optional phase.
- Trusted-proxy handling: use `X-Forwarded-For` only when the immediate peer is a configured proxy **(verify your proxy topology)**.

### 5.2 Session duration

- A heartbeat agent called periodically while Verse is open updates `LastSeen` on the login event. Duration = `LastSeen − LoginTime`, labelled "approximate".
- Whether a Verse extension can run a periodic script, and how to capture logout, needs confirming against the Verse extensibility docs **(verify)**. If not possible, the fallback is the Domino idle-timeout value shown as "session ended (timeout)" with no exact duration.

### 5.3 Storage — new `LoginAudit.nsf` (not `names.nsf`)

One document per login, Form `LoginEvent`:

| Field | Notes |
|---|---|
| `UserCanonical` | Exact key for lookups |
| `LoginTimeUTC` | Server time |
| `LastSeenUTC` / `EndTimeUTC` / `DurationSec` | From heartbeat |
| `IP`, `ForwardedFor` | Trusted proxies only |
| `UserAgentRaw`, `Browser`, `OS` | Parsed server-side |
| `AccessSource` | Verse web / iNotes / other |
| `AuthMethod` | Password / MFA / SAML |
| `SessionIdHash` | Hash only; dedupes retries |
| `NewIP`, `NewDevice` | Computed against prior events |
| `Readers` | The user + LocalDomainAdmins only |

- A scheduled agent purges events beyond the retention period. Retention length needs a decision from Legal/Security.
- Sign agents with a dedicated, least-privilege signer ID. Put `GetLoginHistory` in this DB so the DOMCFG ACL conflict (finding 7) disappears.

### 5.4 Verse viewer

- Show the **last 5 successful logins**: date/time, IP, access source, browser/OS, duration, and a "current session" marker.
- Highlight `NewIP` / `NewDevice` rows, add a **"This wasn't me"** action (notifies the security mailbox and links to the password-change page), and add a note on how to read the table.
- `GetLoginHistory`: exact canonical match from `session.EffectiveUserName`, return top 5 by time descending, return `[]` for anonymous, no debug output.

### 5.5 Operational standards (per engineering policy)

- `DEBUG_MODE = False` and status panel off by default. Add a dry-run flag, rate limiting per IP/user, input length caps, and idempotency on `SessionIdHash`.
- Test matrix: correct login, wrong password (no record), MFA on/off, behind proxy, forged POST (must have no effect), user A requesting user B's history (must be blocked), anonymous caller.
- Alert email only on new-IP/new-device **success**, not on every attempt.
- Privacy: IP and User-Agent are personal data in many jurisdictions. Get Legal review of retention, notice and access rights before go-live. Flag if the server crosses regions.

## 6. Proposed phases

1. Clean-up: remove dropped files (after approval), default debug off, fix finding 2 immediately in the existing agent.
2. `LoginAudit.nsf` + landing agent + new `GetLoginHistory` + viewer update.
3. Heartbeat/duration + flags + "not me" + purge agent.
4. Optional: failed-login capture and alerting.

## 7. Open questions

1. Is there a reverse proxy/WAF in front of Domino, and does it pass the real client IP?
2. Native Domino auth, SAML, or both? Is MFA enabled?
3. Verse version and whether extension scripts can run a heartbeat.
4. Retention period and who reviews "not me" reports.
5. Do you want failed attempts shown to the user, or only successful logins?
