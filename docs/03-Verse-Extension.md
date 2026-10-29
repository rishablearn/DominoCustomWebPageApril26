# HCL Verse — Login Activity Extension

> **Version:** 3.0.0 | **Last Updated:** 2026-10-28 | Developed against HCL Verse on-premises 3.2.7  
> Not yet executed on a server — see the test plan in `02-Deployment-Guide.md` §7.

Adds **Login Activity** to the Verse navbar *More* menu. It opens a window showing the user's last 5 successful logins (time, IP, access source, browser/device, approximate duration, new-IP/new-device flags), a **This wasn't me** button and a **Sign out** button.

## Architecture

```
Verse navbar ▸ More ▸ "Login Activity"   (com.ibm.action.link, order 96500)
        └─▶ https://<SERVER>/loginaudit.nsf/LoginActivityViewer.html   (File Resource)
                ├─ GET  /loginaudit.nsf/GetLoginHistory?OpenAgent
                ├─ POST /loginaudit.nsf/Heartbeat?OpenAgent     (every 60 s while open)
                └─ POST /loginaudit.nsf/NotMe?OpenAgent
```

The page and the agents are in the same database and origin, so no CORS configuration is needed. The page uses only `textContent` (no HTML injection) and makes no external requests.

## Deploy

1. Complete `02-Deployment-Guide.md` §2–§4 (database, agents, viewer file resource).
2. Register the extension with Verse (`applications.json`).

### Option 1 — no existing `applications.json`

Edit `verse-extension/applications.json`, replace `YOUR_DOMINO_SERVER` with your host name, then deploy the file as in "Provider setup" below.

### Option 2 — you already have an `applications.json`

It is a JSON **array**. Add the object from `verse-extension/merge-snippet.json` (after replacing `YOUR_DOMINO_SERVER`) as one more element, keeping commas valid. Validate the JSON before deploying.

The extension uses the documented Verse navbar link extension point `com.ibm.action.link`; order values 96000–96999 place a link in the *More* menu ([Extension Points](https://opensource.hcltechsw.com/Verse-Extension-Documentation/docs/extension-points/)). `link` must be an **absolute** HTTPS URL.

### Provider setup (Domino server `notes.ini`)

Local file:

```ini
VOP_Extensibility_Data_Provider_Name=localFileProvider
VOP_Extensibility_Applications_Json_FilePath=<PATH_ON_SERVER>/applications.json
```

or HTTP:

```ini
VOP_Extensibility_Data_Provider_Name=httpDataProvider
VOP_Extensibility_Applications_Json_URL=https://<SERVER>/verse/applications.json
```

Restart HTTP (`tell http restart`) after changing `notes.ini`. The provider re-reads the file periodically, so later edits to `applications.json` do not need a restart (per HCL's extension documentation) *(verify on your deployment)*.

## Test

1. Sign in to Verse → **More** → **Login Activity** → a window opens (allow pop-ups for the server if blocked).
2. Your recent sign-ins are listed, newest first; the current one is tagged *This device*.
3. Leave it open 3+ minutes → press **Refresh** → the current session shows "≈ N min (active)".
4. Run the rest of the table in `02-Deployment-Guide.md` §7 (other-user isolation, anonymous, "not me").

## About session duration

Duration is measured by the heartbeat the viewer sends **while it is open**, and by **Sign out** (which ends the session record before redirecting to Domino's logout). Verse 3.2.7 documents no always-on background extension point, so sessions where the viewer was never opened show "Not measured". The documentation also lists a widget extension point (`com.ibm.verse.ext.widget`) and `modifyOnSend` (hidden iframe) — neither provides a safe continuous heartbeat; do not use `modifyOnSend` for this, since it blocks message sending if it does not answer within 30 seconds.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No "Login Activity" in More | `applications.json` not loaded | Check `notes.ini` provider lines and file path, restart HTTP, hard-refresh Verse |
| Window blank / 404 | File resource missing or wrong DB | URL must be `/loginaudit.nsf/LoginActivityViewer.html` |
| "You are not signed in" | Session expired | Sign in to Verse again |
| "history is temporarily unavailable" | Agent error | Check `(AuditErrors)` view in `loginaudit.nsf` |
| Table empty | No events yet, or events under another name | See Troubleshooting in `02-Deployment-Guide.md` §9 |
| Pop-up blocked | Browser setting | Allow pop-ups for the Domino server |

## Security notes

- The viewer shows only the signed-in user's events (exact canonical-name match; unrelated users are never returned).
- "This wasn't me" and heartbeat calls require a custom request header and, for "not me", the event must belong to the caller.
- Stored data: login time, IP, User-Agent (browser/OS), access source. No passwords, tokens or session cookies are stored.
- Follow [HCL Verse security practices](https://opensource.hcltechsw.com/Verse-Extension-Documentation/docs/best-security-practices/) for extension deployment.
