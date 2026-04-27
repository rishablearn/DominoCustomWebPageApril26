/**
 * DominoCustomWebPageApril26 - Configuration File
 * ================================================
 * 
 * This configuration file allows you to easily customize the HCL Domino
 * login page without modifying the core HTML, CSS, or JavaScript files.
 * 
 * All features can be toggled ON/OFF using simple boolean switches.
 * 
 * @version 2.0.0
 * @date April 2026
 */

const DominoLoginConfig = {
    
    // ============================================================
    // FEATURE TOGGLES (Master Switches)
    // Set to true to enable, false to disable each feature
    // ============================================================
    features: {
        // Security Features
        enableMFA: false,                    // Multi-Factor Authentication UI
        enableCaptcha: false,                // CAPTCHA verification
        enableAccessibleCaptcha: true,       // Audio CAPTCHA for visually impaired
        enablePasswordStrength: true,        // Password strength meter
        enableRateLimitWarning: true,        // Show warning after failed attempts
        enableWebAuthn: false,               // Passkey/Biometric authentication
        enableCSPNonce: false,               // Content Security Policy nonce
        
        // UX Features
        enableI18n: true,                    // Multi-language support
        enableRTL: true,                     // Right-to-left language support
        enableThemeSwitcher: true,           // Light/Dark mode toggle
        enableSessionWarning: true,          // Session timeout warning
        enableOfflineDetection: true,        // Network status indicator
        enableRememberUsername: true,        // Remember last username
        enableAutoFocus: true,               // Auto-focus first field
        
        // Enterprise Features
        enableSSOButtons: false,             // Social/Enterprise SSO login
        enableDomainSelector: false,         // Domain/Tenant selection
        enableCustomFields: false,           // Additional custom fields
        enableAnalytics: false,              // Analytics event hooks
        enableABTesting: false,              // A/B testing variants
        
        // Accessibility Features
        enableScreenReaderAnnounce: true,    // Screen reader announcements
        enableHighContrast: true,            // High contrast mode support
        enableReducedMotion: true,           // Respect prefers-reduced-motion
        enableKeyboardShortcuts: true,       // Keyboard shortcuts
        enableFocusIndicators: true,         // Enhanced focus indicators
        
        // Visual Features
        enableAnimations: true,              // UI animations
        enableBackgroundAnimation: true,     // Floating shapes background
        enableGlassMorphism: false,          // Glass effect on card
        enableLoadingSpinner: true,          // Submit button spinner
        enablePasswordToggle: true,          // Show/hide password
        
        // Additional Features
        showRememberMe: true,                // Remember me checkbox
        showForgotPassword: true,            // Forgot password link
        showHelpLink: false,                 // Help/support link
        showSecurityNotice: true,            // Secure connection notice
        showDominoBadge: true,               // Powered by Domino badge
        showCookieConsent: false,            // GDPR cookie consent
        enableDebugMode: false               // Debug information display
    },
    
    // ============================================================
    // BRANDING CONFIGURATION
    // ============================================================
    branding: {
        // Company/Organization name displayed on the login page
        companyName: "Your Company Name",
        
        // --------------------------------------------------------
        // LOGO CONFIGURATION
        // Domino supports: PNG, JPG, GIF (NO SVG!)
        // --------------------------------------------------------
        
        // Primary logo URL (relative or absolute URL)
        // 
        // FOR DOMINO DEPLOYMENT:
        //   - Use: "/domcfg.nsf/logo.png" (no subfolders!)
        //   - Domino does NOT support SVG - use PNG, JPG, or GIF only
        //   - Leave empty "" to hide logo and show company name only
        //
        // Supported formats: PNG, JPG, WEBP, GIF (NO SVG in Domino!)
        logoUrl: "",  // Set to "/domcfg.nsf/logo.png" for Domino
        
        // Fallback logo URL (used if primary fails to load)
        // Useful for providing PNG fallback for SVG logos
        logoFallbackUrl: "",
        
        // Logo format hint - helps optimize loading
        // Options: "svg", "png", "jpg", "webp", "gif", "auto"
        logoFormat: "auto",
        
        // Alternative text for the logo (accessibility - WCAG required)
        logoAlt: "Company Logo",
        
        // Logo sizing options
        logo: {
            // Maximum width in pixels (applies to all formats)
            maxWidth: 200,
            
            // Maximum height in pixels (set to null for auto)
            maxHeight: null,
            
            // Specific width (overrides maxWidth if set)
            width: null,
            
            // Specific height (overrides maxHeight if set)
            height: null,
            
            // Object-fit behavior for raster images (PNG, JPG, etc.)
            // Options: "contain", "cover", "fill", "scale-down", "none"
            objectFit: "contain",
            
            // Padding around logo in pixels
            padding: 0,
            
            // Background color behind logo (useful for transparent PNGs)
            // Set to null for transparent, or use color code
            backgroundColor: null,
            
            // Border radius in pixels (0 for square corners)
            borderRadius: 0,
            
            // Add drop shadow to logo
            shadow: false,
            
            // Invert logo colors for dark backgrounds (useful for SVGs)
            invertOnDarkMode: false
        },
        
        // Dark mode logo variant (used when system is in dark mode)
        // Leave empty to use primary logo
        logoDarkModeUrl: "",
        
        // High-DPI/Retina logo (2x resolution for PNG/JPG)
        // Automatically used on high-DPI screens
        logoRetina2xUrl: "",
        
        // Logo loading behavior
        // Options: "eager" (load immediately), "lazy" (load when visible)
        logoLoading: "eager",
        
        // Login page title (shown in browser tab)
        pageTitle: "Secure Login - HCL Domino",
        
        // Welcome message displayed above the login form
        welcomeTitle: "Welcome Back",
        
        // Subtitle/description below the welcome message
        welcomeSubtitle: "Please sign in to access your applications",
        
        // Footer text (copyright, etc.)
        footerText: "© 2026 Your Company Name. All rights reserved.",
        
        // Show "Powered by HCL Domino" badge (legacy - use features.showDominoBadge)
        showDominoBadge: true
    },
    
    // ============================================================
    // COLOR THEME CONFIGURATION
    // ============================================================
    theme: {
        // Primary brand color (used for buttons, links, accents)
        primaryColor: "#0066CC",
        
        // Primary color hover state
        primaryColorHover: "#0052A3",
        
        // Secondary accent color
        secondaryColor: "#00A3E0",
        
        // Background gradient start color
        backgroundGradientStart: "#667eea",
        
        // Background gradient end color
        backgroundGradientEnd: "#764ba2",
        
        // Alternative: Use solid background color instead of gradient
        // Set to null to use gradient, or provide a color code
        backgroundSolid: null,
        
        // Background image URL (overrides gradient/solid if provided)
        // Leave empty string "" to use color background
        backgroundImage: "",
        
        // Background overlay opacity (0.0 to 1.0) - darkens background image
        backgroundOverlayOpacity: 0.5,
        
        // Login card background color
        cardBackground: "rgba(255, 255, 255, 0.95)",
        
        // Login card border radius in pixels
        cardBorderRadius: 16,
        
        // Login card shadow intensity (light, medium, heavy)
        cardShadow: "heavy",
        
        // Text colors
        textPrimary: "#1a1a2e",
        textSecondary: "#6c757d",
        textLight: "#ffffff",
        
        // Input field styling
        inputBackground: "#f8f9fa",
        inputBorder: "#dee2e6",
        inputBorderFocus: "#0066CC",
        inputBorderRadius: 8,
        
        // Error message color
        errorColor: "#dc3545",
        
        // Success color
        successColor: "#28a745",
        
        // Warning color
        warningColor: "#ffc107"
    },
    
    // ============================================================
    // FORM CONFIGURATION
    // ============================================================
    form: {
        // Username field label
        usernameLabel: "Username",
        
        // Username field placeholder
        usernamePlaceholder: "Enter your username",
        
        // Password field label
        passwordLabel: "Password",
        
        // Password field placeholder
        passwordPlaceholder: "Enter your password",
        
        // Login button text
        loginButtonText: "Sign In",
        
        // Show "Remember Me" checkbox
        showRememberMe: true,
        
        // "Remember Me" label text
        rememberMeLabel: "Remember me on this device",
        
        // Show password visibility toggle
        showPasswordToggle: true,
        
        // Show forgot password link
        showForgotPassword: true,
        
        // Forgot password link URL
        forgotPasswordUrl: "#",
        
        // Forgot password link text
        forgotPasswordText: "Forgot your password?",
        
        // Enable form validation
        enableValidation: true,
        
        // Minimum password length for validation (0 to disable)
        minPasswordLength: 1,
        
        // Show loading spinner on submit
        showLoadingSpinner: true
    },
    
    // ============================================================
    // DOMINO SERVER CONFIGURATION
    // ============================================================
    domino: {
        // Login form action URL (Domino session authentication endpoint)
        loginActionUrl: "/names.nsf?Login",
        
        // Redirect URL after successful login
        // Use %%RedirectTo%% placeholder for dynamic redirect
        defaultRedirectTo: "/",
        
        // Method for form submission
        formMethod: "POST"
    },
    
    // ============================================================
    // ACCESSIBILITY & LOCALIZATION
    // ============================================================
    accessibility: {
        // Language code for the page
        language: "en",
        
        // ARIA labels
        ariaLabels: {
            loginForm: "Login Form",
            usernameInput: "Enter your username",
            passwordInput: "Enter your password",
            submitButton: "Submit login credentials",
            passwordToggle: "Toggle password visibility"
        }
    },
    
    // ============================================================
    // ERROR MESSAGES (Mapped to Domino reasontype values)
    // ============================================================
    errorMessages: {
        // reasontype 0: Initial prompt (no error)
        0: "",
        
        // reasontype 1: Not authorized to access database
        1: "You are not authorized to access this application. Please sign in with valid credentials.",
        
        // reasontype 2: Invalid username or password
        2: "Invalid username or password. Please try again.",
        
        // reasontype 3: Session expired
        3: "Your session has expired. Please sign in again.",
        
        // reasontype 4: Server timing issue (SSO)
        4: "A timing issue occurred with the login server. Please try again.",
        
        // Generic/fallback error message
        generic: "An error occurred. Please try again."
    },
    
    // ============================================================
    // ANIMATION & EFFECTS
    // ============================================================
    effects: {
        // Enable animations
        enableAnimations: true,
        
        // Animation duration in milliseconds
        animationDuration: 300,
        
        // Enable background animation (subtle movement)
        backgroundAnimation: true,
        
        // Enable glass morphism effect on card (use with lighter backgrounds)
        glassMorphism: false,
        
        // Enable floating labels on inputs
        floatingLabels: false
    },
    
    // ============================================================
    // INTERNATIONALIZATION (i18n) CONFIGURATION
    // ============================================================
    i18n: {
        // Default language code (ISO 639-1)
        defaultLanguage: "en",
        
        // Auto-detect browser language
        autoDetect: true,
        
        // Available languages (add more as needed)
        // Each language requires corresponding translations in i18n/[code].js
        availableLanguages: [
            { code: "en", name: "English", dir: "ltr" },
            { code: "es", name: "Español", dir: "ltr" },
            { code: "fr", name: "Français", dir: "ltr" },
            { code: "de", name: "Deutsch", dir: "ltr" },
            { code: "pt", name: "Português", dir: "ltr" },
            { code: "zh", name: "中文", dir: "ltr" },
            { code: "ja", name: "日本語", dir: "ltr" },
            { code: "ar", name: "العربية", dir: "rtl" },
            { code: "he", name: "עברית", dir: "rtl" },
            { code: "hi", name: "हिन्दी", dir: "ltr" }
        ],
        
        // Show language selector dropdown
        showLanguageSelector: true,
        
        // Save language preference in localStorage
        rememberLanguage: true
    },
    
    // ============================================================
    // MULTI-FACTOR AUTHENTICATION (MFA) CONFIGURATION
    // ============================================================
    mfa: {
        // MFA verification endpoint
        verifyEndpoint: "/api/mfa/verify",
        
        // Supported MFA methods
        methods: {
            totp: true,         // Time-based OTP (Google Authenticator, etc.)
            sms: false,         // SMS verification
            email: false,       // Email verification
            push: false,        // Push notification
            webauthn: false     // Security key / biometric
        },
        
        // OTP code length
        codeLength: 6,
        
        // Allow "Remember this device" option
        allowRememberDevice: true,
        rememberDeviceDays: 30,
        
        // MFA page title
        mfaTitle: "Two-Factor Authentication",
        mfaSubtitle: "Enter the verification code from your authenticator app"
    },
    
    // ============================================================
    // CAPTCHA CONFIGURATION
    // ============================================================
    captcha: {
        // CAPTCHA type: "simple", "math", "image", "recaptcha", "hcaptcha"
        type: "math",
        
        // reCAPTCHA v2/v3 site key (if using reCAPTCHA)
        recaptchaSiteKey: "",
        
        // hCaptcha site key (if using hCaptcha)
        hcaptchaSiteKey: "",
        
        // Simple CAPTCHA settings
        simple: {
            length: 6,                    // Number of characters
            includeNumbers: true,
            includeLetters: true,
            caseSensitive: false
        },
        
        // Math CAPTCHA settings (e.g., "5 + 3 = ?")
        math: {
            maxNumber: 10,                // Max number in equation
            operations: ["+", "-"]        // Allowed operations
        },
        
        // Accessible CAPTCHA for visually impaired
        accessible: {
            enableAudio: true,            // Audio CAPTCHA option
            audioEndpoint: "/api/captcha/audio",
            enableTextAlternative: true,  // Text description
            announceToScreenReader: true
        },
        
        // CAPTCHA display settings
        showAfterFailedAttempts: 3,       // Show after N failed attempts (0 = always)
        refreshButtonText: "New CAPTCHA",
        audioButtonText: "Listen to CAPTCHA",
        placeholderText: "Enter the code above"
    },
    
    // ============================================================
    // PASSWORD STRENGTH CONFIGURATION
    // ============================================================
    passwordStrength: {
        // Minimum requirements
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        
        // Special characters allowed
        specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
        
        // Show strength meter
        showMeter: true,
        
        // Show requirement checklist
        showRequirements: true,
        
        // Strength levels
        levels: {
            weak: { label: "Weak", color: "#dc3545", minScore: 0 },
            fair: { label: "Fair", color: "#ffc107", minScore: 25 },
            good: { label: "Good", color: "#17a2b8", minScore: 50 },
            strong: { label: "Strong", color: "#28a745", minScore: 75 },
            excellent: { label: "Excellent", color: "#20c997", minScore: 90 }
        },
        
        // Check against common passwords
        checkCommonPasswords: true,
        
        // Prevent username in password
        preventUsernameInPassword: true
    },
    
    // ============================================================
    // SSO / SOCIAL LOGIN CONFIGURATION
    // ============================================================
    sso: {
        // Show SSO section separator text
        separatorText: "or sign in with",
        
        // SSO providers (enable/disable and configure each)
        providers: {
            saml: {
                enabled: false,
                label: "Enterprise SSO",
                icon: "building-2",
                url: "/saml/login",
                buttonStyle: "outline"      // "filled" or "outline"
            },
            microsoft: {
                enabled: false,
                label: "Microsoft",
                icon: "microsoft",
                url: "/oauth/microsoft",
                clientId: "",
                buttonStyle: "outline"
            },
            google: {
                enabled: false,
                label: "Google",
                icon: "google",
                url: "/oauth/google",
                clientId: "",
                buttonStyle: "outline"
            },
            apple: {
                enabled: false,
                label: "Apple",
                icon: "apple",
                url: "/oauth/apple",
                clientId: "",
                buttonStyle: "outline"
            },
            github: {
                enabled: false,
                label: "GitHub",
                icon: "github",
                url: "/oauth/github",
                clientId: "",
                buttonStyle: "outline"
            },
            linkedin: {
                enabled: false,
                label: "LinkedIn",
                icon: "linkedin",
                url: "/oauth/linkedin",
                clientId: "",
                buttonStyle: "outline"
            }
        }
    },
    
    // ============================================================
    // DOMAIN / TENANT SELECTOR CONFIGURATION
    // ============================================================
    domain: {
        // Show domain selector dropdown
        showSelector: false,
        
        // Label for domain field
        label: "Domain",
        
        // Placeholder text
        placeholder: "Select your domain",
        
        // Available domains
        domains: [
            { id: "default", name: "Default", server: "/names.nsf" },
            { id: "corp", name: "Corporate", server: "/corp/names.nsf" },
            { id: "partner", name: "Partner Portal", server: "/partner/names.nsf" }
        ],
        
        // Remember selected domain
        rememberDomain: true,
        
        // Domain field position: "above-username", "below-username", "above-form"
        position: "above-username"
    },
    
    // ============================================================
    // CUSTOM FIELDS CONFIGURATION
    // ============================================================
    customFields: {
        // Additional fields to display on login form
        fields: [
            // Example: Employee ID field
            // {
            //     id: "employeeId",
            //     name: "EmployeeID",
            //     type: "text",
            //     label: "Employee ID",
            //     placeholder: "Enter your employee ID",
            //     required: false,
            //     position: "after-username",
            //     icon: "badge",
            //     validation: {
            //         pattern: "^[A-Z]{2}[0-9]{6}$",
            //         message: "Format: AA123456"
            //     }
            // }
        ]
    },
    
    // ============================================================
    // SESSION WARNING CONFIGURATION
    // ============================================================
    session: {
        // Warning before session expires (seconds)
        warningTime: 300,           // 5 minutes before expiry
        
        // Session timeout (seconds) - should match Domino setting
        timeout: 1800,              // 30 minutes
        
        // Show countdown timer
        showCountdown: true,
        
        // Allow extend session
        allowExtend: true,
        
        // Warning message
        warningTitle: "Session Expiring",
        warningMessage: "Your session will expire in {time}. Would you like to continue?",
        
        // Button labels
        extendButtonText: "Stay Signed In",
        logoutButtonText: "Sign Out"
    },
    
    // ============================================================
    // RATE LIMITING / LOCKOUT CONFIGURATION
    // ============================================================
    rateLimiting: {
        // Maximum failed attempts before warning
        maxAttempts: 5,
        
        // Lockout duration in seconds
        lockoutDuration: 300,       // 5 minutes
        
        // Show remaining attempts
        showRemainingAttempts: true,
        
        // Messages
        warningMessage: "Warning: {remaining} attempts remaining before account lockout.",
        lockoutMessage: "Too many failed attempts. Please try again in {time}."
    },
    
    // ============================================================
    // WEBAUTHN / PASSKEY CONFIGURATION
    // ============================================================
    webauthn: {
        // Relying Party name (your organization)
        rpName: "Your Company",
        
        // Relying Party ID (your domain)
        rpId: window.location.hostname,
        
        // User verification requirement: "required", "preferred", "discouraged"
        userVerification: "preferred",
        
        // Authenticator attachment: "platform", "cross-platform", null (any)
        authenticatorAttachment: null,
        
        // Resident key requirement: "required", "preferred", "discouraged"
        residentKey: "preferred",
        
        // Registration endpoint
        registerEndpoint: "/api/webauthn/register",
        
        // Authentication endpoint
        authEndpoint: "/api/webauthn/authenticate",
        
        // Button text
        buttonText: "Sign in with Passkey",
        
        // Show passkey option prominently
        prominent: true
    },
    
    // ============================================================
    // ANALYTICS CONFIGURATION
    // ============================================================
    analytics: {
        // Analytics provider: "google", "adobe", "custom", "none"
        provider: "none",
        
        // Google Analytics 4 Measurement ID
        gaId: "",
        
        // Adobe Analytics tracking server
        adobeServer: "",
        
        // Custom analytics endpoint
        customEndpoint: "",
        
        // Events to track
        events: {
            pageView: true,
            loginAttempt: true,
            loginSuccess: true,
            loginFailure: true,
            mfaPrompt: true,
            passwordReset: true,
            ssoClick: true,
            languageChange: true,
            themeChange: true
        },
        
        // Include user agent in events
        includeUserAgent: false,
        
        // Include timestamp in events
        includeTimestamp: true
    },
    
    // ============================================================
    // A/B TESTING CONFIGURATION
    // ============================================================
    abTesting: {
        // Enable A/B testing
        enabled: false,
        
        // Test ID
        testId: "",
        
        // Variants
        variants: [
            { id: "control", weight: 50 },
            { id: "variant-a", weight: 50 }
        ],
        
        // Variant-specific overrides
        overrides: {
            // "variant-a": {
            //     "theme.primaryColor": "#8b5cf6",
            //     "branding.welcomeTitle": "Hello!"
            // }
        }
    },
    
    // ============================================================
    // COOKIE CONSENT (GDPR) CONFIGURATION
    // ============================================================
    cookieConsent: {
        // Consent message
        message: "We use cookies to ensure you get the best experience on our login page.",
        
        // Accept button text
        acceptText: "Accept",
        
        // Decline button text (set to "" to hide)
        declineText: "Decline",
        
        // Learn more link
        learnMoreUrl: "/privacy-policy",
        learnMoreText: "Learn more",
        
        // Cookie name for storing consent
        cookieName: "login_cookie_consent",
        
        // Consent expiry in days
        expiryDays: 365,
        
        // Position: "bottom", "top"
        position: "bottom"
    },
    
    // ============================================================
    // ADDITIONAL UI CONFIGURATION
    // ============================================================
    ui: {
        // Help link settings
        helpLinkUrl: "#",
        helpLinkText: "Need help?",
        
        // Security notice text
        securityNoticeText: "This is a secure connection",
        
        // Custom HTML injection (use with caution)
        customHtmlAbove: "",
        customHtmlBelow: "",
        
        // Theme switcher settings
        themeSwitcher: {
            position: "top-right",  // "top-right", "top-left", "bottom-right", "bottom-left"
            showLabel: false,
            lightLabel: "Light",
            darkLabel: "Dark",
            autoLabel: "Auto"
        },
        
        // Language selector settings
        languageSelector: {
            position: "top-left",   // "top-right", "top-left", "footer"
            showFlag: true,
            showName: true
        },
        
        // Offline indicator settings
        offline: {
            message: "You appear to be offline. Please check your connection.",
            showIcon: true,
            position: "top"         // "top", "bottom"
        }
    }
};

