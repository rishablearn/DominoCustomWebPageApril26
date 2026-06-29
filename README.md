# HCL Domino Custom Login Page

> **Extend Your HCL Domino Login Experience** — A modern, secure, fully accessible login page with TOTP MFA, login attempt tracking, CAPTCHA, 18 languages, dark mode, and a native HCL Verse extension that surfaces login activity directly inside the email client.

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![Domino](https://img.shields.io/badge/HCL%20Domino-12.x%20%7C%2014.x-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Languages](https://img.shields.io/badge/languages-18-orange)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-purple)
![MFA](https://img.shields.io/badge/MFA-TOTP%20Ready-red)
![Verse](https://img.shields.io/badge/HCL%20Verse-Extension%20Ready-blueviolet)

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [How This Solution Augments Domino](#augments-domino)
3. [Features at a Glance](#features)
4. [Detailed Feature Documentation](#detailed-features)
5. [Logo Configuration](#logo-configuration)
6. [Architecture & Technical Details](#architecture)
7. [FAQ](#faq)
8. [What's New in v2.5.0](#whats-new)
9. [Quick Start Guide (5 minutes)](#quick-start)
10. [Deployment Guide — Step by Step](#deployment-guide)
11. [TOTP Multi-Factor Authentication](#mfa)
12. [Login Activity Tracker — Complete Guide](#login-activity-tracker)
    - [Phase 1: Provision Person Document Fields](#phase-1-provision-person-document-fields)
    - [Phase 2: Deploy LogLoginAttempt Agent](#phase-2-deploy-the-logloginattempt-agent)
    - [Phase 3: Configure Login Page](#phase-3-configure-the-login-page)
    - [Phase 4: Verify End-to-End](#phase-4-verify-end-to-end)
    - [Accessing Login History](#accessing-login-history)
    - [LoginHistory Field Reference](#loginhistory-field-reference)
13. [HCL Verse Login Activity Extension](#hcl-verse-extension)
14. [Audio CAPTCHA](#audio-captcha)
15. [Configuration Reference](#configuration-reference)
16. [Internationalization (i18n)](#i18n)
17. [Accessibility (WCAG 2.1 AA)](#accessibility)
18. [Troubleshooting](#troubleshooting)
19. [Changelog](#changelog)

---

<a id="introduction"></a>
## 🌟 Introduction

When organizations deploy HCL Domino for enterprise collaboration, this solution extends the default login experience to meet modern UX expectations and corporate branding requirements. This project provides a **login page** that:

- **Looks modern** with smooth animations, responsive design, and professional styling
- **Simple to deploy** with a self-contained, single-file approach
- **Supports your brand** with customizable logos, colors, and messaging
- **Speaks your language** with 18 built-in languages including RTL support
- **Protects your users** with CAPTCHA, session management, and security notices
- **Includes everyone** with WCAG 2.1 AA accessibility compliance

### Who Is This For?

- **Domino Administrators** who want a professional login experience
- **IT Departments** needing quick deployment without development resources
- **Organizations** requiring multi-language support
- **Security Teams** needing compliance messaging and CAPTCHA protection
- **Developers** wanting a solid foundation for customization

---

<a id="augments-domino"></a>
## 🎯 How This Solution Augments Domino

### MIME Type Configuration Context

When extending a Domino login page with external CSS or JavaScript resources, browsers may display the following messages if MIME type headers are not yet in place:

```
Uncaught SyntaxError: Unexpected token '<'
Refused to execute script because its MIME type ('text/html') is not executable
```

**Context:** Browsers require correctly declared MIME type headers for script and style resources. Configuring these in Domino Designer's Web Properties tab is the standard approach. This solution intends to augment this capability by embedding all resources inline, so no external MIME type configuration is needed.

### The Solution: Zero-Configuration Deployment

This project addresses this by creating **self-contained HTML files** with ALL CSS and JavaScript embedded inline. This means:

- ✅ **No external files to configure**
- ✅ **No MIME types to set**
- ✅ **No file resources to manage**
- ✅ **Works on first deploy**

Just paste the HTML, mark it as Pass-Thru HTML, and you're done.

---

<a id="features"></a>
## ✨ Features at a Glance

### Core Features

| Feature | Description |
|---------|-------------|
| **Self-Contained HTML** | All CSS/JS inline - no external dependencies |
| **Responsive Design** | Perfect on desktop, tablet, and mobile |
| **Dark/Light Mode** | Automatic or manual theme switching with smooth transitions |
| **18 Languages** | Including Hindi, Arabic (RTL), French, German, Spanish, and more |
| **CAPTCHA Protection** | Math-based CAPTCHA with audio support for accessibility |
| **Session Management** | Timeout warnings with stay-logged-in functionality |
| **Keyboard Shortcuts** | Alt+U (username), Alt+P (password), Alt+T (theme), Ctrl+Enter (submit) |
| **Offline Detection** | Visual indicator when network is unavailable |
| **Password Strength Meter** | Real-time feedback on password quality |
| **Remember Username** | Convenience feature for returning users |

### Enterprise Features (EnterpriseLoginForm.html)

| Feature | Description |
|---------|-------------|
| **Quick Links Grid** | Forgot Password, Unlock Account, User Guide, FAQ, IT Support |
| **Security Notice Banner** | Display compliance and security messaging |
| **System Announcements** | Scheduled maintenance or important notices |
| **Version Display** | Track which version is deployed |
| **Company Branding** | Logo, colors, taglines fully customizable |

### HCL Verse Integration (`verse-login-activity/`)

| Feature | Description |
|---------|-------------|
| **Login Activity Popup** | "Login Activity" link in Verse navbar → popup with full history table and summary cards |
| **Dual Data Source** | Server history from `names.nsf` with automatic `localStorage` fallback |
| **GetLoginHistory Agent** | Authenticated JSON endpoint; returns only the current user's history |
| **applications.json Extension** | `com.ibm.action.link` at navbar order `96500` (More dropdown menu) |
| **Merge-Safe Deploy** | `merge-snippet.json` appends to existing `applications.json` without disrupting other extensions |

---

<a id="detailed-features"></a>
##  Detailed Feature Documentation

### 🌓 Dark/Light Mode

The login page supports automatic and manual dark/light mode switching:

**Automatic Detection:**
- Respects system preference (`prefers-color-scheme`)
- Saves user preference to localStorage

**Manual Toggle:**
- Click the 🌙/☀️ button in the top-right corner
- Or use keyboard shortcut: `Alt + T`

**Theme Persistence:**
- User's choice is saved and remembered across sessions
- Falls back to system preference if no saved choice

**Smooth Transitions:**
- 300ms transitions on all elements for a polished experience
- No jarring color jumps when switching themes

### 🌍 Internationalization (18 Languages)

Built-in support for:

| Language | Code | Direction | Region |
|----------|------|-----------|--------|
| English | `en` | LTR | Global |
| Spanish | `es` | LTR | Latin America, Spain |
| French | `fr` | LTR | France, Canada |
| German | `de` | LTR | Germany, Austria |
| Arabic | `ar` | **RTL** | Middle East |
| Hindi | `hi` | LTR | India |
| Tamil | `ta` | LTR | India |
| Telugu | `te` | LTR | India |
| Bengali | `bn` | LTR | India |
| Marathi | `mr` | LTR | India |
| Kannada | `kn` | LTR | India |
| Malayalam | `ml` | LTR | India |
| Gujarati | `gu` | LTR | India |
| Punjabi | `pa` | LTR | India |
| Chinese | `zh` | LTR | China |
| Japanese | `ja` | LTR | Japan |
| Korean | `ko` | LTR | Korea |
| Portuguese | `pt` | LTR | Brazil, Portugal |

**RTL Support:** Arabic automatically switches to right-to-left layout.

**Adding New Languages:**

```javascript
i18n: {
    languages: {
        // Add your language
        nl: { 
            name: "Nederlands", 
            dir: "ltr", 
            strings: {
                welcomeTitle: "Welkom Terug",
                welcomeSubtitle: "Log in om door te gaan",
                usernameLabel: "Gebruikersnaam",
                passwordLabel: "Wachtwoord",
                signIn: "Inloggen"
                // ... more strings
            }
        }
    }
}
```

### 🔐 CAPTCHA System

The built-in CAPTCHA provides bot protection without external services:

**Features:**
- Math-based challenges (addition, subtraction, multiplication)
- Three difficulty levels: Easy, Medium, Hard
- Audio support for visually impaired users
- Refresh button for new challenges
- Configurable attempt limits

**Configuration:**

```javascript
captcha: {
    difficulty: "easy",     // easy | medium | hard
    maxAttempts: 5,         // Lock form after X failures
    enableAudio: true       // Text-to-speech support
}
```

**Difficulty Levels:**

| Level | Example | Number Range |
|-------|---------|--------------|
| Easy | 5 + 3 = ? | 1-10, addition only |
| Medium | 12 - 7 = ? | 1-20, add/subtract |
| Hard | 8 × 6 = ? | 1-15, all operations |

### 🔒 Security Features

**Form Validation:**
- Real-time validation on every keystroke
- Submit button disabled until all fields are valid
- Username, password, and CAPTCHA all validated
- Clear visual feedback for errors

**Password Requirements:**
- Configurable minimum length (default: 8)
- Real-time strength indicator
- Visual feedback: Weak → Fair → Good → Strong

**Session Management:**
- Configurable timeout warning
- "Stay Logged In" button to extend session
- Visual countdown before logout

**Security Notice:**
- Customizable security/compliance message
- Displayed prominently on the login form
- Supports HTML formatting

### ♿ Accessibility (WCAG 2.1 AA)

**Keyboard Navigation:**
- Full form navigation with Tab key
- Keyboard shortcuts for quick access
- Focus indicators on all interactive elements
- Skip links for screen readers

**Screen Reader Support:**
- Proper ARIA labels and roles
- Live regions for dynamic updates
- Form error announcements
- CAPTCHA audio alternative

**Visual Accessibility:**
- High contrast mode support
- Configurable font sizes
- Color contrast ratios > 4.5:1
- Reduced motion support

**Keyboard Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Alt + U` | Focus username field |
| `Alt + P` | Focus password field |
| `Alt + T` | Toggle dark/light theme |
| `Ctrl + Enter` | Submit form |
| `Escape` | Close dropdowns |

---

<a id="logo-configuration"></a>
## 🖼️ Logo Configuration

### Supported Logo Formats

**Supported formats:** PNG, JPG, GIF only

### Option 1: Base64 Data URI (Recommended)

Convert your logo to base64 and embed it directly:

```javascript
logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

**Benefits:**
- No file resources needed
- No MIME configuration
- Instant loading (no extra request)

**How to convert:**
1. Visit https://www.base64-image.de/
2. Upload your PNG/JPG logo
3. Copy the data URI output
4. Paste into the CONFIG

### Option 2: File Resource

```javascript
logoUrl: "/domcfg.nsf/logo.png"
```

**Requirements:**
- Import logo as File Resource in DOMCFG.NSF
- Set MIME type in Web Properties tab
- PNG → `image/png`
- JPG → `image/jpeg`
- GIF → `image/gif`

### Option 3: External URL

```javascript
logoUrl: "https://cdn.yourcompany.com/logo.png"
```

**Note:** Ensure the URL is accessible and allows CORS if on different domain.

### Option 4: Text Only (No Logo)

```javascript
logoUrl: ""
```

This hides the logo and shows only the company name.

---

<a id="architecture"></a>
## 🏗️ Architecture & Technical Details

### Project Structure

```
DominoCustomWebPageApril26/
│
├── docs/
│   ├── EnterpriseLoginForm.html   # ⭐ Full-featured, self-contained
│   ├── DominoEmbeddedForm.html    # ⭐ Simple, self-contained
│   ├── DEPLOYMENT_GUIDE.md        # Step-by-step deployment
│   └── COMPLETE_DOCUMENTATION.md  # Technical reference
│
├── CustomLoginForm-Domino.html    # Modular version (requires external files)
├── config.js                      # Configuration for modular version
├── css/login.css                  # Styles for modular version
├── js/login.js                    # Scripts for modular version
├── i18n/translations.js           # Translations for modular version
│
├── samples/                       # Pre-built theme configurations
│   ├── corporate-blue.html
│   ├── dark-modern.html
│   └── minimal-clean.html
│
├── preview-server.js              # Local preview server (Node.js)
└── README.md                      # This file
```

### Self-Contained Files

Both `EnterpriseLoginForm.html` and `DominoEmbeddedForm.html` are fully self-contained:

- **~2,800 lines** of HTML, CSS, and JavaScript
- **~120KB** uncompressed
- **~25KB** gzipped
- **Zero external dependencies**

### Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 80+ | ✅ Full |
| Firefox | 75+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Edge | 80+ | ✅ Full |
| IE 11 | - | ⚠️ Partial (no CSS variables) |

### Domino Compatibility

| Domino Version | Support |
|----------------|---------|
| 12.0.x | ✅ Full |
| 12.0.1+ | ✅ Full |
| 14.0.x | ✅ Full |
| 14.5.x | ✅ Full |

---

<a id="faq"></a>
## ❓ FAQ

### Q: Can I use this without Domino Designer?

**A:** You need Domino Designer to deploy to DOMCFG.NSF. However, you can preview locally by opening the HTML file in a browser.

### Q: Does this work with Domino SAML authentication?

**A:** This is designed for standard Domino username/password authentication. SAML redirects would need modifications.

### Q: Can I remove the CAPTCHA?

**A:** Yes, set `features.enableCaptcha: false` in the CONFIG.

### Q: How do I add my own language?

**A:** Add a new entry to `i18n.languages` with all required strings. See the Internationalization section.

### Q: Is this mobile-friendly?

**A:** Yes, fully responsive design tested on iOS and Android devices.

### Q: Can I customize the CSS?

**A:** Yes, the CSS is inline and well-commented. Search for the section you want to modify.

### Q: Does this support two-factor authentication?

**A:** Yes — v2.4.0 adds full TOTP MFA support. Set `features.enableMFA: true` and `mfa.enable: true` after configuring Domino MFA server-side. See the [TOTP section](#mfa).

### Q: Where is login history stored?

**A:** On the **Person document** in `names.nsf`, field `LoginHistory` (multi-value text). A LotusScript agent in DOMCFG.NSF writes to it on each attempt. See the [Login Activity Tracker — Complete Guide](#login-activity-tracker).

### Q: Can I see login history in the email client?

**A:** Yes — two ways. (1) The `LoginHistory` field on the Person document can be surfaced in the Domino Directory or any Notes form/view. See [Accessing Login History](#accessing-login-history). (2) The new **HCL Verse Login Activity Extension** adds a dedicated "Login Activity" popup directly inside Verse via the navbar More menu. See [HCL Verse Login Activity Extension](#hcl-verse-extension).

### Q: I already have an applications.json — will the Verse extension conflict?

**A:** No. The `merge-snippet.json` file contains a single application object to **add** to your existing array. Your current applications and extensions are untouched. See `verse-login-activity/DEPLOYMENT.md` for the step-by-step merge guide and a before/after JSON example.

---

<a id="whats-new"></a>
## 🆕 What's New in v2.5.0

| Feature | Details |
|---------|---------|
| **HCL Verse Login Activity Extension** | \"Login Activity\" link in Verse navbar More menu opens a popup with login history table, summary cards, and status badges. |
| **LoginActivityViewer.html** | Self-contained popup UI (all CSS/JS inline). Dual data source: `names.nsf` via agent, with automatic `localStorage` fallback. |
| **GetLoginHistory Agent** | New LotusScript agent in DOMCFG.NSF. Returns current user's `LoginHistory` as JSON. Anonymous-safe; no cross-user access. |
| **applications.json + merge-snippet.json** | Ready-to-deploy Verse extension. `merge-snippet.json` lets you add it to an existing `applications.json` array without disrupting other extensions. |
| **verse-login-activity/DEPLOYMENT.md** | Full deployment guide: agent creation, ACL, notes.ini parameters, and step-by-step merge instructions. |

> Previous release notes: see [Changelog](#-changelog).

---

<a id="quick-start"></a>
## 🚀 Quick Start Guide (5 minutes)

### Step 1 — Choose Your File

| Use Case | File | Notes |
|----------|------|-------|
| Enterprise + all features | `docs/EnterpriseLoginForm.html` | Sidebar quick links, announcement banner |
| Embedded / compact | `docs/DominoEmbeddedForm.html` | Smaller card, same feature set |

### Step 2 — Edit CONFIG (lines ~97-430)

```javascript
const CONFIG = {
    branding: {
        companyName: "Acme Corp",
        companyTagline: "Enterprise Portal",
        logoUrl: "data:image/png;base64,..."  // base64 avoids MIME issues
    },
    features: {
        enableCaptcha: true,
        enableMFA: false,          // set true after Domino MFA is configured
        enableLoginTracking: false  // set true after agent is deployed
    }
};
```

### Step 3 — Deploy (see full guide below)

1. Open DOMCFG.NSF in Domino Designer
2. Create form `$$LoginUserForm`
3. Paste HTML → select all → Text → Pass-Thru HTML → Save
4. `tell http restart`

---

<a id="deployment-guide"></a>
## 📦 Deployment Guide — Step by Step

### Prerequisites

- HCL Domino 12.0.1+ (for TOTP; 9.0+ for basic login page)
- Domino Designer installed
- `DOMCFG.NSF` exists on the server (create if needed)
- Administrator access to Domino Administrator console

---

### Part A — Deploy the Login Page

#### A1. Open DOMCFG.NSF in Domino Designer

1. Launch **Domino Designer**.
2. **File → Open → HCL Notes Application**.
3. Type your server name and path: `servername!!domcfg.nsf`.
4. If `DOMCFG.NSF` doesn't exist:
   - Copy it from `<DominoDataDir>/domcfg.ntf` (the template).
   - Rename the copy to `domcfg.nsf` and place it in the Domino data directory.

#### A2. Create the Login Form

1. In Designer, expand **Forms** under the application.
2. Click **New Form**.
3. Set the form name to exactly: `$$LoginUserForm`
   - **Important:** Case-sensitive. Domino looks for this exact name.
4. The form editor opens with a blank canvas.

#### A3. Paste the HTML Content

1. Open `docs/EnterpriseLoginForm.html` (or `DominoEmbeddedForm.html`) in a text editor.
2. Select all content (`Ctrl+A`) and copy (`Ctrl+C`).
3. In the Designer form editor, click once to place the cursor.
4. Paste (`Ctrl+V`).
5. Select all content in the form (`Ctrl+A`).
6. Go to **Text → Pass-Thru HTML** (or press `Ctrl+Shift+P`).
   - The text will turn grey/italic — this confirms Pass-Thru mode.
7. Save the form (`Ctrl+S`).

#### A4. Configure Sign-In Form Mapping

1. In DOMCFG.NSF, click **Create → Sign In Form Mapping**.
2. Set:
   - **Organization field:** Leave blank (applies to all orgs) or enter your org name.
   - **Login form database:** `domcfg.nsf`
   - **Login form name:** `$$LoginUserForm`
3. Save the mapping document.

#### A5. Restart HTTP and Test

```
# In Domino console (or Administrator → Server Tasks → Start/Stop):
tell http restart

# Or full restart:
restart task http
```

Open a browser and navigate to any protected URL on your server. The custom login page should appear.

---

### Part B — Customize Branding

All customization is done in the `CONFIG` / `DominoLoginConfig` JavaScript block at the top of the HTML file (lines ~97–430 in EnterpriseLoginForm.html, ~81–280 in DominoEmbeddedForm.html).

| Setting | Where | Example |
|---------|-------|---------|
| Company name | `branding.companyName` | `"Acme Corporation"` |
| Logo (base64) | `branding.logoUrl` | `"data:image/png;base64,..."` |
| Primary color | `theme.primaryColor` | `"#0066CC"` |
| Background | `theme.backgroundGradientStart/End` | `"#1a1a2e"`, `"#16213e"` |
| Footer text | `branding.footerText` | `"© 2026 Acme. All rights reserved."` |
| Quick links | `quickLinks.*` | Set `url` and `show: true/false` |
| Announcement | `announcement.show/text` | Maintenance window notices |

> **Logo tip:** Use base64 (https://www.base64-image.de/) to avoid all MIME type issues. PNG, JPG, or GIF formats are recommended for logos.

---

<a id="mfa"></a>
## 🔐 TOTP Multi-Factor Authentication

### How It Works

```
User enters Username + Password + CAPTCHA
              ↓
     [Sign In button clicked]
              ↓
     Client-side validation passes
              ↓  (if MFA enabled)
     TOTP step appears:
     - 30-second countdown ring
     - 6-digit input (inputmode=numeric, autocomplete=one-time-code)
     - Auto-submits when 6 digits entered
              ↓
     Form POST to /names.nsf?Login with:
       Username=...  Password=...  OTPToken=...  RedirectTo=/
              ↓
     Domino validates all three fields server-side
```

### Server-Side Setup (Required Before Enabling)

#### Step 1 — Enable MFA on the Domino Server

1. Open **Domino Administrator**.
2. Go to **Configuration → Server → Current Server Document**.
3. Click the **Security** tab.
4. Under **Multi-Factor Authentication (MFA)**:
   - Set **Multi-factor authentication** to `Enabled`.
   - Note the **OTP Field Name** (default: `OTPToken`). This MUST match `mfa.totpFieldName` in the CONFIG.
5. Save the Server document.
6. Restart the HTTP task: `restart task http`

#### Step 2 — Configure MFA Policy (Domino 12.0.1+)

1. In Domino Administrator, go to **People & Groups → Policies**.
2. Create or edit a **Security Settings** policy document.
3. Under the **MFA** tab:
   - Enable **Time-based One-Time Password (TOTP)**.
   - Set **TOTP window** to `30` seconds (must match `mfa.totpWindow` in CONFIG).
4. Apply the policy to the target users or OU.

#### Step 3 — User Enrollment

Users must enroll their authenticator app (Google Authenticator, Microsoft Authenticator, etc.) before they can log in with MFA:

1. Direct users to: `https://yourserver/names.nsf?MFASetup`
   - Or the URL configured in your MFA policy as the "enrollment URL".
2. Users scan the QR code with their authenticator app.
3. Once enrolled, their next web login will require the TOTP code.

#### Step 4 — Enable MFA in the Login Page CONFIG

```javascript
features: {
    enableMFA: true,         // ← flip to true
},
mfa: {
    enable: true,            // ← flip to true
    totpFieldName: "OTPToken",  // must match Domino server setting
    totpWindow: 30,
    autoSubmit: true,
    promptTitle: "Two-Factor Authentication",
    backupLinkUrl: "mailto:itsupport@yourorg.com"
}
```

### UX Flow

| Step | What User Sees |
|------|---------------|
| 1 | Normal login form (username, password, CAPTCHA) |
| 2 | After clicking Sign In: smooth transition to TOTP step |
| 3 | 🔐 header + 30-second countdown ring (green → amber → red) |
| 4 | Large 6-digit input; auto-submits on 6th digit |
| 5 | "← Back to Login" button returns to credentials |
| 6 | "Contact IT Support" link for lost device fallback |

### Screen Reader Behaviour

- `srAnnounce` fires with "Two-factor authentication required. Enter your 6-digit code."
- Countdown announces at 10 and 5 seconds remaining.
- Error messages use `role="alert"` + `aria-live="assertive"`.
- Focus moves to the 6-digit input automatically.

---

<a id="login-activity-tracker"></a>
## 📊 Login Activity Tracker — Complete Guide

> Follow the four phases **in order**. Do not set `loginTracking.enable: true` (Phase 3) before completing Phases 1 and 2.

---

<a id="phase-1-provision-person-document-fields"></a>
### Phase 1: Provision Person Document Fields in pubnames.ntf

**Purpose:** Add `LoginHistory` and `LoginHistoryUpdated` fields to the **Person form** in `pubnames.ntf` so they are visible directly in the Notes UI. The `LogLoginAttempt` agent writes these fields automatically — they do not need to exist in the form template for tracking to work. This phase makes them **visible** without having to open Document Properties.

> **Can this phase be skipped?** Yes — tracking still works and fields are still written. However, without this step you must use Document Properties (Tools → Document Properties → Fields tab) to view them. Complete this phase for a proper Notes UI experience.

#### Step 1.1 — Open pubnames.ntf in Domino Designer

1. Launch **HCL Domino Designer**.
2. **File → Open Application** → select your server → open `pubnames.ntf`.
3. In the left panel expand **Forms**.
4. Open the **Person** form.

#### Step 1.2 — Add the LoginHistory Field

1. Position the cursor where the field should appear (e.g., a new section near the bottom of the form).
2. **Create → Field** from the menu bar.
3. Configure the field properties:

   | Property | Value |
   |----------|-------|
   | Name | `LoginHistory` |
   | Type | Text |
   | Allow multiple values | ✅ Yes |
   | Computed type | Computed for display |
   | Formula | `LoginHistory` |

4. Add a static text label above the field: `Login History`.
5. Optional: set the font to Monospace and rows to 5 for readability.

#### Step 1.3 — Add the LoginHistoryUpdated Field

1. Below `LoginHistory`, **Create → Field**:

   | Property | Value |
   |----------|-------|
   | Name | `LoginHistoryUpdated` |
   | Type | Date/Time |
   | Computed type | Computed for display |
   | Formula | `LoginHistoryUpdated` |

2. Add a label: `Last Login Record Updated`.

#### Step 1.4 — Save and Sign pubnames.ntf

1. Save: **Ctrl+S**.
2. Sign: **File → Application → Sign** using an ID with **Manager** access on `pubnames.ntf`.

#### Step 1.5 — Replace Design of names.nsf

This pushes the updated Person form design to the live `names.nsf`.

1. In **HCL Notes Client** (not Designer): **File → Application → Replace Design**.
2. In the dialog:
   - Template server: *(your Domino server)*
   - Select **pubnames.ntf**
   - Check **"Replace existing design elements"**
3. Click **OK** and wait for completion.

*Alternatively:* Domino Administrator → Files tab → right-click `names.nsf` → Application → Replace Design.

#### Step 1.6 — Verify Field Visibility

1. Domino Administrator → **People & Groups → People** → open any Person document.
2. After at least one login attempt is recorded, `Login History` should be visible directly in the form body.

---

<a id="phase-2-deploy-the-logloginattempt-agent"></a>
### Phase 2: Deploy the LogLoginAttempt Agent

**Source file:** `docs/LotusScript/LoginTracker.lss` — copy the entire file into the agent.

#### Step 2.1 — Create Agent in DOMCFG.NSF

| Setting | Value |
|---------|-------|
| Database | `domcfg.nsf` |
| Agent Name | `LogLoginAttempt` *(exact — must match `agentUrl` in CONFIG)* |
| Language | LotusScript |
| When to run | On demand *(HTTP `?OpenAgent`)* |
| Which documents | None |

1. Open `domcfg.nsf` in **Domino Designer**.
2. **Shared Code → Agents → New Agent** with settings above.
3. Select **LotusScript** as the language.
4. Copy the **entire** contents of `docs/LotusScript/LoginTracker.lss` and paste into the Script area.

#### Step 2.2 — Configure Agent Constants

Edit at the top of the agent before saving:

```lotusscript
Const MAX_HISTORY  = 5              ' Entries to retain per user (newest first)
Const NAMES_SERVER = ""             ' "" = current server; "ServerName/Org" for remote
Const NAMES_DB_PATH = "names.nsf"   ' Path to Domino Directory
Const SEND_EMAIL_ON_NEW_ATTEMPT = False  ' True = send email alert per attempt
```

#### Step 2.3 — Save Then Sign the Agent

1. Save: **Ctrl+S**.
2. Sign: **File → Application → Sign** with an ID that has:
   - **Author** + Write public documents (minimum) **or** **Editor** access on `names.nsf`
   - Listed in server Programmability Restrictions (Step 2.5)

#### Step 2.4 — Set ACL on Both Databases

| Database | ACL Entry | Required Access |
|----------|-----------|-----------------|
| `domcfg.nsf` | `Anonymous` | `Reader` — allows unauthenticated web POST |
| `domcfg.nsf` | `LocalDomainServers` | `Manager` |
| `names.nsf` | *Signing ID* | `Author` + Write public docs **or** `Editor` |

#### Step 2.5 — Server Programmability Restrictions

1. Domino Administrator → **Configuration → Servers → Current Server Document → Security** tab.
2. Under **Programmability Restrictions**, add the signing ID to:  
   **"Run restricted LotusScript/Java agents"**
3. Save. Restart HTTP: `restart task http`

#### Step 2.6 — Verify the Agent

Browse to the agent URL in a browser:
```
https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent
```
Expected: `OK` (plain text, HTTP 200).

Test with a POST (optional):
```bash
curl -X POST "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent" \
     -d "username=john.doe&ts=2026-06-25T07:30:00Z&browser=Chrome&platform=Win32&tz=Asia/Kolkata&scr=1920x1080&mfa=0"
```

---

<a id="phase-3-configure-the-login-page"></a>
### Phase 3: Configure the Login Page

In `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html`, locate the CONFIG block:

```javascript
loginTracking: {
    enable: true,                                        // ← flip to true
    agentUrl: "/domcfg.nsf/LogLoginAttempt?OpenAgent",  // exact agent URL
    maxHistory: 5,                                       // entries to retain
    trackValidationFailures: false                       // true = also log CAPTCHA failures
}
```

> Setting `features.enableLoginTracking: true` is equivalent — either flag alone enables tracking.

Save and re-upload to DOMCFG.NSF.

---

<a id="phase-4-verify-end-to-end"></a>
### Phase 4: Verify End-to-End

1. **Reload the login page.** Banner appears immediately:
   - *First load* → dashed placeholder: *"Login Activity Tracking Active — No previous login recorded on this device"*

2. **Submit the login form** with a valid username (credentials may be wrong — tracking still fires).

3. **Check the Person document:**
   - Domino Administrator → People & Groups → People → open the user
   - If Phase 1 done: `Login History` field visible in the form
   - If Phase 1 skipped: Tools → Document Properties → Fields tab → find `LoginHistory`
   - Verify one new pipe-delimited entry was prepended

4. **Reload the login page.** Banner now shows full details:

```
🕐 Last Login Attempt
Date:     Jun 25, 2026, 07:30 AM    Status:   ATTEMPT
Browser:  Chrome / Win32            Timezone: Asia/Kolkata
Screen:   1920x1080                 MFA Used: No
```

Status colours: **green** = SUCCESS · **red** = FAILED · **orange** = ATTEMPT

---

<a id="accessing-login-history"></a>
### Accessing Login History

> `LoginHistory` is on the **Person document** in `names.nsf`.  
> The mail template (`mail12.ntf`) has no connection to it — do NOT modify it.

#### Option A — Domino Administrator

- **Phase 1 done:** Domino Administrator → People → open Person doc → `Login History` visible in form.
- **Phase 1 skipped:** Open Person doc → Tools → Document Properties → Fields → `LoginHistory`.

#### Option B — Custom View in names.nsf (All Users)

1. Open `names.nsf` in Designer → **New View**.
2. Selection formula: `SELECT Form = "Person"`
3. Columns: `FullName` · `@Text(@Elements(LoginHistory))` · `LoginHistory[1]` · `LoginHistoryUpdated`
4. Save and sign the view.

#### Option C — HCL Verse Self-Service Popup

Deploy `verse-login-activity/`. Users see their own history in a popup from the Verse navbar "More" menu via the `GetLoginHistory` agent.  
→ See [HCL Verse Login Activity Extension](#hcl-verse-extension).

#### Option D — LotusScript (Programmatic Read)

```lotusscript
Sub ReadLoginHistory(username As String)
    Dim session As New NotesSession
    Dim db As NotesDatabase
    Set db = session.GetDatabase("", "names.nsf")
    Dim view As NotesView
    Set view = db.GetView("($Users)")
    Dim doc As NotesDocument
    Set doc = view.GetDocumentByKey(username, True)
    If doc Is Nothing Then MsgBox "User not found" : Exit Sub
    Dim history As Variant
    history = doc.GetItemValue("LoginHistory")
    Dim i As Integer
    For i = 0 To UBound(history)
        Dim parts() As String
        parts = Split(CStr(history(i)), "|")
        If UBound(parts) >= 7 Then
            Print "Attempt " & (i+1) & ": " & parts(0) & " | IP: " & parts(1) & _
                  " | Browser: " & parts(3) & " | Screen: " & parts(6)
        End If
    Next i
    Call doc.Recycle() : Call view.Recycle() : Call db.Recycle()
End Sub
```

---

<a id="loginhistory-field-reference"></a>
### LoginHistory Field Reference

**Storage:** Multi-value Text on Person document in `names.nsf`, newest first.

```
TIMESTAMP|IP_ADDRESS|STATUS|BROWSER|PLATFORM|TIMEZONE|SCREEN|MFA_USED
```

| # | Field | Description | Example |
|---|-------|-------------|---------|
| 0 | `TIMESTAMP` | ISO 8601 UTC | `2026-06-25T07:30:00Z` |
| 1 | `IP_ADDRESS` | Client IP from `REMOTE_ADDR` | `192.168.1.10` |
| 2 | `STATUS` | Always `ATTEMPT` at submit time | `ATTEMPT` |
| 3 | `BROWSER` | Detected browser | `Chrome` |
| 4 | `PLATFORM` | OS/platform | `Win10` |
| 5 | `TIMEZONE` | IANA timezone | `Asia/Kolkata` |
| 6 | `SCREEN` | Resolution | `1920x1080` |
| 7 | `MFA_USED` | `1` = MFA used, `0` = no MFA | `0` |

**Example Person document `LoginHistory` field:**
```
[0] 2026-06-25T07:30:00Z|192.168.1.10|ATTEMPT|Chrome|Win10|Asia/Kolkata|1920x1080|0
[1] 2026-06-24T14:15:00Z|10.0.0.5|ATTEMPT|Edge|Win10|Asia/Kolkata|1920x1080|0
[2] 2026-06-23T09:00:00Z|192.168.1.10|ATTEMPT|Chrome|Win10|Asia/Kolkata|2560x1440|1
```

**`LoginHistoryUpdated`** — Date/Time field, updated on every write. Use for sorting/filtering in views.

---

### Data Collected (Client-Side — No Passwords)

| Field | Example |
|-------|---------|
| `username` | `john.doe` |
| `ts` (timestamp) | `2026-06-25T07:30:00.000Z` |
| `tz` (timezone) | `Asia/Kolkata` |
| `scr` (screen) | `1920x1080` |
| `browser` | `Chrome` |
| `platform` | `Win32` |
| `mfa` | `0` or `1` |

> Passwords are **never** collected. IP is added server-side from `REMOTE_ADDR` — never from the browser.

---

### Security Considerations

- The agent only updates existing Person documents — no new documents are created.
- To prevent endpoint abuse, add rate-limiting at the Domino HTTP level or via a WAF rule.
- IP addresses are stored server-side only; never in `localStorage`.

---

<a id="hcl-verse-extension"></a>
## � HCL Verse Login Activity Extension

Brings captured login history directly into **HCL Verse** as a popup accessible from the navbar "More" menu — no additional navigation or separate tools required.

### Files

| File | Purpose |
|------|---------|
| `verse-login-activity/LoginActivityViewer.html` | Self-contained popup UI — deploy as File Resource in DOMCFG.NSF |
| `verse-login-activity/GetLoginHistory.lss` | LotusScript agent — returns `LoginHistory` from `names.nsf` as a JSON array |
| `verse-login-activity/applications.json` | Complete Verse extension definition (use for new deployments) |
| `verse-login-activity/merge-snippet.json` | Single app object to append to an existing `applications.json` |
| `verse-login-activity/DEPLOYMENT.md` | Step-by-step deployment guide with ACL, notes.ini, and merge instructions |

### Architecture

```
HCL Verse (navbar More menu)
  └─ "Login Activity" link  ← injected by applications.json
        ↓  (popup window opens)
  LoginActivityViewer.html  (File Resource in DOMCFG.NSF)
        ├─ reads  localStorage['lastLoginAttempt']   (instant, same-origin)
        └─ fetches  /domcfg.nsf/GetLoginHistory?OpenAgent
                          ↓  (authenticated — session cookie)
               GetLoginHistory (LotusScript Agent)
                          ↓
               reads LoginHistory[] → names.nsf Person document
                          ↓  returns JSON array
                  Popup displays: Date | IP | Browser | Platform | Timezone | Screen | MFA | Status
```

### Popup Features

| Feature | Details |
|---------|---------|
| **Summary Cards** | Last login date, total recorded attempts, unique IPs, MFA usage count |
| **Activity Table** | Full history with absolute timestamps and relative labels ("2 hr ago") |
| **Status Badges** | Color-coded — ATTEMPT (blue), SUCCESS (green), FAILED (red) |
| **Pending Sync Tag** | Highlights entries written to `localStorage` but not yet flushed to `names.nsf` |
| **Data Source Indicator** | Green dot = `names.nsf` (live) · Orange dot = browser localStorage only |
| **Refresh Button** | Re-fetches without closing the popup |
| **Graceful Degradation** | Falls back to `localStorage` data with an informational banner if agent is unreachable |
| **Self-Contained** | All CSS/JS inline — no external files, no MIME type configuration |

### Verse Extension Point Used

```json
{
  "type": "com.ibm.action.link",
  "path": "com.ibm.navbar.order.96500",
  "payload": {
    "link": "https://YOUR_DOMINO_SERVER/domcfg.nsf/LoginActivityViewer.html",
    "window_features": "width=1040,height=720,resizable=yes,scrollbars=yes"
  }
}
```

### Integrating with an Existing applications.json

Your existing `applications.json` is a JSON **array** (`[...]`). Add the new app object from `merge-snippet.json` as an additional element:

```json
[
  { "name": "YourExistingApp", "extensions": [...], "services": ["Verse"] },
  {
    "name": "DominoLoginActivityViewer",
    "extensions": [
      {
        "id": "domino-login-activity",
        "type": "com.ibm.action.link",
        "path": "com.ibm.navbar.order.96500",
        "title": "Login Activity",
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

> Validate your merged JSON at [jsonlint.com](https://jsonlint.com) before deploying.

### Quick Deploy Checklist

- [ ] Deploy `LoginActivityViewer.html` as File Resource in DOMCFG.NSF
- [ ] Create agent `GetLoginHistory` in DOMCFG.NSF — paste `GetLoginHistory.lss`, sign with an ID that has Reader access to `names.nsf`
- [ ] Set DOMCFG.NSF ACL: Anonymous → No Access; authenticated users → Reader
- [ ] Edit `applications.json` (or `merge-snippet.json`): replace `YOUR_DOMINO_SERVER`
- [ ] Deploy `applications.json` and set `notes.ini` parameters
- [ ] `tell http restart` · Test: click More menu in Verse

For the complete guide see `verse-login-activity/DEPLOYMENT.md`.

---

<a id="audio-captcha"></a>
## �� Audio CAPTCHA

The math CAPTCHA fully supports visually impaired users via Web Speech API:

- Operators are **fully spelled out** ("plus", "minus", "times") — no raw `+`, `-`, `×` symbols sent to TTS.
- **Body-level ARIA live regions** (`role="status"` + `role="alert"`) ensure JAWS, NVDA, VoiceOver, and Narrator all announce playback state.
- **Click-to-stop toggle** — clicking the audio button again stops speech.
- **iOS Safari** workaround for silent speech synthesis after page load.
- **Chrome/Edge** `onstart` bug workaround with `requestAnimationFrame` fallback.
- `@media (prefers-reduced-motion)` disables the pulse animation.
- `@media (forced-colors: active)` adds outline-based indicators for Windows High Contrast Mode.

---

<a id="configuration-reference"></a>
## ⚙️ Configuration Reference

### CONFIG / DominoLoginConfig Keys (v2.5.0)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `version` | String | `"2.5.0"` | Displayed in footer |
| `branding.companyName` | String | `"Your Organization"` | Displayed in header |
| `branding.logoUrl` | String | `""` | Base64 or URL; leave blank for text only |
| `theme.primaryColor` | String | `"#0066CC"` | Buttons, links, focus rings |
| `features.enableCaptcha` | Boolean | `true` | Math CAPTCHA with audio |
| `features.enableMFA` | Boolean | `false` | TOTP two-step flow |
| `features.enableLoginTracking` | Boolean | `false` | Login attempt tracking + banner |
| `features.enableThemeSwitcher` | Boolean | `true` | Dark/Light toggle button |
| `features.enableTranslations` | Boolean | `true` | Language selector |
| `mfa.enable` | Boolean | `false` | Master MFA switch (same as `features.enableMFA`) |
| `mfa.totpFieldName` | String | `"OTPToken"` | Must match Domino server MFA field name |
| `mfa.totpWindow` | Number | `30` | Seconds per TOTP code (must match server) |
| `mfa.autoSubmit` | Boolean | `true` | Submit automatically when 6 digits entered |
| `mfa.backupLinkUrl` | String | `"mailto:..."` | Fallback support link |
| `loginTracking.enable` | Boolean | `false` | Master tracking switch |
| `loginTracking.agentUrl` | String | `"/domcfg.nsf/LogLoginAttempt?OpenAgent"` | Tracking agent URL |
| `loginTracking.maxHistory` | Number | `5` | Attempts kept on Person document |
| `loginTracking.trackValidationFailures` | Boolean | `false` | Also track CAPTCHA/validation failures |
| `captcha.difficulty` | String | `"easy"` | `"easy"`, `"medium"`, `"hard"` |
| `captcha.enableAudio` | Boolean | `true` | TTS audio for CAPTCHA |
| `captcha.maxAttempts` | Number | `3` | Lock after N failures |
| `session.warningMinutes` | Number | `25` | Show timeout warning at this minute |
| `session.timeoutMinutes` | Number | `30` | Full session timeout |

---

<a id="i18n"></a>
## 🌍 Internationalization (i18n)

Built-in support for 18 languages: English, Spanish, French, German, Arabic (RTL), Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Chinese, Japanese, Korean, Portuguese.

To add a language, extend `i18n.languages` in the CONFIG:

```javascript
nl: { name: "Nederlands", dir: "ltr", strings: {
    welcomeTitle: "Welkom terug",
    signIn: "Inloggen",
    // ... all keys required
}}
```

---

<a id="accessibility"></a>
## ♿ Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All interactive elements focusable; Tab order is logical |
| Focus indicators | `outline: 2px solid primary-color` on all elements |
| Screen reader labels | `aria-label`, `aria-describedby`, `aria-required` on all inputs |
| Live regions | Body-level `role="status"` + `role="alert"` outside any `role="group"` |
| Error messages | `role="alert"` on error containers; announced immediately |
| TOTP timer | Announces at 10s and 5s thresholds only (not every second) |
| CAPTCHA audio | Fully spelled operators; toggle-to-stop; iOS/Chrome workarounds |
| Reduced motion | `@media (prefers-reduced-motion)` disables all animations |
| High contrast | `@media (forced-colors: active)` uses outline-based indicators |
| Skip link | "Skip to login form" visible on keyboard focus |
| RTL | Arabic automatically applies `dir="rtl"` |

---

<a id="troubleshooting"></a>
## 🔧 Troubleshooting

### Login page not showing custom form
- Confirm form name is exactly `$$LoginUserForm` (case-sensitive).
- Confirm the Sign In Form Mapping document exists in DOMCFG.NSF.
- Run `tell http restart` after changes.

### TOTP code rejected by Domino
- Verify `mfa.totpFieldName` matches the field name in the Domino Server document MFA settings.
- Verify `mfa.totpWindow` matches the server's TOTP window (default 30s).
- Check that the user is enrolled — not all users need MFA unless the policy applies.
- Verify system clocks: TOTP is time-sensitive; server and authenticator device clocks must be in sync (±30s).

### Login tracking agent returns error
- Check the agent is signed with an ID that has write access to `names.nsf`.
- Verify Anonymous has at least Reader access to DOMCFG.NSF.
- Test the agent URL directly in a browser: `https://server/domcfg.nsf/LogLoginAttempt?OpenAgent`.
- Check the Domino server console log for agent errors (`show log`).

### Last-login banner not appearing
- Set `loginTracking: { enable: true }` in CONFIG (preferred) or `features.enableLoginTracking: true` — either flag is sufficient.
- **First load (no prior attempt):** a dashed-border placeholder *"Login Activity Tracking Active"* should appear immediately. If it does not, the flag is not set or `setupLoginTracking()` is not running.
- **Subsequent loads:** full last-attempt details are shown from `localStorage`. If still empty, the form submit event may not have fired — check the browser console for errors.
- Private/incognito mode blocks `localStorage` — the banner will not persist across sessions in private mode.

### Logo not displaying
- Domino does **NOT** support SVG — use PNG, JPG, or GIF only.
- File resources have no subfolders: `/domcfg.nsf/logo.png` ✅ NOT `/domcfg.nsf/images/logo.png` ❌.
- Use base64 data URI to bypass all MIME issues entirely.

---

<a id="changelog"></a>
## 📋 Changelog

### Version 2.5.0 (June 2026)

**New Features:**
- ✅ HCL Verse Login Activity Extension — "Login Activity" link in Verse navbar More menu
- ✅ `LoginActivityViewer.html` — self-contained popup with history table, summary cards, dual data source (server + localStorage)
- ✅ `GetLoginHistory.lss` — new LotusScript agent returning `LoginHistory` from `names.nsf` as authenticated JSON
- ✅ `applications.json` + `merge-snippet.json` — seamless integration with existing or new Verse deployments
- ✅ `verse-login-activity/DEPLOYMENT.md` — comprehensive step-by-step guide covering agents, ACL, notes.ini, and merge instructions

### Version 2.4.2 (June 29, 2026)

**Login Tracking — Fixes & Documentation Overhaul:**
- ✅ Banner now shows immediately when `loginTracking.enable: true` — dashed placeholder on first load (previously: silent/invisible until second load)
- ✅ Banner expanded from 4 to 6 fields: Date, Status, Browser, Timezone, **Screen resolution**, **MFA Used**
- ✅ Status colour corrected: SUCCESS = green · FAILED = red · ATTEMPT = orange (was incorrectly red)
- ✅ Dual enable flags unified — `features.enableLoginTracking` syncs into `loginTracking.enable`; either flag alone is sufficient
- ✅ `LoginTracker.lss` (v1.1.0): full Deployment Checklist, Prerequisites, field-by-field format reference
- ✅ README corrected: `LoginHistory` is stored on the **Person document** in `names.nsf` — **no mail template changes needed or applicable**
- ✅ Documentation restructured: "Accessing Login History" section replaces incorrect "Show in Notes Mail" content

### Version 2.4.1 (June 25, 2026)

**Bug Fixes:**
- ✅ `initFormValidation` fallback to `querySelector` when Domino's outer form nests and discards inner form tag
- ✅ `align-items: center` threshold raised to 1000px — fixes page content clipped above scroll at 100% zoom
- ✅ Logo text fallback shown instead of hiding container when image fails to load
- ✅ Language selector `type=button` + `stopPropagation()` — prevents unintended form submission
- ✅ `padding-top: 80px` on main container at all breakpoints — title no longer clipped under fixed top bar

### Version 2.4.0 (June 2026)

**New Features:**
- ✅ TOTP Multi-Factor Authentication — two-step login flow with animated countdown ring
- ✅ Login attempt tracking — client-side fingerprint POSTed to Domino agent
- ✅ LotusScript agent (`docs/LotusScript/LoginTracker.lss`) for Person document updates
- ✅ Last-login banner — shows previous attempt info on each page load
- ✅ Optional email notification per attempt (controlled by `SEND_EMAIL_ON_NEW_ATTEMPT`)
- ✅ `credentialsStep` / `mfaStep` two-step HTML structure

**Improvements:**
- ✅ Form submit handler now intercepts for MFA before Domino POST
- ✅ `trackLoginAttempt()` fires on every submission (non-blocking, `keepalive: true`)
- ✅ TOTP countdown announces at 10s and 5s for screen readers
- ✅ Both files (EnterpriseLoginForm.html, DominoEmbeddedForm.html) fully synced

### Version 2.3.0 (May 2026)

**New Features:**
- ✅ Full WCAG screen reader compatibility for Audio CAPTCHA
- ✅ Body-level ARIA live regions (`srLivePolite`, `srLiveAssertive`)
- ✅ Spelled-out math operators ("plus", "minus", "times") in TTS
- ✅ iOS Safari + Chrome/Edge speech synthesis workarounds
- ✅ `@media (prefers-reduced-motion)` + `@media (forced-colors: active)` CSS

### Version 2.2.0 (May 2026)

- ✅ Audio CAPTCHA with Web Speech API
- ✅ CAPTCHA refresh generates new math problem
- ✅ Math CAPTCHA with difficulty levels

### Version 2.1.0 (April 2026)

- ✅ Real-time validation with disabled submit until valid
- ✅ Dark/Light mode with smooth transitions
- ✅ 18 languages including 9 Indian languages + Arabic RTL
- ✅ Version display in footer
- ✅ Enhanced CAPTCHA

### Version 2.0.0 (April 2026)

- Initial Release: self-contained HTML, dark mode, CAPTCHA, session management, WCAG 2.1

---

**Repository:** [github.com/rishablearn/DominoCustomWebPageApril26](https://github.com/rishablearn/DominoCustomWebPageApril26)  
**Compatible with:** HCL Domino 12.x, 14.x  
**Version:** 2.5.0 (HTML files: 2.4.2)  
**Last Updated:** June 29, 2026

