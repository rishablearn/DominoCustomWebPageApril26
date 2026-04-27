# DominoCustomWebPageApril26 - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [⭐ Deployment Options](#deployment-options) - **START HERE**
3. [MIME Type Issues - Solved](#mime-type-issues---solved)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Quick Start](#quick-start)
7. [Configuration Guide](#configuration-guide)
8. [Customization Options](#customization-options)
9. [Sample Themes](#sample-themes)
10. [HCL Domino Deployment](#hcl-domino-deployment)
11. [Responsive Design](#responsive-design)
12. [Accessibility](#accessibility)
13. [Troubleshooting](#troubleshooting)
14. [API Reference](#api-reference)
15. [Best Practices](#best-practices)
16. [FAQ](#faq)

---

## Introduction

DominoCustomWebPageApril26 is a modern, fully customizable login page designed specifically for HCL Domino Server. It provides a beautiful, responsive user interface with easy configuration options.

### Why Use This Login Page?

- **Modern Design**: Clean, professional UI following 2024+ design trends
- **Easy Customization**: Single configuration file controls everything
- **Domino Ready**: Built with Domino session authentication in mind
- **Zero MIME Issues**: Self-contained versions require no external files
- **Responsive**: Works on all devices from mobile to desktop
- **Accessible**: WCAG 2.1 compliant with keyboard navigation
- **Secure**: Follows security best practices

---

## Deployment Options

### ⭐ Quick Decision Guide

| If You Need... | Use This File | MIME Config Required? |
|----------------|---------------|-----------------------|
| **Enterprise features** (quick links, security notice) | `EnterpriseLoginForm.html` | ❌ **NO** |
| **Simple clean login** | `DominoEmbeddedForm.html` | ❌ **NO** |
| **Full modularity** with separate files | `CustomLoginForm-Domino.html` | ⚠️ **YES** |

### EnterpriseLoginForm.html (Recommended)

**Location:** `docs/EnterpriseLoginForm.html`

**Features:**
- ✅ All CSS/JS embedded inline - no external files
- ✅ Quick links (Forgot Password, Unlock Account, FAQ, IT Support)
- ✅ Security notice banner
- ✅ System announcement support
- ✅ Fully configurable theme and branding
- ✅ Logo support (PNG, JPG, GIF - **NOT SVG**)
- ✅ **Zero MIME configuration required**

**Inspired by:** ONGC Verse and UIIC Mail corporate login pages

### DominoEmbeddedForm.html

**Location:** `docs/DominoEmbeddedForm.html`

**Features:**
- ✅ All CSS/JS embedded inline - no external files
- ✅ Clean, minimal design
- ✅ Configurable theme and branding
- ✅ Logo support (PNG, JPG, GIF - **NOT SVG**)
- ✅ **Zero MIME configuration required**

**Best for:** Simple deployments without extra enterprise features

### CustomLoginForm-Domino.html

**Location:** `CustomLoginForm-Domino.html`

**Features:**
- ✅ Modular architecture with separate CSS/JS files
- ✅ Full feature set including i18n
- ⚠️ Requires file resource imports
- ⚠️ **Requires MIME type configuration**

**Best for:** Advanced users who need full modularity

---

## MIME Type Issues - Solved

### Common Errors

```
Uncaught SyntaxError: Unexpected token '<'
Refused to execute script because its MIME type ('text/html') is not executable
```

### Why This Happens

When you use external JavaScript/CSS files, Domino must serve them with the correct MIME type. If not configured properly, Domino serves them as `text/html`, causing browsers to reject them.

### Solution 1: Use Self-Contained HTML (Recommended)

Use `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html` - they have all CSS/JS embedded inline, so **no external files are needed and no MIME configuration is required**.

### Solution 2: Configure MIME Types Manually

If you must use external files, set MIME types in **Web Properties** tab (not Basic tab):

| File Type | MIME Type |
|-----------|-----------|
| `.js` | `text/javascript` |
| `.css` | `text/css` |
| `.png` | `image/png` |
| `.jpg` | `image/jpeg` |

**Reference:** [HCL Documentation - File Resource Web Properties](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html)

---

## Logo Support

### ⚠️ IMPORTANT: Domino does NOT support SVG files

**Supported formats:** PNG, JPG, GIF only

### Options

1. **Base64 Data URI** (no file upload needed):
   ```javascript
   logoUrl: "data:image/png;base64,iVBORw0KGgo..."
   ```

2. **File Resource** (must set MIME type):
   ```javascript
   logoUrl: "/domcfg.nsf/logo.png"
   ```

3. **External URL**:
   ```javascript
   logoUrl: "https://cdn.example.com/logo.png"
   ```

4. **Hide logo**:
   ```javascript
   logoUrl: ""
   ```

---

## Features

### Visual Features
- Animated gradient backgrounds
- Glass morphism effects (optional)
- Smooth hover and focus states
- Loading spinner on form submit
- Password visibility toggle
- Error message animations

### Technical Features
- CSS Custom Properties for theming
- Modular JavaScript architecture
- Form validation
- Domino error code handling (reasontype)
- Keyboard shortcuts support
- Dark mode support (system preference)

### Customization Features
- Company logo support
- Custom colors and gradients
- Custom text and labels
- Background image support
- Multiple pre-built themes

---

## Project Structure

```
DominoCustomWebPageApril26/
│
├── docs/
│   ├── EnterpriseLoginForm.html   ⭐ RECOMMENDED - All-in-one enterprise
│   ├── DominoEmbeddedForm.html    ⭐ All-in-one simple version
│   ├── DEPLOYMENT_GUIDE.md           Complete deployment instructions
│   └── COMPLETE_DOCUMENTATION.md     This file
│
├── CustomLoginForm-Domino.html    # Advanced: Uses external files
├── config.js                      # Configuration for modular version
├── css/login.css                  # Stylesheet for modular version
├── js/login.js                    # JavaScript for modular version
├── i18n/translations.js           # Translations for modular version
├── samples/                       # Pre-built theme configurations
├── preview-server.js              # Local testing server
└── README.md
```

### File Descriptions

| File | Purpose | MIME Config |
|------|---------|-------------|
| `docs/EnterpriseLoginForm.html` | Enterprise login with quick links, security notice | ❌ None |
| `docs/DominoEmbeddedForm.html` | Simple clean login page | ❌ None |
| `CustomLoginForm-Domino.html` | Modular version for Domino | ⚠️ Required |

---

## Quick Start

### 1. Preview Locally

```bash
cd /Users/rishabnewmbp2025/CascadeProjects/DominoCustomWebPageApril26
node preview-server.js
```

Open browser to `http://localhost:3000`

### 2. Test Login

| Username | Password | Result |
|----------|----------|--------|
| `demo` | `demo` | Success |
| `test` | `test` | Invalid credentials error |
| `unauthorized` | any | Access denied error |
| `expired` | any | Session expired error |

### 3. Customize

Edit `config.js` to change:
- Logo and company name
- Colors and theme
- Form labels and text
- Error messages

---

## Configuration Guide

### Configuration File Structure

The `config.js` file contains all customizable options organized into sections:

```javascript
const DominoLoginConfig = {
    branding: { ... },      // Logo, company name, text
    theme: { ... },         // Colors, backgrounds, styling
    form: { ... },          // Form fields, labels, validation
    domino: { ... },        // Domino server settings
    accessibility: { ... }, // Language, ARIA labels
    errorMessages: { ... }, // Error message text
    effects: { ... },       // Animations, visual effects
    features: { ... }       // Additional features
};
```

### Branding Section

```javascript
branding: {
    companyName: "Your Company",
    logoUrl: "images/logo.svg",     // Path to logo
    logoAlt: "Company Logo",        // Alt text for accessibility
    logoMaxWidth: 200,              // Maximum logo width in pixels
    pageTitle: "Login - Company",   // Browser tab title
    welcomeTitle: "Welcome Back",   // Main heading
    welcomeSubtitle: "Please sign in", // Subheading
    footerText: "© 2026 Company",   // Footer copyright
    showDominoBadge: true           // Show "Powered by HCL Domino"
}
```

### Theme Section

```javascript
theme: {
    // Primary colors
    primaryColor: "#0066CC",        // Buttons, links
    primaryColorHover: "#0052A3",   // Hover state
    
    // Background
    backgroundGradientStart: "#667eea",
    backgroundGradientEnd: "#764ba2",
    backgroundSolid: null,          // Set color for solid bg
    backgroundImage: "",            // URL for background image
    backgroundOverlayOpacity: 0.5,  // Darkens background image
    
    // Card styling
    cardBackground: "rgba(255, 255, 255, 0.95)",
    cardBorderRadius: 16,
    cardShadow: "heavy",            // "light", "medium", "heavy"
    
    // Text colors
    textPrimary: "#1a1a2e",
    textSecondary: "#6c757d",
    textLight: "#ffffff",
    
    // Input styling
    inputBackground: "#f8f9fa",
    inputBorder: "#dee2e6",
    inputBorderFocus: "#0066CC",
    inputBorderRadius: 8,
    
    // Status colors
    errorColor: "#dc3545",
    successColor: "#28a745",
    warningColor: "#ffc107"
}
```

### Form Section

```javascript
form: {
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginButtonText: "Sign In",
    
    showRememberMe: true,
    rememberMeLabel: "Remember me on this device",
    
    showPasswordToggle: true,
    
    showForgotPassword: true,
    forgotPasswordUrl: "/help/reset",
    forgotPasswordText: "Forgot your password?",
    
    enableValidation: true,
    minPasswordLength: 1,
    showLoadingSpinner: true
}
```

### Domino Section

```javascript
domino: {
    loginActionUrl: "/names.nsf?Login",  // Domino login endpoint
    defaultRedirectTo: "/",               // Redirect after login
    formMethod: "POST"
}
```

### Error Messages Section

```javascript
errorMessages: {
    0: "",  // No error (initial load)
    1: "You are not authorized to access this application.",
    2: "Invalid username or password. Please try again.",
    3: "Your session has expired. Please sign in again.",
    4: "A timing issue occurred. Please try again.",
    generic: "An error occurred. Please try again."
}
```

### Effects Section

```javascript
effects: {
    enableAnimations: true,
    animationDuration: 300,       // milliseconds
    backgroundAnimation: true,    // Floating shapes
    glassMorphism: false,         // Glass effect on card
    floatingLabels: false         // Future feature
}
```

### Features Section

```javascript
features: {
    showHelpLink: false,
    helpLinkUrl: "/help",
    helpLinkText: "Need help?",
    
    showSecurityNotice: true,
    securityNoticeText: "This is a secure connection",
    
    customHtmlBelow: "",          // Inject custom HTML
    keyboardShortcuts: true
}
```

---

## Customization Options

### Background Options

#### Gradient Background (Default)
```javascript
theme: {
    backgroundGradientStart: "#667eea",
    backgroundGradientEnd: "#764ba2",
    backgroundSolid: null,
    backgroundImage: ""
}
```

#### Solid Color Background
```javascript
theme: {
    backgroundSolid: "#1e3a8a",
    backgroundImage: ""
}
```

#### Image Background
```javascript
theme: {
    backgroundImage: "/images/background.jpg",
    backgroundOverlayOpacity: 0.6  // Darkens image
}
```

### Logo Configuration

#### With Logo
```javascript
branding: {
    logoUrl: "images/company-logo.svg",
    logoMaxWidth: 180
}
```

#### Without Logo
```javascript
branding: {
    logoUrl: ""  // Empty string hides logo
}
```

### Color Schemes

#### Blue Corporate
```javascript
primaryColor: "#1e40af"
backgroundGradientStart: "#1e3a8a"
backgroundGradientEnd: "#312e81"
```

#### Purple Modern
```javascript
primaryColor: "#8b5cf6"
backgroundGradientStart: "#667eea"
backgroundGradientEnd: "#764ba2"
```

#### Dark Elegant
```javascript
primaryColor: "#f59e0b"
backgroundGradientStart: "#0f172a"
backgroundGradientEnd: "#1e293b"
cardBackground: "rgba(30, 41, 59, 0.95)"
```

---

## Sample Themes

### 1. Corporate Blue (`samples/config-corporate-blue.js`)
Professional blue theme for enterprise environments.
- Deep blue gradient
- Employee ID field
- IT Support contact

### 2. Modern Gradient (`samples/config-modern-gradient.js`)
Vibrant purple gradient for tech companies.
- Email-based login
- Casual, friendly tone
- Animated background

### 3. Dark Elegant (`samples/config-dark-elegant.js`)
Sophisticated dark theme for premium services.
- Gold accents
- Dark card background
- Concierge support link

### 4. Healthcare (`samples/config-healthcare.js`)
Clean teal theme for medical organizations.
- HIPAA compliance notice
- IT Help Desk contact
- Security-focused messaging

### Using a Sample Theme

Copy the sample configuration to replace `config.js`:
```bash
cp samples/config-corporate-blue.js config.js
```

---

## HCL Domino Deployment

### Prerequisites

1. HCL Domino Server 12.x or 14.x
2. HCL Domino Designer
3. Server Administrator access
4. Session-based authentication enabled

### Step-by-Step Deployment

#### Step 1: Create DOMCFG.NSF

1. Open Domino Administrator
2. File > Application > New
3. Server: Your Domino server
4. Check "Show Advanced Templates"
5. Select: Domino Web Server Configuration (DOMCFG5.NTF)
6. File name: `DOMCFG.NSF` (mandatory)
7. Click OK

#### Step 2: Configure ACL

1. Open DOMCFG.NSF
2. File > Application > Access Control
3. Add entries:
   - Anonymous: Reader
   - Your Admin: Manager
   - LocalDomainServers: Manager

#### Step 3: Create Login Form

1. Open DOMCFG.NSF in Domino Designer
2. Expand Forms
3. Create New Form or copy $$LoginUserForm
4. Name: `CustomLoginForm`
5. Use content from `docs/DominoEmbeddedForm.html`
6. Save

#### Step 4: Add File Resources (Optional)

Import separate CSS/JS files:
1. Resources > Files > Import
2. Import: login.css, login.js, config.js, logo.svg
3. Update HTML to reference: `/domcfg.nsf/filename`

#### Step 5: Create Form Mapping

1. Open DOMCFG.NSF in Notes Client
2. Go to Sign In Form Mappings
3. Click Add Mapping
4. Configure:
   - Site: All Web Sites/Entire Server
   - Target Database: DOMCFG.NSF
   - Target Form: CustomLoginForm
5. Save

#### Step 6: Restart HTTP

```
tell http restart
```

### Required Form Fields

| Field | Name | Type |
|-------|------|------|
| Username | `Username` | text |
| Password | `Password` | password |
| Redirect | `RedirectTo` | hidden |
| Error Code | `reasontype` | hidden |

### Form Action

```html
<form method="POST" action="/names.nsf?Login">
```

---

## Responsive Design

### Breakpoints

| Screen Size | Breakpoint | Behavior |
|-------------|------------|----------|
| Large Desktop | > 1200px | Max width 440px, larger padding |
| Desktop | 769px - 1200px | Default styling |
| Tablet | 481px - 768px | Slightly reduced padding |
| Mobile | 361px - 480px | Full width, compact layout |
| Small Mobile | < 360px | Minimal padding, smaller fonts |
| Landscape | Height < 600px | Compact vertical spacing |

### Mobile Optimizations

- Simplified background (no animated shapes)
- Stacked form options
- Reduced padding
- Smaller logo
- Touch-friendly tap targets (44px minimum)

---

## Accessibility

### WCAG 2.1 Compliance

- **Keyboard Navigation**: Full tab support
- **Focus Indicators**: Clear visible focus states
- **Color Contrast**: Meets AA standards
- **ARIA Labels**: All interactive elements labeled
- **Screen Reader**: Semantic HTML structure
- **Reduced Motion**: Respects user preference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Navigate between fields |
| Enter | Submit form |
| Alt + U | Focus username field |
| Alt + P | Focus password field |

---

## Troubleshooting

### Common Issues

#### Login form not appearing
- Verify DOMCFG.NSF in data directory
- Check form mapping configuration
- Restart HTTP task

#### Styles not loading
- Confirm Anonymous has Reader access
- Verify file resource paths
- Check browser console

#### Error messages not displaying
- Ensure `reasontype` hidden field exists
- Check JavaScript console
- Verify errorMessages configuration

#### Text not visible
- Check color contrast settings
- Disable glassMorphism if using light backgrounds
- Verify textPrimary and textSecondary colors

### Debug Mode

Add URL parameter `?debug=true` to show:
- Current reasontype value
- RedirectTo value
- Configuration status

---

## API Reference

### JavaScript Functions

#### `applyConfiguration()`
Applies all settings from DominoLoginConfig.

#### `applyBranding(config)`
Sets logo, company name, and text content.

#### `applyTheme(config)`
Applies CSS custom properties for colors.

#### `applyFormSettings(config)`
Configures form fields, labels, and validation.

#### `handleErrorMessages(config)`
Displays appropriate error based on reasontype.

### CSS Custom Properties

```css
--primary-color
--primary-color-hover
--bg-gradient-start
--bg-gradient-end
--card-bg
--card-border-radius
--text-primary
--text-secondary
--input-bg
--input-border
--input-border-focus
--error-color
--success-color
--animation-duration
```

---

## Best Practices

### Security
1. Always use HTTPS
2. Never store credentials in JavaScript
3. Use Content Security Policy headers
4. Enable audit logging

### Performance
1. Optimize logo images (SVG preferred)
2. Use system fonts as fallback
3. Minimize custom HTML injection

### Maintenance
1. Document custom configurations
2. Test after Domino upgrades
3. Keep backup of DOMCFG.NSF

---

## FAQ

**Q: Can I use this with Domino 11?**
A: Yes, but some features may be limited. Tested with 12.x and 14.x.

**Q: How do I add multi-factor authentication?**
A: Use Domino's $$LoginUserFormMFA form or integrate with TOTP.

**Q: Can I have different login pages for different databases?**
A: Yes, create multiple forms and mappings for specific IP addresses or virtual servers.

**Q: How do I customize error messages per language?**
A: Create multiple configuration files and serve based on browser language.

**Q: Is the glass morphism effect safe to use?**
A: It's disabled by default. Enable only with lighter, solid color backgrounds for best text visibility.

---

## Support & Resources

- [HCL Domino Documentation](https://help.hcl-software.com/domino/)
- [Customizing HTML Log-in Form](https://help.hcl-software.com/domino/14.5.1/admin/conf_customizingthehtmlloginform_t.html)
- [Modern Login Form Configuration](https://help.hcl-software.com/domino/12.0.2/admin/conf_creatingmodernloginform.html)

---

**Document Version:** 1.1.0  
**Last Updated:** April 2026  
**Compatible with:** HCL Domino 12.x, 14.x
