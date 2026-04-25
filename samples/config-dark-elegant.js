/**
 * Sample Configuration: Dark Elegant Theme
 * =========================================
 * Sophisticated dark theme for premium feel
 */

const DominoLoginConfig = {
    branding: {
        companyName: "Premium Services Ltd",
        logoUrl: "",
        logoAlt: "Premium Services Logo",
        logoMaxWidth: 200,
        pageTitle: "Premium Services - Secure Access",
        welcomeTitle: "Welcome Back",
        welcomeSubtitle: "Access your exclusive dashboard",
        footerText: "© 2026 Premium Services Ltd. Excellence in every detail.",
        showDominoBadge: false
    },
    
    theme: {
        primaryColor: "#f59e0b",
        primaryColorHover: "#d97706",
        secondaryColor: "#fbbf24",
        backgroundGradientStart: "#0f172a",
        backgroundGradientEnd: "#1e293b",
        backgroundSolid: null,
        backgroundImage: "",
        backgroundOverlayOpacity: 0.7,
        cardBackground: "rgba(30, 41, 59, 0.95)",
        cardBorderRadius: 16,
        cardShadow: "heavy",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
        textLight: "#ffffff",
        inputBackground: "rgba(51, 65, 85, 0.8)",
        inputBorder: "#475569",
        inputBorderFocus: "#f59e0b",
        inputBorderRadius: 8,
        errorColor: "#f87171",
        successColor: "#4ade80",
        warningColor: "#fbbf24"
    },
    
    form: {
        usernameLabel: "Username",
        usernamePlaceholder: "Enter username",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter password",
        loginButtonText: "Access Dashboard",
        showRememberMe: true,
        rememberMeLabel: "Remember this device",
        showPasswordToggle: true,
        showForgotPassword: true,
        forgotPasswordUrl: "#forgot",
        forgotPasswordText: "Forgot credentials?",
        enableValidation: true,
        minPasswordLength: 1,
        showLoadingSpinner: true
    },
    
    domino: {
        loginActionUrl: "/names.nsf?Login",
        defaultRedirectTo: "/",
        formMethod: "POST"
    },
    
    accessibility: {
        language: "en",
        ariaLabels: {
            loginForm: "Secure Login Form",
            usernameInput: "Enter your username",
            passwordInput: "Enter your password",
            submitButton: "Access your dashboard",
            passwordToggle: "Show or hide password"
        }
    },
    
    errorMessages: {
        0: "",
        1: "Access restricted. Please contact your account manager.",
        2: "Invalid credentials. Please verify and try again.",
        3: "Your session has expired for security. Please re-authenticate.",
        4: "Server synchronization in progress. Please wait a moment.",
        generic: "An error occurred. Our team has been notified."
    },
    
    effects: {
        enableAnimations: true,
        animationDuration: 350,
        backgroundAnimation: false,
        glassMorphism: false,
        floatingLabels: false
    },
    
    features: {
        showHelpLink: true,
        helpLinkUrl: "#support",
        helpLinkText: "Contact Concierge",
        showSecurityNotice: true,
        securityNoticeText: "Bank-grade security enabled",
        customHtmlBelow: "",
        keyboardShortcuts: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DominoLoginConfig;
}
