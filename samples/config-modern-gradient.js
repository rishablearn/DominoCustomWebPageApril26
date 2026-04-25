/**
 * Sample Configuration: Modern Gradient Theme
 * ============================================
 * Vibrant modern design with colorful gradient background
 */

const DominoLoginConfig = {
    branding: {
        companyName: "TechStart Inc",
        logoUrl: "",
        logoAlt: "TechStart Logo",
        logoMaxWidth: 160,
        pageTitle: "TechStart - Login",
        welcomeTitle: "Hello Again!",
        welcomeSubtitle: "We're excited to see you back",
        footerText: "© 2026 TechStart Inc. Built with innovation.",
        showDominoBadge: true
    },
    
    theme: {
        primaryColor: "#8b5cf6",
        primaryColorHover: "#7c3aed",
        secondaryColor: "#a78bfa",
        backgroundGradientStart: "#667eea",
        backgroundGradientEnd: "#764ba2",
        backgroundSolid: null,
        backgroundImage: "",
        backgroundOverlayOpacity: 0.5,
        cardBackground: "rgba(255, 255, 255, 0.95)",
        cardBorderRadius: 20,
        cardShadow: "heavy",
        textPrimary: "#1f2937",
        textSecondary: "#6b7280",
        textLight: "#ffffff",
        inputBackground: "#f9fafb",
        inputBorder: "#e5e7eb",
        inputBorderFocus: "#8b5cf6",
        inputBorderRadius: 10,
        errorColor: "#ef4444",
        successColor: "#10b981",
        warningColor: "#f59e0b"
    },
    
    form: {
        usernameLabel: "Email Address",
        usernamePlaceholder: "you@techstart.com",
        passwordLabel: "Password",
        passwordPlaceholder: "••••••••",
        loginButtonText: "Continue",
        showRememberMe: true,
        rememberMeLabel: "Stay signed in",
        showPasswordToggle: true,
        showForgotPassword: true,
        forgotPasswordUrl: "#reset",
        forgotPasswordText: "Reset password",
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
            loginForm: "Login Form",
            usernameInput: "Enter your email address",
            passwordInput: "Enter your password",
            submitButton: "Continue to dashboard",
            passwordToggle: "Toggle password visibility"
        }
    },
    
    errorMessages: {
        0: "",
        1: "You don't have access to this resource. Need help? Contact support.",
        2: "Hmm, that doesn't look right. Check your email and password.",
        3: "Session expired. Please sign in again.",
        4: "Server hiccup! Please try again in a moment.",
        generic: "Something went wrong. Please try again."
    },
    
    effects: {
        enableAnimations: true,
        animationDuration: 300,
        backgroundAnimation: true,
        glassMorphism: false,
        floatingLabels: false
    },
    
    features: {
        showHelpLink: false,
        helpLinkUrl: "#",
        helpLinkText: "Need help?",
        showSecurityNotice: true,
        securityNoticeText: "Your data is encrypted and secure",
        customHtmlBelow: "",
        keyboardShortcuts: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DominoLoginConfig;
}
