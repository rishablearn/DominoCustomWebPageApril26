# HCL Domino Custom Login Page - Recreation Prompt

**Use this prompt to recreate the complete application from scratch.**

---

## PROMPT

```
Create a world-class, enterprise-grade custom login page for HCL Domino Server with the following comprehensive specifications:

## PROJECT OVERVIEW

Build a modern, responsive, accessible custom login page designed specifically for HCL Domino session-based authentication. The page should be deployable via DOMCFG.NSF and work with the standard Domino login mechanism (/names.nsf?Login).

**Target Environment:** HCL Domino Server 12.x / 14.x
**Authentication Method:** Session-based authentication via DOMCFG.NSF
**Design Philosophy:** Feature toggles for all capabilities - everything configurable via a single config.js file

---

## PROJECT STRUCTURE

Create the following file structure:

```
project-root/
├── CustomLoginForm.html          # Main HTML login form
├── config.js                     # Central configuration (ALL feature toggles)
├── css/
│   └── login.css                 # Complete stylesheet with CSS variables
├── js/
│   └── login.js                  # All JavaScript functionality
├── i18n/
│   └── translations.js           # Multi-language translations (10 languages)
├── images/
│   └── logo-placeholder.svg      # Placeholder logo
├── samples/                      # Pre-built theme configurations
│   ├── config-corporate-blue.js
│   ├── config-modern-gradient.js
│   ├── config-dark-elegant.js
│   └── config-healthcare.js
├── docs/
│   ├── DEPLOYMENT_GUIDE.md       # Domino deployment instructions
│   └── COMPLETE_DOCUMENTATION.md
├── preview-server.js             # Node.js local preview server
└── README.md

