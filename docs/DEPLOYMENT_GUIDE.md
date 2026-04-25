# HCL Domino Custom Login Page - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the custom login page on HCL Domino Server using the Domino Web Server Configuration database (DOMCFG.NSF).

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Compatible with:** HCL Domino 12.x, 14.x

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating DOMCFG.NSF Database](#creating-domcfgnsf-database)
3. [Creating the Custom Login Form](#creating-the-custom-login-form)
4. [Configuring the Login Form Mapping](#configuring-the-login-form-mapping)
5. [Adding Resources (CSS, JS, Images)](#adding-resources)
6. [Testing the Login Page](#testing-the-login-page)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)
9. [Customization Reference](#customization-reference)

---

## Prerequisites

Before deploying the custom login page, ensure you have:

- [ ] **HCL Domino Server** running (version 12.x or later recommended)
- [ ] **HCL Domino Designer** installed for creating forms
- [ ] **HCL Notes Client** or Domino Administrator for configuration
- [ ] **Server Administrator access** to the Domino server
- [ ] **Session-based authentication** enabled on the server

### Server Configuration Requirements

Ensure your Domino server has session-based authentication enabled:

1. Open the **Server Document** in the Domino Directory
2. Navigate to **Internet Protocols > HTTP**
3. Set **Session authentication** to "Multi-Server" or "Single Server"
4. Set **Session timeout** as needed (default: 30 minutes)

---

## Creating DOMCFG.NSF Database

The DOMCFG.NSF database is required for custom login forms. If it doesn't exist, create it:

### Step 1: Create the Database

1. Open **HCL Domino Administrator** or **HCL Notes Client**
2. Go to **File > Application > New**
3. Configure the new database:
   - **Server:** Your Domino server name
   - **Title:** Domino Web Server Configuration
   - **File name:** `DOMCFG.NSF` (this name is **mandatory**)
   - Check **Show Advanced Templates**
   - Select template: **Domino Web Server Configuration (DOMCFG5.NTF)**
4. Click **OK** to create the database

### Step 2: Configure ACL

1. Open the newly created DOMCFG.NSF
2. Go to **File > Application > Access Control**
3. Add entries:
   | Name | Access Level |
   |------|--------------|
   | -Default- | No Access |
   | Anonymous | Reader |
   | Your Admin Name | Manager |
   | LocalDomainServers | Manager |
4. Click **OK** to save

> **Important:** Anonymous must have at least Reader access for the login form to be accessible.

---

## Creating the Custom Login Form

### Method 1: Using Domino Designer (Recommended)

1. Open **HCL Domino Designer**
2. Open the **DOMCFG.NSF** database
3. Expand **Forms** in the design pane
4. Right-click and select **New Form**
5. Name the form: `CustomLoginForm` (or your preferred name)

### Step 3: Add Form Content

In the form design, switch to HTML mode and paste the contents from `CustomLoginForm.html`:

#### Required HTML Structure for Domino

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Your Company</title>
    
    <!-- Include CSS inline or reference from File Resource -->
    <style>
        /* Paste contents of css/login.css here */
    </style>
</head>
<body>
    <!-- Login Form - CRITICAL: These field names are required by Domino -->
    <form method="POST" action="/names.nsf?Login" name="loginForm">
        
        <!-- Hidden field for redirect after login -->
        <input type="hidden" name="RedirectTo" value="/">
        
        <!-- Username field - MUST be named "Username" -->
        <input type="text" name="Username" id="Username" required>
        
        <!-- Password field - MUST be named "Password" -->
        <input type="password" name="Password" id="Password" required>
        
        <button type="submit">Sign In</button>
    </form>
    
    <!-- Include JavaScript inline -->
    <script>
        /* Paste contents of config.js here */
        /* Paste contents of js/login.js here */
    </script>
</body>
</html>
```

### Critical Field Requirements

| Field Name | Type | Purpose |
|------------|------|---------|
| `Username` | Text | User's login name (required) |
| `Password` | Password | User's password (required) |
| `RedirectTo` | Hidden | URL to redirect after login |
| `reasontype` | Hidden | Error code from Domino |

### Form Action URL

The form **must** submit to `/names.nsf?Login`:
```html
<form method="POST" action="/names.nsf?Login">
```

---

## Adding Resources

### Option A: Embed Resources (Simplest)

Embed all CSS and JavaScript directly in the HTML form. This is the simplest approach:

1. Copy contents of `css/login.css` into a `<style>` tag
2. Copy contents of `config.js` into a `<script>` tag
3. Copy contents of `js/login.js` into another `<script>` tag
4. Convert `images/logo-placeholder.svg` to Base64 and embed

### Option B: File Resources in DOMCFG.NSF

1. In Domino Designer, open DOMCFG.NSF
2. Expand **Resources > Files**
3. Right-click and select **Import**
4. Import each file:
   - `css/login.css` → Reference as `/domcfg.nsf/login.css`
   - `js/login.js` → Reference as `/domcfg.nsf/login.js`
   - `config.js` → Reference as `/domcfg.nsf/config.js`
   - `images/logo-placeholder.svg` → Reference as `/domcfg.nsf/logo.svg`

5. Update HTML references:
```html
<link rel="stylesheet" href="/domcfg.nsf/login.css">
<script src="/domcfg.nsf/config.js"></script>
<script src="/domcfg.nsf/login.js"></script>
```

### Option C: Separate Database for Resources

For larger deployments, create a separate database for static resources:

1. Create a new database (e.g., `loginresources.nsf`)
2. Import all CSS, JS, and image files
3. Set Anonymous to Reader access
4. Reference files using:
```html
<link rel="stylesheet" href="/loginresources.nsf/login.css">
```

---

## Configuring the Login Form Mapping

### Step 1: Open Sign In Form Mappings

1. Open **DOMCFG.NSF** in Notes Client
2. Navigate to the **Sign In Form Mappings** view

### Step 2: Create New Mapping

1. Click **Add Mapping**
2. Configure the mapping:

#### Site Information
- **All Web Sites/Entire Server** - Use custom form for all sites
- **Specific Web Sites/Virtual Servers** - Use for specific IP addresses only

#### Form Mapping
| Field | Value |
|-------|-------|
| Target Database | DOMCFG.NSF |
| Target Form | CustomLoginForm |
| Comment | Custom branded login form v1.0 |

3. **Save and close** the document

### Step 3: Restart HTTP Task

For changes to take effect:

```
tell http restart
```

Or restart the Domino server.

---

## Testing the Login Page

### Test Checklist

- [ ] Navigate to a protected resource that requires authentication
- [ ] Verify the custom login form appears
- [ ] Test valid credentials - should redirect successfully
- [ ] Test invalid credentials - should show error message (reasontype=2)
- [ ] Test session timeout scenario
- [ ] Verify logo displays correctly
- [ ] Check mobile responsiveness
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Verify password visibility toggle works

### Common Test URLs

```
https://your-server.com/names.nsf?Login
https://your-server.com/mail/username.nsf
https://your-server.com/any-protected-resource.nsf
```

---

## Troubleshooting

### Issue: Default login form still appears

**Causes & Solutions:**
1. DOMCFG.NSF not in server's data directory
   - Ensure file is at `<Domino Data>/domcfg.nsf`
2. Form mapping not configured
   - Check Sign In Form Mappings view
3. HTTP task not restarted
   - Run `tell http restart`

### Issue: Form appears but login fails

**Causes & Solutions:**
1. Field names incorrect
   - Verify `Username` and `Password` field names (case-sensitive)
2. Form action URL wrong
   - Must be `/names.nsf?Login`
3. Method not POST
   - Ensure `method="POST"`

### Issue: CSS/JS not loading

**Causes & Solutions:**
1. Anonymous doesn't have Reader access
   - Check ACL settings
2. File paths incorrect
   - Verify resource URLs
3. CORS issues
   - Ensure resources are in same domain

### Issue: Error messages not displaying

**Causes & Solutions:**
1. reasontype field missing
   - Add `<input type="hidden" name="reasontype" id="reasontype">`
2. JavaScript not handling errors
   - Check browser console for errors

### Debug Mode

Add this to the form for debugging:
```html
<div id="debug" style="display:none;">
    <p>reasontype: <span id="debugReasonType"></span></p>
    <p>RedirectTo: <span id="debugRedirect"></span></p>
</div>
<script>
document.getElementById('debugReasonType').textContent = 
    new URLSearchParams(location.search).get('reasontype') || 'none';
</script>
```

---

## Security Considerations

### HTTPS Requirement

Always use HTTPS for login pages:
- Configure SSL certificate on Domino server
- Redirect HTTP to HTTPS

### Content Security Policy

Add CSP headers to prevent XSS:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://unpkg.com;">
```

### Input Validation

- Domino handles credential validation server-side
- Client-side validation is for UX only
- Never trust client-side validation for security

### Audit Logging

Enable audit logging in Domino:
1. Server Document > Security > Audit Settings
2. Enable login/logout events

---

## Customization Reference

### Configuration File (config.js)

The `config.js` file contains all customizable options:

#### Branding Options
```javascript
branding: {
    companyName: "Your Company",
    logoUrl: "/domcfg.nsf/logo.svg",
    welcomeTitle: "Welcome Back",
    welcomeSubtitle: "Please sign in",
    footerText: "© 2026 Your Company"
}
```

#### Theme Colors
```javascript
theme: {
    primaryColor: "#0066CC",
    backgroundGradientStart: "#667eea",
    backgroundGradientEnd: "#764ba2",
    // ... see config.js for full options
}
```

#### Form Settings
```javascript
form: {
    usernameLabel: "Username",
    passwordLabel: "Password",
    loginButtonText: "Sign In",
    showRememberMe: true,
    showForgotPassword: true
}
```

### Error Message Customization

Domino passes `reasontype` parameter on authentication failure:

| reasontype | Meaning |
|------------|---------|
| 0 | Initial prompt (no error) |
| 1 | Not authorized to access database |
| 2 | Invalid username or password |
| 3 | Session expired |
| 4 | Server timing issue (SSO) |

Customize messages in `config.js`:
```javascript
errorMessages: {
    1: "Access denied. Please contact your administrator.",
    2: "Invalid credentials. Please try again.",
    3: "Session timed out. Please sign in again.",
    4: "Server synchronization error. Please retry."
}
```

---

## Quick Reference Card

### File Structure
```
DOMCFG.NSF
├── Forms
│   └── CustomLoginForm
├── Resources/Files
│   ├── login.css
│   ├── login.js
│   ├── config.js
│   └── logo.svg
└── Sign In Form Mappings
    └── [Your Mapping Document]
```

### Required Form Fields
- `Username` (text input)
- `Password` (password input)
- `RedirectTo` (hidden)

### Form Action
```html
<form method="POST" action="/names.nsf?Login">
```

### ACL Requirements
- Anonymous: Reader
- Administrators: Manager

---

## Support & Resources

- [HCL Domino Documentation](https://help.hcl-software.com/domino/)
- [Customizing the HTML Log-in Form](https://help.hcl-software.com/domino/14.5.1/admin/conf_customizingthehtmlloginform_t.html)
- [Configuring Modern Login Form](https://help.hcl-software.com/domino/12.0.2/admin/conf_creatingmodernloginform.html)

---

*Document Version: 1.0.0 | April 2026*
