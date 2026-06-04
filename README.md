# HCL Domino Custom Login Page

> **Extend Your HCL Domino Login Experience** — A modern, secure, fully accessible login page with TOTP MFA, login attempt tracking, CAPTCHA, 18 languages, dark mode, and streamlined MIME type handling.

![Version](https://img.shields.io/badge/version-2.4.0-blue)
![Domino](https://img.shields.io/badge/HCL%20Domino-12.x%20%7C%2014.x-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Languages](https://img.shields.io/badge/languages-18-orange)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-purple)
![MFA](https://img.shields.io/badge/MFA-TOTP%20Ready-red)

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [How This Solution Augments Domino](#-how-this-solution-augments-domino)
3. [Features at a Glance](#-features-at-a-glance)
4. [Detailed Feature Documentation](#-detailed-feature-documentation)
5. [Logo Configuration](#-logo-configuration)
6. [Architecture & Technical Details](#-architecture--technical-details)
7. [FAQ](#-faq)
8. [What's New in v2.4.0](#-whats-new-in-v240)
9. [Quick Start Guide (5 minutes)](#-quick-start-guide-5-minutes)
10. [Deployment Guide — Step by Step](#-deployment-guide--step-by-step)
11. [TOTP Multi-Factor Authentication](#-totp-multi-factor-authentication)
12. [Login Attempt Tracking](#-login-attempt-tracking)
13. [Person Document Storage](#-person-document-storage)
14. [LotusScript Agent Deployment](#-lotusscript-agent-deployment)
15. [Audio CAPTCHA](#-audio-captcha)
16. [Configuration Reference](#-configuration-reference)
17. [Internationalization (i18n)](#-internationalization-i18n)
18. [Accessibility (WCAG 2.1 AA)](#-accessibility-wcag-21-aa)
19. [Troubleshooting](#-troubleshooting)
20. [Changelog](#-changelog)

---

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

---

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
| Tamil | `ta` | LTR | India, Sri Lanka |
| Telugu | `te` | LTR | India |
| Bengali | `bn` | LTR | India, Bangladesh |
| Marathi | `mr` | LTR | India |
| Kannada | `kn` | LTR | India |
| Malayalam | `ml` | LTR | India |
| Gujarati | `gu` | LTR | India |
| Punjabi | `pa` | LTR | India, Pakistan |
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

**A:** Yes — v2.4.0 adds full TOTP MFA support. Set `features.enableMFA: true` and `mfa.enable: true` after configuring Domino MFA server-side. See the [TOTP section](#-totp-multi-factor-authentication).

### Q: Where is login history stored?

**A:** On the **Person document** in `names.nsf`, field `LoginHistory` (multi-value text). A LotusScript agent in DOMCFG.NSF writes to it on each attempt. See the [Login Tracking section](#-login-attempt-tracking).

### Q: Can I see login history in the email client?

**A:** Yes. The `LoginHistory` field is a standard multi-value text item on the Person document and can be exposed in the Domino Directory or any Notes form/view that looks up the Person document. See [Person Document Storage](#-person-document-storage).

---

## 🆕 What's New in v2.4.0

| Feature | Details |
|---------|---------|
| **TOTP MFA** | Two-step login flow: credentials → 6-digit TOTP code. Animated 30-second countdown ring. Auto-submit on 6 digits. Full WCAG screen-reader support. |
| **Login Attempt Tracking** | Client-side fingerprint (browser, timezone, screen) + server IP written to Person document in `names.nsf`. |
| **Last-Login Banner** | On next page load, shows a non-intrusive banner with the previous attempt's date, browser, timezone, and status. |
| **LotusScript Agent** | Full agent source in `docs/LotusScript/LoginTracker.lss`. Stores last 5 attempts per user. Optional email notification on each attempt. |
| **Audio CAPTCHA (v2.3.0)** | Body-level ARIA live regions, spelled-out operators, iOS + Chrome/Edge TTS compatibility. |

---

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

## 📊 Login Attempt Tracking

### Architecture

```
Browser (login page JS)         Domino Server
─────────────────────           ──────────────────────────────────
1. On form submit:
   Collect payload:
   { ts, tz, lang, scr,
     browser, platform, mfa }
                                
2. fetch POST (keepalive:true)  →  LogLoginAttempt?OpenAgent
   + username                       ↓
                                2a. Reads REMOTE_ADDR (real IP)
                                2b. Looks up Person doc in names.nsf
                                2c. Prepends entry to LoginHistory[]
                                2d. Trims to last 5
                                2e. Saves Person doc

3. localStorage.setItem(...)    (last attempt for banner)

4. form.submit()                →  /names.nsf?Login (Domino auth)
```

### Data Collected (Client-Side — No PII)

| Field | Value | Example |
|-------|-------|---------|
| `ts` | ISO 8601 timestamp | `2026-06-04T12:30:00.000Z` |
| `tz` | IANA timezone | `Asia/Kolkata` |
| `lang` | Browser language | `en-IN` |
| `scr` | Screen resolution | `1920x1080` |
| `browser` | Detected browser | `Chrome` |
| `platform` | OS/platform | `Win32` |
| `mfa` | MFA used? | `0` or `1` |
| `username` | Typed username | `john.doe` |

> **Note:** Passwords are never collected or transmitted by this tracking.

### Data Added Server-Side (Agent)

| Field | Source |
|-------|--------|
| `ip` | `REMOTE_ADDR` CGI variable (real client IP) |
| Server timestamp | `Now()` in LotusScript |

### Last-Login Banner

When `enableLoginTracking: true`, after each login attempt the data is saved to `localStorage`. On the **next page load** (next login), a compact info banner appears showing:

```
🕐 Last Login Attempt
Date: Jun 3, 2026, 09:15 AM    Status: ATTEMPT
Browser: Chrome / Win32         Timezone: Asia/Kolkata
```

---

## 🗂️ Person Document Storage

### Fields Written

| Field | Type | Description |
|-------|------|-------------|
| `LoginHistory` | Multi-value Text | Last 5 login attempts, newest first |
| `LoginHistoryUpdated` | Date/Time | Timestamp of last update |

### Entry Format (pipe-delimited)

```
TIMESTAMP|IP_ADDRESS|STATUS|BROWSER|PLATFORM|TIMEZONE|SCREEN|MFA_USED
```

**Example entries:**

```
LoginHistory:
  [0] 2026-06-04T12:30:00Z|192.168.1.5|ATTEMPT|Chrome|Win32|Asia/Kolkata|1920x1080|0
  [1] 2026-06-03T09:15:00Z|10.0.0.22|ATTEMPT|Firefox|MacIntel|Europe/London|2560x1440|1
  [2] 2026-06-01T16:45:00Z|192.168.1.5|ATTEMPT|Edge|Win32|Asia/Kolkata|1920x1080|0
```

### Show in Notes Mail / Web Mail

To display login history in the HCL Notes client or web mail interface:

#### Option A — Subform on Mail Template

1. Open the mail template (`mail12.ntf` or your org's template) in Domino Designer.
2. Create a new **Subform** named `LoginHistorySubform`.
3. Add a computed field:
   - Name: `LoginHistoryDisplay`
   - Type: Rich Text (computed for display)
   - Formula:
     ```notes
     @If(@IsAvailable(LoginHistory);
         "Last 5 Login Attempts:" + @NewLine + @Implode(LoginHistory; @NewLine);
         "")
     ```
4. Include the subform in the **Memo** form or a dedicated **Person Info** page.

#### Option B — Domino Directory View

1. Open `names.nsf` in Domino Designer.
2. Create a new **View** named `Login History`:
   - Selection: `SELECT Form = "Person"`
   - Column 1: `FullName`
   - Column 2: `@Text(@Elements(LoginHistory))` — count of attempts
   - Column 3: `LoginHistory[1]` — most recent attempt
3. Categorize by `LoginHistoryUpdated` date.

#### Option C — Notes Client Agent (Read History)

```lotusscript
Sub ReadLoginHistory(username As String)
    Dim session As New NotesSession
    Dim db As NotesDatabase
    Set db = session.GetDatabase("", "names.nsf")
    Dim view As NotesView
    Set view = db.GetView("($Users)")
    Dim doc As NotesDocument
    Set doc = view.GetDocumentByKey(username, True)
    If doc Is Nothing Then
        MsgBox "User not found"
        Exit Sub
    End If
    Dim history As Variant
    history = doc.GetItemValue("LoginHistory")
    Dim i As Integer
    For i = 0 To UBound(history)
        Dim parts() As String
        parts = Split(CStr(history(i)), "|")
        If UBound(parts) >= 4 Then
            Print "Attempt " & (i+1) & ": " & _
                  parts(0) & " from " & parts(1) & _
                  " via " & parts(3) & " on " & parts(4)
        End If
    Next i
    Call doc.Recycle()
    Call view.Recycle()
    Call db.Recycle()
End Sub
```

---

## 🤖 LotusScript Agent Deployment

The full agent source is at `docs/LotusScript/LoginTracker.lss`.

### Step-by-Step Deployment

#### Step 1 — Open DOMCFG.NSF in Designer

1. Launch Domino Designer.
2. Open `domcfg.nsf` on your server.

#### Step 2 — Create the Agent

1. Expand **Agents** in the left panel.
2. Click **New Agent**.
3. Set:
   - **Name:** `LogLoginAttempt` (exact name — must match `loginTracking.agentUrl` in CONFIG)
   - **Alias:** *(optional)*
   - **When should this agent run:** `On demand`
   - **Which document(s) should it act on:** `None`
   - **Runtime security level:** `2 - Restricted` (or higher if your security policy requires)
   - **Run as web user:** ✅ checked

#### Step 3 — Paste the LotusScript Code

1. Select **LotusScript** as the language.
2. Open `docs/LotusScript/LoginTracker.lss` from this repository.
3. Copy the entire content and paste into the agent's **Script** area.
4. Adjust constants at the top of the file if needed:
   ```lotusscript
   Const MAX_HISTORY = 5          ' How many attempts to store
   Const NAMES_SERVER = ""        ' "" = current server
   Const NAMES_DB_PATH = "names.nsf"
   Const SEND_EMAIL_ON_NEW_ATTEMPT = False  ' Set True to email users
   ```

#### Step 4 — Sign the Agent

1. Go to **File → Application → Sign** in Designer.
2. Select an ID that has:
   - **Write access** to `names.nsf` (to update Person documents).
   - Permission to **run LotusScript agents** on the server.
3. Sign with that ID.

#### Step 5 — Set ACL on DOMCFG.NSF

1. In Designer (or Domino Administrator), open the ACL for `domcfg.nsf`.
2. Add/verify:
   - **Anonymous** → `Reader` access (required for the agent to be called by an unauthenticated web user).
   - **LocalDomainServers** → `Manager` (needed to sign/run agents).
3. Save the ACL.

#### Step 6 — Set ACL on NAMES.NSF

The agent signer's ID needs write access to `names.nsf`:

1. Open the ACL for `names.nsf`.
2. Ensure the signer ID has at minimum `Author` access with **Write public documents** checked, OR `Editor` access.

#### Step 7 — Enable in Server Document

1. In Domino Administrator, open **Configuration → Servers → Current Server Document**.
2. Go to the **Security** tab.
3. Under **Programmability Restrictions**:
   - Add the agent signer to **"Run restricted LotusScript/Java agents"** (or unrestricted if required).
4. Save.

#### Step 8 — Test the Agent

```bash
# Open in browser (should return "OK"):
https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent

# Or use curl:
curl -X POST "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent" \
     -d "username=testuser&ts=2026-06-04T12:00:00Z&browser=Chrome&platform=Win32&tz=UTC&scr=1920x1080&mfa=0"
```

Expected response: `OK` (plain text, HTTP 200).

#### Step 9 — Enable in Login Page CONFIG

```javascript
features: {
    enableLoginTracking: true,  // ← flip to true
},
loginTracking: {
    enable: true,
    agentUrl: "/domcfg.nsf/LogLoginAttempt?OpenAgent",
    maxHistory: 5,
    trackValidationFailures: false  // set true to also log CAPTCHA failures
}
```

### Security Considerations

- The agent receives the **typed username** (not authenticated). A malicious actor could send arbitrary usernames. The agent only updates the Person document if the username matches an existing record — no documents are created.
- Passwords are **never** sent to or stored by the tracking agent.
- IP addresses are stored server-side only (never in localStorage or the browser).
- To prevent abuse of the endpoint, consider adding rate-limiting at the Domino HTTP level or a WAF rule.

---

## 🔊 Audio CAPTCHA

The math CAPTCHA fully supports visually impaired users via Web Speech API:

- Operators are **fully spelled out** ("plus", "minus", "times") — no raw `+`, `-`, `×` symbols sent to TTS.
- **Body-level ARIA live regions** (`role="status"` + `role="alert"`) ensure JAWS, NVDA, VoiceOver, and Narrator all announce playback state.
- **Click-to-stop toggle** — clicking the audio button again stops speech.
- **iOS Safari** workaround for silent speech synthesis after page load.
- **Chrome/Edge** `onstart` bug workaround with `requestAnimationFrame` fallback.
- `@media (prefers-reduced-motion)` disables the pulse animation.
- `@media (forced-colors: active)` adds outline-based indicators for Windows High Contrast Mode.

---

## ⚙️ Configuration Reference

### CONFIG / DominoLoginConfig Keys (v2.4.0)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `version` | String | `"2.4.0"` | Displayed in footer |
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
- `features.enableLoginTracking` must be `true`.
- The banner only shows on the **second** page load (first attempt is stored, shown on next).
- Check browser console for localStorage errors (private/incognito mode may block it).

### Logo not displaying
- Domino does **NOT** support SVG — use PNG, JPG, or GIF only.
- File resources have no subfolders: `/domcfg.nsf/logo.png` ✅ NOT `/domcfg.nsf/images/logo.png` ❌.
- Use base64 data URI to bypass all MIME issues entirely.

---

## 📋 Changelog

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
**Version:** 2.4.0  
**Last Updated:** June 2026