```

---

## CORE DOMINO REQUIREMENTS

### Form Action & Fields (CRITICAL)
- Form action: `/names.nsf?Login` (POST method)
- Required field names (exact case):
  - `Username` - text input for user login
  - `Password` - password input
  - `RedirectTo` - hidden field for redirect URL after login
  - `reasontype` - hidden field (populated by Domino on errors)

### Domino Error Codes (reasontype)
Map these error codes to user-friendly messages:
- `0` = Initial prompt (no error)
- `1` = Not authorized to access database
- `2` = Invalid username or password
- `3` = Session expired
- `4` = Server timing issue (SSO)

---

## FEATURE TOGGLES (config.js)

Create a comprehensive `DominoLoginConfig` object with ALL features as boolean toggles:

### Security Features
- `enableMFA` - Multi-Factor Authentication UI (TOTP, 6-digit code input with auto-advance)
- `enableCaptcha` - CAPTCHA verification (supports: math, simple text, image canvas)
- `enableAccessibleCaptcha` - Audio CAPTCHA using Web Speech API
- `enablePasswordStrength` - Real-time password strength meter with requirements checklist
- `enableRateLimitWarning` - Show warning after failed login attempts
- `enableWebAuthn` - Passkey/Biometric authentication button
- `enableCSPNonce` - Content Security Policy nonce support

### UX Features
- `enableI18n` - Multi-language support with 10 languages
- `enableRTL` - Right-to-left language support (Arabic, Hebrew)
- `enableThemeSwitcher` - Light/Dark/Auto mode toggle
- `enableSessionWarning` - Session timeout warning modal with extend option
- `enableOfflineDetection` - Network status indicator
- `enableRememberUsername` - Remember last username in localStorage
- `enableAutoFocus` - Auto-focus first empty field

### Enterprise Features
- `enableSSOButtons` - Social/Enterprise SSO buttons (Microsoft, Google, Apple, GitHub, LinkedIn, SAML)
- `enableDomainSelector` - Multi-tenant domain/server selection dropdown
- `enableCustomFields` - Support for additional custom form fields
- `enableAnalytics` - Analytics hooks (Google Analytics, Adobe, custom endpoint)
- `enableABTesting` - A/B testing variant support

### Accessibility Features (WCAG 2.1 AA)
- `enableScreenReaderAnnounce` - ARIA live region announcements
- `enableHighContrast` - High contrast mode support
- `enableReducedMotion` - Respect `prefers-reduced-motion`
- `enableKeyboardShortcuts` - Keyboard navigation
- `enableFocusIndicators` - Enhanced visible focus indicators

### Visual Features
- `enableAnimations` - UI animations and transitions
- `enableBackgroundAnimation` - Floating shapes/particles background
- `enableGlassMorphism` - Glass effect on login card
- `enableLoadingSpinner` - Submit button loading state
- `enablePasswordToggle` - Show/hide password button

### Additional Features
- `showRememberMe` - Remember me checkbox
- `showForgotPassword` - Forgot password link
- `showHelpLink` - Help/support link
- `showSecurityNotice` - Secure connection notice (lock icon)
- `showDominoBadge` - "Powered by HCL Domino" badge
- `showCookieConsent` - GDPR cookie consent banner
- `enableDebugMode` - Debug panel showing config and URL params

---

## CONFIGURATION SECTIONS

### 1. Branding Configuration
```javascript
branding: {
    companyName: "Your Company Name",
    logoUrl: "images/logo-placeholder.svg",     // Primary logo
    logoFallbackUrl: "",                         // PNG fallback for SVG
    logoFormat: "auto",                          // svg, png, jpg, webp, gif, auto
    logoAlt: "Company Logo",                     // WCAG accessibility
    logo: {
        maxWidth: 200,
        maxHeight: null,
        width: null,
        height: null,
        objectFit: "contain",
        padding: 0,
        backgroundColor: null,
        borderRadius: 0,
        shadow: false,
        invertOnDarkMode: false
    },
    logoDarkModeUrl: "",                         // Alternate logo for dark mode
    logoRetina2xUrl: "",                         // 2x resolution for retina
    logoLoading: "eager",                        // eager or lazy
    pageTitle: "Secure Login - HCL Domino",
    welcomeTitle: "Welcome Back",
    welcomeSubtitle: "Please sign in to access your applications",
    footerText: "© 2026 Your Company Name. All rights reserved.",
    showDominoBadge: true
}
```

### 2. Theme Configuration
```javascript
theme: {
    primaryColor: "#0066CC",
    primaryColorHover: "#0052A3",
    secondaryColor: "#00A3E0",
    backgroundGradientStart: "#667eea",
    backgroundGradientEnd: "#764ba2",
    backgroundSolid: null,                       // Use instead of gradient
    backgroundImage: "",                         // URL to background image
    backgroundOverlayOpacity: 0.5,
    cardBackground: "rgba(255, 255, 255, 0.95)",
    cardBorderRadius: 16,
    cardShadow: "heavy",                         // light, medium, heavy
    textPrimary: "#1a1a2e",
    textSecondary: "#6c757d",
    textLight: "#ffffff",
    inputBackground: "#f8f9fa",
    inputBorder: "#dee2e6",
    inputBorderFocus: "#0066CC",
    inputBorderRadius: 8,
    errorColor: "#dc3545",
    successColor: "#28a745",
    warningColor: "#ffc107"
}
```

### 3. Form Configuration
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
    forgotPasswordUrl: "#",
    forgotPasswordText: "Forgot your password?",
    enableValidation: true,
    minPasswordLength: 1,
    showLoadingSpinner: true
}
```

### 4. Domino Configuration
```javascript
domino: {
    loginActionUrl: "/names.nsf?Login",
    defaultRedirectTo: "/",
    formMethod: "POST"
}
```

### 5. i18n Configuration
```javascript
i18n: {
    defaultLanguage: "en",
    autoDetect: true,                            // Detect browser language
    availableLanguages: [
        { code: "en", name: "English", dir: "ltr", flag: "🇺🇸" },
        { code: "es", name: "Español", dir: "ltr", flag: "🇪🇸" },
        { code: "fr", name: "Français", dir: "ltr", flag: "🇫🇷" },
        { code: "de", name: "Deutsch", dir: "ltr", flag: "🇩🇪" },
        { code: "pt", name: "Português", dir: "ltr", flag: "🇧🇷" },
        { code: "zh", name: "中文", dir: "ltr", flag: "🇨🇳" },
        { code: "ja", name: "日本語", dir: "ltr", flag: "🇯🇵" },
        { code: "ar", name: "العربية", dir: "rtl", flag: "🇸🇦" },
        { code: "he", name: "עברית", dir: "rtl", flag: "🇮🇱" },
        { code: "hi", name: "हिन्दी", dir: "ltr", flag: "🇮🇳" }
    ],
    showLanguageSelector: true,
    rememberLanguage: true
}
```

