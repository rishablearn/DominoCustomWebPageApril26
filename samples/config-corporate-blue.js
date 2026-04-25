/**
 * Sample Configuration: Corporate Blue Theme
 * ===========================================
 * Professional blue theme suitable for enterprise environments
 */

const DominoLoginConfig = {
    branding: {
        companyName: "Acme Corporation",
        logoUrl: "", // Add your logo path here
        logoAlt: "Acme Corporation Logo",
        logoMaxWidth: 180,
        pageTitle: "Acme Corporation - Secure Login",
        welcomeTitle: "Welcome to Acme Portal",
        welcomeSubtitle: "Enter your credentials to access the system",
        footerText: "© 2026 Acme Corporation. All rights reserved.",
        showDominoBadge: true
    },
    
    theme: {
        primaryColor: "#1e40af",
        primaryColorHover: "#1e3a8a",
        secondaryColor: "#3b82f6",
        backgroundGradientStart: "#1e3a8a",
        backgroundGradientEnd: "#312e81",
        backgroundSolid: null,
        backgroundImage: "",
        backgroundOverlayOpacity: 0.6,
        cardBackground: "rgba(255, 255, 255, 0.98)",
        cardBorderRadius: 12,
        cardShadow: "heavy",
        textPrimary: "#1e293b",
        textSecondary: "#64748b",
        textLight: "#ffffff",
        inputBackground: "#f1f5f9",
        inputBorder: "#cbd5e1",
        inputBorderFocus: "#1e40af",
        inputBorderRadius: 6,
        errorColor: "#dc2626",
        successColor: "#16a34a",
        warningColor: "#ca8a04"
    },
    
    form: {
        usernameLabel: "Employee ID",
        usernamePlaceholder: "Enter your employee ID",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButtonText: "Sign In",
        showRememberMe: true,
        rememberMeLabel: "Keep me signed in",
        showPasswordToggle: true,
        showForgotPassword: true,
        forgotPasswordUrl: "/help/password-reset",
        forgotPasswordText: "Forgot password?",
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
            loginForm: "Employee Login Form",
            usernameInput: "Enter your employee ID",
            passwordInput: "Enter your password",
            submitButton: "Sign in to portal",
            passwordToggle: "Show or hide password"
        }
    },
    
    errorMessages: {
        0: "",
        1: "Access denied. Please contact IT Support for assistance.",
        2: "Invalid employee ID or password. Please try again.",
        3: "Your session has timed out. Please sign in again.",
        4: "Authentication server error. Please try again later.",
        generic: "An error occurred. Please contact IT Support."
    },
    
    effects: {
        enableAnimations: true,
        animationDuration: 250,
        backgroundAnimation: true,
        glassMorphism: false,
        floatingLabels: false
    },
    
    features: {
        showHelpLink: true,
        helpLinkUrl: "/help",
        helpLinkText: "Contact IT Support",
        showSecurityNotice: true,
        securityNoticeText: "256-bit SSL Encrypted Connection",
        customHtmlBelow: "",
        keyboardShortcuts: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DominoLoginConfig;
}
