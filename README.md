# HCL Domino Custom Login Page

> **Transform Your HCL Domino Login Experience** - A modern, secure, and fully customizable login page solution that works out-of-the-box with zero configuration headaches.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Domino](https://img.shields.io/badge/HCL%20Domino-12.x%20%7C%2014.x-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Languages](https://img.shields.io/badge/languages-18-orange)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-purple)

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [The Problem We Solve](#-the-problem-we-solve)
3. [Features at a Glance](#-features-at-a-glance)
4. [Quick Start Guide](#-quick-start-guide)
5. [Detailed Feature Documentation](#-detailed-feature-documentation)
6. [Configuration Reference](#-configuration-reference)
7. [Internationalization (i18n)](#-internationalization-i18n)
8. [Theming & Dark Mode](#-theming--dark-mode)
9. [Security Features](#-security-features)
10. [Accessibility (WCAG 2.1)](#-accessibility-wcag-21)
11. [Troubleshooting](#-troubleshooting)
12. [Architecture & Technical Details](#-architecture--technical-details)
13. [Deployment Guide](#-deployment-guide)
14. [FAQ](#-faq)
15. [Changelog](#-changelog)

---

## 🌟 Introduction

When organizations deploy HCL Domino for enterprise collaboration, the default login page often doesn't meet modern UX expectations or corporate branding requirements. This project provides a **production-ready, enterprise-grade login page** that:

- **Looks modern** with smooth animations, responsive design, and professional styling
- **Works immediately** without complex MIME type configurations
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

## 🚨 The Problem We Solve

### The MIME Type Nightmare

If you've ever tried to customize a Domino login page with external CSS or JavaScript files, you've probably encountered these frustrating errors:

```
Uncaught SyntaxError: Unexpected token '<'
Refused to execute script because its MIME type ('text/html') is not executable
```

**Why does this happen?** When Domino serves files without proper MIME type configuration, browsers refuse to execute them. Setting MIME types requires navigating obscure settings in Domino Designer's Web Properties tab—and even then, it doesn't always work as expected.

### Our Solution: Zero-Configuration Deployment

We've solved this by creating **self-contained HTML files** with ALL CSS and JavaScript embedded inline. This means:

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

## 🚀 Quick Start Guide

### Step 1: Choose Your File

| Use Case | Recommended File | Complexity |
|----------|------------------|------------|
| Enterprise with all features | `docs/EnterpriseLoginForm.html` | ⭐ Easy |
| Simple clean login | `docs/DominoEmbeddedForm.html` | ⭐ Easy |
| Full modularity (advanced) | `CustomLoginForm-Domino.html` | ⭐⭐⭐ Advanced |

### Step 2: Customize the Configuration

Open your chosen HTML file and edit the `CONFIG` object at the top (around line 95):

```javascript
const CONFIG = {
    // Version info - displayed at bottom of page
    version: "2.1.0",
    versionDate: "2026-04-28",
    
    branding: {
        companyName: "Your Organization",
        companyTagline: "Enterprise Collaboration Portal",
        logoUrl: "data:image/png;base64,YOUR_LOGO_HERE",
        welcomeTitle: "Welcome Back",
        welcomeSubtitle: "Sign in to access your email and applications"
    },
    
    theme: {
        primaryColor: "#0066CC",
        primaryColorHover: "#0052A3"
    },
    
    features: {
        enableThemeSwitcher: true,      // Light/Dark mode toggle
        enablePasswordStrength: true,   // Password strength meter
        enableRememberUsername: true,   // Remember last username
        enableCaptcha: true             // CAPTCHA verification
    }
};
```

### Step 3: Deploy to Domino

1. **Open Domino Designer**
2. **Open or create DOMCFG.NSF** in your server's data directory
3. **Create a new Form** named "$$LoginUserForm"
4. **Paste the entire HTML content** into the form
5. **Select all content** → **Text menu** → **Pass-Thru HTML**
6. **Save the form**
7. **Configure Sign In Form Mapping** (if not already done)
8. **Restart HTTP**: `tell http restart`

**That's it!** Your new login page is now live.

---

## 📋 Detailed Feature Documentation

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

## ⚙️ Configuration Reference

### Complete CONFIG Object

```javascript
const CONFIG = {
    // =========================================================================
    // VERSION INFO
    // =========================================================================
    version: "2.1.0",
    versionDate: "2026-04-28",
    
    // =========================================================================
    // COMPANY BRANDING
    // =========================================================================
    branding: {
        companyName: "Your Organization",
        companyTagline: "Enterprise Collaboration Portal",
        
        // Logo Options:
        // 1. Base64: "data:image/png;base64,iVBORw0KGgo..."
        // 2. File Resource: "/domcfg.nsf/logo.png"
        // 3. External URL: "https://cdn.example.com/logo.png"
        // 4. Empty string to hide logo: ""
        logoUrl: "data:image/png;base64,...",
        logoAlt: "Organization Logo",
        logoWidth: 180,
        logoHeight: 60,
        
        welcomeTitle: "Welcome Back",
        welcomeSubtitle: "Sign in to access your email and applications",
        
        footerText: "© 2026 Your Organization. All rights reserved.",
        showPoweredBy: true
    },
    
    // =========================================================================
    // THEME COLORS
    // =========================================================================
    theme: {
        primaryColor: "#0066CC",
        primaryColorHover: "#0052A3",
        primaryColorLight: "#e6f0ff",
        
        errorColor: "#dc3545",
        successColor: "#28a745",
        warningColor: "#f59e0b",
        
        backgroundGradientStart: "#1a1a2e",
        backgroundGradientEnd: "#16213e"
    },
    
    // =========================================================================
    // QUICK LINKS
    // =========================================================================
    quickLinks: {
        forgotPassword: {
            show: true,
            text: "Forgot Password",
            url: "https://pwdreset.yourcompany.com/",
            icon: "🔑"
        },
        unlockAccount: {
            show: true,
            text: "Unlock Account",
            url: "/domcfg.nsf/unlock.nsf",
            icon: "🔓"
        },
        userGuide: {
            show: true,
            text: "User Guide",
            url: "/domcfg.nsf/UserGuide.pdf",
            icon: "📖"
        },
        faq: {
            show: true,
            text: "FAQ",
            url: "/domcfg.nsf/FAQ.pdf",
            icon: "❓"
        },
        itSupport: {
            show: true,
            text: "IT Support",
            url: "mailto:itsupport@yourcompany.com",
            icon: "📧"
        }
    },
    
    // =========================================================================
    // SECURITY NOTICE
    // =========================================================================
    securityNotice: {
        show: true,
        icon: "🔒",
        title: "Secure Connection",
        text: "This system is for authorized users only. All activity is monitored."
    },
    
    // =========================================================================
    // SYSTEM ANNOUNCEMENT
    // =========================================================================
    announcement: {
        show: false,
        type: "info",  // info | warning | error
        title: "Scheduled Maintenance",
        text: "System will be unavailable Saturday 2-4 AM",
        dismissible: true
    },
    
    // =========================================================================
    // FEATURE TOGGLES
    // =========================================================================
    features: {
        enableThemeSwitcher: true,
        enablePasswordStrength: true,
        enableRememberUsername: true,
        enableOfflineDetection: true,
        enableSessionWarning: true,
        enableKeyboardShortcuts: true,
        enableAnimations: true,
        enableTranslations: true,
        enableCaptcha: true
    },
    
    // =========================================================================
    // PASSWORD REQUIREMENTS
    // =========================================================================
    passwordStrength: {
        minLength: 8,
        showStrengthMeter: true
    },
    
    // =========================================================================
    // CAPTCHA SETTINGS
    // =========================================================================
    captcha: {
        difficulty: "easy",
        maxAttempts: 5,
        enableAudio: true
    },
    
    // =========================================================================
    // SESSION SETTINGS
    // =========================================================================
    session: {
        warningTimeMinutes: 25,
        extendUrl: "/names.nsf?Login"
    },
    
    // =========================================================================
    // ERROR MESSAGES
    // =========================================================================
    errors: {
        defaultTitle: "Login Failed",
        defaultMessage: "Please check your credentials",
        messages: {
            0: "Authentication successful",
            1: "Username not found",
            2: "Incorrect password",
            3: "Account locked",
            4: "Password expired",
            5: "Account disabled",
            6: "Session expired",
            7: "Access denied",
            8: "Server unavailable",
            9: "Too many attempts",
            10: "Certificate required"
        }
    },
    
    // =========================================================================
    // TRANSLATIONS (i18n)
    // =========================================================================
    i18n: {
        defaultLanguage: "en",
        languages: {
            en: { name: "English", dir: "ltr", strings: { /* ... */ }},
            es: { name: "Español", dir: "ltr", strings: { /* ... */ }},
            // ... more languages
        }
    }
};
```

---

## 🖼️ Logo Configuration

### Important: Domino Does NOT Support SVG

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

## 🔧 Troubleshooting

### Common Issues and Solutions

#### "Uncaught SyntaxError: Unexpected token '<'"

**Cause:** Domino is serving files as HTML instead of JavaScript

**Solution:** Use the self-contained HTML files that have no external dependencies:
- `docs/EnterpriseLoginForm.html`
- `docs/DominoEmbeddedForm.html`

#### Logo Not Displaying

**Checklist:**
1. ❌ Using SVG? → Convert to PNG
2. ❌ Using subfolders? → Use `/domcfg.nsf/logo.png`, NOT `/domcfg.nsf/images/logo.png`
3. ❌ MIME type not set? → Set in Web Properties tab
4. ✅ Use Base64 to avoid all these issues

#### Theme Toggle Not Working

**Check:**
1. Is `enableThemeSwitcher: true` in CONFIG?
2. Is there a JavaScript error in the console?
3. Try clearing localStorage: `localStorage.clear()`

#### Translations Showing Incorrectly

**Check:**
1. Is `enableTranslations: true` in CONFIG?
2. Is the language code correct in `i18n.languages`?
3. Are all required strings defined?

#### Form Not Submitting

**Check:**
1. All validation requirements met?
2. CAPTCHA answered correctly?
3. Password meets minimum length?
4. Submit button enabled (not grayed out)?

#### Session Warning Not Appearing

**Check:**
1. Is `enableSessionWarning: true` in CONFIG?
2. Is `session.warningTimeMinutes` set?
3. Page must be open longer than the timeout

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

## 📦 Deployment Guide

### Method 1: Pass-Thru HTML Form (Recommended)

1. **Open Domino Designer**
2. **Open DOMCFG.NSF** (create if it doesn't exist)
3. **Create Form:** Design → Forms → New Form
4. **Name it:** `$$LoginUserForm`
5. **Paste HTML:** Copy entire file content and paste
6. **Set Pass-Thru:** Select all → Text → Pass-Thru HTML
7. **Save and close**
8. **Configure mapping:** In DOMCFG.NSF, create Sign In Form Mapping
9. **Restart HTTP:** `tell http restart`

### Method 2: Page Design Element

1. **Create Page:** Design → Pages → New Page
2. **Paste HTML** content
3. **Set Pass-Thru HTML**
4. **Configure as default login page**

### Domino Form Requirements

The HTML form includes these required fields:

```html
<form method="POST" action="/names.nsf?Login">
    <input type="text" name="Username" required>
    <input type="password" name="Password" required>
    <input type="hidden" name="RedirectTo" value="/">
</form>
```

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

**A:** The current version supports username, password, and CAPTCHA. True 2FA would require server-side integration.

---

## 📋 Changelog

### Version 2.1.0 (April 2026)

**New Features:**
- ✅ Real-time form validation with disabled submit button until valid
- ✅ Comprehensive dark/light mode with smooth transitions
- ✅ 18 languages including 9 Indian languages
- ✅ Version display in footer
- ✅ Enhanced CAPTCHA with audio support

**Improvements:**
- ✅ Better disabled button styling
- ✅ CAPTCHA triggers re-validation on refresh
- ✅ Improved RTL support for Arabic
- ✅ Better error message visibility

**Bug Fixes:**
- ✅ Fixed theme persistence across sessions
- ✅ Fixed CAPTCHA validation not blocking form submit
- ✅ Fixed password strength meter colors

### Version 2.0.0 (April 2026)

**Initial Release:**
- Self-contained HTML files
- 10 language support
- Dark/Light mode
- CAPTCHA protection
- Session management
- Password strength meter
- Accessibility features (WCAG 2.1)
- Quick links grid
- Security notice banner
- System announcements

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - Feel free to use and modify for your organization.

---

## 📞 Support

- **Documentation:** See `docs/` folder
- **Issues:** GitHub Issues
- **HCL Support:** For Domino-specific issues

---

**Created:** April 2026  
**Author:** Cascade AI  
**Compatible with:** HCL Domino 12.x, 14.x  
**Version:** 2.1.0
