# DominoCustomWebPageApril26

A modern, customizable login page for HCL Domino Server with beautiful design and easy configuration.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Domino](https://img.shields.io/badge/HCL%20Domino-12.x%20%7C%2014.x-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- **Modern Design** - Beautiful, responsive UI with smooth animations
- **Fully Customizable** - Easy configuration via `config.js`
- **Domino Ready** - Built specifically for HCL Domino session authentication
- **Feature Toggles** - All features can be turned ON/OFF via simple switches

### Security Features
- **Multi-Factor Authentication (MFA)** - 2FA UI with TOTP support
- **Accessible CAPTCHA** - Visual + Audio CAPTCHA for visually impaired users
- **Password Strength Meter** - Real-time password strength feedback
- **Rate Limiting UI** - Warning after failed attempts
- **WebAuthn/Passkeys** - Modern passwordless authentication
- **Session Timeout Warning** - Alerts before session expiry

### Internationalization
- **Multi-Language (i18n)** - 10 languages included (EN, ES, FR, DE, PT, ZH, JA, AR, HE, HI)
- **RTL Support** - Full right-to-left language support (Arabic, Hebrew)
- **Language Selector** - Easy language switching dropdown

### UX Features
- **Theme Switcher** - Light/Dark/Auto mode toggle
- **Offline Detection** - Network status indicator
- **Remember Username** - Persist last username
- **SSO/Social Login** - Microsoft, Google, Apple, GitHub, LinkedIn buttons
- **Domain Selector** - Multi-tenant/domain selection

### Accessibility (WCAG 2.1)
- **Screen Reader Support** - ARIA labels and announcements
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast Mode** - Enhanced visibility option
- **Reduced Motion** - Respects user preferences

### Additional Features
- **Cookie Consent** - GDPR compliance banner
- **Analytics Hooks** - Google Analytics, Adobe, custom endpoints
- **A/B Testing** - Variant support for testing
- **Debug Mode** - Development debugging panel

## 📁 Project Structure

```
DominoCustomWebPageApril26/
├── CustomLoginForm.html        # Main login form (modular version)
├── config.js                   # Configuration file (all feature toggles!)
├── css/
│   └── login.css               # Stylesheet with CSS variables
├── js/
│   └── login.js                # Form handling and all features
├── i18n/
│   └── translations.js         # Multi-language translations (10 languages)
├── images/
│   └── logo-placeholder.svg    # Sample logo (replace with yours)
├── samples/                    # Pre-built theme configurations
│   ├── config-corporate-blue.js
│   ├── config-modern-gradient.js
│   ├── config-dark-elegant.js
│   └── config-healthcare.js
├── docs/
│   ├── DEPLOYMENT_GUIDE.md     # Domino deployment instructions
│   ├── COMPLETE_DOCUMENTATION.md # Full documentation
│   └── DominoEmbeddedForm.html # Ready-to-deploy embedded version
├── preview-server.js           # Local preview server
└── README.md                   # This file
```

## 🚀 Quick Start

### Preview Locally

1. Navigate to the project directory:
   ```bash
   cd /Users/rishabnewmbp2025/CascadeProjects/DominoCustomWebPageApril26
   ```

2. Start the preview server:
   ```bash
   node preview-server.js
   ```

3. Open your browser to `http://localhost:3000`

### Customize

1. Edit `config.js` to customize:
   - Company branding (logo, name)
   - Colors and theme
   - Form labels and text
   - Error messages

2. Replace `images/logo-placeholder.svg` with your company logo

3. Adjust CSS variables in `css/login.css` for fine-tuning

## 🎨 Customization Options

### Branding
```javascript
branding: {
    companyName: "Your Company",
    logoUrl: "images/your-logo.svg",      // Primary logo (SVG, PNG, JPG, WEBP)
    logoFallbackUrl: "images/logo.png",   // Fallback for older browsers
    logoFormat: "auto",                    // "svg", "png", "jpg", "auto"
    logoDarkModeUrl: "images/logo-dark.svg", // Optional dark mode variant
    logo: {
        maxWidth: 200,
        maxHeight: null,
        objectFit: "contain"
    },
    welcomeTitle: "Welcome Back",
    welcomeSubtitle: "Sign in to continue"
}
```

### Theme Colors
```javascript
theme: {
    primaryColor: "#0066CC",
    backgroundGradientStart: "#667eea",
    backgroundGradientEnd: "#764ba2"
}
```

### Background Options
- **Gradient** - Set `backgroundGradientStart` and `backgroundGradientEnd`
- **Solid Color** - Set `backgroundSolid: "#yourcolor"`
- **Image** - Set `backgroundImage: "path/to/image.jpg"`

## 📦 Deployment to HCL Domino

### Quick Steps

1. Create `DOMCFG.NSF` database using DOMCFG5.NTF template
2. Add Anonymous with Reader access to ACL
3. Create new form named `CustomLoginForm`
4. Copy HTML content with embedded CSS/JS
5. Configure Sign In Form Mapping
6. Restart HTTP task: `tell http restart`

### Detailed Instructions

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for complete instructions.

## 🔧 Configuration Reference

| Option | Description | Default |
|--------|-------------|---------|
| `branding.logoUrl` | Primary logo (SVG/PNG/JPG/WEBP) | `images/logo-placeholder.svg` |
| `branding.logoFallbackUrl` | Fallback logo URL | `""` |
| `branding.logoFormat` | Format hint (svg/png/jpg/auto) | `auto` |
| `branding.logoDarkModeUrl` | Dark mode logo variant | `""` |
| `branding.logo.maxWidth` | Logo max width in pixels | `200` |
| `branding.logo.objectFit` | Object-fit for raster images | `contain` |
| `branding.welcomeTitle` | Main heading text | `Welcome Back` |
| `theme.primaryColor` | Button and accent color | `#0066CC` |
| `theme.backgroundGradientStart` | Gradient start color | `#667eea` |
| `theme.backgroundGradientEnd` | Gradient end color | `#764ba2` |
| `form.showRememberMe` | Show remember me checkbox | `true` |
| `form.showForgotPassword` | Show forgot password link | `true` |
| `effects.glassMorphism` | Enable glass effect | `true` |

## 🛡️ Security Notes

- Always use HTTPS in production
- Form fields are validated client-side for UX only
- Server-side validation is handled by Domino
- Never store credentials in JavaScript

## 📝 Domino Form Requirements

The following fields are **required** for Domino authentication:

| Field | Type | Name Attribute |
|-------|------|----------------|
| Username | text | `Username` |
| Password | password | `Password` |
| Redirect | hidden | `RedirectTo` |

Form must POST to `/names.nsf?Login`

## 🐛 Troubleshooting

### Login form not appearing
- Verify DOMCFG.NSF exists in server data directory
- Check Sign In Form Mappings configuration
- Restart HTTP task

### Styles not loading
- Ensure Anonymous has Reader access
- Verify file resource paths
- Check browser console for errors

### Error messages not showing
- Verify `reasontype` hidden field exists
- Check JavaScript console for errors

## 📚 Resources

- [HCL Domino Documentation](https://help.hcl-software.com/domino/)
- [Customizing HTML Login Form](https://help.hcl-software.com/domino/14.5.1/admin/conf_customizingthehtmlloginform_t.html)
- [Modern Login Form Guide](https://help.hcl-software.com/domino/12.0.2/admin/conf_creatingmodernloginform.html)

## 📄 License

MIT License - Feel free to use and modify for your organization.

---

**Created:** April 2026  
**Author:** Cascade AI  
**Compatible with:** HCL Domino 12.x, 14.x
