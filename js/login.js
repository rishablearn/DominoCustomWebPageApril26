/**
 * DominoCustomWebPageApril26 - Login Page JavaScript
 * ===================================================
 * 
 * World-class login page with comprehensive features including:
 * - Multi-language (i18n) support
 * - Password strength meter
 * - Accessible CAPTCHA (visual + audio)
 * - MFA/2FA support
 * - SSO/Social login
 * - Theme switcher (light/dark/auto)
 * - Session timeout warning
 * - Offline detection
 * - WebAuthn/Passkey support
 * - Rate limiting UI
 * 
 * All features are toggleable via config.js
 * 
 * @version 2.0.0
 * @date April 2026
 */

(function() {
    'use strict';

    // ============================================================
    // GLOBAL STATE
    // ============================================================
    const LoginState = {
        currentLanguage: 'en',
        currentTheme: 'auto',
        failedAttempts: 0,
        isOffline: !navigator.onLine,
        captchaAnswer: null,
        captchaAudio: null,
        sessionTimer: null,
        translations: {},
        config: null
    };

    // ============================================================
    // CONFIGURATION LOADER
    // ============================================================
    
    /**
     * Main initialization - applies all configuration settings
     */
    function applyConfiguration() {
        if (typeof DominoLoginConfig === 'undefined') {
            console.warn('DominoLoginConfig not found. Using default settings.');
            return;
        }

        LoginState.config = DominoLoginConfig;
        const config = DominoLoginConfig;
        const features = config.features || {};

        // Load translations
        if (features.enableI18n) {
            initializeI18n(config.i18n);
        }

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

        // Initialize feature toggles
        initializeFeatures(features, config);

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
    // FEATURE INITIALIZATION
    // ============================================================
    
    /**
     * Initialize all enabled features based on config toggles
     */
    function initializeFeatures(features, config) {
        // Password strength meter
        if (features.enablePasswordStrength) {
            initializePasswordStrength(config.passwordStrength);
        }
        
        // Theme switcher
        if (features.enableThemeSwitcher) {
            initializeThemeSwitcher(config.ui?.themeSwitcher);
        }
        
        // Language selector
        if (features.enableI18n && config.i18n?.showLanguageSelector) {
            initializeLanguageSelector(config.i18n, config.ui?.languageSelector);
        }
        
        // CAPTCHA
        if (features.enableCaptcha) {
            initializeCaptcha(config.captcha, features.enableAccessibleCaptcha);
        }
        
        // MFA UI
        if (features.enableMFA) {
            initializeMFA(config.mfa);
        }
        
        // SSO buttons
        if (features.enableSSOButtons) {
            initializeSSOButtons(config.sso);
        }
        
        // Domain selector
        if (features.enableDomainSelector) {
            initializeDomainSelector(config.domain);
        }
        
        // Session warning
        if (features.enableSessionWarning) {
            initializeSessionWarning(config.session);
        }
        
        // Offline detection
        if (features.enableOfflineDetection) {
            initializeOfflineDetection(config.ui?.offline);
        }
        
        // Rate limiting UI
        if (features.enableRateLimitWarning) {
            initializeRateLimiting(config.rateLimiting);
        }
        
        // WebAuthn / Passkey
        if (features.enableWebAuthn) {
            initializeWebAuthn(config.webauthn);
        }
        
        // Remember username
        if (features.enableRememberUsername) {
            initializeRememberUsername();
        }
        
        // Cookie consent
        if (features.showCookieConsent) {
            initializeCookieConsent(config.cookieConsent);
        }
        
        // Analytics
        if (features.enableAnalytics) {
            initializeAnalytics(config.analytics);
        }
        
        // Keyboard shortcuts
        if (features.enableKeyboardShortcuts) {
            initializeKeyboardShortcuts();
        }
        
        // Debug mode
        if (features.enableDebugMode) {
            initializeDebugMode();
        }
    }

    // ============================================================
    // i18n INTERNATIONALIZATION
    // ============================================================
    
    function initializeI18n(i18nConfig) {
        if (!i18nConfig) return;
        
        // Load translations
        if (typeof DominoLoginI18n !== 'undefined') {
            LoginState.translations = DominoLoginI18n;
        } else if (typeof DominoLoginTranslations !== 'undefined') {
            LoginState.translations = DominoLoginTranslations;
        }
        
        // Detect or load saved language
        let lang = i18nConfig.defaultLanguage || 'en';
        
        if (i18nConfig.rememberLanguage) {
            const saved = localStorage.getItem('domino_login_language');
            if (saved) lang = saved;
        }
        
        if (i18nConfig.autoDetect && !localStorage.getItem('domino_login_language')) {
            const browserLang = navigator.language.split('-')[0];
            const available = i18nConfig.availableLanguages.map(l => l.code);
            if (available.includes(browserLang)) {
                lang = browserLang;
            }
        }
        
        setLanguage(lang, i18nConfig);
    }
    
    function setLanguage(langCode, i18nConfig) {
        LoginState.currentLanguage = langCode;
        
        const langData = i18nConfig?.availableLanguages?.find(l => l.code === langCode);
        if (langData) {
            document.documentElement.lang = langCode;
            document.documentElement.dir = langData.dir || 'ltr';
        }
        
        // Update all translatable elements
        updateTranslations(langCode);
        
        // Save preference
        if (i18nConfig?.rememberLanguage) {
            localStorage.setItem('domino_login_language', langCode);
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
    }
    
    function t(key, replacements = {}) {
        const translations = LoginState.translations[LoginState.currentLanguage] || LoginState.translations['en'] || {};
        let text = translations[key] || key;
        
        // Handle replacements like {n}, {time}
        Object.keys(replacements).forEach(k => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), replacements[k]);
        });
        
        return text;
    }
    
    function updateTranslations(langCode) {
        const trans = LoginState.translations[langCode] || LoginState.translations['en'] || {};
        
        // Update static elements
        setTextContent('welcomeTitle', trans.welcomeTitle);
        setTextContent('welcomeSubtitle', trans.welcomeSubtitle);
        setLabelText('usernameLabel', trans.usernameLabel);
        setLabelText('passwordLabel', trans.passwordLabel);
        setTextContent('btnText', trans.loginButton);
        setTextContent('rememberMeLabel', trans.rememberMe);
        setTextContent('securityText', trans.securityNotice);
        
        // Update placeholders
        setPlaceholder('Username', trans.usernamePlaceholder);
        setPlaceholder('Password', trans.passwordPlaceholder);
        
        // Update forgot password
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (forgotLink) forgotLink.textContent = trans.forgotPassword;
    }

    // ============================================================
    // PASSWORD STRENGTH METER
    // ============================================================
    
    function initializePasswordStrength(config) {
        if (!config) return;
        
        const passwordInput = document.getElementById('Password');
        if (!passwordInput) return;
        
        // Create strength meter container
        const meterContainer = document.createElement('div');
        meterContainer.className = 'password-strength-container';
        meterContainer.id = 'passwordStrengthContainer';
        meterContainer.innerHTML = `
            <div class="password-strength-meter">
                <div class="strength-bar" id="strengthBar"></div>
            </div>
            <div class="strength-label" id="strengthLabel"></div>
            ${config.showRequirements ? `<ul class="password-requirements" id="passwordRequirements"></ul>` : ''}
        `;
        
        // Insert after password wrapper
        const passwordWrapper = passwordInput.closest('.input-wrapper');
        if (passwordWrapper) {
            passwordWrapper.parentNode.insertBefore(meterContainer, passwordWrapper.nextSibling);
        }
        
        // Build requirements list
        if (config.showRequirements) {
            const reqList = document.getElementById('passwordRequirements');
            if (reqList) {
                const requirements = [];
                if (config.minLength > 0) requirements.push({ id: 'length', text: t('passwordMinLength', { n: config.minLength }) });
                if (config.requireUppercase) requirements.push({ id: 'upper', text: t('passwordUppercase') });
                if (config.requireLowercase) requirements.push({ id: 'lower', text: t('passwordLowercase') });
                if (config.requireNumbers) requirements.push({ id: 'number', text: t('passwordNumber') });
                if (config.requireSpecialChars) requirements.push({ id: 'special', text: t('passwordSpecial') });
                
                reqList.innerHTML = requirements.map(r => 
                    `<li id="req-${r.id}" class="requirement"><i data-lucide="circle" class="req-icon"></i>${r.text}</li>`
                ).join('');
                
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
        
        // Listen for password input
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value, config);
        });
    }
    
    function updatePasswordStrength(password, config) {
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        if (!strengthBar || !strengthLabel) return;
        
        let score = 0;
        const checks = {
            length: password.length >= (config.minLength || 8),
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: new RegExp(`[${config.specialChars?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') || '!@#$%^&*'}]`).test(password)
        };
        
        // Calculate score
        if (checks.length) score += 20;
        if (checks.upper) score += 20;
        if (checks.lower) score += 20;
        if (checks.number) score += 20;
        if (checks.special) score += 20;
        if (password.length > 12) score += 10;
        
        score = Math.min(100, score);
        
        // Determine level
        let level = 'weak';
        Object.entries(config.levels || {}).forEach(([key, val]) => {
            if (score >= val.minScore) level = key;
        });
        
        const levelConfig = config.levels?.[level] || { color: '#dc3545', label: 'Weak' };
        
        // Update UI
        strengthBar.style.width = `${score}%`;
        strengthBar.style.backgroundColor = levelConfig.color;
        strengthLabel.textContent = t(`password${level.charAt(0).toUpperCase() + level.slice(1)}`) || levelConfig.label;
        strengthLabel.style.color = levelConfig.color;
        
        // Update requirements
        Object.entries(checks).forEach(([key, passed]) => {
            const reqEl = document.getElementById(`req-${key}`);
            if (reqEl) {
                reqEl.classList.toggle('passed', passed);
                const icon = reqEl.querySelector('.req-icon');
                if (icon) {
                    icon.setAttribute('data-lucide', passed ? 'check-circle' : 'circle');
                }
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // THEME SWITCHER
    // ============================================================
    
    function initializeThemeSwitcher(config) {
        // Create theme toggle button
        const position = config?.position || 'top-right';
        const toggle = document.createElement('button');
        toggle.className = `theme-toggle position-${position}`;
        toggle.id = 'themeToggle';
        toggle.setAttribute('aria-label', t('themeToggle'));
        toggle.innerHTML = `
            <i data-lucide="sun" class="theme-icon light-icon"></i>
            <i data-lucide="moon" class="theme-icon dark-icon"></i>
        `;
        
        document.body.appendChild(toggle);
        
        // Load saved theme
        const savedTheme = localStorage.getItem('domino_login_theme') || 'auto';
        applyThemeMode(savedTheme);
        
        // Toggle handler
        toggle.addEventListener('click', () => {
            const current = LoginState.currentTheme;
            const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
            applyThemeMode(next);
            localStorage.setItem('domino_login_theme', next);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    function applyThemeMode(mode) {
        LoginState.currentTheme = mode;
        document.documentElement.setAttribute('data-theme', mode);
        
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.classList.remove('theme-light', 'theme-dark', 'theme-auto');
            toggle.classList.add(`theme-${mode}`);
        }
    }

    // ============================================================
    // LANGUAGE SELECTOR
    // ============================================================
    
    function initializeLanguageSelector(i18nConfig, uiConfig) {
        const position = uiConfig?.position || 'top-left';
        const languages = i18nConfig?.availableLanguages || [];
        
        const selector = document.createElement('div');
        selector.className = `language-selector position-${position}`;
        selector.id = 'languageSelector';
        
        const current = languages.find(l => l.code === LoginState.currentLanguage) || languages[0];
        
        selector.innerHTML = `
            <button class="lang-toggle" id="langToggle" aria-label="${t('languageSelect')}">
                ${uiConfig?.showFlag !== false ? `<span class="lang-flag">${current?.flag || '🌐'}</span>` : ''}
                ${uiConfig?.showName !== false ? `<span class="lang-name">${current?.name || 'English'}</span>` : ''}
                <i data-lucide="chevron-down" class="lang-arrow"></i>
            </button>
            <div class="lang-dropdown" id="langDropdown">
                ${languages.map(lang => `
                    <button class="lang-option ${lang.code === LoginState.currentLanguage ? 'active' : ''}" 
                            data-lang="${lang.code}">
                        <span class="lang-flag">${lang.flag || '🌐'}</span>
                        <span class="lang-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(selector);
        
        // Toggle dropdown
        const toggle = document.getElementById('langToggle');
        const dropdown = document.getElementById('langDropdown');
        
        toggle?.addEventListener('click', () => {
            dropdown?.classList.toggle('open');
        });
        
        // Language selection
        selector.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                setLanguage(lang, i18nConfig);
                dropdown?.classList.remove('open');
                
                // Update toggle display
                const langData = languages.find(l => l.code === lang);
                if (langData) {
                    toggle.querySelector('.lang-flag').textContent = langData.flag || '🌐';
                    toggle.querySelector('.lang-name').textContent = langData.name;
                }
                
                // Update active state
                selector.querySelectorAll('.lang-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                dropdown?.classList.remove('open');
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // ACCESSIBLE CAPTCHA
    // ============================================================
    
    function initializeCaptcha(config, enableAccessible) {
        if (!config) return;
        
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        // Create CAPTCHA container
        const captchaContainer = document.createElement('div');
        captchaContainer.className = 'captcha-container';
        captchaContainer.id = 'captchaContainer';
        captchaContainer.setAttribute('role', 'group');
        captchaContainer.setAttribute('aria-label', t('captchaLabel'));
        
        // Generate initial CAPTCHA
        const captchaData = generateCaptcha(config);
        
        captchaContainer.innerHTML = `
            <label class="form-label captcha-label">
                <i data-lucide="shield-check" class="label-icon"></i>
                <span>${t('captchaLabel')}</span>
            </label>
            <div class="captcha-display" id="captchaDisplay">
                ${config.type === 'math' ? 
                    `<span class="captcha-math" id="captchaMath">${captchaData.display}</span>` :
                    `<canvas class="captcha-canvas" id="captchaCanvas" width="200" height="60"></canvas>`
                }
            </div>
            <div class="captcha-controls">
                <button type="button" class="captcha-btn" id="refreshCaptcha" aria-label="${t('captchaRefresh')}">
                    <i data-lucide="refresh-cw"></i>
                </button>
                ${enableAccessible ? `
                    <button type="button" class="captcha-btn" id="audioCaptcha" aria-label="${t('captchaAudio')}">
                        <i data-lucide="volume-2"></i>
                    </button>
                ` : ''}
            </div>
            ${enableAccessible ? `
                <p class="captcha-instructions screen-reader-text" id="captchaInstructions">
                    ${config.type === 'math' ? t('captchaMathInstructions') : t('captchaInstructions')}
                </p>
            ` : ''}
            <div class="input-wrapper">
                <input type="text" 
                       id="captchaInput" 
                       name="captchaResponse"
                       class="form-input captcha-input" 
                       placeholder="${t('captchaPlaceholder')}"
                       required
                       autocomplete="off"
                       aria-describedby="captchaInstructions">
            </div>
        `;
        
        // Insert before submit button
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.parentNode.insertBefore(captchaContainer, submitBtn);
        }
        
        LoginState.captchaAnswer = captchaData.answer;
        
        // Draw canvas CAPTCHA if needed
        if (config.type !== 'math') {
            drawCaptcha(captchaData.display);
        }
        
        // Refresh handler
        document.getElementById('refreshCaptcha')?.addEventListener('click', () => {
            const newCaptcha = generateCaptcha(config);
            LoginState.captchaAnswer = newCaptcha.answer;
            
            if (config.type === 'math') {
                document.getElementById('captchaMath').textContent = newCaptcha.display;
            } else {
                drawCaptcha(newCaptcha.display);
            }
            
            document.getElementById('captchaInput').value = '';
            announceToScreenReader(t('captchaRefresh'));
        });
        
        // Audio CAPTCHA handler
        if (enableAccessible) {
            document.getElementById('audioCaptcha')?.addEventListener('click', () => {
                playCaptchaAudio(config);
            });
        }
        
        // Validate CAPTCHA on form submit
        form.addEventListener('submit', (e) => {
            const input = document.getElementById('captchaInput');
            const userAnswer = input?.value?.trim().toLowerCase();
            const correctAnswer = String(LoginState.captchaAnswer).toLowerCase();
            
            if (userAnswer !== correctAnswer) {
                e.preventDefault();
                showCaptchaError();
                // Refresh CAPTCHA
                document.getElementById('refreshCaptcha')?.click();
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    function generateCaptcha(config) {
        if (config.type === 'math') {
            const ops = config.math?.operations || ['+', '-'];
            const max = config.math?.maxNumber || 10;
            const a = Math.floor(Math.random() * max) + 1;
            const b = Math.floor(Math.random() * max) + 1;
            const op = ops[Math.floor(Math.random() * ops.length)];
            const answer = op === '+' ? a + b : Math.abs(a - b);
            const display = `${Math.max(a, b)} ${op} ${Math.min(a, b)} = ?`;
            return { display, answer, audio: `What is ${Math.max(a, b)} ${op === '+' ? 'plus' : 'minus'} ${Math.min(a, b)}?` };
        } else {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            const length = config.simple?.length || 6;
            let code = '';
            for (let i = 0; i < length; i++) {
                code += chars[Math.floor(Math.random() * chars.length)];
            }
            return { display: code, answer: code, audio: code.split('').join(' ') };
        }
    }
    
    function drawCaptcha(text) {
        const canvas = document.getElementById('captchaCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
        
        // Draw text
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#333';
        ctx.textBaseline = 'middle';
        
        const chars = text.split('');
        const spacing = canvas.width / (chars.length + 1);
        
        chars.forEach((char, i) => {
            ctx.save();
            ctx.translate(spacing * (i + 1), canvas.height / 2 + (Math.random() * 10 - 5));
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(char, 0, 0);
            ctx.restore();
        });
        
        // Add lines
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
    }
    
    function playCaptchaAudio(config) {
        const audioBtn = document.getElementById('audioCaptcha');
        if (!audioBtn) return;
        
        // Use Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            
            if (config.type === 'math') {
                const display = document.getElementById('captchaMath')?.textContent || '';
                utterance.text = display.replace('=', 'equals').replace('?', 'what');
            } else {
                utterance.text = String(LoginState.captchaAnswer).split('').join(', ');
            }
            
            utterance.rate = 0.8;
            utterance.onstart = () => {
                audioBtn.classList.add('playing');
                announceToScreenReader(t('captchaAudioPlaying'));
            };
            utterance.onend = () => {
                audioBtn.classList.remove('playing');
            };
            
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } else {
            // Fallback to API endpoint if configured
            if (config.accessible?.audioEndpoint) {
                fetch(config.accessible.audioEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({ text: LoginState.captchaAnswer })
                })
                .then(res => res.blob())
                .then(blob => {
                    const audio = new Audio(URL.createObjectURL(blob));
                    audio.play();
                });
            }
        }
    }
    
    function showCaptchaError() {
        const input = document.getElementById('captchaInput');
        if (input) {
            input.classList.add('error');
            showInputError(input, t('errorInvalidCaptcha'));
        }
    }

    // ============================================================
    // OFFLINE DETECTION
    // ============================================================
    
    function initializeOfflineDetection(config) {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.id = 'offlineIndicator';
        indicator.setAttribute('role', 'alert');
        indicator.innerHTML = `
            <i data-lucide="wifi-off"></i>
            <span>${config?.message || t('offlineMessage')}</span>
        `;
        
        document.body.appendChild(indicator);
        
        function updateStatus(online) {
            LoginState.isOffline = !online;
            indicator.classList.toggle('visible', !online);
            
            if (online) {
                announceToScreenReader(t('backOnline'));
            } else {
                announceToScreenReader(t('offlineMessage'));
            }
        }
        
        window.addEventListener('online', () => updateStatus(true));
        window.addEventListener('offline', () => updateStatus(false));
        
        // Initial check
        updateStatus(navigator.onLine);
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // SESSION WARNING
    // ============================================================
    
    function initializeSessionWarning(config) {
        if (!config) return;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'session-modal';
        modal.id = 'sessionModal';
        modal.innerHTML = `
            <div class="session-modal-content">
                <h3>${config.warningTitle || t('sessionWarningTitle')}</h3>
                <p id="sessionMessage"></p>
                <div class="session-buttons">
                    ${config.allowExtend ? `<button class="btn-primary" id="extendSession">${config.extendButtonText || t('sessionExtendButton')}</button>` : ''}
                    <button class="btn-secondary" id="logoutSession">${config.logoutButtonText || t('sessionLogoutButton')}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event handlers
        document.getElementById('extendSession')?.addEventListener('click', extendSession);
        document.getElementById('logoutSession')?.addEventListener('click', () => {
            window.location.href = '/?Logout';
        });
    }
    
    function showSessionWarning(remainingSeconds) {
        const modal = document.getElementById('sessionModal');
        const message = document.getElementById('sessionMessage');
        
        if (modal && message) {
            message.textContent = t('sessionWarningMessage', { time: formatTime(remainingSeconds) });
            modal.classList.add('visible');
        }
    }
    
    function extendSession() {
        // Send keep-alive request
        fetch('/names.nsf?OpenDatabase', { credentials: 'same-origin' })
            .then(() => {
                document.getElementById('sessionModal')?.classList.remove('visible');
            });
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }

    // ============================================================
    // SSO BUTTONS
    // ============================================================
    
    function initializeSSOButtons(config) {
        if (!config?.providers) return;
        
        const enabledProviders = Object.entries(config.providers)
            .filter(([_, p]) => p.enabled);
        
        if (enabledProviders.length === 0) return;
        
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        const ssoContainer = document.createElement('div');
        ssoContainer.className = 'sso-container';
        ssoContainer.innerHTML = `
            <div class="sso-separator">
                <span>${config.separatorText || t('ssoSeparator')}</span>
            </div>
            <div class="sso-buttons">
                ${enabledProviders.map(([key, provider]) => `
                    <a href="${provider.url}" class="sso-btn sso-${key} ${provider.buttonStyle || 'outline'}">
                        <i data-lucide="${provider.icon}"></i>
                        <span>${provider.label}</span>
                    </a>
                `).join('')}
            </div>
        `;
        
        // Insert after form
        form.parentNode.insertBefore(ssoContainer, form.nextSibling);
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // DOMAIN SELECTOR
    // ============================================================
    
    function initializeDomainSelector(config) {
        if (!config?.showSelector) return;
        
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        const domainGroup = document.createElement('div');
        domainGroup.className = 'form-group domain-group';
        domainGroup.innerHTML = `
            <label for="domainSelect" class="form-label">
                <i data-lucide="building-2" class="label-icon"></i>
                <span>${config.label || t('domainLabel')}</span>
            </label>
            <div class="input-wrapper">
                <select id="domainSelect" name="domain" class="form-input form-select">
                    ${config.domains.map(d => 
                        `<option value="${d.server}" data-id="${d.id}">${d.name}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        // Insert based on position
        const usernameGroup = document.querySelector('.form-group');
        if (config.position === 'above-username' && usernameGroup) {
            usernameGroup.parentNode.insertBefore(domainGroup, usernameGroup);
        } else {
            form.insertBefore(domainGroup, form.firstChild);
        }
        
        // Remember selection
        if (config.rememberDomain) {
            const saved = localStorage.getItem('domino_login_domain');
            if (saved) {
                document.getElementById('domainSelect').value = saved;
            }
            
            document.getElementById('domainSelect')?.addEventListener('change', (e) => {
                localStorage.setItem('domino_login_domain', e.target.value);
            });
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // REMEMBER USERNAME
    // ============================================================
    
    function initializeRememberUsername() {
        const usernameInput = document.getElementById('Username');
        if (!usernameInput) return;
        
        // Load saved username
        const saved = localStorage.getItem('domino_login_username');
        if (saved) {
            usernameInput.value = saved;
            // Focus password instead
            setTimeout(() => document.getElementById('Password')?.focus(), 100);
        }
        
        // Save on successful form submit
        const form = document.getElementById('loginForm');
        form?.addEventListener('submit', () => {
            const remember = document.getElementById('rememberMe')?.checked;
            if (remember) {
                localStorage.setItem('domino_login_username', usernameInput.value);
            }
        });
    }

    // ============================================================
    // RATE LIMITING UI
    // ============================================================
    
    function initializeRateLimiting(config) {
        if (!config) return;
        
        // Check for failed attempts in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reasonType = urlParams.get('reasontype');
        
        if (reasonType === '2') {
            LoginState.failedAttempts++;
            
            if (LoginState.failedAttempts >= config.maxAttempts) {
                showLockoutWarning(config);
            } else if (config.showRemainingAttempts) {
                showAttemptsWarning(config.maxAttempts - LoginState.failedAttempts, config);
            }
        }
    }
    
    function showAttemptsWarning(remaining, config) {
        const container = document.getElementById('errorContainer');
        if (!container) return;
        
        const warning = document.createElement('div');
        warning.className = 'rate-limit-warning';
        warning.innerHTML = `
            <i data-lucide="alert-triangle"></i>
            <span>${t('attemptsRemaining', { n: remaining })}</span>
        `;
        
        container.parentNode.insertBefore(warning, container.nextSibling);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    function showLockoutWarning(config) {
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        form.classList.add('locked');
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = true;
        
        // Show lockout message
        const lockout = document.createElement('div');
        lockout.className = 'lockout-message';
        lockout.innerHTML = `
            <i data-lucide="lock"></i>
            <span>${t('accountLocked', { time: formatTime(config.lockoutDuration) })}</span>
        `;
        form.prepend(lockout);
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ============================================================
    // WEBAUTHN / PASSKEY
    // ============================================================
    
    function initializeWebAuthn(config) {
        if (!config || !window.PublicKeyCredential) return;
        
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        const webauthnBtn = document.createElement('button');
        webauthnBtn.type = 'button';
        webauthnBtn.className = `webauthn-btn ${config.prominent ? 'prominent' : ''}`;
        webauthnBtn.innerHTML = `
            <i data-lucide="fingerprint"></i>
            <span>${config.buttonText || t('webauthnButton')}</span>
        `;
        
        if (config.prominent) {
            form.parentNode.insertBefore(webauthnBtn, form);
        } else {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.parentNode.insertBefore(webauthnBtn, submitBtn.nextSibling);
            }
        }
        
        webauthnBtn.addEventListener('click', () => authenticateWithPasskey(config));
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    async function authenticateWithPasskey(config) {
        try {
            const response = await fetch(config.authEndpoint);
            const options = await response.json();
            
            const credential = await navigator.credentials.get({
                publicKey: options
            });
            
            // Send credential to server
            const result = await fetch(config.authEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credential)
            });
            
            if (result.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('WebAuthn error:', error);
            announceToScreenReader(t('webauthnError'));
        }
    }

    // ============================================================
    // MFA UI
    // ============================================================
    
    function initializeMFA(config) {
        // MFA handling would be triggered after successful primary auth
        // This creates the UI elements that would be shown
        
        const mfaModal = document.createElement('div');
        mfaModal.className = 'mfa-modal';
        mfaModal.id = 'mfaModal';
        mfaModal.innerHTML = `
            <div class="mfa-content">
                <h2>${config.mfaTitle || t('mfaTitle')}</h2>
                <p>${config.mfaSubtitle || t('mfaSubtitle')}</p>
                <div class="mfa-code-input">
                    ${Array(config.codeLength || 6).fill(0).map((_, i) => 
                        `<input type="text" maxlength="1" class="mfa-digit" data-index="${i}" autocomplete="off">`
                    ).join('')}
                </div>
                ${config.allowRememberDevice ? `
                    <label class="mfa-remember">
                        <input type="checkbox" id="mfaRemember">
                        <span>${t('mfaRememberDevice')}</span>
                    </label>
                ` : ''}
                <button class="btn-primary mfa-verify" id="mfaVerify">${t('mfaVerifyButton')}</button>
                <a href="#" class="mfa-back">${t('mfaBackToLogin')}</a>
            </div>
        `;
        
        document.body.appendChild(mfaModal);
        
        // Auto-focus and auto-advance
        mfaModal.querySelectorAll('.mfa-digit').forEach((input, i, inputs) => {
            input.addEventListener('input', (e) => {
                if (e.target.value && i < inputs.length - 1) {
                    inputs[i + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && i > 0) {
                    inputs[i - 1].focus();
                }
            });
        });
    }

    // ============================================================
    // COOKIE CONSENT
    // ============================================================
    
    function initializeCookieConsent(config) {
        if (!config) return;
        
        // Check if already consented
        if (document.cookie.includes(config.cookieName + '=')) return;
        
        const banner = document.createElement('div');
        banner.className = `cookie-banner position-${config.position || 'bottom'}`;
        banner.innerHTML = `
            <p>${config.message}</p>
            <div class="cookie-buttons">
                <button class="cookie-accept">${config.acceptText}</button>
                ${config.declineText ? `<button class="cookie-decline">${config.declineText}</button>` : ''}
                <a href="${config.learnMoreUrl}" class="cookie-learn">${config.learnMoreText}</a>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
            document.cookie = `${config.cookieName}=accepted; max-age=${config.expiryDays * 86400}; path=/`;
            banner.remove();
        });
        
        banner.querySelector('.cookie-decline')?.addEventListener('click', () => {
            document.cookie = `${config.cookieName}=declined; max-age=${config.expiryDays * 86400}; path=/`;
            banner.remove();
        });
    }

    // ============================================================
    // ANALYTICS
    // ============================================================
    
    function initializeAnalytics(config) {
        if (!config || config.provider === 'none') return;
        
        // Track page view
        if (config.events?.pageView) {
            trackEvent('page_view', { page: 'login' });
        }
        
        // Track form submit
        document.getElementById('loginForm')?.addEventListener('submit', () => {
            if (config.events?.loginAttempt) {
                trackEvent('login_attempt', {});
            }
        });
    }
    
    function trackEvent(eventName, data) {
        const config = LoginState.config?.analytics;
        if (!config) return;
        
        if (config.includeTimestamp) {
            data.timestamp = new Date().toISOString();
        }
        
        switch (config.provider) {
            case 'google':
                if (typeof gtag === 'function') {
                    gtag('event', eventName, data);
                }
                break;
            case 'custom':
                if (config.customEndpoint) {
                    fetch(config.customEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ event: eventName, ...data })
                    });
                }
                break;
        }
    }

    // ============================================================
    // DEBUG MODE
    // ============================================================
    
    function initializeDebugMode() {
        const debugPanel = document.createElement('div');
        debugPanel.className = 'debug-panel';
        debugPanel.innerHTML = `
            <h4>Debug Info</h4>
            <pre id="debugInfo"></pre>
        `;
        document.body.appendChild(debugPanel);
        
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('debugInfo').textContent = JSON.stringify({
            reasontype: urlParams.get('reasontype'),
            RedirectTo: urlParams.get('RedirectTo'),
            language: LoginState.currentLanguage,
            theme: LoginState.currentTheme,
            failedAttempts: LoginState.failedAttempts,
            isOffline: LoginState.isOffline
        }, null, 2);
    }

    // ============================================================
    // ACCESSIBILITY HELPERS
    // ============================================================
    
    function announceToScreenReader(message) {
        const announcer = document.getElementById('srAnnouncer') || createAnnouncer();
        announcer.textContent = message;
    }
    
    function createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'srAnnouncer';
        announcer.className = 'screen-reader-text';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function initialize() {
        // Apply configuration
        applyConfiguration();

        // Initialize password toggle
        initializePasswordToggle();

        // Focus username field on load (if not pre-filled)
        const features = LoginState.config?.features || {};
        if (features.enableAutoFocus !== false) {
            const usernameInput = document.getElementById('Username');
            const passwordInput = document.getElementById('Password');
            
            if (usernameInput && !usernameInput.value) {
                setTimeout(() => usernameInput.focus(), 100);
            } else if (passwordInput && !passwordInput.value) {
                setTimeout(() => passwordInput.focus(), 100);
            }
        }

        console.log('DominoCustomWebPageApril26 v2.0.0 initialized successfully');
        console.log('Features enabled:', Object.entries(features).filter(([k,v]) => v === true).map(([k]) => k).join(', '));
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