### 6. MFA Configuration
```javascript
mfa: {
    verifyEndpoint: "/api/mfa/verify",
    methods: { totp: true, sms: false, email: false, push: false, webauthn: false },
    codeLength: 6,
    allowRememberDevice: true,
    rememberDeviceDays: 30,
    mfaTitle: "Two-Factor Authentication",
    mfaSubtitle: "Enter the verification code from your authenticator app"
}
```

### 7. CAPTCHA Configuration
```javascript
captcha: {
    type: "math",                                // math, simple, image, recaptcha, hcaptcha
    recaptchaSiteKey: "",
    hcaptchaSiteKey: "",
    simple: { length: 6, includeNumbers: true, includeLetters: true, caseSensitive: false },
    math: { maxNumber: 10, operations: ["+", "-"] },
    accessible: {
        enableAudio: true,
        audioEndpoint: "/api/captcha/audio",     // Fallback if Web Speech API unavailable
        enableTextAlternative: true,
        announceToScreenReader: true
    },
    showAfterFailedAttempts: 3
}
```

### 8. Password Strength Configuration
```javascript
passwordStrength: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    showMeter: true,
    showRequirements: true,
    levels: {
        weak: { label: "Weak", color: "#dc3545", minScore: 0 },
        fair: { label: "Fair", color: "#ffc107", minScore: 25 },
        good: { label: "Good", color: "#17a2b8", minScore: 50 },
        strong: { label: "Strong", color: "#28a745", minScore: 75 },
        excellent: { label: "Excellent", color: "#20c997", minScore: 90 }
    },
    checkCommonPasswords: true,
    preventUsernameInPassword: true
}
```

### 9. SSO Configuration
```javascript
sso: {
    separatorText: "or sign in with",
    providers: {
        saml: { enabled: false, label: "Enterprise SSO", icon: "building-2", url: "/saml/login", buttonStyle: "outline" },
        microsoft: { enabled: false, label: "Microsoft", icon: "microsoft", url: "/oauth/microsoft", buttonStyle: "outline" },
        google: { enabled: false, label: "Google", icon: "google", url: "/oauth/google", buttonStyle: "outline" },
        apple: { enabled: false, label: "Apple", icon: "apple", url: "/oauth/apple", buttonStyle: "outline" },
        github: { enabled: false, label: "GitHub", icon: "github", url: "/oauth/github", buttonStyle: "outline" },
        linkedin: { enabled: false, label: "LinkedIn", icon: "linkedin", url: "/oauth/linkedin", buttonStyle: "outline" }
    }
}
```

### 10. Domain/Tenant Selector
```javascript
domain: {
    showSelector: false,
    label: "Domain",
    placeholder: "Select your domain",
    domains: [
        { id: "default", name: "Default", server: "/names.nsf" },
        { id: "corp", name: "Corporate", server: "/corp/names.nsf" },
        { id: "partner", name: "Partner Portal", server: "/partner/names.nsf" }
    ],
    rememberDomain: true,
    position: "above-username"
}
```

### 11. Session Warning
```javascript
session: {
    warningTime: 300,                            // 5 min before expiry
    timeout: 1800,                               // 30 min session
    showCountdown: true,
    allowExtend: true,
    warningTitle: "Session Expiring",
    warningMessage: "Your session will expire in {time}.",
    extendButtonText: "Stay Signed In",
    logoutButtonText: "Sign Out"
}
```

### 12. Rate Limiting
```javascript
rateLimiting: {
    maxAttempts: 5,
    lockoutDuration: 300,
    showRemainingAttempts: true,
    warningMessage: "Warning: {remaining} attempts remaining",
    lockoutMessage: "Too many failed attempts. Try again in {time}."
}
```

### 13. WebAuthn/Passkey
```javascript
webauthn: {
    rpName: "Your Company",
    rpId: window.location.hostname,
    userVerification: "preferred",
    authenticatorAttachment: null,
    residentKey: "preferred",
    registerEndpoint: "/api/webauthn/register",
    authEndpoint: "/api/webauthn/authenticate",
    buttonText: "Sign in with Passkey",
    prominent: true
}
```

