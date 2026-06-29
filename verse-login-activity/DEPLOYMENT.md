# HCL Verse — Login Activity Viewer Extension

## Deployment Guide

> **What this adds:** A **"Login Activity"** link in the HCL Verse navbar "More" menu. Clicking it opens a popup showing the current user's login history (last 5 attempts) pulled in real time from `names.nsf`.

---

## Architecture Overview

```
HCL Verse (navbar More menu)
  └─ "Login Activity" link  ← injected by applications.json extension
        │
        ▼  (opens popup)
  LoginActivityViewer.html  ← File Resource in DOMCFG.NSF
        │
        ├─ reads  localStorage['lastLoginAttempt']  (instant, same-origin)
        │
        └─ fetches  /domcfg.nsf/GetLoginHistory?OpenAgent
                          │
                          ▼
               GetLoginHistory (LotusScript Agent in DOMCFG.NSF)
                          │
                          └─ reads LoginHistory field → names.nsf Person document
```

**Data source priority:**
1. If the `GetLoginHistory` agent responds successfully → shows full server history
2. If agent is unreachable → shows the last attempt from `localStorage` (this browser only)
3. If neither available → shows empty state with setup instructions

---

## Prerequisites

| Requirement | Details |
|---|---|
| HCL Domino | 12.0.1+ (14.x fully supported) |
| HCL Verse | On-premises (with extensibility enabled) |
| Login tracking enabled | `features.enableLoginTracking: true` in `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html` |
| `LogLoginAttempt` agent | Deployed and working (writes `LoginHistory` to Person document in `names.nsf`) |
| Domino Designer | Required for deploying file resources and agents |

> **If you haven't deployed the login tracking agent yet**, do that first by following the main project `README.md` (LotusScript Agent Deployment section). The viewer will function in degraded mode (localStorage only) without it, but the server-side history requires the agent.

---

## Part A — Deploy the HTML Viewer Page

The `LoginActivityViewer.html` must be accessible at a URL your Domino server serves over HTTPS. The simplest approach is to add it as a **File Resource** in `DOMCFG.NSF`.

### A1. Open DOMCFG.NSF in Domino Designer

1. Launch **Domino Designer**.
2. **File → Open → HCL Notes Application**.
3. Enter your server name and `domcfg.nsf`.

### A2. Add as a File Resource

1. In the left navigator, expand **Resources → Files**.
2. Click **New File Resource** (or double-click an existing one to edit).
3. In the dialog, select `LoginActivityViewer.html` from this folder.
4. Ensure the resource name is exactly: `LoginActivityViewer.html`
5. Go to the **Web** tab and confirm MIME type is `text/html`.
6. Save.

> **URL after deployment:**
> `https://yourserver/domcfg.nsf/LoginActivityViewer.html`

### A3. Test the page

Open the URL in a browser where you are **already logged in** to Domino. You should see the Login Activity Viewer popup page load. It will show a warning message about the agent until you deploy Part B.

---

## Part B — Deploy the GetLoginHistory Agent

### B1. Create the agent in DOMCFG.NSF

1. In Designer, with `DOMCFG.NSF` open, click **Create → Agent**.
2. Set these properties:

   | Property | Value |
   |---|---|
   | **Name** | `GetLoginHistory` |
   | **Language** | LotusScript |
   | **When should this agent run** | **On Schedule → Never** |
   | **Which document(s) should it act on** | **None** |
   | **Run as web user** | **Checked** — agent runs as the authenticated Verse user |

   > **Trigger must be "On Schedule → Never".** Any "On Event" sub-option causes HTTP 500 "Unsupported trigger and search in the background or embedded agent" when the agent is called via `?OpenAgent`.
   >
   > **Run as web user must be checked.** The Verse popup calls this agent while the user is already authenticated. Running as the web user ensures the agent returns only the calling user's own `LoginHistory`.

3. In the Script area, paste the entire contents of `GetLoginHistory.lss`.
4. Click **File → Compile** to verify there are no syntax errors.
5. Save the agent (`Ctrl+S`).

### B2. Sign the agent

The agent needs to be signed with a Notes ID that has **at minimum Reader access** to `names.nsf`.

1. In Designer, right-click the agent → **Sign**.
2. Select the appropriate Domino Administrator ID.
3. Click **OK**.

### B3. Set DOMCFG.NSF ACL

1. Open DOMCFG.NSF properties → **Access Control**.
2. Ensure **Default** or specific authenticated groups have at least **Reader** access.
3. Set **Anonymous** to **No Access** (prevents unauthenticated queries to the history agent).

> **Important:** The `LoginActivityViewer.html` page itself can be public (Anonymous: Reader), but the `GetLoginHistory` agent should require authentication. Domino handles this automatically when Anonymous has No Access.

### B4. Configure Server Security (if required)

If the agent fails with a "Not allowed to run agents" error:

1. Open **Domino Administrator → Configuration → Server Document → Security** tab.
2. Under **Run restricted LotusScript/Java agents**, add the signing ID.
3. Restart the HTTP task: `tell http restart`.

### B5. Verify the agent

Navigate to `https://yourserver/domcfg.nsf/GetLoginHistory?OpenAgent` while logged in.

Expected response:
```json
[
  {
    "ts": "2026-06-09T08:00:00Z",
    "ip": "192.168.1.5",
    "status": "ATTEMPT",
    "browser": "Chrome",
    "platform": "Win32",
    "tz": "Asia/Kolkata",
    "scr": "1920x1080",
    "mfa": "0"
  }
]
```

If you see `[]` and have LoginHistory data, check the agent signing and ACL.

---

## Part C — Register the Verse Extension

### Option 1: You DO NOT have an existing applications.json

