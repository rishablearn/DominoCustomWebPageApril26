/**
 * Sample Configuration: Healthcare Theme
 * =======================================
 * Clean, professional theme for medical/healthcare organizations
 */

const DominoLoginConfig = {
    branding: {
        companyName: "MedCare Health Systems",
        logoUrl: "",
        logoAlt: "MedCare Logo",
        logoMaxWidth: 180,
        pageTitle: "MedCare - Secure Portal Login",
        welcomeTitle: "MedCare Portal",
        welcomeSubtitle: "Secure access to patient records and services",
        footerText: "© 2026 MedCare Health Systems. HIPAA Compliant.",
        showDominoBadge: true
    },
    
    theme: {
        primaryColor: "#0891b2",
        primaryColorHover: "#0e7490",
        secondaryColor: "#06b6d4",
        backgroundGradientStart: "#0e7490",
        backgroundGradientEnd: "#155e75",
        backgroundSolid: null,
        backgroundImage: "",
        backgroundOverlayOpacity: 0.5,
        cardBackground: "rgba(255, 255, 255, 0.98)",
        cardBorderRadius: 12,
        cardShadow: "medium",
        textPrimary: "#164e63",
        textSecondary: "#64748b",
        textLight: "#ffffff",
        inputBackground: "#f0fdfa",
        inputBorder: "#99f6e4",
        inputBorderFocus: "#0891b2",
        inputBorderRadius: 8,
        errorColor: "#dc2626",
        successColor: "#059669",
        warningColor: "#d97706"
    },
    
    form: {
        usernameLabel: "User ID",
        usernamePlaceholder: "Enter your user ID",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButtonText: "Secure Login",
        showRememberMe: false,
        rememberMeLabel: "Remember me",
        showPasswordToggle: true,
        showForgotPassword: true,
        forgotPasswordUrl: "/ithelp",
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
            loginForm: "MedCare Secure Login Form",
            usernameInput: "Enter your user ID",
            passwordInput: "Enter your password",
            submitButton: "Log in securely",
            passwordToggle: "Toggle password visibility"
        }
    },
    
    errorMessages: {
        0: "",
        1: "Access denied. Contact IT Help Desk at ext. 5555.",
        2: "Invalid user ID or password. Please try again.",
        3: "Session timeout for security. Please log in again.",
        4: "Authentication service temporarily unavailable.",
        generic: "Login error. Please contact IT Help Desk."
    },
    
    effects: {
        enableAnimations: true,
        animationDuration: 200,
        backgroundAnimation: true,
        glassMorphism: false,
        floatingLabels: false
    },
    
    features: {
        showHelpLink: true,
        helpLinkUrl: "tel:+18001234567",
        helpLinkText: "IT Help Desk: 1-800-123-4567",
        showSecurityNotice: true,
        securityNoticeText: "HIPAA Compliant - 256-bit Encryption",
        customHtmlBelow: "",
        keyboardShortcuts: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DominoLoginConfig;
}
