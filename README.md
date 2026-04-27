# HCL Domino Custom Login Page

A modern, customizable login page for HCL Domino Server with **zero MIME configuration issues**.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Domino](https://img.shields.io/badge/HCL%20Domino-12.x%20%7C%2014.x-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚨 Common Error - SOLVED

If you see these errors in browser console:
```
Uncaught SyntaxError: Unexpected token '<'
Refused to execute script because its MIME type ('text/html') is not executable
```

**This means Domino is returning an HTML error page instead of your JavaScript file.**

### ✅ Solution: Use Self-Contained HTML Files

We provide **self-contained HTML files** with ALL CSS and JavaScript embedded inline - **no external files needed, no MIME configuration required!**

---

## 🎯 Quick Start - Choose Your Deployment Option

| If You Need... | Use This File | MIME Config | Complexity |
|----------------|---------------|-------------|------------|
| **Enterprise features** (quick links, security notice) | `EnterpriseLoginForm.html` | ❌ None | ⭐ Easy |
| **Simple clean login** | `DominoEmbeddedForm.html` | ❌ None | ⭐ Easy |
| **Full customization** with separate files | `CustomLoginForm-Domino.html` | ✅ Required | ⭐⭐⭐ Advanced |

### 📋 Deployment in 5 Minutes

1. **Choose your HTML file** (recommend `EnterpriseLoginForm.html`)
2. **Edit the CONFIG section** at the top of the file
3. **Copy entire file content**
4. In Domino Designer: Create form → Paste → **Text menu → Pass-Thru HTML**
5. Create Sign In Form Mapping
6. Run: `tell http restart`

**That's it! No file resources, no MIME types to configure.**

---

## 📁 Project Structure

```
DominoCustomWebPageApril26/
│
├── docs/
│   ├── EnterpriseLoginForm.html    ⭐ RECOMMENDED - Enterprise features, all-in-one
│   ├── DominoEmbeddedForm.html     ⭐ Simple version, all-in-one
│   ├── BEGINNER_DEPLOYMENT_GUIDE.md   Step-by-step instructions
│   ├── DEPLOYMENT_GUIDE.md            Technical deployment guide
│   └── COMPLETE_DOCUMENTATION.md      Full documentation
│
├── CustomLoginForm.html            # For local development only
├── CustomLoginForm-Domino.html     # For Domino with external files (advanced)
├── config.js                       # Configuration (for modular version)
├── css/login.css                   # Styles (for modular version)
├── js/login.js                     # Scripts (for modular version)
├── i18n/translations.js            # Translations (for modular version)
│
├── samples/                        # Pre-built theme configurations
│   ├── config-corporate-blue.js
│   ├── config-modern-gradient.js
│   ├── config-dark-elegant.js
│   └── config-healthcare.js
│
└── preview-server.js               # Local preview server
```

---

## 📄 File Comparison: Which One Should I Use?

### EnterpriseLoginForm.html ⭐ RECOMMENDED
**Location:** `docs/EnterpriseLoginForm.html`

**Best for:** Corporate/Enterprise deployments

| Feature | Included |
|---------|----------|
| All CSS/JS inline | ✅ |
| Quick Links (Forgot Password, Unlock, FAQ, IT Support) | ✅ |
| Security Notice Banner | ✅ |
| System Announcements | ✅ |
| Configurable Theme | ✅ |
| Logo Support (PNG/JPG/GIF) | ✅ |
| MIME Configuration Needed | ❌ **NONE** |

**Inspired by:** ONGC Verse, UIIC Mail corporate login pages

---

### DominoEmbeddedForm.html
**Location:** `docs/DominoEmbeddedForm.html`

**Best for:** Simple, clean deployments without extra features

| Feature | Included |
|---------|----------|
| All CSS/JS inline | ✅ |
| Clean minimal design | ✅ |
| Configurable Theme | ✅ |
| Logo Support (PNG/JPG/GIF) | ✅ |
| Quick Links | ❌ |
| Security Notice | ❌ |
| MIME Configuration Needed | ❌ **NONE** |

---

### CustomLoginForm-Domino.html
**Location:** `CustomLoginForm-Domino.html`

**Best for:** Advanced users who need full modularity and separate file management

| Feature | Included |
|---------|----------|
| Modular architecture | ✅ |
| Separate CSS/JS files | ✅ |
| Full feature set | ✅ |
| Requires File Resources | ⚠️ Yes |
| MIME Configuration Needed | ⚠️ **YES** |

**⚠️ If using this option, you MUST:**
1. Import all file resources (config.js, login.css, login.js, translations.js)
2. Set MIME types in **Web Properties** tab for each file
3. See [BEGINNER_DEPLOYMENT_GUIDE.md](docs/BEGINNER_DEPLOYMENT_GUIDE.md) for detailed instructions

---

## ⚙️ Configuration Examples

### EnterpriseLoginForm.html Configuration

Edit the `CONFIG` object at the top of the file (around line 95):

```javascript
const CONFIG = {
    branding: {
        companyName: "Your Organization",
        companyTagline: "Enterprise Collaboration Portal",
        logoUrl: "/domcfg.nsf/logo.png",  // PNG, JPG, or GIF only!
        welcomeTitle: "Welcome",
        welcomeSubtitle: "Sign in to access your applications"
    },
    
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
    
    securityNotice: {
        show: true,
        title: "Security Notice",
        text: "This system is for authorized users only. Unauthorized access is prohibited."
    },
    
    theme: {
        primaryColor: "#0066CC",
        backgroundGradientStart: "#1a1a2e",
        backgroundGradientEnd: "#16213e"
    }
};
```

### DominoEmbeddedForm.html Configuration

Edit the `DominoLoginConfig` object at the top of the file:

```javascript
const DominoLoginConfig = {
    branding: {
        companyName: "Your Company",
        logoUrl: "/domcfg.nsf/logo.png",  // PNG, JPG, or GIF only!
        welcomeTitle: "Welcome Back",
        welcomeSubtitle: "Please sign in to continue"
    },
    theme: {
        primaryColor: "#0066CC",
        backgroundGradientStart: "#667eea",
        backgroundGradientEnd: "#764ba2"
    }
};
```

---

## 🖼️ Logo Support

### ⚠️ IMPORTANT: Domino does NOT support SVG files!

**Supported formats:** PNG, JPG, GIF only

### Logo Configuration Options

**Option 1: Base64 Data URI (Recommended - No file upload needed)**
```javascript
logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```
Convert your logo to base64 at: https://www.base64-image.de/

**Option 2: Upload to DOMCFG.NSF as File Resource**
```javascript
logoUrl: "/domcfg.nsf/logo.png"
```
⚠️ Must set MIME type to `image/png` in **Web Properties** tab!

**Option 3: External URL**
```javascript
logoUrl: "https://your-cdn.com/logo.png"
```

**Option 4: Hide logo (show company name only)**
```javascript
logoUrl: ""
```

---

## 🔧 Troubleshooting

### Error: `Uncaught SyntaxError: Unexpected token '<'`

**Cause:** Domino is serving JavaScript/CSS files as HTML (wrong MIME type or file not found)

**Solutions:**
1. ✅ **Best:** Use `EnterpriseLoginForm.html` or `DominoEmbeddedForm.html` (no external files needed)
2. If using external files: 
   - Ensure files are imported as File Resources
   - Set MIME type in **Web Properties** tab (not Basic tab!)
   - `.js` files → `text/javascript`
   - `.css` files → `text/css`

### Error: `MIME type ('text/html') is not executable`

**Same cause and solutions as above.**

### Error: Logo not displaying

**Causes & Solutions:**
1. **Using SVG?** → Convert to PNG (Domino doesn't support SVG)
2. **Wrong path?** → Use `/domcfg.nsf/logo.png` (no subfolders like `/images/`)
3. **MIME type not set?** → Set to `image/png` in Web Properties tab
4. **File not found?** → Verify file is imported as File Resource

### Error: Form not appearing after login URL

1. Verify DOMCFG.NSF exists in server data directory
2. Check Sign In Form Mappings configuration
3. Ensure Anonymous has Reader access in ACL
4. Restart HTTP: `tell http restart`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [BEGINNER_DEPLOYMENT_GUIDE.md](docs/BEGINNER_DEPLOYMENT_GUIDE.md) | Step-by-step for first-time admins |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Technical deployment reference |
| [COMPLETE_DOCUMENTATION.md](docs/COMPLETE_DOCUMENTATION.md) | Full feature documentation |

## 📚 HCL References

| Topic | Link |
|-------|------|
| File Resource Web Properties | [HCL Docs](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_DEPLOY_A_FILE_RESOURCE_ON_THE_WEB_STEPS.html) |
| Creating File Resources | [HCL Docs](https://help.hcl-software.com/dom_designer/11.0.1/basic/H_TO_CREATE_A_FILE_RESOURCE_STEPS.html) |
| Modern Login Form | [HCL Docs](https://help.hcl-software.com/domino/12.0.2/admin/conf_creatingmodernloginform.html) |
| Pass-Thru HTML | [HCL Docs](https://help.hcl-software.com/dom_designer/14.5.1/basic/H_IMPORTING_HTML_INTO_A_PAGE_OR_FORM_STEPS.html) |

---

## 🛡️ Security Notes

- Always use HTTPS in production
- Form fields are validated client-side for UX only
- Server-side validation is handled by Domino
- Never store credentials in JavaScript
- Use the Security Notice feature to display compliance messages

---

## 📝 Domino Form Requirements

The following fields are **required** for Domino authentication:

| Field | Type | Name Attribute |
|-------|------|----------------|
| Username | text | `Username` |
| Password | password | `Password` |
| Redirect | hidden | `RedirectTo` |

Form must POST to `/names.nsf?Login`

---

## 📋 Changelog

### Version 2.1.0 (April 2026)
- ✅ Added `EnterpriseLoginForm.html` - enterprise features with zero MIME issues
- ✅ Updated `DominoEmbeddedForm.html` - simplified self-contained form
- ✅ Removed SVG support - Domino doesn't support SVG, use PNG/JPG/GIF
- ✅ Added comprehensive MIME troubleshooting documentation
- ✅ Added "Choosing Your Deployment Option" guide
- ✅ Added HCL documentation references throughout

### Version 2.0.0 (April 2026)
- Initial release with modular architecture
- Multi-language support (10 languages)
- Theme customization
- Accessibility features (WCAG 2.1)

---

## 📄 License

MIT License - Feel free to use and modify for your organization.

---

**Created:** April 2026  
**Author:** Cascade AI  
**Compatible with:** HCL Domino 12.x, 14.x