### 14. Analytics
```javascript
analytics: {
    provider: "none",                            // google, adobe, custom, none
    gaId: "",
    customEndpoint: "",
    events: {
        pageView: true, loginAttempt: true, loginSuccess: true,
        loginFailure: true, mfaPrompt: true, ssoClick: true,
        languageChange: true, themeChange: true
    },
    includeTimestamp: true
}
```

### 15. Cookie Consent
```javascript
cookieConsent: {
    message: "We use cookies to ensure you get the best experience.",
    acceptText: "Accept",
    declineText: "Decline",
    learnMoreUrl: "/privacy-policy",
    learnMoreText: "Learn more",
    cookieName: "login_cookie_consent",
    expiryDays: 365,
    position: "bottom"
}
```

### 16. UI Positions
```javascript
ui: {
    helpLinkUrl: "#",
    helpLinkText: "Need help?",
    securityNoticeText: "This is a secure connection",
    themeSwitcher: { position: "top-right", showLabel: false },
    languageSelector: { position: "top-left", showFlag: true, showName: true },
    offline: { message: "You appear to be offline.", showIcon: true, position: "top" }
}
```

---

## TRANSLATIONS (i18n/translations.js)

Create `DominoLoginI18n` object with translations for 10 languages:
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Chinese Simplified (zh)
- Japanese (ja)
- Arabic (ar) - RTL
- Hebrew (he) - RTL
- Hindi (hi)

Each language must include translations for:
- Meta info (_meta: name, nativeName, dir, flag emoji)
- Branding (welcomeTitle, welcomeSubtitle)
- Form labels (usernameLabel, passwordLabel, loginButton, etc.)
- MFA strings (mfaTitle, mfaSubtitle, mfaVerifyButton, etc.)
- CAPTCHA strings (captchaLabel, captchaAudio, etc.)
- Password strength (passwordStrength, passwordWeak/Fair/Good/Strong/Excellent)
- Error messages (error1, error2, error3, error4, errorGeneric)
- Session (sessionWarningTitle, sessionExpired)
- Accessibility (showPassword, hidePassword, togglePassword)
- Theme (lightMode, darkMode, autoMode)
- Offline status (offlineMessage, backOnline)
- And all other UI strings

Include helper function `t(key, replacements)` for getting translations with placeholder support.

---

## JavaScript (js/login.js)

Create a self-executing function with:

### State Management
```javascript
const LoginState = {
    config: null,
    currentLanguage: 'en',
    currentTheme: 'light',
    failedAttempts: 0,
    isOffline: false,
    captchaAnswer: null
};
```

### Core Functions
1. `initialize()` - Entry point, calls applyConfiguration()
2. `applyConfiguration()` - Reads config and applies all settings
3. `applyBranding(branding)` - Logo, titles, footer
4. `applyTheme(theme)` - CSS variables, colors
5. `applyFormSettings(form)` - Labels, placeholders
6. `applyDominoSettings(domino)` - Form action, redirect
7. `applyAccessibility(accessibility)` - ARIA labels
8. `handleErrorMessages()` - Parse URL reasontype, show errors
9. `initializeFeatures()` - Enable features based on toggles

### Feature Initialization Functions
- `initializePasswordToggle()` - Show/hide password
- `initializePasswordStrength(config)` - Strength meter with requirements
- `initializeThemeSwitcher(config)` - Light/Dark/Auto toggle
- `initializeLanguageSelector(i18nConfig, uiConfig)` - Language dropdown
- `initializeCaptcha(config, enableAccessible)` - Math/text CAPTCHA
- `initializeOfflineDetection(config)` - Network status
- `initializeSessionWarning(config)` - Timeout modal
- `initializeSSOButtons(config)` - SSO provider buttons
- `initializeDomainSelector(config)` - Domain dropdown
- `initializeRememberUsername()` - localStorage persistence
- `initializeRateLimiting(config)` - Attempt warnings
- `initializeWebAuthn(config)` - Passkey button
- `initializeMFA(config)` - MFA code input
- `initializeCookieConsent(config)` - GDPR banner
- `initializeAnalytics(config)` - Event tracking
- `initializeDebugMode()` - Debug panel

