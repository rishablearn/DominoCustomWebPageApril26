# HCL Domino Custom Login Page - Beginner's Deployment Guide

**Step-by-Step Instructions for First-Time Domino Administrators**

This guide assumes you have never deployed a custom login page before. Follow each step exactly as written.

---

## Table of Contents

1. [What You Need Before Starting](#what-you-need-before-starting)
2. [Understanding the Basics](#understanding-the-basics)
3. [Method 1: Using DXL Import (Easiest)](#method-1-using-dxl-import-easiest)
4. [Method 2: Manual Setup in Domino Designer](#method-2-manual-setup-in-domino-designer)
5. [Configuring Your Login Page](#configuring-your-login-page)
6. [Testing Your Login Page](#testing-your-login-page)
7. [Troubleshooting Common Problems](#troubleshooting-common-problems)
8. [Getting Help](#getting-help)

---

## What You Need Before Starting

### Required Software

| Software | Purpose | Where to Get It |
|----------|---------|-----------------|
| HCL Notes Client | Access Domino databases | Your IT department |
| HCL Domino Designer | Create/edit forms | Your IT department |
| HCL Domino Administrator | Server management | Your IT department |
| Text Editor (Notepad++) | Edit configuration files | https://notepad-plus-plus.org |
| Web Browser | Test the login page | Already installed |

### Required Access

You need **administrator access** to your Domino server. If you don't have this, contact your IT department.

To check if you have admin access:
1. Open HCL Notes Client
2. Try to open the **Domino Directory** (names.nsf) on your server
3. If you can see and edit documents, you likely have sufficient access

### Files You'll Need

Download or locate these files from this project:
- `CustomLoginForm.html` - The main login page
- `config.js` - Configuration settings
- `css/login.css` - Styling
- `js/login.js` - Functionality
- `i18n/translations.js` - Language translations
- `images/logo-placeholder.svg` - Placeholder logo (replace with yours)

---

## Understanding the Basics

### What is DOMCFG.NSF?

DOMCFG.NSF is a special database that tells Domino how to handle web login. When someone tries to access a protected resource on your Domino web server, Domino checks this database to find your custom login form.

**Think of it like:** A receptionist desk at the entrance of a building. Everyone who wants to enter must check in there first.

### What is Session Authentication?

Session authentication means users log in once, and Domino remembers them for a period of time (usually 30 minutes). They don't need to log in again for each page they visit.

### What is a Form in Domino?

A form is like a template. In our case, it's a template for the login page that Domino shows to users.

---

## Method 1: Using DXL Import (Easiest)

**DXL (Domino XML Language)** allows you to import pre-built forms directly into Domino. This is the easiest method.

### Step 1.1: Create DOMCFG.NSF Database

**If DOMCFG.NSF already exists on your server, skip to Step 1.2**

1. Open **HCL Notes Client**
2. Click **File** menu → **Application** → **New**
3. Fill in the dialog:

   | Field | What to Enter |
   |-------|---------------|
   | Server | Select your Domino server name (e.g., `Server1/YourCompany`) |
   | Title | `Domino Web Server Configuration` |
   | File name | `domcfg.nsf` (type this exactly) |
   | Template | Click **Show Advanced Templates** checkbox, then select **Domino Web Server Configuration** |

4. Click **OK**
5. Wait for the database to be created (this may take a few seconds)

**Screenshot Reference:**
```
┌─────────────────────────────────────────┐
│ New Application                         │
├─────────────────────────────────────────┤
│ Server: [Server1/YourCompany    ▼]      │
│ Title:  [Domino Web Server Config    ]  │
│ File:   [domcfg.nsf                  ]  │
│                                         │
│ ☑ Show Advanced Templates               │
│ Template: [Domino Web Server Config ▼]  │
│                                         │
│         [  OK  ]  [ Cancel ]            │
└─────────────────────────────────────────┘
```

### Step 1.2: Set Database Permissions (ACL)

1. Open the newly created `domcfg.nsf` database
2. Click **File** menu → **Application** → **Access Control**
3. You'll see a list of names/groups with access levels
4. Make these changes:

   **Add Anonymous access:**
   - Click **Add** button
   - Type: `Anonymous`
   - Click **OK**
   - Select `Anonymous` in the list
   - Set **Access** to `Reader`
   - Click **OK**

   **Verify these entries exist:**
   | Name | Access Level |
   |------|--------------|
   | -Default- | No Access |
   | Anonymous | Reader |
   | LocalDomainServers | Manager |
   | Your Admin Name | Manager |

5. Click **OK** to save

**Why Anonymous needs Reader access:** When someone visits your login page, they're not logged in yet (they're "anonymous"). They need to be able to see the login form.

### Step 1.3: Import the DXL File

1. In Domino Designer, open `domcfg.nsf`
2. Click **File** menu → **Import** → **DXL**
3. Browse to the file: `dxl/CustomLoginForm.dxl` (from this project)
4. Click **Import**
5. You should see a success message

**If you don't see the Import DXL option:**
- Make sure you're in **Domino Designer** (not Notes Client)
- Make sure the database is open and selected

### Step 1.4: Import Resource Files

Now we need to import the CSS, JavaScript, and image files.

1. In Domino Designer, with `domcfg.nsf` open
2. In the left panel, expand **Resources**
3. Click on **Files**
4. Right-click in the empty area → **Import**
5. Import each file one at a time:

   | File to Import | After Import, Rename To |
   |----------------|------------------------|
   | `css/login.css` | `login.css` |
   | `config.js` | `config.js` |
   | `js/login.js` | `login.js` |
   | `i18n/translations.js` | `translations.js` |
   | `images/logo-placeholder.svg` | `logo.svg` |

**How to rename a file resource:**
1. Right-click on the imported file
2. Select **Properties** or **Rename**
3. Change the name
4. Save

### Step 1.5: Create Login Form Mapping

This tells Domino to use your custom form for logins.

1. Open `domcfg.nsf` in **Notes Client** (not Designer)
2. You should see the main view
3. Look for **Sign In Form Mappings** or a button labeled **Add Mapping**
4. Click to create a new mapping document
5. Fill in:

   | Field | Value |
   |-------|-------|
   | Site Configuration | Select "All Web Sites / Entire Server" |
   | Target Database | `domcfg.nsf` |
   | Target Form | `CustomLoginForm` |
   | Comments | `Custom branded login - v2.0` |

6. **Save and Close** the document (Ctrl+S, then Esc)

### Step 1.6: Restart HTTP Service

For changes to take effect, restart the Domino HTTP service:

**Option A: Using Domino Administrator**
1. Open HCL Domino Administrator
2. Connect to your server
3. Click **Server** tab
4. Click **Status** tab
5. Find **HTTP** in the task list
6. Right-click → **Restart Task**

**Option B: Using Server Console**
1. Open Domino Administrator
2. Go to **Server** → **Console**
3. Type: `tell http restart`
4. Press Enter

**Option C: Ask your Domino administrator to run:**
```
tell http restart
```

---

## Method 2: Manual Setup in Domino Designer

If the DXL import doesn't work, follow these steps to create everything manually.

### Step 2.1: Create DOMCFG.NSF

(Same as Step 1.1 above)

### Step 2.2: Set Database Permissions

(Same as Step 1.2 above)

### Step 2.3: Create the Login Form Manually

1. Open `domcfg.nsf` in **Domino Designer**
2. In the left panel, right-click on **Forms**
3. Select **New Form**
4. A blank form opens

**Set Form Properties:**
1. Click **Design** menu → **Form Properties** (or press Alt+Enter)
2. In the properties box:
   - **Name:** `CustomLoginForm`
   - **Comment:** `Custom Login Form v2.0`
3. Close the properties box

**Add HTML Content:**
1. In the form design area, you'll see a blank page
2. Click **Create** menu → **Hotspot** → **Computed Text**
3. Delete any default content
4. We need to change this to Pass-Thru HTML:
   - Select all content in the form
   - Click **Text** menu → **Pass-Thru HTML**
   - The text should change to green (indicating HTML mode)

5. Now paste the ENTIRE contents of the `DominoEmbeddedForm.html` file

6. Save the form (Ctrl+S)

### Step 2.4: Import Resource Files

(Same as Step 1.4 above)

### Step 2.5: Create Login Form Mapping

(Same as Step 1.5 above)

### Step 2.6: Restart HTTP Service

(Same as Step 1.6 above)

---

## Configuring Your Login Page

After deployment, you'll want to customize the login page for your organization.

### Where to Make Changes

All customization is done in the `config.js` file.

**To edit config.js in Domino:**
1. Open `domcfg.nsf` in Domino Designer
2. Expand **Resources** → **Files**
3. Double-click on `config.js`
4. The file opens in a text editor
5. Make your changes
6. Save (Ctrl+S)
7. Restart HTTP service for changes to take effect

### Basic Customizations

#### Change Company Name

Find this section in `config.js`:
```javascript
branding: {
    companyName: "Your Company Name",
```

Change `"Your Company Name"` to your actual company name:
```javascript
branding: {
    companyName: "Acme Corporation",
```

#### Change Logo

1. First, import your logo as a file resource (see Step 1.4)
2. Name it something like `company-logo.svg` or `company-logo.png`
3. In `config.js`, find:
```javascript
logoUrl: "images/logo-placeholder.svg",
```

4. Change to:
```javascript
logoUrl: "/domcfg.nsf/company-logo.svg",
```

**Important:** The URL must start with `/domcfg.nsf/` when the file is inside DOMCFG.NSF

#### Change Colors

Find the `theme` section:
```javascript
theme: {
    primaryColor: "#0066CC",
```

Change the color codes. Color codes start with `#` followed by 6 characters.

**Common colors:**
| Color | Code |
|-------|------|
| Blue | #0066CC |
| Green | #28a745 |
| Red | #dc3545 |
| Purple | #6f42c1 |
| Orange | #fd7e14 |
| Dark Gray | #343a40 |

**Find more colors at:** https://htmlcolorcodes.com/

#### Change Welcome Message

Find:
```javascript
welcomeTitle: "Welcome Back",
welcomeSubtitle: "Please sign in to access your applications",
```

Change to your preferred text:
```javascript
welcomeTitle: "Sign In to Acme Portal",
welcomeSubtitle: "Enter your credentials to continue",
```

### Enabling/Disabling Features

All features have switches (true/false) at the top of `config.js`:

```javascript
features: {
    // Security Features
    enableMFA: false,                    // Multi-Factor Authentication
    enableCaptcha: false,                // CAPTCHA verification
    enablePasswordStrength: true,        // Password strength meter
    
    // UX Features  
    enableI18n: true,                    // Multi-language support
    enableThemeSwitcher: true,           // Light/Dark mode toggle
    enableSessionWarning: true,          // Session timeout warning
```

**To enable a feature:** Change `false` to `true`
**To disable a feature:** Change `true` to `false`

**Example - Enable CAPTCHA:**
```javascript
enableCaptcha: true,
```

**Example - Disable theme switcher:**
```javascript
enableThemeSwitcher: false,
```

### Feature Configuration Examples

#### Example 1: Enable Password Strength Meter with Custom Rules

```javascript
features: {
    enablePasswordStrength: true,
},

passwordStrength: {
    minLength: 10,              // Minimum 10 characters
    requireUppercase: true,     // Must have uppercase
    requireLowercase: true,     // Must have lowercase
    requireNumbers: true,       // Must have numbers
    requireSpecialChars: true,  // Must have special characters
    showMeter: true,            // Show the strength bar
    showRequirements: true,     // Show checklist of requirements
},
```

#### Example 2: Enable Remember Me and Forgot Password

```javascript
features: {
    showRememberMe: true,
    showForgotPassword: true,
},

form: {
    showRememberMe: true,
    rememberMeLabel: "Keep me signed in",
    showForgotPassword: true,
    forgotPasswordUrl: "https://helpdesk.yourcompany.com/reset-password",
    forgotPasswordText: "Forgot your password?",
},
```

#### Example 3: Change Background to Company Image

```javascript
theme: {
    backgroundImage: "/domcfg.nsf/company-background.jpg",
    backgroundOverlayOpacity: 0.6,  // Darken image so text is readable
    backgroundGradientStart: null,   // Disable gradient
    backgroundGradientEnd: null,
},
```

First, import your background image as a file resource.

#### Example 4: Enable Multiple Languages

```javascript
features: {
    enableI18n: true,
    enableRTL: true,  // Enable for Arabic/Hebrew
},

i18n: {
    defaultLanguage: "en",
    autoDetect: true,  // Use visitor's browser language
    showLanguageSelector: true,
    availableLanguages: [
        { code: "en", name: "English", dir: "ltr", flag: "🇺🇸" },
        { code: "es", name: "Español", dir: "ltr", flag: "🇪🇸" },
        { code: "fr", name: "Français", dir: "ltr", flag: "🇫🇷" },
    ],
},
```

#### Example 5: Add Custom Footer Text

```javascript
branding: {
    footerText: "© 2026 Acme Corporation. All rights reserved. IT Help: x1234",
    showDominoBadge: false,  // Hide "Powered by Domino"
},
```

---

## Testing Your Login Page

### Step 1: Open a Private/Incognito Browser Window

This ensures you're not logged in from a previous session.

- **Chrome:** Ctrl+Shift+N
- **Firefox:** Ctrl+Shift+P  
- **Edge:** Ctrl+Shift+N
- **Safari:** Cmd+Shift+N

### Step 2: Navigate to a Protected Resource

Enter one of these URLs (replace `your-server.com` with your actual server):

```
https://your-server.com/names.nsf
https://your-server.com/mail/yourusername.nsf
https://your-server.com/?Login
```

### Step 3: Verify the Custom Login Page Appears

You should see YOUR custom login page, not the default Domino login.

**If you see the default Domino login (gray background, simple form):**
- The setup isn't complete - see Troubleshooting section

### Step 4: Test Login

1. Enter valid credentials
2. Click Sign In
3. You should be redirected to the resource you requested

### Step 5: Test Invalid Login

1. Enter wrong password
2. Click Sign In
3. You should see an error message on the login page

### Step 6: Test on Mobile

Open the same URL on your phone to verify it's responsive.

---

## Troubleshooting Common Problems

### Problem: Default Domino Login Still Appears

**Possible causes and solutions:**

1. **DOMCFG.NSF not in correct location**
   - Must be in the Domino data directory root
   - Not in a subfolder
   - File name must be exactly `domcfg.nsf`

2. **Form mapping not created**
   - Open DOMCFG.NSF in Notes Client
   - Check if Sign In Form Mapping document exists
   - Create one if missing

3. **HTTP not restarted**
   - Run `tell http restart` on server console

4. **Browser cache**
   - Try incognito/private window
   - Clear browser cache

### Problem: Login Page Appears But CSS/Styling Missing

**Cause:** Resource files not accessible

**Solutions:**
1. Check Anonymous has Reader access in ACL
2. Verify file names are correct (case-sensitive)
3. Check file paths in config.js start with `/domcfg.nsf/`

### Problem: Login Fails with "Not Authorized"

**Cause:** Session authentication not enabled on server

**Solution:**
1. Open Server Document in Domino Directory
2. Go to **Internet Protocols** → **HTTP**
3. Set **Session authentication** to:
   - "Single Server" (for one server)
   - "Multi-Server" (for multiple servers with SSO)
4. Save and restart HTTP

### Problem: JavaScript Errors in Browser Console

**How to check:**
1. Open browser Developer Tools (F12)
2. Click **Console** tab
3. Look for red error messages

**Common causes:**
- Syntax error in config.js (missing comma, quote, etc.)
- File resource not found
- Lucide icons CDN blocked (corporate firewall)

### Problem: Logo Not Displaying

**Solutions:**
1. Verify logo file is imported as file resource
2. Check URL path is correct: `/domcfg.nsf/your-logo.svg`
3. Check file format is supported (SVG, PNG, JPG, GIF)
4. Try opening the logo URL directly in browser

### Problem: Changes to config.js Not Taking Effect

**Solutions:**
1. Make sure you saved the file (Ctrl+S)
2. Restart HTTP service
3. Clear browser cache or use incognito window

---

## Getting Help

### HCL Documentation

- [HCL Domino Documentation](https://help.hcl-software.com/domino/)
- [Customizing the Login Form](https://help.hcl-software.com/domino/14.5.1/admin/conf_customizingthehtmlloginform_t.html)

### Support Contacts

- **HCL Support:** https://support.hcltechsw.com/
- **HCL Community:** https://community.hcltechsw.com/

### This Project

If you need help with this specific login page project:
1. Check the README.md file
2. Review the COMPLETE_DOCUMENTATION.md
3. Look at sample configurations in the `/samples` folder

---

## Quick Reference Card

### Key File Locations

| Purpose | Location |
|---------|----------|
| Login Form | DOMCFG.NSF → Forms → CustomLoginForm |
| Configuration | DOMCFG.NSF → Resources → Files → config.js |
| Stylesheet | DOMCFG.NSF → Resources → Files → login.css |
| JavaScript | DOMCFG.NSF → Resources → Files → login.js |
| Translations | DOMCFG.NSF → Resources → Files → translations.js |
| Logo | DOMCFG.NSF → Resources → Files → logo.svg |

### Key Commands

| Action | Command |
|--------|---------|
| Restart HTTP | `tell http restart` |
| Check HTTP status | `show tasks` |
| View HTTP config | `show configuration http` |
| Enable debug | `set config DOMINOCONSOLELOG=2` |

### Important URLs

| URL | Purpose |
|-----|---------|
| `/names.nsf?Login` | Force login page |
| `/?Logout` | Log out |
| `/domcfg.nsf/login.css` | CSS file resource |
| `/domcfg.nsf/config.js` | Config file resource |

---

---

## Customization Examples with Screenshots

This section provides visual examples of common customizations.

### Changing the Color Scheme

**Before (Default Blue):**
```
┌─────────────────────────────────┐
│        🔵 Company Logo          │
│                                 │
│     [Username Field     ]       │
│     [Password Field     ]       │
│                                 │
│    [█████ Sign In ████████]     │  ← Blue button
│                                 │
└─────────────────────────────────┘
Background: Purple gradient
```

**After (Green Theme):**

Edit `config.js`:
```javascript
theme: {
    primaryColor: "#28a745",           // Green
    primaryColorHover: "#218838",      // Darker green
    backgroundGradientStart: "#134e5e",
    backgroundGradientEnd: "#71b280",
},
```

```
┌─────────────────────────────────┐
│        🟢 Company Logo          │
│                                 │
│     [Username Field     ]       │
│     [Password Field     ]       │
│                                 │
│    [█████ Sign In ████████]     │  ← Green button
│                                 │
└─────────────────────────────────┘
Background: Teal to green gradient
```

### Adding Your Company Logo

**Step-by-step:**

1. **Prepare your logo:**
   - Recommended format: SVG (best quality at any size)
   - Alternative: PNG with transparent background
   - Recommended size: 200-400px wide
   - File size: Under 100KB

2. **Import logo into Domino:**
   - Open DOMCFG.NSF in Designer
   - Expand **Resources** → **Files**
   - Right-click → **Import**
   - Select your logo file
   - Name it: `company-logo.svg` (or `.png`)

3. **Update config.js:**
```javascript
branding: {
    logoUrl: "/domcfg.nsf/company-logo.svg",
    logoAlt: "Acme Corporation Logo",    // Accessibility
    logo: {
        maxWidth: 180,       // Adjust size
        maxHeight: 60,
    },
},
```

### Complete Corporate Blue Theme Example

```javascript
const DominoLoginConfig = {
    
    features: {
        enablePasswordStrength: true,
        enableThemeSwitcher: false,      // Disable for corporate
        enableI18n: false,               // English only
        showRememberMe: true,
        showForgotPassword: true,
        showSecurityNotice: true,
        showDominoBadge: false,          // Hide Domino badge
    },
    
    branding: {
        companyName: "Acme Corporation",
        logoUrl: "/domcfg.nsf/acme-logo.svg",
        logoAlt: "Acme Corporation",
        pageTitle: "Acme Corporation - Sign In",
        welcomeTitle: "Welcome to Acme",
        welcomeSubtitle: "Enter your credentials to continue",
        footerText: "© 2026 Acme Corporation. For support: help@acme.com",
    },
    
    theme: {
        primaryColor: "#003366",         // Corporate navy blue
        primaryColorHover: "#002244",
        backgroundGradientStart: "#003366",
        backgroundGradientEnd: "#006699",
        cardBackground: "rgba(255, 255, 255, 0.98)",
    },
    
    form: {
        usernameLabel: "Employee ID",
        usernamePlaceholder: "Enter your employee ID",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButtonText: "Sign In",
        showRememberMe: true,
        rememberMeLabel: "Remember me",
        showForgotPassword: true,
        forgotPasswordUrl: "https://helpdesk.acme.com/reset",
        forgotPasswordText: "Forgot password?",
    },
    
    domino: {
        loginActionUrl: "/names.nsf?Login",
        defaultRedirectTo: "/",
    },
    
    errorMessages: {
        0: "",
        1: "Access denied. Contact IT: x4567",
        2: "Invalid ID or password.",
        3: "Session expired. Please sign in again.",
        4: "Server error. Please try again.",
        generic: "An error occurred."
    },
};
```

### Multi-Language Setup Example

```javascript
const DominoLoginConfig = {
    
    features: {
        enableI18n: true,        // Enable languages
        enableRTL: true,         // Enable right-to-left
    },
    
    i18n: {
        defaultLanguage: "en",
        autoDetect: true,
        showLanguageSelector: true,
        rememberLanguage: true,
        availableLanguages: [
            { code: "en", name: "English", dir: "ltr", flag: "🇺🇸" },
            { code: "es", name: "Español", dir: "ltr", flag: "🇪🇸" },
            { code: "de", name: "Deutsch", dir: "ltr", flag: "🇩🇪" },
            { code: "ar", name: "العربية", dir: "rtl", flag: "🇸🇦" },
        ],
    },
};
```

**Result:**
```
🌐 [English ▼]     ← Language selector appears

┌─────────────────────────────────┐
│        Company Logo             │
│                                 │
│   Welcome Back                  │
│   Please sign in...             │
│                                 │
│     [Username          ]        │
│     [Password          ]        │
│                                 │
│    [█████ Sign In ███████]      │
└─────────────────────────────────┘
```

### Password Strength with Custom Rules

```javascript
const DominoLoginConfig = {
    
    features: {
        enablePasswordStrength: true,
    },
    
    passwordStrength: {
        minLength: 12,                    // Require 12 chars
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,        // Require special chars
        showMeter: true,
        showRequirements: true,           // Show checklist
        checkCommonPasswords: true,
        preventUsernameInPassword: true,
    },
};
```

**Result (when user types password):**
```
Password: [••••••••••    ]

Password Strength: [███████░░░] Good

Requirements:
  ✓ At least 12 characters
  ✓ One uppercase letter
  ✓ One lowercase letter
  ✓ One number
  ✗ One special character (!@#$%...)
```

---

## Checklist: Before Going Live

Use this checklist before deploying to production:

### Design & Branding
- [ ] Company logo imported and displaying correctly
- [ ] Company name updated in branding
- [ ] Welcome message customized
- [ ] Footer text with copyright/contact info
- [ ] Color scheme matches corporate colors
- [ ] Page title updated for browser tab

### Functionality
- [ ] Login works with valid credentials
- [ ] Error messages display for invalid login
- [ ] Forgot password link points to correct URL
- [ ] Remember me checkbox works (if enabled)
- [ ] Password toggle shows/hides password

### Security
- [ ] HTTPS is enabled on the server
- [ ] ACL restricts access appropriately
- [ ] Password strength rules match company policy
- [ ] Session timeout set appropriately

### Accessibility
- [ ] Logo has alt text
- [ ] Form fields have labels
- [ ] Tab navigation works through form
- [ ] Error messages are visible

### Mobile
- [ ] Page displays correctly on phone
- [ ] Touch targets are large enough
- [ ] Keyboard appears for inputs

### Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Tested on mobile device

---

## Video Tutorial Links

(If available, add links to video tutorials here)

- How to create DOMCFG.NSF: `[link]`
- How to import DXL files: `[link]`
- How to customize config.js: `[link]`

---

*Document Version: 2.0.0 | April 2026*
*For beginners with zero Domino development experience*
