/**
 * DominoCustomWebPageApril26 - Configuration File
 * ================================================
 * 
 * This configuration file allows you to easily customize the HCL Domino
 * login page without modifying the core HTML, CSS, or JavaScript files.
 * 
 * Simply modify the values below and the login page will automatically
 * reflect your changes.
 * 
 * @version 1.0.0
 * @date April 2026
 */

const DominoLoginConfig = {
    
    // ============================================================
    // BRANDING CONFIGURATION
    // ============================================================
    branding: {
        // Company/Organization name displayed on the login page
        companyName: "Your Company Name",
        
        // --------------------------------------------------------
        // LOGO CONFIGURATION - Supports SVG, PNG, JPG, WEBP, GIF
        // --------------------------------------------------------
        
        // Primary logo URL (relative or absolute URL)
        // Supported formats: SVG (recommended), PNG, JPG, WEBP, GIF
        // Leave empty string "" to hide logo and show company name only
        logoUrl: "images/logo-placeholder.svg",
        
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
        
        // Show "Powered by HCL Domino" badge
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
    // ADDITIONAL FEATURES
    // ============================================================
    features: {
        // Show help/support link
        showHelpLink: false,
        helpLinkUrl: "#",
        helpLinkText: "Need help?",
        
        // Show security notice
        showSecurityNotice: true,
        securityNoticeText: "This is a secure connection",
        
        // Custom HTML to inject below the form (use with caution)
        customHtmlBelow: "",
        
        // Enable keyboard shortcuts
        keyboardShortcuts: true
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DominoLoginConfig;
}