// ============================================================
// TRANSLATIONS (Default English - add more in i18n folder)
// ============================================================
const DominoLoginTranslations = {
    en: {
        // Branding
        welcomeTitle: "Welcome Back",
        welcomeSubtitle: "Please sign in to access your applications",
        
        // Form labels
        usernameLabel: "Username",
        usernamePlaceholder: "Enter your username",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButton: "Sign In",
        signingIn: "Signing In...",
        
        // Options
        rememberMe: "Remember me on this device",
        forgotPassword: "Forgot your password?",
        
        // MFA
        mfaTitle: "Two-Factor Authentication",
        mfaSubtitle: "Enter the verification code",
        mfaCodePlaceholder: "Enter 6-digit code",
        mfaVerifyButton: "Verify",
        mfaRememberDevice: "Remember this device for 30 days",
        mfaResendCode: "Resend code",
        mfaTryAnotherMethod: "Try another method",
        
        // CAPTCHA
        captchaLabel: "Security Verification",
        captchaPlaceholder: "Enter the code above",
        captchaRefresh: "New code",
        captchaAudio: "Listen",
        captchaAudioPlaying: "Playing audio...",
        captchaInstructions: "Please enter the characters shown in the image",
        captchaAudioInstructions: "Listen to the audio and type what you hear",
        
        // Password strength
        passwordStrength: "Password Strength",
        passwordWeak: "Weak",
        passwordFair: "Fair",
        passwordGood: "Good",
        passwordStrong: "Strong",
        passwordExcellent: "Excellent",
        passwordRequirements: "Password requirements:",
        passwordMinLength: "At least {n} characters",
        passwordUppercase: "One uppercase letter",
        passwordLowercase: "One lowercase letter",
        passwordNumber: "One number",
        passwordSpecial: "One special character",
        
        // SSO
        ssoSeparator: "or sign in with",
        
        // Domain
        domainLabel: "Domain",
        domainPlaceholder: "Select your domain",
        
        // Session
        sessionWarningTitle: "Session Expiring",
        sessionWarningMessage: "Your session will expire in {time}.",
        sessionExtendButton: "Stay Signed In",
        sessionLogoutButton: "Sign Out",
        
        // Rate limiting
        attemptsRemaining: "{n} attempts remaining",
        accountLocked: "Account temporarily locked. Try again in {time}.",
        
        // Errors
        errorRequired: "This field is required",
        errorInvalidUsername: "Please enter a valid username",
        errorInvalidPassword: "Password does not meet requirements",
        errorInvalidCaptcha: "Incorrect verification code",
        errorInvalidMfa: "Invalid verification code",
        errorGeneric: "An error occurred. Please try again.",
        error1: "You are not authorized to access this application.",
        error2: "Invalid username or password. Please try again.",
        error3: "Your session has expired. Please sign in again.",
        error4: "A timing issue occurred. Please try again.",
        
        // WebAuthn
        webauthnButton: "Sign in with Passkey",
        webauthnRegister: "Set up Passkey",
        webauthnError: "Passkey authentication failed",
        
        // Accessibility
        togglePassword: "Toggle password visibility",
        showPassword: "Show password",
        hidePassword: "Hide password",
        loading: "Loading...",
        
        // Theme
        lightMode: "Light mode",
        darkMode: "Dark mode",
        autoMode: "System default",
        
        // Offline
        offlineMessage: "You appear to be offline",
        
        // Cookie consent
        cookieMessage: "We use cookies to improve your experience.",
        cookieAccept: "Accept",
        cookieDecline: "Decline",
        cookieLearnMore: "Learn more",
        
        // Footer
        securityNotice: "This is a secure connection",
        poweredBy: "Powered by",
        
        // Misc
        required: "Required",
        optional: "Optional",
        or: "or",
        and: "and"
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DominoLoginConfig, DominoLoginTranslations };
}