1. Open `applications.json` from this folder.
2. Replace `YOUR_DOMINO_SERVER` with your actual server hostname, e.g.:
   ```
   "link": "https://mail.example.com/domcfg.nsf/LoginActivityViewer.html"
   ```
3. Deploy this `applications.json` to Domino using one of the two methods below.

---

### Option 2: You ALREADY have an applications.json  ← Read carefully

Your existing `applications.json` is an **array** (`[...]`). You need to **add one new object** to that array.

#### Step-by-step merge:

1. Open your existing `applications.json` in a text editor.
2. Open `merge-snippet.json` from this folder.
3. Replace `YOUR_DOMINO_SERVER` in `merge-snippet.json` with your actual hostname.
4. In your existing `applications.json`, find the **last `}` before the closing `]`**.
5. Add a comma after that `}`, then paste the contents of `merge-snippet.json`.

**Before merge:**
```json
[
  {
    "name": "ExistingApp1",
    "extensions": [...],
    "services": ["Verse"]
  }
]
```

**After merge:**
```json
[
  {
    "name": "ExistingApp1",
    "extensions": [...],
    "services": ["Verse"]
  },
  {
    "name": "DominoLoginActivityViewer",
    "title": "Login Activity Viewer",
    "description": "Adds a Login Activity link to the HCL Verse More menu...",
    "extensions": [
      {
        "id": "domino-login-activity",
        "type": "com.ibm.action.link",
        "path": "com.ibm.navbar.order.96500",
        "name": "Login Activity",
        "title": "Login Activity",
        "description": "View your login history and security activity",
        "payload": {
          "link": "https://YOUR_DOMINO_SERVER/domcfg.nsf/LoginActivityViewer.html",
          "window_features": "width=1040,height=720,resizable=yes,scrollbars=yes"
        }
      }
    ],
    "services": ["Verse"]
  }
]
```

> **Validate JSON** before deploying: paste into https://jsonlint.com to catch any syntax errors introduced during the merge.

---

### Deploy applications.json to Domino

#### Method 1 — Local File (localFileProvider)

1. Copy `applications.json` to a path on the Domino server, e.g.:
   `D:\Domino\Data\verse\applications.json`
2. Add these lines to the server's `notes.ini`:
   ```ini
   VOP_Extensibility_Data_Provider_Name=localFileProvider
   VOP_Extensibility_Applications_Json_FilePath=D:\Domino\Data\verse\applications.json
   ```
3. Restart HTTP: `tell http restart`

> The localFileProvider polls for changes automatically. You can update `applications.json` without restarting HTTP.

#### Method 2 — HTTP (httpDataProvider)

1. Host `applications.json` on any HTTPS server accessible to Domino (can be Domino itself):
   - Place it in `<DominoData>/domino/html/verse/applications.json`
   - URL: `https://yourserver/verse/applications.json`
2. Add these lines to `notes.ini`:
   ```ini
   VOP_Extensibility_Data_Provider_Name=httpDataProvider
   VOP_Extensibility_Applications_Json_URL=https://yourserver/verse/applications.json
   ```
3. Restart HTTP: `tell http restart`

---

## Part D — Test the Verse Extension

1. Open HCL Verse in a browser (clear cache if needed).
2. Click the **More** menu in the top navigation bar (the `⋯` or "More" item).
3. You should see **"Login Activity"** in the dropdown.
4. Click it — a popup window opens with your login history.

### Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| "Login Activity" not in More menu | `applications.json` not loaded | Check `notes.ini` parameters, restart HTTP |
| Menu item appears but popup is blank | HTML file not deployed to DOMCFG.NSF | Verify file resource exists, check URL |
| Popup shows "agent not reachable" | Agent not deployed or ACL issue | Follow Part B, verify agent URL manually |
| Empty `[]` from agent | No `LoginHistory` field on Person doc | Enable login tracking on the login page first |
| Popup blocked | Browser popup blocker | Allow popups for your Domino server domain |
| Agent returns 401 | Anonymous has access to agent | Set Anonymous: No Access → Reader for auth users |

---

## notes.ini Parameters Reference

| Parameter | Purpose | Example |
|---|---|---|
| `VOP_Extensibility_Data_Provider_Name` | Which provider to use | `localFileProvider` or `httpDataProvider` |
| `VOP_Extensibility_Applications_Json_FilePath` | Path for local file | `D:\Domino\Data\verse\applications.json` |
| `VOP_Extensibility_Applications_Json_URL` | URL for HTTP provider | `https://yourserver/verse/applications.json` |

---

## File Reference

| File | Purpose | Deploy to |
|---|---|---|
| `LoginActivityViewer.html` | Popup UI page (self-contained, no external deps) | DOMCFG.NSF → File Resources |
| `GetLoginHistory.lss` | LotusScript agent returning JSON history | DOMCFG.NSF → Agents (named `GetLoginHistory`) |
| `applications.json` | Complete Verse extension file (new deployments) | Domino server file system or HTTP server |
| `merge-snippet.json` | Single app object to add to existing `applications.json` | Merge manually into existing file |

---

## Security Considerations

- The viewer reads only the **current authenticated user's** data — no cross-user access.
- Anonymous users receive an empty `[]` from the agent — no data leakage.
- The `LoginHistory` field contains: timestamp, IP, browser name, platform, timezone, screen size, and MFA flag. **No passwords, tokens, or session IDs are stored.**
- Follow [HCL Verse Secure Deployment Practices](https://opensource.hcltechsw.com/Verse-Extension-Documentation/docs/best-security-practices/) for additional hardening.
- The `LoginActivityViewer.html` popup URL should use HTTPS (required for modern browsers to allow window.open with credentials).
