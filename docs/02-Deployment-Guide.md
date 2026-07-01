# HCL Domino Custom Login Page - Deployment Guide

**Complete Step-by-Step Instructions for Domino Administrators**

This guide provides detailed instructions for deploying the custom login page. Follow each step exactly as written.

---

## Table of Contents

1. [What You Need Before Starting](#prerequisites)
2. [Understanding the Basics](#understanding-basics)
3. [Choosing Your Deployment Option](#deployment-option) ⭐ **Start Here**
4. [Method 1: Create Form in Domino Designer](#method-1)
5. [Method 2: All-In-One Embedded Form](#method-2)
6. [Configuring Your Login Page](#configuring)
7. [Testing Your Login Page](#testing)
8. [Troubleshooting Common Problems](#troubleshooting)
9. [Login Attempt Tracking — Deployment](#login-tracking) 🔐
10. [Getting Help](#getting-help)

---

<a id="prerequisites"></a>
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

**⭐ RECOMMENDED — Self-contained (no `config.js`/`login.js` needed, no MIME issues):**
- `login-forms/DominoEmbeddedForm.html` — **Clean login, all CSS/JS embedded inline**
- `login-forms/EnterpriseLoginForm.html` — Enterprise login with sidebar quick links and banner, all CSS/JS inline

> Both self-contained forms manage all configuration **inside the HTML file itself** via an inline `CONFIG` block. There is no `config.js` or `login.js` for these forms.

**For modular deployment only (requires MIME setup):**
- `login-forms/CustomLoginForm-Domino.html` — Login page that loads external files
- `config.js` — Configuration (only for `CustomLoginForm-Domino.html`)
- `css/login.css` — Styling (only for `CustomLoginForm-Domino.html`)
- `js/login.js` — Functionality incl. login tracking (only for `CustomLoginForm-Domino.html`)
- `i18n/translations.js` — Language translations (only for `CustomLoginForm-Domino.html`)
- Your logo file (PNG, JPG, or GIF formats are supported)

---

<a id="understanding-basics"></a>
## Understanding the Basics

### What is DOMCFG.NSF?

DOMCFG.NSF is a special database that tells Domino how to handle web login. When someone tries to access a protected resource on your Domino web server, Domino checks this database to find your custom login form.

**Think of it like:** A receptionist desk at the entrance of a building. Everyone who wants to enter must check in there first.

### What is Session Authentication?

Session authentication means users log in once, and Domino remembers them for a period of time (usually 30 minutes). They don't need to log in again for each page they visit.

### What is a Form in Domino?

A form is like a template. In our case, it's a template for the login page that Domino shows to users.

---

<a id="deployment-option"></a>
## Choosing Your Deployment Option

### 🎯 Quick Decision Guide

| If You Want... | Use This File | MIME Issues? |
|----------------|---------------|--------------|
| ⭐ **Recommended — full features, zero MIME issues** | `DominoEmbeddedForm.html` | ✅ **NONE** |
| Enterprise extras (quick links, banner) | `EnterpriseLoginForm.html` | ✅ **NONE** |
| Modular with external files | `CustomLoginForm-Domino.html` | ⚠️ Requires MIME setup |

### ⭐ RECOMMENDED: DominoEmbeddedForm.html (Full Features, Zero MIME Issues)

**This is the best option for most deployments.** The `DominoEmbeddedForm.html` file:
- Has ALL CSS and JavaScript embedded inline — no external file resources
- **Completely avoids MIME type errors**
- Full feature set: 18 languages, CAPTCHA, MFA, login tracking, dark mode, session management
- Single inline `CONFIG` block for all customisation

**Location:** `login-forms/DominoEmbeddedForm.html`

> **Need the enterprise sidebar with quick links and an announcement banner?** Use `login-forms/EnterpriseLoginForm.html` instead — same zero-MIME, self-contained approach, with those extras added.

### Why MIME Errors Happen

When you use external files (`.js`, `.css`), Domino must serve them with the correct MIME type:
- `.js` files need `text/javascript`
- `.css` files need `text/css`

If Domino serves them as `text/html` (the default), browsers refuse to load them:
```
Refused to execute script from 'config.js' because its MIME type ('text/html') is not executable
```

### How to Avoid MIME Errors

**Option A: Use Self-Contained HTML (Recommended)**
- Use `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html`
- All CSS/JS is inline - no external files needed
- **Zero MIME configuration required**

**Option B: If Using External Files**
- Must set MIME types manually in Domino Designer
- See Step 1.4.4 below for detailed instructions
- Reference: [HCL Documentation - File Resource Web Properties](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html)

---

<a id="method-1"></a>
## Method 1: Create Form Manually in Domino Designer (Recommended)

This is the standard and most reliable method for creating the custom login form.

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

### Step 1.3: Create the Custom Login Form

Now we'll create the login form and add the HTML content.

#### Step 1.3.1: Create a New Form

1. Open `domcfg.nsf` in **HCL Domino Designer**
2. In the left panel (Design pane), find and expand **Forms**
3. Right-click on **Forms** → Select **New Form**
4. A blank form design window opens

```
┌─────────────────────────────────────────────────────────┐
│ Domino Designer                                         │
├─────────────────────────────────────────────────────────┤
│ ▼ domcfg.nsf                                            │
│   ├─ Forms                  ◄── Right-click here        │
│   │   └─ (empty)                 Select "New Form"      │
│   ├─ Views                                              │
│   ├─ Resources                                          │
│   └─ ...                                                │
└─────────────────────────────────────────────────────────┘
```

#### Step 1.3.2: Set Form Properties

1. With the new form open, click **Design** menu → **Form Properties**
   (Or press **Alt+Enter**, or right-click → **Form Properties**)

2. In the Properties box that appears:

   **Basics Tab:**
   | Property | Value to Enter |
   |----------|----------------|
   | Name | `$$LoginUserForm` |
   | Comment | `Custom branded login form v2.0` |

3. Click the **X** to close the Properties box (it auto-saves)

```
┌─────────────────────────────────────┐
│ Form Properties                     │
├─────────────────────────────────────┤
│ Name:    [$$LoginUserForm      ]    │
│ Comment: [Custom branded login ]    │
│ Type:    ○ Document  ● No type      │
│                                     │
│ [Defaults] [Launch] [Background]    │
└─────────────────────────────────────┘
```

#### Step 1.3.3: Add the HTML Content

This is the critical step where we add the login page HTML to the form.

> **Reference:** [HCL Domino Designer Documentation - Using HTML on a page, form, or subform](https://help.hcl-software.com/dom_designer/14.5.1/basic/H_IMPORTING_HTML_INTO_A_PAGE_OR_FORM_STEPS.html)

**⚠️ IMPORTANT: Choose the Right HTML File!**

There are THREE HTML files for Domino deployment:

| File | Location | Best For | MIME Config |
|------|----------|----------|-------------|
| `DominoEmbeddedForm.html` | `login-forms/` | ⭐ **RECOMMENDED** — full features, self-contained | ❌ None |
| `EnterpriseLoginForm.html` | `login-forms/` | Quick links sidebar + announcement banner | ❌ None |
| `CustomLoginForm-Domino.html` | `login-forms/` | Modular (external JS/CSS files) | ⚠️ Required |

**Use `DominoEmbeddedForm.html`** — all CSS/JS inline, 18 languages, full CONFIG block, zero MIME configuration.

**Step A: Copy the HTML content**

1. Open your chosen HTML file (recommended: **`login-forms/DominoEmbeddedForm.html`**) in a text editor:
   - **Windows:** Right-click the file → **Open with** → **Notepad** (or Notepad++)
   - **Mac:** Right-click → **Open With** → **TextEdit** (or VS Code)

2. Select ALL the content:
   - Press **Ctrl+A** (Windows) or **Cmd+A** (Mac)
   - Everything should be highlighted in blue

3. Copy to clipboard:
   - Press **Ctrl+C** (Windows) or **Cmd+C** (Mac)

```
┌─────────────────────────────────────────────────────────┐
│ Notepad++ - EnterpriseLoginForm.html                    │
├─────────────────────────────────────────────────────────┤
│ ████████████████████████████████████  ◄── All selected  │
│ ████████████████████████████████████      (highlighted) │
│ ████████████████████████████████████                    │
│ ████████████████████████████████████                    │
│ ████████████████████████████████████                    │
└─────────────────────────────────────────────────────────┘
```

**Step B: Paste into the Domino Form**

1. Switch back to **Domino Designer** (the form should still be open)
2. Click inside the blank form design area
3. Paste the content:
   - Press **Ctrl+V** (Windows) or **Cmd+V** (Mac)
   - Or click **Edit** menu → **Paste**

4. You should see the HTML code appear in the form (it may look like plain text at this point)

```
┌─────────────────────────────────────────────────────────┐
│ Form: $$LoginUserForm (Untitled)                        │
├─────────────────────────────────────────────────────────┤
│ <!DOCTYPE html>                                         │
│ <html lang="en">                                        │
│ <head>                                                  │
│     <meta charset="UTF-8">                              │
│     <meta name="viewport" content="width=device-wi...   │
│     <title id="pageTitle">Secure Login</title>          │
│     ...                                                 │
│ </body>                                                 │
│ </html>                                                 │
└─────────────────────────────────────────────────────────┘
```

**Step C: Mark the content as Pass-Thru HTML**

Now we need to tell Domino to send this HTML directly to the browser without processing it.

1. Select ALL the pasted content:
   - Click at the beginning of the content
   - Press **Ctrl+A** to select all
   - Or click **Edit** menu → **Select All**

2. Mark as Pass-Thru HTML:
   - Click **Text** menu → **Pass-Thru HTML**
   
```
┌─────────────────────────────────────────────────────────┐
│ Domino Designer                                         │
├─────────────────────────────────────────────────────────┤
│ File  Edit  View  Create  [Text]  Design  ...           │
│                              │                          │
│                              ▼                          │
│                    ┌─────────────────────┐              │
│                    │ Text Properties...  │              │
│                    │ Font                │              │
│                    │ Size                │              │
│                    │ Style               │              │
│                    │ ─────────────────── │              │
│                    │ ✓ Pass-Thru HTML   │◄── Click this │
│                    │ Hide Paragraph      │              │
│                    └─────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

3. After clicking **Pass-Thru HTML**, the text will change to **green color**
   - Green text = Pass-Thru HTML (Domino sends it as-is to browser)
   - Black text = Regular text (Domino may process/convert it)

```
┌─────────────────────────────────────────────────────────┐
│ Form: $$LoginUserForm                                   │
├─────────────────────────────────────────────────────────┤
│ <!DOCTYPE html>                      ◄── GREEN text     │
│ <html lang="en">                         means it's     │
│ <head>                                   Pass-Thru HTML │
│     <meta charset="UTF-8">                              │
│     ...                                                 │
│ </html>                                                 │
└─────────────────────────────────────────────────────────┘
```

**Step D: Verify Pass-Thru HTML is Applied**

To confirm the HTML is properly marked:

1. Click anywhere in the green HTML text
2. Look at the **Text** menu
3. **Pass-Thru HTML** should have a checkmark (✓) next to it

If the text is NOT green:
- Select all the text again (**Ctrl+A**)
- Click **Text** menu → **Pass-Thru HTML** again

**Step E: Save the Form**

1. Press **Ctrl+S** to save
2. Or click **File** menu → **Save**
3. If prompted for a name, verify it says `$$LoginUserForm`
4. Close the form design window (**Ctrl+W** or click the X)

#### Step 1.3.4: Verify Form Was Created

1. In the left panel, expand **Forms**
2. You should see `$$LoginUserForm` listed
3. Double-click to open and verify content is there

### Step 1.4: Import Resource Files (CSS, JavaScript, Images)

Now we need to import the CSS, JavaScript, and image files that the form references.

#### Step 1.4.1: Navigate to File Resources

1. In Domino Designer, with `domcfg.nsf` open
2. In the left panel (Design pane), expand **Resources**
3. Click on **Files**

```
┌─────────────────────────────────────────────────────────┐
│ ▼ domcfg.nsf                                            │
│   ├─ Forms                                              │
│   │   └─ $$LoginUserForm                                │
│   ├─ Views                                              │
│   ▼ Resources                   ◄── Expand this         │
│     ├─ Files                    ◄── Click here          │
│     ├─ Images                                           │
│     ├─ Stylesheets                                      │
│     └─ ...                                              │
└─────────────────────────────────────────────────────────┘
```

#### Step 1.4.2: Import Each File

For EACH file listed below, follow these steps:

1. Right-click in the Files panel (right side, where files are listed)
2. Select **Import...** (or **File** menu → **Import**)
3. Browse to the file location on your computer
4. Select the file
5. Click **Import** or **Open**

**Files to Import (in this order):**

| # | Source File | Name in Domino | Purpose |
|---|-------------|----------------|---------|
| 1 | `config.js` | `config.js` | All settings |
| 2 | `css/login.css` | `login.css` | Styles |
| 3 | `js/login.js` | `login.js` | Functionality |
| 4 | `i18n/translations.js` | `translations.js` | Languages |
| 5 | Your logo file (PNG, JPG, GIF) | `logo.png` | Logo image |

**Note:** PNG, JPG, or GIF formats are supported for logo files.

#### Step 1.4.3: Rename Files If Needed

Sometimes files import with their folder path (e.g., `css/login.css` instead of `login.css`).

**To rename a file:**
1. Right-click on the file in the list
2. Select **Properties** (or **Design Properties**)
3. In the Properties box, find **Name**
4. Change to just the filename (no folders)
5. Close Properties (it auto-saves)
6. Press **Ctrl+S** to ensure save

```
┌─────────────────────────────────────┐
│ File Resource Properties            │
├─────────────────────────────────────┤
│ Name: [login.css              ]     │  ◄── Just filename
│                                     │      NOT css/login.css
│ MIME Type: [text/css          ]     │
└─────────────────────────────────────┘
```

#### Step 1.4.4: Set Correct MIME Types (CRITICAL!)

**⚠️ THIS STEP IS REQUIRED** - Without it, browsers will refuse to load the files!

> **Reference:** [HCL Domino Designer - File Resource Web Properties](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html)

When you import files, Domino may not set the correct MIME type automatically for `.js` files. You MUST set the MIME type for each file manually using the **Web Properties** tab.

**For EACH file resource, follow these EXACT steps:**

1. **Select** the file in the Files list (click once to highlight it)
2. Look at the **Properties panel** on the right side of Designer
   - If you don't see it, go to **Window** menu → **Properties**
3. In the Properties panel, click the **"Web Properties"** tab (also called "Web" tab)
   - This is usually the second tab with a globe icon 🌐
4. Find the **"MIME type"** field
5. Enter the correct MIME type from the table below
6. Press **Enter** to confirm
7. Save the database (**Ctrl+S** or **File** → **Save**)

```
┌─────────────────────────────────────────────────────────────────┐
│ Domino Designer - Properties Panel                              │
├─────────────────────────────────────────────────────────────────┤
│  [Basic] [Web Properties] [Info] [Design]                       │
│           ▲                                                     │
│           └── Click this tab!                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Read Only:  [ ] (unchecked)                                    │
│                                                                 │
│  MIME type:  [text/javascript                    ]              │
│              ▲                                                  │
│              └── Enter the MIME type here                       │
│                  This sets the Content-Type HTTP header         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Required MIME Types:**

| File Name | MIME Type | Notes |
|-----------|-----------|-------|
| `config.js` | `text/javascript` | Domino may not auto-detect this! |
| `login.js` | `text/javascript` | Domino may not auto-detect this! |
| `translations.js` | `text/javascript` | Domino may not auto-detect this! |
| `login.css` | `text/css` | Usually auto-detected |
| `logo.png` | `image/png` | Usually auto-detected |
| `logo.jpg` | `image/jpeg` | Usually auto-detected |

**⚠️ IMPORTANT NOTES:**
- PNG, JPG, or GIF formats are recommended for image files.
- The MIME type field is in the **Web Properties** tab, NOT the Basic tab!
- If the Web Properties tab is empty, make sure you selected a file resource.

**Common Error If MIME Type Is Wrong:**

If you see this error in browser console (F12):
```
Refused to execute script from 'https://server/domcfg.nsf/config.js' 
because its MIME type ('text/html') is not executable
```

**Fix:** Go back and set the MIME type to `text/javascript` for that file.

**Verification:**

After setting MIME types, test each file URL directly in your browser:
- `https://your-server/domcfg.nsf/config.js` - should show JavaScript code
- `https://your-server/domcfg.nsf/login.css` - should show CSS code
- `https://your-server/domcfg.nsf/login.js` - should show JavaScript code

If any URL shows an error page or HTML instead of the file content, the MIME type is incorrect.

#### Step 1.4.5: Verify All Files Are Present

Your Files list should show:

```
┌─────────────────────────────────────────────────────────┐
│ Files                                                   │
├─────────────────────────────────────────────────────────┤
│ 📄 config.js                                            │
│ 📄 login.css                                            │
│ 📄 login.js                                             │
│ 📄 translations.js                                      │
│ 🖼️ logo.png                                             │
└─────────────────────────────────────────────────────────┘
```

**IMPORTANT:** These names must match EXACTLY what's in the HTML:
- The HTML references `/domcfg.nsf/config.js`
- So the file must be named `config.js` (not `Config.js` or `config.JS`)

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
   | Target Form | `$$LoginUserForm` |
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

<a id="method-2"></a>
## Method 2: All-In-One Embedded Form (No Separate Files)

If you prefer a simpler setup without separate CSS/JS files, use the embedded version.

### When to Use This Method

- Simpler deployment (only one form, no file resources)
- Restricted environments where file resources are problematic
- Quick testing before full deployment

### Step 2.1: Create DOMCFG.NSF and Set Permissions

(Same as Steps 1.1 and 1.2 above)

### Step 2.2: Create the Embedded Form

1. Open `domcfg.nsf` in **Domino Designer**
2. Right-click **Forms** → **New Form**
3. Set **Name** to `$$LoginUserForm` in Form Properties

4. Click **Create** menu → **Pass-Thru HTML**

5. Open the file `login-forms/DominoEmbeddedForm.html` from this project
   - This file has ALL CSS and JavaScript embedded inline
   - No separate file resources needed

6. Copy the ENTIRE contents and paste into the form

7. Save (**Ctrl+S**)

### Step 2.3: Create Login Form Mapping

(Same as Step 1.5 above)

### Step 2.4: Restart HTTP

```
tell http restart
```

> **This is the recommended deployment method.** `DominoEmbeddedForm.html` is a full-featured form with 18 languages, CAPTCHA, MFA, login tracking, dark mode, and all enterprise features — all inline. Editing means downloading the HTML, updating the `CONFIG` block near the top, re-pasting, and re-marking Pass-Thru HTML.
>
> Method 1 (modular with external files) is for advanced users who require separate `config.js`/`login.js` versioning.

---

<a id="configuring"></a>
## Configuring Your Login Page

After deployment, you'll want to customize the login page for your organization.

### Where to Make Changes

**Self-contained forms (`DominoEmbeddedForm.html` / `EnterpriseLoginForm.html`):**
All configuration is in the **inline `CONFIG` block** near the top of the HTML file (search for `const DominoLoginConfig` or `const CONFIG`). Edit the file locally, re-paste the entire contents into the `$$LoginUserForm` form in Designer, re-mark as Pass-Thru HTML, save, and restart HTTP.

**Modular form (`CustomLoginForm-Domino.html`) only:**
Customization is done in `config.js`. To edit:
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
2. Name it something like `company-logo.png` (PNG, JPG, or GIF formats are recommended)
3. In `config.js`, find:
```javascript
logoUrl: "",  // Empty by default
```

4. Change to:
```javascript
logoUrl: "/domcfg.nsf/company-logo.png",  // PNG, JPG, or GIF formats
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

<a id="testing"></a>
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

<a id="troubleshooting"></a>
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

### Problem: "MIME type is not executable" Error (Wrong Path)

**Error message with `/css/` or `/js/` in path:**
```
Refused to apply style from 'https://server/domcfg.nsf/css/login.css' 
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Cause:** The HTML file references subfolder paths, which are not supported for file resources in this configuration.

**Solution:** Use `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html` instead - they have all CSS/JS inline, so no external files needed!

If you must use external files, paths should be:
- ✅ Correct: `/domcfg.nsf/login.css`
- ❌ Wrong: `/domcfg.nsf/css/login.css`

To fix, replace the form content with `login-forms/EnterpriseLoginForm.html`.

### Problem: "MIME type is not executable" Error (MIME Not Set)

**Error message WITHOUT `/css/` or `/js/` in path:**
```
Refused to execute script from 'https://server/domcfg.nsf/config.js' 
because its MIME type ('text/html') is not executable, 
and strict MIME type checking is enabled.
```

**Cause:** The file resources don't have correct MIME types set in Domino.

**Solution:**

> **Reference:** [HCL Domino Designer - File Resource Web Properties](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html)

1. Open `domcfg.nsf` in **Domino Designer**
2. Go to **Resources** → **Files**
3. For EACH JavaScript file (config.js, login.js, translations.js):
   - **Click once** on the file to select it
   - In the **Properties panel** (right side), click the **"Web Properties"** tab
   - In the **MIME type** field, enter: `text/javascript`
   - Press **Enter**
4. For login.css:
   - Select the file, go to **Web Properties** tab
   - Set **MIME type** to: `text/css`
5. For logo.png (or .jpg):
   - Select the file, go to **Web Properties** tab
   - Set **MIME type** to: `image/png` (or `image/jpeg`)
6. Save all changes (**Ctrl+S**)
7. Restart HTTP: `tell http restart`

**⚠️ CRITICAL:** The MIME type field is in the **Web Properties** tab, NOT the Basic tab!

**Quick Reference - MIME Types:**

| File | MIME Type |
|------|-----------|
| `.js` files | `text/javascript` |
| `.css` files | `text/css` |
| `.png` files | `image/png` |
| `.jpg` files | `image/jpeg` |
| `.gif` files | `image/gif` |

**PNG, JPG, or GIF formats are recommended for image files.**

**Verify fix:** Open each file URL directly in browser - you should see the file content, not an error page.

### Problem: Logo Not Displaying

**Solutions:**
1. Verify logo file is imported as file resource
2. Check URL path is correct: `/domcfg.nsf/your-logo.png`
3. Check file format: PNG, JPG, or GIF are supported
4. Try opening the logo URL directly in browser

### Problem: Changes to config.js Not Taking Effect

**Solutions:**
1. Make sure you saved the file (Ctrl+S)
2. Restart HTTP service
3. Clear browser cache or use incognito window

---

<a id="getting-help"></a>
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
2. Review `docs/01-Overview.md`
3. Look at sample configurations in the `/samples` folder

---

## Quick Reference Card

### Key File Locations

| Purpose | Location |
|---------|----------|
| Login Form | DOMCFG.NSF → Forms → `$$LoginUserForm` |
| Configuration | DOMCFG.NSF → Resources → Files → config.js |
| Stylesheet | DOMCFG.NSF → Resources → Files → login.css |
| JavaScript | DOMCFG.NSF → Resources → Files → login.js |
| Translations | DOMCFG.NSF → Resources → Files → translations.js |
| Logo | DOMCFG.NSF → Resources → Files → logo.png |

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
   - **PNG format is recommended (JPG or GIF are also supported)**
   - Recommended format: PNG with transparent background
   - Alternative: JPG or GIF
   - Recommended size: 200-400px wide
   - File size: Under 100KB

2. **Import logo into Domino:**
   - Open DOMCFG.NSF in Designer
   - Expand **Resources** → **Files**
   - Right-click → **Import**
   - Select your logo file
   - Name it: `company-logo.png` (PNG, JPG, or GIF formats are recommended)

3. **Update config.js:**
```javascript
branding: {
    logoUrl: "/domcfg.nsf/company-logo.png",  // PNG, JPG, or GIF formats
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
        logoUrl: "/domcfg.nsf/acme-logo.png",  // NO SVG support in Domino
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

<a id="login-tracking"></a>
## Login Attempt Tracking — Deployment

Login attempt tracking records each login submission to the user's **Person document** in `names.nsf` and displays a compact banner on the login page for the user's reference.

> **Key principle:** Login history is stored in the **Person document** (`names.nsf`), NOT in the mail template. The mail template (`mail12.ntf` or equivalent) does NOT need to be modified.

---

### Architecture Overview

```
Browser (login page)                    Domino Server
─────────────────────────               ──────────────────────────────────
On form submit:
  Collect: timestamp, timezone,
  browser, screen, MFA flag
                                ──POST──▶  LogLoginAttempt?OpenAgent
                                               │
                                               ├─ Read REMOTE_ADDR (real IP)
                                               ├─ Lookup Person doc in names.nsf
                                               ├─ Prepend entry to LoginHistory[]
                                               ├─ Trim to last 5 entries
                                               └─ Save Person document

Save to localStorage                    ◀──OK──
(for banner on next load)

Submit to /names.nsf?Login ──────────▶  Domino authenticates user
```

---

### Where Login History is Stored

The `LogLoginAttempt` LotusScript agent writes two fields directly to the **Person document** in `names.nsf`:

| Field | Type | Contents |
|-------|------|----------|
| `LoginHistory` | Multi-value Text | Last 5 login attempts, newest first |
| `LoginHistoryUpdated` | Date/Time | Timestamp of the most recent update |

**Entry format** (pipe-delimited):
```
TIMESTAMP|IP_ADDRESS|STATUS|BROWSER|PLATFORM|TIMEZONE|SCREEN|MFA_USED
```

**Example:**
```
2026-06-25T07:30:00Z|192.168.1.10|ATTEMPT|Chrome|Win10|Asia/Kolkata|1920x1080|0
```

| Position | Field | Description |
|----------|-------|-------------|
| 0 | TIMESTAMP | ISO 8601 UTC |
| 1 | IP_ADDRESS | Real client IP (from CGI REMOTE_ADDR) |
| 2 | STATUS | Always `ATTEMPT` (server cannot confirm success/failure at this point) |
| 3 | BROWSER | Chrome, Firefox, Edge, Safari, Opera |
| 4 | PLATFORM | Win10, MacOS, Linux, Android, iOS |
| 5 | TIMEZONE | IANA timezone (e.g. Asia/Kolkata) |
| 6 | SCREEN | Resolution (e.g. 1920x1080) |
| 7 | MFA_USED | 1 = MFA step completed · 0 = no MFA |

---

### Accessing Login History in Notes Client

> **Do NOT modify the mail template.** The mail template is for email messages only and has no access to Person document fields.

#### Method 1 — Domino Administrator (Fastest for Admins)

1. Open **Domino Administrator** → **People & Groups** → **People**.
2. Find and open the user's **Person document**.
3. Click **Tools** → **Document Properties** → **Fields** tab.
4. Scroll to `LoginHistory` — each value is one login entry.
5. `LoginHistoryUpdated` shows when the field was last written.

> The field does not appear in the standard Person form view. It is in the document's raw field list (Document Properties). This is normal — no design change to pubnames.ntf is needed for it to work.

#### Method 2 — Custom View in names.nsf (Admin, All Users)

1. Open `names.nsf` in Domino Designer.
2. Create a **New View**:
   - Name: `Login History`
   - Selection: `SELECT Form = "Person"`
3. Add columns:
   - `FullName` — user's display name
   - `@Text(@Elements(LoginHistory))` — count of recorded attempts
   - `LoginHistory[1]` — most recent entry (raw pipe-delimited string)
   - `LoginHistoryUpdated` — date/time of last update
4. Save and sign the view.

#### Method 3 — HCL Verse Self-Service Popup

Deploy the `verse-extension/` extension. Users see their own `LoginHistory` in a popup from the Verse navbar "More" menu. The popup fetches data directly from the Person document via an authenticated `GetLoginHistory` agent — no mail template involved.

See `docs/03-Verse-Extension.md` for full setup steps.

---

### Deploying the LotusScript Agent (`LogLoginAttempt`)

The full agent source is at `lotusscript/LoginTracker.lss` **(current version: v1.2.0)**.

> **v1.2.0 important fix:** Domino does NOT automatically parse `application/x-www-form-urlencoded` POST bodies into `DocumentContext` fields for `?OpenAgent` agents. v1.2.0 reads the raw `REQUEST_CONTENT` CGI variable and parses it manually. If you are running v1.1.0 or earlier, login data will never be recorded — replace the agent code with the current `LoginTracker.lss`.

#### Step 1 — Create Agent in DOMCFG.NSF

| Property | Value |
|----------|-------|
| Name | `LogLoginAttempt` |
| Language | LotusScript |
| **When should this agent run** | **On Schedule → Never** |
| **Which document(s) should it act on** | **None** |
| **Run as web user** | **Unchecked** — agent runs as signer's identity |

> **Trigger must be "On Schedule → Never".** Any "On Event" sub-option causes HTTP 500 "Unsupported trigger and search in the background or embedded agent" when the agent is called via `?OpenAgent`.
>
> **Run as web user must be unchecked.** The login form POSTs before authentication, so the web context is Anonymous. The agent must run as the signer (who has write access to `names.nsf`).

1. Open DOMCFG.NSF in Domino Designer.
2. **Shared Code → Agents → New Agent** with settings above.
3. Paste the entire contents of `lotusscript/LoginTracker.lss`.
4. Configure constants at the top:
   ```lotusscript
   Const MAX_HISTORY  = 5       ' Entries to retain per user
   Const NAMES_SERVER = ""      ' "" = current server
   Const NAMES_DB_PATH = "names.nsf"
   Const SEND_EMAIL_ON_NEW_ATTEMPT = False  ' True for email alerts
   ```

#### Step 2 — Sign the Agent

- **File → Sign** with an ID that has:
  - **Author or Editor** access on `names.nsf` (to write `LoginHistory`)
  - Permission to run agents on the server (Programmability Restrictions)

#### Step 3 — Set ACL

| Database | Entry | Access |
|----------|-------|--------|
| `DOMCFG.NSF` | Anonymous | Reader (minimum — allows web POST) |
| `DOMCFG.NSF` | LocalDomainServers | Manager |
| `names.nsf` | Signing ID | Author + Write public docs, or Editor |

#### Step 4 — Server Security (Programmability Restrictions)

1. Domino Administrator → **Configuration → Server → Current Server Document → Security** tab.
2. Under **Programmability Restrictions**, add the signing ID to:
   `"Run restricted LotusScript/Java agents"`

#### Step 5 — Verify

> **Important:** Browsing to the agent URL in a browser sends a **GET** request with no body. `REQUEST_CONTENT` will be empty and all fields will show `[]` — this is **normal** and does not indicate a problem.
>
> **Windows users:** PowerShell's `curl` is an alias for `Invoke-WebRequest` and does NOT support `-v`, `-k`, `-H`, or `-d`. Use **`curl.exe`** (built into Windows 10/11) or the PowerShell splatting syntax shown below.

**Step 5a — GET smoke test** (confirms the agent is reachable and running):  

*If you get login form HTML instead of the debug trace, the `domcfg.nsf` ACL has `Anonymous = No Access`. Fix: Domino Admin → Files → `domcfg.nsf` → right-click → Access Control → set Anonymous = **Reader** → `tell http restart`.*

Browse to `https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent` — you should see a plain-text debug trace. Or use:

**Windows (curl.exe):**
```
curl.exe -v -k "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent"
```
**Linux / macOS:**
```bash
curl -v -k "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent"
```
Expected: response body starts with `=== LogLoginAttempt DEBUG (v1.4.0) ===`. If you see this, the agent is reachable. Proceed to Step 5b.

**Step 5b — POST test** (end-to-end test — verifies body parsing, Person doc lookup, and save):  
Replace `yourserver` and `John+Doe` with your real hostname and a real Domino username (`First+Last`, email, or short name):

**Windows (curl.exe in PowerShell or cmd):**
```
curl.exe -k -X POST "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent" -H "Content-Type: application/x-www-form-urlencoded" -d "username=John+Doe&ts=2026-07-01T10%%3A00%%3A00Z&browser=Chrome&platform=Win32&tz=Asia%%2FKolkata&scr=1920x1080&mfa=0&lang=en"
```

**Windows (PowerShell splatting — alternative to curl.exe):**
```powershell
$params = @{
    UseBasicParsing = $true
    Uri             = "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent"
    Method          = "POST"
    ContentType     = "application/x-www-form-urlencoded"
    Body            = "username=John+Doe&ts=2026-07-01T10%3A00%3A00Z&browser=Chrome&platform=Win32&tz=Asia%2FKolkata&scr=1920x1080&mfa=0&lang=en"
}
(Invoke-WebRequest @params).Content
```

**Linux / macOS:**
```bash
curl -k -X POST "https://yourserver/domcfg.nsf/LogLoginAttempt?OpenAgent" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=John+Doe&ts=2026-07-01T10%3A00%3A00Z&browser=Chrome&platform=Win32&tz=Asia%2FKolkata&scr=1920x1080&mfa=0&lang=en"
```
Expected output with `DEBUG_MODE = True`:
```
=== LogLoginAttempt DEBUG (v1.4.0) ===
REQUEST_METHOD : [POST]
CONTENT_TYPE   : [application/x-www-form-urlencoded]
REQUEST_CONTENT: [username=John+Doe&ts=2026-07-01T...]
Source: REQUEST_CONTENT (parsed)
username    : [John Doe]
...
Lookup results:
  Strategy C scan — looking for: [John Doe]
  MATCHED FullName.common=[John Doe]
---
=== PRE-WRITE CHECKPOINT ==
Target doc  : FullName=[CN=John Doe/O=DemoCollab]
  [0] 2026-07-01T...|10.x.x.x|ATTEMPT|Chrome|Win32|Asia/Kolkata|1920x1080|0
===========================
Save result : SUCCESS
OK
```

**If you get login form HTML instead of the above** — `domcfg.nsf` ACL has Anonymous = No Access. Fix: Domino Admin → Files → `domcfg.nsf` → Access Control → Anonymous = **Reader** → `tell http restart`.  
**If `Save result : FAILED`** — check the agent signer's ACL on `names.nsf` (Step 3).  
**If `NO MATCH`** — the username typed doesn't match any field in names.nsf; check FullName/ShortName/InternetAddress values on the Person document (Ctrl+Shift+F9 → Fields tab in Domino Admin).  
**If `username: []`** — the agent code is outdated; replace with `LoginTracker.lss` v1.4.0.  
Once verified, set `Const DEBUG_MODE = False` in the agent and re-sign before going to production.

---

### Enable in Login Page CONFIG

The method depends on which login page you deployed.

---

#### Option A — `DominoEmbeddedForm.html` or `EnterpriseLoginForm.html` *(self-contained — **no config.js / login.js needed**)*

> **These files are fully self-contained.** Tracking JavaScript is embedded inline inside the HTML. **Do not upload or modify `config.js` or `login.js` for this option — they are not used.**

1. Open `login-forms/DominoEmbeddedForm.html` (or `EnterpriseLoginForm.html`) in a text editor.
2. Search for `loginTracking:` and set `enable: true`:

```javascript
loginTracking: {
    enable: true,                                          // ← flip false → true
    agentUrl: "/domcfg.nsf/LogLoginAttempt?OpenAgent",
    maxHistory: 5,
    trackValidationFailures: false
}
```

> `features.enableLoginTracking: true` is an equivalent shorthand — either flag alone activates tracking.

3. Save the file, then **re-paste the updated HTML into the `$$LoginUserForm` form in Domino Designer**:
   - Open `DOMCFG.NSF` in Domino Designer → open form `$$LoginUserForm`
   - Select all (Ctrl+A) → Delete
   - Paste the full updated HTML (Ctrl+V)
   - Select all (Ctrl+A) → **Text → Pass-Thru HTML** (text turns green)
   - Save → run `tell http restart` on the Domino console

   > **Do NOT upload `DominoEmbeddedForm.html` as a File Resource.** Self-contained forms are deployed by pasting directly into the Designer form, not as File Resources.

---

#### Option B — `CustomLoginForm-Domino.html` *(external files — config.js + login.js required)*

> This modular form loads tracking logic from `js/login.js` (`initLoginTracking()`). Tracking is enabled via `loginTracking.enable: true` in `config.js`.

Upload both files to DOMCFG.NSF as File Resources:

| Local file | File Resource name | Action required |
|------------|--------------------|----------------|
| `config.js` | `config.js` | Set `loginTracking.enable: true` |
| `js/login.js` | `login.js` | No changes needed |

The `initLoginTracking()` function in `login.js` intercepts the form submit, collects browser fingerprint data, and POSTs `application/x-www-form-urlencoded` to the agent via `navigator.sendBeacon` (XHR fallback for older browsers). The POST fires before Domino authentication proceeds.

---

On the next page load the tracking banner will appear:
- **First load:** dashed placeholder — *"Login Activity Tracking Active — No previous login recorded on this device"*
- **After first submit:** full last-attempt details (Date, Status, Browser, Timezone, Screen, MFA Used)

---

### Login Tracking Checklist

**Agent (both deployment types):**
- [ ] Agent `LogLoginAttempt` created in DOMCFG.NSF with trigger **On Schedule → Never**
- [ ] Agent signed with ID that has Author/Editor on `names.nsf`
- [ ] DOMCFG.NSF ACL: Anonymous = Reader
- [ ] `names.nsf` ACL: signing ID = Author or Editor
- [ ] Server Programmability Restrictions: signing ID listed
- [ ] Agent GET test shows debug trace (v1.2.0): `https://server/domcfg.nsf/LogLoginAttempt?OpenAgent`
- [ ] Agent POST test via `curl -X POST` shows `Save result : SUCCESS` (see Step 5b above)
- [ ] `DEBUG_MODE = False` set in agent before production use

**Login page — Option A (`DominoEmbeddedForm.html` or `EnterpriseLoginForm.html`):**
- [ ] `loginTracking.enable: true` set in the **inline `CONFIG`** inside the HTML file
- [ ] Updated HTML re-pasted into `$$LoginUserForm` form in Designer → Pass-Thru HTML → Save → `tell http restart`
- [ ] *No `config.js` or `login.js` upload needed — not used by self-contained forms*

**Login page — Option B (`CustomLoginForm-Domino.html`) only:**
- [ ] `config.js` uploaded to DOMCFG.NSF with `loginTracking.enable: true`
- [ ] `js/login.js` uploaded to DOMCFG.NSF (contains `initLoginTracking()`)

**Verification:**
- [ ] Login page reloaded — tracking-active banner visible
- [ ] Test submit performed — check Person document for `LoginHistory` field
- [ ] Banner on next load shows last attempt details

---

## Checklist: Before Going Live

Use this checklist before deploying:

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
- How to customize your login page: `[link]`

---

*Document Version: 2.4.2 | June 29, 2026*
*Complete step-by-step deployment guide for Domino administrators*
