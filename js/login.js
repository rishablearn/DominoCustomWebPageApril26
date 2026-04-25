/**
 * DominoCustomWebPageApril26 - Login Page JavaScript
 * ===================================================
 * 
 * Handles configuration loading, form validation, theming,
 * and user interactions for the HCL Domino login page.
 * 
 * @version 1.0.0
 * @date April 2026
 */

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION LOADER
    // ============================================================
    
    /**
     * Applies configuration settings to the login page
     */
    function applyConfiguration() {
        if (typeof DominoLoginConfig === 'undefined') {
            console.warn('DominoLoginConfig not found. Using default settings.');
            return;
        }

        const config = DominoLoginConfig;

        // Apply branding
        applyBranding(config.branding);

        // Apply theme
        applyTheme(config.theme);

        // Apply form settings
        applyFormSettings(config.form);

        // Apply Domino settings
        applyDominoSettings(config.domino);

        // Apply accessibility settings
        applyAccessibility(config.accessibility);

        // Apply effects
        applyEffects(config.effects);

        // Apply additional features
        applyFeatures(config.features);

        // Handle error messages from Domino
        handleErrorMessages(config.errorMessages);
    }

    /**
     * Applies branding configuration
     */
    function applyBranding(branding) {
        if (!branding) return;

        // Page title
        if (branding.pageTitle) {
            document.title = branding.pageTitle;
            const pageTitleEl = document.getElementById('pageTitle');
            if (pageTitleEl) pageTitleEl.textContent = branding.pageTitle;
        }

        // Logo
        const logoEl = document.getElementById('companyLogo');
        const logoSection = document.getElementById('logoSection');
        if (logoEl && logoSection) {
            if (branding.logoUrl) {
                logoEl.src = branding.logoUrl;
                logoEl.alt = branding.logoAlt || 'Company Logo';
                if (branding.logoMaxWidth) {
                    logoEl.style.maxWidth = branding.logoMaxWidth + 'px';
                }
                logoSection.style.display = 'block';
            } else {
                logoSection.style.display = 'none';
            }
        }

        // Welcome text
        setTextContent('welcomeTitle', branding.welcomeTitle);
        setTextContent('welcomeSubtitle', branding.welcomeSubtitle);

        // Footer
        setTextContent('footerText', branding.footerText);

        // Domino badge
        const dominoBadge = document.getElementById('dominoBadge');
        if (dominoBadge) {
            dominoBadge.style.display = branding.showDominoBadge ? 'inline-flex' : 'none';
        }
    }

    /**
     * Applies theme configuration using CSS custom properties
     */
    function applyTheme(theme) {
        if (!theme) return;

        const root = document.documentElement;

        // Colors
        setCSSVariable('--primary-color', theme.primaryColor);
        setCSSVariable('--primary-color-hover', theme.primaryColorHover);
        setCSSVariable('--secondary-color', theme.secondaryColor);

        // Background
        const bgLayer = document.getElementById('backgroundLayer');
        if (bgLayer) {
            if (theme.backgroundImage) {
                bgLayer.style.backgroundImage = `url('${theme.backgroundImage}')`;
                bgLayer.classList.add('has-image');
                setCSSVariable('--bg-overlay-opacity', theme.backgroundOverlayOpacity);
            } else if (theme.backgroundSolid) {
                bgLayer.classList.add('solid-bg');
                setCSSVariable('--bg-solid', theme.backgroundSolid);
            } else {
                setCSSVariable('--bg-gradient-start', theme.backgroundGradientStart);
                setCSSVariable('--bg-gradient-end', theme.backgroundGradientEnd);
            }
        }

        // Card
        setCSSVariable('--card-bg', theme.cardBackground);
        setCSSVariable('--card-border-radius', theme.cardBorderRadius + 'px');

        // Card shadow
        const loginCard = document.querySelector('.login-card');
        if (loginCard && theme.cardShadow) {
            loginCard.classList.remove('shadow-light', 'shadow-medium', 'shadow-heavy');
            loginCard.classList.add('shadow-' + theme.cardShadow);
        }

        // Text colors
        setCSSVariable('--text-primary', theme.textPrimary);
        setCSSVariable('--text-secondary', theme.textSecondary);
        setCSSVariable('--text-light', theme.textLight);

        // Input styling
        setCSSVariable('--input-bg', theme.inputBackground);
        setCSSVariable('--input-border', theme.inputBorder);
        setCSSVariable('--input-border-focus', theme.inputBorderFocus);
        setCSSVariable('--input-border-radius', theme.inputBorderRadius + 'px');

        // Status colors
        setCSSVariable('--error-color', theme.errorColor);
        setCSSVariable('--success-color', theme.successColor);
        setCSSVariable('--warning-color', theme.warningColor);
    }

    /**
     * Applies form configuration
     */
    function applyFormSettings(form) {
        if (!form) return;

        // Labels
        setLabelText('usernameLabel', form.usernameLabel);
        setLabelText('passwordLabel', form.passwordLabel);

        // Placeholders
        setPlaceholder('Username', form.usernamePlaceholder);
        setPlaceholder('Password', form.passwordPlaceholder);

        // Button text
        setTextContent('btnText', form.loginButtonText);

        // Remember me
        const rememberMeContainer = document.getElementById('rememberMeContainer');
        if (rememberMeContainer) {
            rememberMeContainer.style.display = form.showRememberMe ? 'block' : 'none';
        }
        setTextContent('rememberMeLabel', form.rememberMeLabel);

        // Password toggle
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.style.display = form.showPasswordToggle ? 'flex' : 'none';
        }

        // Forgot password
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            if (form.showForgotPassword) {
                forgotPasswordLink.style.display = 'inline';
                forgotPasswordLink.href = form.forgotPasswordUrl || '#';
                forgotPasswordLink.textContent = form.forgotPasswordText;
            } else {
                forgotPasswordLink.style.display = 'none';
            }
        }

        // Form validation
        if (form.enableValidation) {
            initializeFormValidation(form);
        }

        // Loading spinner
        if (form.showLoadingSpinner) {
            initializeLoadingSpinner();
        }
    }

    /**
     * Applies Domino server configuration
     */
    function applyDominoSettings(domino) {
        if (!domino) return;

        const form = document.getElementById('loginForm');
        if (form) {
            if (domino.loginActionUrl) {
                form.action = domino.loginActionUrl;
            }
            if (domino.formMethod) {
                form.method = domino.formMethod;
            }
        }

        const redirectTo = document.getElementById('RedirectTo');
        if (redirectTo && domino.defaultRedirectTo) {
            // Check for URL parameter first
            const urlParams = new URLSearchParams(window.location.search);
            const redirectParam = urlParams.get('RedirectTo');
            redirectTo.value = redirectParam || domino.defaultRedirectTo;
        }
    }

    /**
     * Applies accessibility configuration
     */
    function applyAccessibility(accessibility) {
        if (!accessibility) return;

        const html = document.documentElement;
        if (accessibility.language) {
            html.lang = accessibility.language;
        }

        // Apply ARIA labels
        if (accessibility.ariaLabels) {
            const form = document.getElementById('loginForm');
            if (form) form.setAttribute('aria-label', accessibility.ariaLabels.loginForm);

            setAriaLabel('Username', accessibility.ariaLabels.usernameInput);
            setAriaLabel('Password', accessibility.ariaLabels.passwordInput);
            setAriaLabel('submitBtn', accessibility.ariaLabels.submitButton);
            setAriaLabel('passwordToggle', accessibility.ariaLabels.passwordToggle);
        }
    }

    /**
     * Applies visual effects configuration
     */
    function applyEffects(effects) {
        if (!effects) return;

        const root = document.documentElement;

        // Animation duration
        if (effects.animationDuration) {
            setCSSVariable('--animation-duration', effects.animationDuration + 'ms');
        }

        // Disable animations if configured
        if (!effects.enableAnimations) {
            root.style.setProperty('--animation-duration', '0ms');
            const bgShapes = document.querySelectorAll('.bg-shape');
            bgShapes.forEach(shape => shape.style.animation = 'none');
        }

        // Background animation
        if (!effects.backgroundAnimation) {
            const bgShapes = document.querySelectorAll('.bg-shape');
            bgShapes.forEach(shape => shape.style.display = 'none');
        }

        // Glass morphism
        const loginCard = document.querySelector('.login-card');
        if (loginCard && effects.glassMorphism) {
            loginCard.classList.add('glass');
        }
    }

    /**
     * Applies additional features configuration
     */
    function applyFeatures(features) {
        if (!features) return;

        // Help link
        const helpSection = document.getElementById('helpSection');
        const helpLink = document.getElementById('helpLink');
        if (helpSection && helpLink) {
            if (features.showHelpLink) {
                helpSection.style.display = 'block';
                helpLink.href = features.helpLinkUrl || '#';
                setTextContent('helpText', features.helpLinkText);
            } else {
                helpSection.style.display = 'none';
            }
        }

        // Security notice
        const securityNotice = document.getElementById('securityNotice');
        if (securityNotice) {
            securityNotice.style.display = features.showSecurityNotice ? 'flex' : 'none';
            setTextContent('securityText', features.securityNoticeText);
        }

        // Custom HTML
        if (features.customHtmlBelow) {
            const container = document.getElementById('customHtmlContainer');
            if (container) {
                container.innerHTML = features.customHtmlBelow;
            }
        }

        // Keyboard shortcuts
        if (features.keyboardShortcuts) {
            initializeKeyboardShortcuts();
        }
    }

    /**
     * Handles error messages from Domino server
     */
    function handleErrorMessages(errorMessages) {
        if (!errorMessages) return;

        const reasonTypeEl = document.getElementById('reasontype');
        const errorContainer = document.getElementById('errorContainer');
        const errorText = document.getElementById('errorText');

        if (!reasonTypeEl || !errorContainer || !errorText) return;

        const reasonType = parseInt(reasonTypeEl.value, 10);

        // Also check URL parameters for error info
        const urlParams = new URLSearchParams(window.location.search);
        const urlReasonType = urlParams.get('reasontype');
        const actualReasonType = urlReasonType ? parseInt(urlReasonType, 10) : reasonType;

        if (actualReasonType && actualReasonType > 0) {
            const message = errorMessages[actualReasonType] || errorMessages.generic;
            if (message) {
                errorText.textContent = message;
                errorContainer.style.display = 'block';
                // Re-initialize icons for error container
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }

    // ============================================================
    // FORM INTERACTIONS
    // ============================================================

    /**
     * Initializes form validation
     */
    function initializeFormValidation(formConfig) {
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('Username');
        const passwordInput = document.getElementById('Password');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            let isValid = true;

            // Username validation
            if (usernameInput && !usernameInput.value.trim()) {
                showInputError(usernameInput, 'Username is required');
                isValid = false;
            } else {
                clearInputError(usernameInput);
            }

            // Password validation
            if (passwordInput) {
                const minLength = formConfig.minPasswordLength || 1;
                if (!passwordInput.value) {
                    showInputError(passwordInput, 'Password is required');
                    isValid = false;
                } else if (passwordInput.value.length < minLength) {
                    showInputError(passwordInput, `Password must be at least ${minLength} characters`);
                    isValid = false;
                } else {
                    clearInputError(passwordInput);
                }
            }

            if (!isValid) {
                e.preventDefault();
            }
        });

        // Clear errors on input
        [usernameInput, passwordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', function() {
                    clearInputError(this);
                });
            }
        });
    }

    /**
     * Shows input error state
     */
    function showInputError(input, message) {
        input.classList.add('error');
        input.style.borderColor = 'var(--error-color)';
        
        // Remove any existing error message
        const existingError = input.parentElement.querySelector('.input-error-message');
        if (existingError) existingError.remove();

        // Add error message
        const errorEl = document.createElement('span');
        errorEl.className = 'input-error-message';
        errorEl.style.cssText = 'color: var(--error-color); font-size: 12px; margin-top: 4px; display: block;';
        errorEl.textContent = message;
        input.parentElement.appendChild(errorEl);
    }

    /**
     * Clears input error state
     */
    function clearInputError(input) {
        if (!input) return;
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const errorEl = input.parentElement.querySelector('.input-error-message');
        if (errorEl) errorEl.remove();
    }

    /**
     * Initializes loading spinner on form submit
     */
    function initializeLoadingSpinner() {
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;

        if (!form || !submitBtn) return;

        form.addEventListener('submit', function(e) {
            // Check if form is valid before showing spinner
            if (form.checkValidity()) {
                submitBtn.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (btnLoader) btnLoader.style.display = 'flex';
                if (btnIcon) btnIcon.style.display = 'none';
            }
        });
    }

    /**
     * Initializes password visibility toggle
     */
    function initializePasswordToggle() {
        const passwordInput = document.getElementById('Password');
        const toggleBtn = document.getElementById('passwordToggle');
        const eyeIcon = document.getElementById('eyeIcon');

        if (!passwordInput || !toggleBtn) return;

        toggleBtn.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Update icon
            if (eyeIcon) {
                eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    /**
     * Initializes keyboard shortcuts
     */
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + U = Focus username
            if (e.altKey && e.key === 'u') {
                e.preventDefault();
                const usernameInput = document.getElementById('Username');
                if (usernameInput) usernameInput.focus();
            }

            // Alt + P = Focus password
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                const passwordInput = document.getElementById('Password');
                if (passwordInput) passwordInput.focus();
            }

            // Enter on password field = Submit
            if (e.key === 'Enter' && e.target.id === 'Password') {
                const form = document.getElementById('loginForm');
                if (form) form.requestSubmit();
            }
        });
    }

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    function setCSSVariable(name, value) {
        if (value) {
            document.documentElement.style.setProperty(name, value);
        }
    }

    function setTextContent(id, text) {
        const el = document.getElementById(id);
        if (el && text !== undefined) {
            el.textContent = text;
        }
    }

    function setLabelText(id, text) {
        const el = document.getElementById(id);
        if (el && text !== undefined) {
            const span = el.querySelector('span');
            if (span) {
                span.textContent = text;
            }
        }
    }

    function setPlaceholder(id, placeholder) {
        const el = document.getElementById(id);
        if (el && placeholder !== undefined) {
            el.placeholder = placeholder;
        }
    }

    function setAriaLabel(id, label) {
        const el = document.getElementById(id);
        if (el && label) {
            el.setAttribute('aria-label', label);
        }
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function initialize() {
        // Apply configuration
        applyConfiguration();

        // Initialize password toggle
        initializePasswordToggle();

        // Focus username field on load
        const usernameInput = document.getElementById('Username');
        if (usernameInput && !usernameInput.value) {
            setTimeout(() => usernameInput.focus(), 100);
        }

        console.log('DominoCustomWebPageApril26 initialized successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