### CAPTCHA Functions
- `generateCaptcha(config)` - Generate math or text
- `drawCaptcha(text)` - Canvas rendering with noise
- `playCaptchaAudio(config)` - Web Speech API or endpoint fallback

### Utility Functions
- `t(key, replacements)` - Translation lookup
- `setLanguage(lang, config)` - Change language, update UI
- `setCSSVariable(name, value)` - Update CSS custom property
- `setTextContent(id, text)` - Update element text
- `setAriaLabel(id, label)` - Update ARIA label
- `showInputError(input, message)` - Display validation error
- `formatTime(seconds)` - Format duration
- `announceToScreenReader(message)` - ARIA live announcement

---

## CSS (css/login.css)

Create comprehensive stylesheet with:

### CSS Custom Properties (:root)
All colors, sizes, shadows as variables for easy theming.

### Base Styles
- Reset and normalize
- Body with gradient/image background
- Google Fonts (Inter) with system font fallback

### Layout
- Centered login card with max-width
- Responsive breakpoints (mobile, tablet, desktop)
- Glass morphism support

### Components
- `.login-card` - Main container with shadow and border-radius
- `.logo-section` - Company logo area
- `.form-group` - Label + input wrapper
- `.form-input` - Styled inputs with focus states
- `.password-wrapper` - Password with toggle button
- `.submit-btn` - Primary button with loading state
- `.error-message` - Error display with icon

### Feature Components
- `.password-strength-meter` - Progress bar with colors
- `.password-requirements` - Checklist with check icons
- `.theme-toggle` - Sun/Moon/Auto icons
- `.language-selector` - Dropdown with flags
- `.captcha-container` - CAPTCHA display + controls
- `.captcha-canvas` - Canvas for image CAPTCHA
- `.offline-indicator` - Network status banner
- `.session-modal` - Session warning overlay
- `.sso-container` - SSO button group
- `.sso-btn` - Individual SSO buttons
- `.mfa-modal` - MFA verification overlay
- `.mfa-code-input` - 6-digit code boxes
- `.webauthn-btn` - Passkey button
- `.rate-limit-warning` - Attempt warning
- `.cookie-banner` - GDPR consent bar
- `.domain-group` - Domain selector
- `.debug-panel` - Debug info display

### Dark Mode
```css
[data-theme="dark"] { ... }
@media (prefers-color-scheme: dark) { [data-theme="auto"] { ... } }
```

### RTL Support
```css
[dir="rtl"] { ... }
```

### Accessibility
- `.screen-reader-text` - Visually hidden but accessible
- `:focus-visible` - Enhanced focus indicators
- `@media (prefers-reduced-motion)` - Disable animations

### Animations
- `@keyframes fadeIn` - Fade in
- `@keyframes slideUp` - Slide up
- `@keyframes pulse` - Pulsing effect
- `@keyframes float` - Background shapes

---

## HTML (CustomLoginForm.html)

