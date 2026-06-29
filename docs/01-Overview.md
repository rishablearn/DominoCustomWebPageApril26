# HCL Domino Custom Login Page — Project Overview

> **Version:** 2.5.0 | **Compatible:** HCL Domino 12.x / 14.x | **Last Updated:** June 2026

---

## What This Is

A modern, fully accessible, enterprise-grade login page for HCL Domino Server. Replaces the default Domino login form with a branded, feature-rich UI deployed entirely inside `DOMCFG.NSF`.

**Key capabilities:**
- Custom branding (logo, colours, text) via a single config object
- 18 built-in languages with RTL support
- TOTP Multi-Factor Authentication (Domino 12.0.1+)
- Math CAPTCHA with audio fallback (WCAG 2.1 AA)
- Login attempt tracking — writes to Person document in `names.nsf`
- Last-login banner on every page load
- HCL Verse "Login Activity" popup extension
- Dark / Light / Auto theme switcher
- Session timeout warning
- Zero MIME configuration (self-contained HTML variants)

---

## Project Structure

```
DominoCustomWebPageApril26/
│
├── README.md                        ← Full documentation (start here)
│
├── login-forms/                     ← Deployable HTML login pages
│   ├── EnterpriseLoginForm.html     ← ⭐ RECOMMENDED: full features, self-contained
│   ├── DominoEmbeddedForm.html      ← Simple self-contained form
│   └── CustomLoginForm-Domino.html  ← Modular form (requires external files below)
│
├── lotusscript/                     ← LotusScript agent source files
│   ├── LoginTracker.lss             ← LogLoginAttempt agent (login tracking)
│   └── GetLoginHistory.lss          ← GetLoginHistory agent (Verse popup)
│
├── verse-extension/                 ← HCL Verse "Login Activity" extension
│   ├── LoginActivityViewer.html     ← Popup UI (File Resource in DOMCFG.NSF)
│   ├── applications.json            ← Verse extension manifest (new deployments)
│   └── merge-snippet.json           ← Snippet to add to existing applications.json
│
├── docs/                            ← Documentation (numbered)
│   ├── 01-Overview.md               ← This file
│   ├── 02-Deployment-Guide.md       ← Full step-by-step deployment
│   └── 03-Verse-Extension.md        ← Verse extension deployment guide
│
├── config.js                        ← Config for CustomLoginForm-Domino.html
├── js/login.js                      ← JavaScript for CustomLoginForm-Domino.html
├── css/login.css                    ← CSS for CustomLoginForm-Domino.html
├── i18n/translations.js             ← Translations for CustomLoginForm-Domino.html
├── samples/                         ← Pre-built theme config files
│   ├── config-corporate-blue.js
│   ├── config-dark-elegant.js
│   ├── config-healthcare.js
│   └── config-modern-gradient.js
│
└── preview-server.js                ← Local dev server (node preview-server.js)
```

---

## Which Login Form to Use

| Need | File | MIME Setup | External files? |
|------|------|-----------|----------------|
| ⭐ Clean, self-contained login | `login-forms/DominoEmbeddedForm.html` | ❌ None | **No** — all CSS/JS inline |
| Enterprise features (quick links, banner) | `login-forms/EnterpriseLoginForm.html` | ❌ None | **No** — all CSS/JS inline |
| Fully modular (separate JS/CSS) | `login-forms/CustomLoginForm-Domino.html` | ⚠️ Required | **Yes** — needs `config.js`, `js/login.js`, `css/login.css` |

**Use `DominoEmbeddedForm.html` for most deployments.** All CSS and JavaScript are embedded inline — no `config.js`, no `login.js`, no MIME configuration needed. Just edit the inline `CONFIG` block near the top of the file.

---

## Deployment in 3 Steps

### Step 1 — Create `DOMCFG.NSF`
Domino Administrator → File → Application → New → select template **Domino Web Server Configuration (DOMCFG5.NTF)** → filename `domcfg.nsf`.

Set ACL: `Anonymous = Reader`, `LocalDomainServers = Manager`.

### Step 2 — Deploy the Login Form
Open `DOMCFG.NSF` in Domino Designer → Create a new form named `CustomLoginForm` → paste the entire contents of your chosen HTML file as Pass-Thru HTML → Save.

Create a **Sign In Form Mapping**: DOMCFG.NSF → open in Notes client → Sign In Form Mappings → Add Mapping → target `DOMCFG.NSF` / `CustomLoginForm`.

### Step 3 — Restart HTTP
```
tell http restart
```

For full instructions see [`docs/02-Deployment-Guide.md`](02-Deployment-Guide.md).

---

## Enabling Login Tracking

> **Using `DominoEmbeddedForm.html`?** No `config.js` or `login.js` involved — tracking logic is already embedded inline in the HTML file. Steps 1–2 below apply to all forms; Step 3 is just editing the file itself.

1. In Domino Designer, create agent `LogLoginAttempt` — paste `lotusscript/LoginTracker.lss`. Set trigger: **On Schedule → Never**. Sign with an ID that has Author/Editor access to `names.nsf`.
2. Set DOMCFG.NSF ACL: **Anonymous = Reader**.
3. Open `login-forms/DominoEmbeddedForm.html` in a text editor. Find the `loginTracking:` block (search `loginTracking:`) and set:
   ```javascript
   loginTracking: {
       enable: true,
       agentUrl: "/domcfg.nsf/LogLoginAttempt?OpenAgent"
   }
   ```
4. Re-upload the updated HTML file to DOMCFG.NSF as a File Resource (overwrite), then `tell http restart`.

> **Using `CustomLoginForm-Domino.html` instead?** Upload `config.js` (set `loginTracking.enable: true`) and `js/login.js` (contains `initLoginTracking()`) as File Resources in DOMCFG.NSF.

For the full four-phase guide see the [Login Activity Tracker section in README.md](../README.md#login-activity-tracker).

---

## Enabling the Verse Extension

Deploy `verse-extension/LoginActivityViewer.html` as a File Resource in `DOMCFG.NSF`, create the `GetLoginHistory` agent from `lotusscript/GetLoginHistory.lss`, then deploy `verse-extension/applications.json` to the Verse server.

Full steps: [`docs/03-Verse-Extension.md`](03-Verse-Extension.md).

---

## MIME Type Note

When using `CustomLoginForm-Domino.html` (the modular form), external `.js` and `.css` files must be served with correct MIME types. In Domino Designer, select each File Resource → **Web Properties** tab → set MIME type to `text/javascript` or `text/css`. The self-contained forms (`EnterpriseLoginForm.html`, `DominoEmbeddedForm.html`) have no external dependencies and require no MIME configuration.

---

## Local Preview

```bash
node preview-server.js
# Open: http://localhost:3000
```

---

## Resources

- [HCL Domino Admin Documentation](https://help.hcl-software.com/domino/)
- [Customising the HTML Log-in Form](https://help.hcl-software.com/domino/14.5.1/admin/conf_customizingthehtmlloginform_t.html)
- [File Resource Web Properties (MIME)](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html)