Create semantic HTML5 structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title id="pageTitle">Secure Login</title>
    
    <!-- Google Fonts with fallback -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons with fallback -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
    
    <script src="config.js"></script>
    <script src="i18n/translations.js"></script>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <!-- Background animation shapes -->
    <div class="background-animation" id="bgAnimation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
    </div>

    <div class="login-container">
        <!-- Logo Section -->
        <section class="logo-section" id="logoSection">
            <img id="companyLogo" src="" alt="" class="company-logo">
            <h2 id="companyName" class="company-name"></h2>
        </section>

        <!-- Login Card -->
        <main class="login-card" role="main">
            <header class="card-header">
                <h1 id="welcomeTitle"></h1>
                <p id="welcomeSubtitle"></p>
            </header>

            <!-- Error Container -->
            <div id="errorContainer" class="error-container" role="alert"></div>

            <!-- Login Form -->
            <form id="loginForm" method="POST" action="/names.nsf?Login">
                <input type="hidden" name="RedirectTo" id="RedirectTo" value="/">
                <input type="hidden" name="reasontype" id="reasontype" value="">

                <!-- Username -->
                <div class="form-group">
                    <label for="Username" id="usernameLabel"></label>
                    <div class="input-wrapper">
                        <i data-lucide="user" class="input-icon"></i>
                        <input type="text" id="Username" name="Username" required autocomplete="username">
                    </div>
                </div>

                <!-- Password -->
                <div class="form-group">
                    <label for="Password" id="passwordLabel"></label>
                    <div class="input-wrapper password-wrapper">
                        <i data-lucide="lock" class="input-icon"></i>
                        <input type="password" id="Password" name="Password" required autocomplete="current-password">
                        <button type="button" id="passwordToggle" class="password-toggle">
                            <i data-lucide="eye" id="eyeIcon"></i>
                        </button>
                    </div>
                </div>

                <!-- Password Strength (injected by JS) -->
                <!-- CAPTCHA (injected by JS) -->

                <!-- Options Row -->
                <div class="options-row">
                    <label class="remember-me" id="rememberMeContainer">
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        <span id="rememberMeLabel"></span>
                    </label>
                    <a href="#" id="forgotPasswordLink"></a>
                </div>

                <!-- Submit Button -->
                <button type="submit" id="submitBtn" class="submit-btn">
                    <span id="submitBtnText"></span>
                    <div class="spinner" id="submitSpinner"></div>
                </button>
            </form>

            <!-- SSO Buttons (injected by JS) -->
            
            <!-- Security Notice -->
            <div class="security-notice" id="securityNotice">
                <i data-lucide="shield-check"></i>
                <span id="securityNoticeText"></span>
            </div>
        </main>

        <!-- Footer -->
        <footer class="login-footer">
            <p id="footerText"></p>
            <div class="domino-badge" id="dominoBadge">
                <span>Powered by</span> <strong>HCL Domino</strong>
            </div>
        </footer>
    </div>

    <!-- Screen Reader Announcements -->
    <div id="screenReaderAnnouncements" class="screen-reader-text" aria-live="polite"></div>

    <script src="js/login.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    </script>
</body>
</html>
```

---

## PREVIEW SERVER (preview-server.js)

Create Node.js Express server for local testing:

```javascript
// Features:
// - Serve static files
// - Mock /names.nsf?Login endpoint
// - Simulate different reasontype scenarios
// - Test credentials: user/password (success), anything else (fail)
// - Session simulation
// - Port 3000 default
```

---

## SAMPLE THEME CONFIGURATIONS

Create 4 sample config files in /samples/:

1. **config-corporate-blue.js** - Professional blue theme
2. **config-modern-gradient.js** - Purple/pink gradient
3. **config-dark-elegant.js** - Dark mode default
4. **config-healthcare.js** - Clean medical/healthcare theme

---

## DEPLOYMENT GUIDE

Document complete Domino deployment:

1. Creating DOMCFG.NSF from template
2. Setting ACL (Anonymous: Reader)
3. Creating CustomLoginForm in Designer
4. Importing file resources (CSS, JS, images)
5. Configuring Sign In Form Mapping
6. Restarting HTTP task
7. Testing and troubleshooting
8. Feature compatibility matrix (client-side vs backend required)
9. External dependencies and self-hosting options

---

## ACCESSIBILITY REQUIREMENTS

Implement WCAG 2.1 AA compliance:
- All form fields have associated labels
- ARIA labels on interactive elements
- Keyboard navigable (Tab, Enter, Escape)
- Screen reader announcements for dynamic content
- Color contrast 4.5:1 minimum
- Focus indicators visible
- Reduced motion support
- RTL text direction support

---

## BROWSER SUPPORT

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari/Chrome
- IE11 graceful degradation

---

## IMPORTANT NOTES

1. All features must be toggleable via config.js
2. No server-side code required for client-side features
3. All external dependencies (fonts, icons) must have fallbacks
4. localStorage used for preferences (theme, language, username)
5. Form submission goes to standard Domino endpoint
6. All client-side validation is for UX only (server validates)
7. Use semantic HTML and proper ARIA attributes
8. Comments in code for Domino-specific path changes
```

---

## VERSION INFO

**Version:** 2.0.0  
**Created:** April 2026  
**Target Platform:** HCL Domino 12.x / 14.x

---

*This prompt contains all specifications needed to recreate the complete HCL Domino Custom Login Page application.*
