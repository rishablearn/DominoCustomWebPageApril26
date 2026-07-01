/**
 * DominoCustomWebPageApril26 - Internationalization (i18n) Translations
 * ======================================================================
 * 
 * Multi-language support for the login page.
 * Add new languages by creating a new language object.
 * 
 * @version 2.5.1
 * @date April 2026
 */

const DominoLoginI18n = {
    
    // ============================================================
    // ENGLISH (Default)
    // ============================================================
    en: {
        // Meta
        _meta: {
            name: "English",
            nativeName: "English",
            dir: "ltr",
            flag: "🇺🇸"
        },
        
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
        mfaSubtitle: "Enter the verification code from your authenticator app",
        mfaCodePlaceholder: "Enter 6-digit code",
        mfaVerifyButton: "Verify",
        mfaRememberDevice: "Remember this device for 30 days",
        mfaResendCode: "Resend code",
        mfaTryAnotherMethod: "Try another method",
        mfaBackToLogin: "Back to login",
        
        // CAPTCHA
        captchaLabel: "Security Verification",
        captchaPlaceholder: "Enter the code above",
        captchaRefresh: "New code",
        captchaAudio: "Listen",
        captchaAudioPlaying: "Playing audio...",
        captchaAudioStop: "Stop audio",
        captchaInstructions: "Please enter the characters shown in the image",
        captchaAudioInstructions: "Listen to the audio and type what you hear",
        captchaMathInstructions: "Solve the math problem below",
        
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
        ssoEnterprise: "Enterprise SSO",
        
        // Domain
        domainLabel: "Domain",
        domainPlaceholder: "Select your domain",
        
        // Session
        sessionWarningTitle: "Session Expiring",
        sessionWarningMessage: "Your session will expire in {time}.",
        sessionExtendButton: "Stay Signed In",
        sessionLogoutButton: "Sign Out",
        sessionExpired: "Your session has expired",
        
        // Rate limiting
        attemptsRemaining: "{n} attempts remaining",
        accountLocked: "Account temporarily locked. Try again in {time}.",
        tooManyAttempts: "Too many failed attempts",
        
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
        
        // WebAuthn / Passkey
        webauthnButton: "Sign in with Passkey",
        webauthnRegister: "Set up Passkey",
        webauthnError: "Passkey authentication failed",
        webauthnNotSupported: "Passkeys are not supported in this browser",
        webauthnPrompt: "Use your fingerprint, face, or security key",
        
        // Accessibility
        togglePassword: "Toggle password visibility",
        showPassword: "Show password",
        hidePassword: "Hide password",
        loading: "Loading...",
        closeDialog: "Close",
        
        // Theme
        lightMode: "Light mode",
        darkMode: "Dark mode",
        autoMode: "System default",
        themeToggle: "Toggle theme",
        
        // Language
        languageSelect: "Select language",
        
        // Offline
        offlineMessage: "You appear to be offline. Please check your connection.",
        backOnline: "You are back online",
        
        // Cookie consent
        cookieMessage: "We use cookies to ensure you get the best experience.",
        cookieAccept: "Accept",
        cookieDecline: "Decline",
        cookieLearnMore: "Learn more",
        
        // Footer
        securityNotice: "This is a secure connection",
        poweredBy: "Powered by",
        
        // Help
        needHelp: "Need help?",
        contactSupport: "Contact support",
        
        // Misc
        required: "Required",
        optional: "Optional",
        or: "or",
        and: "and",
        cancel: "Cancel",
        continue: "Continue",
        back: "Back",
        next: "Next"
    },
    
    // ============================================================
    // SPANISH
    // ============================================================
    es: {
        _meta: {
            name: "Spanish",
            nativeName: "Español",
            dir: "ltr",
            flag: "🇪🇸"
        },
        
        welcomeTitle: "Bienvenido de nuevo",
        welcomeSubtitle: "Por favor, inicie sesión para acceder a sus aplicaciones",
        
        usernameLabel: "Usuario",
        usernamePlaceholder: "Ingrese su nombre de usuario",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Ingrese su contraseña",
        loginButton: "Iniciar Sesión",
        signingIn: "Iniciando sesión...",
        
        rememberMe: "Recuérdame en este dispositivo",
        forgotPassword: "¿Olvidó su contraseña?",
        
        mfaTitle: "Autenticación de Dos Factores",
        mfaSubtitle: "Ingrese el código de verificación de su aplicación",
        mfaCodePlaceholder: "Ingrese el código de 6 dígitos",
        mfaVerifyButton: "Verificar",
        mfaRememberDevice: "Recordar este dispositivo por 30 días",
        
        captchaLabel: "Verificación de Seguridad",
        captchaPlaceholder: "Ingrese el código de arriba",
        captchaRefresh: "Nuevo código",
        captchaAudio: "Escuchar",
        captchaAudioInstructions: "Escuche el audio y escriba lo que oye",
        
        passwordStrength: "Fortaleza de la Contraseña",
        passwordWeak: "Débil",
        passwordFair: "Regular",
        passwordGood: "Buena",
        passwordStrong: "Fuerte",
        passwordExcellent: "Excelente",
        
        ssoSeparator: "o inicie sesión con",
        
        sessionWarningTitle: "Sesión Expirando",
        sessionWarningMessage: "Su sesión expirará en {time}.",
        sessionExtendButton: "Mantener Sesión",
        sessionLogoutButton: "Cerrar Sesión",
        
        attemptsRemaining: "{n} intentos restantes",
        accountLocked: "Cuenta bloqueada temporalmente. Intente de nuevo en {time}.",
        
        errorRequired: "Este campo es requerido",
        errorInvalidUsername: "Por favor ingrese un usuario válido",
        errorInvalidPassword: "La contraseña no cumple los requisitos",
        error1: "No está autorizado para acceder a esta aplicación.",
        error2: "Usuario o contraseña inválidos. Intente de nuevo.",
        error3: "Su sesión ha expirado. Inicie sesión nuevamente.",
        error4: "Ocurrió un problema de sincronización. Intente de nuevo.",
        
        webauthnButton: "Iniciar sesión con Passkey",
        
        togglePassword: "Mostrar/ocultar contraseña",
        loading: "Cargando...",
        
        lightMode: "Modo claro",
        darkMode: "Modo oscuro",
        
        offlineMessage: "Parece que está sin conexión. Verifique su red.",
        
        securityNotice: "Esta es una conexión segura",
        poweredBy: "Desarrollado por",
        
        needHelp: "¿Necesita ayuda?",
        required: "Requerido",
        optional: "Opcional"
    },
    
    // ============================================================
    // FRENCH
    // ============================================================
    fr: {
        _meta: {
            name: "French",
            nativeName: "Français",
            dir: "ltr",
            flag: "🇫🇷"
        },
        
        welcomeTitle: "Bon retour",
        welcomeSubtitle: "Veuillez vous connecter pour accéder à vos applications",
        
        usernameLabel: "Identifiant",
        usernamePlaceholder: "Entrez votre identifiant",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        loginButton: "Se connecter",
        signingIn: "Connexion en cours...",
        
        rememberMe: "Se souvenir de moi",
        forgotPassword: "Mot de passe oublié ?",
        
        mfaTitle: "Authentification à deux facteurs",
        mfaSubtitle: "Entrez le code de vérification de votre application",
        mfaCodePlaceholder: "Entrez le code à 6 chiffres",
        mfaVerifyButton: "Vérifier",
        
        captchaLabel: "Vérification de sécurité",
        captchaPlaceholder: "Entrez le code ci-dessus",
        captchaRefresh: "Nouveau code",
        captchaAudio: "Écouter",
        
        passwordStrength: "Force du mot de passe",
        passwordWeak: "Faible",
        passwordFair: "Moyen",
        passwordGood: "Bon",
        passwordStrong: "Fort",
        passwordExcellent: "Excellent",
        
        ssoSeparator: "ou connectez-vous avec",
        
        sessionWarningTitle: "Session expire bientôt",
        sessionWarningMessage: "Votre session expirera dans {time}.",
        sessionExtendButton: "Rester connecté",
        sessionLogoutButton: "Se déconnecter",
        
        error1: "Vous n'êtes pas autorisé à accéder à cette application.",
        error2: "Identifiant ou mot de passe invalide.",
        error3: "Votre session a expiré. Veuillez vous reconnecter.",
        
        webauthnButton: "Se connecter avec Passkey",
        
        offlineMessage: "Vous semblez être hors ligne.",
        securityNotice: "Connexion sécurisée",
        poweredBy: "Propulsé par",
        needHelp: "Besoin d'aide ?"
    },
    
    // ============================================================
    // GERMAN
    // ============================================================
    de: {
        _meta: {
            name: "German",
            nativeName: "Deutsch",
            dir: "ltr",
            flag: "🇩🇪"
        },
        
        welcomeTitle: "Willkommen zurück",
        welcomeSubtitle: "Bitte melden Sie sich an",
        
        usernameLabel: "Benutzername",
        usernamePlaceholder: "Geben Sie Ihren Benutzernamen ein",
        passwordLabel: "Passwort",
        passwordPlaceholder: "Geben Sie Ihr Passwort ein",
        loginButton: "Anmelden",
        signingIn: "Anmeldung läuft...",
        
        rememberMe: "Angemeldet bleiben",
        forgotPassword: "Passwort vergessen?",
        
        mfaTitle: "Zwei-Faktor-Authentifizierung",
        mfaSubtitle: "Geben Sie den Bestätigungscode ein",
        
        captchaLabel: "Sicherheitsüberprüfung",
        captchaRefresh: "Neuer Code",
        captchaAudio: "Anhören",
        
        passwordStrength: "Passwortstärke",
        passwordWeak: "Schwach",
        passwordGood: "Gut",
        passwordStrong: "Stark",
        
        ssoSeparator: "oder anmelden mit",
        
        sessionWarningTitle: "Sitzung läuft ab",
        sessionExtendButton: "Angemeldet bleiben",
        sessionLogoutButton: "Abmelden",
        
        error2: "Ungültiger Benutzername oder Passwort.",
        error3: "Ihre Sitzung ist abgelaufen.",
        
        webauthnButton: "Mit Passkey anmelden",
        
        offlineMessage: "Sie sind offline.",
        securityNotice: "Sichere Verbindung",
        needHelp: "Hilfe benötigt?"
    },
    
    // ============================================================
    // PORTUGUESE
    // ============================================================
    pt: {
        _meta: {
            name: "Portuguese",
            nativeName: "Português",
            dir: "ltr",
            flag: "🇧🇷"
        },
        
        welcomeTitle: "Bem-vindo de volta",
        welcomeSubtitle: "Por favor, faça login para acessar suas aplicações",
        
        usernameLabel: "Usuário",
        usernamePlaceholder: "Digite seu nome de usuário",
        passwordLabel: "Senha",
        passwordPlaceholder: "Digite sua senha",
        loginButton: "Entrar",
        signingIn: "Entrando...",
        
        rememberMe: "Lembrar-me neste dispositivo",
        forgotPassword: "Esqueceu sua senha?",
        
        mfaTitle: "Autenticação de Dois Fatores",
        captchaLabel: "Verificação de Segurança",
        
        passwordStrength: "Força da Senha",
        passwordWeak: "Fraca",
        passwordGood: "Boa",
        passwordStrong: "Forte",
        
        ssoSeparator: "ou entre com",
        
        error2: "Usuário ou senha inválidos.",
        error3: "Sua sessão expirou.",
        
        webauthnButton: "Entrar com Passkey",
        
        offlineMessage: "Você parece estar offline.",
        securityNotice: "Conexão segura",
        needHelp: "Precisa de ajuda?"
    },
    
    // ============================================================
    // CHINESE (Simplified)
    // ============================================================
    zh: {
        _meta: {
            name: "Chinese",
            nativeName: "中文",
            dir: "ltr",
            flag: "🇨🇳"
        },
        
        welcomeTitle: "欢迎回来",
        welcomeSubtitle: "请登录以访问您的应用程序",
        
        usernameLabel: "用户名",
        usernamePlaceholder: "请输入用户名",
        passwordLabel: "密码",
        passwordPlaceholder: "请输入密码",
        loginButton: "登录",
        signingIn: "正在登录...",
        
        rememberMe: "记住我",
        forgotPassword: "忘记密码？",
        
        mfaTitle: "双重身份验证",
        mfaSubtitle: "请输入验证码",
        
        captchaLabel: "安全验证",
        captchaRefresh: "换一个",
        captchaAudio: "语音",
        
        passwordStrength: "密码强度",
        passwordWeak: "弱",
        passwordGood: "良好",
        passwordStrong: "强",
        
        ssoSeparator: "或使用以下方式登录",
        
        sessionWarningTitle: "会话即将过期",
        sessionExtendButton: "保持登录",
        sessionLogoutButton: "退出登录",
        
        error2: "用户名或密码错误",
        error3: "会话已过期，请重新登录",
        
        webauthnButton: "使用通行密钥登录",
        
        offlineMessage: "您似乎处于离线状态",
        securityNotice: "安全连接",
        needHelp: "需要帮助？"
    },
    
    // ============================================================
    // JAPANESE
    // ============================================================
    ja: {
        _meta: {
            name: "Japanese",
            nativeName: "日本語",
            dir: "ltr",
            flag: "🇯🇵"
        },
        
        welcomeTitle: "おかえりなさい",
        welcomeSubtitle: "アプリケーションにアクセスするにはサインインしてください",
        
        usernameLabel: "ユーザー名",
        usernamePlaceholder: "ユーザー名を入力",
        passwordLabel: "パスワード",
        passwordPlaceholder: "パスワードを入力",
        loginButton: "サインイン",
        signingIn: "サインイン中...",
        
        rememberMe: "ログイン状態を保持",
        forgotPassword: "パスワードをお忘れですか？",
        
        mfaTitle: "二要素認証",
        captchaLabel: "セキュリティ確認",
        
        passwordStrength: "パスワード強度",
        passwordWeak: "弱い",
        passwordGood: "良い",
        passwordStrong: "強い",
        
        ssoSeparator: "または以下でサインイン",
        
        error2: "ユーザー名またはパスワードが無効です",
        error3: "セッションの有効期限が切れました",
        
        webauthnButton: "パスキーでサインイン",
        
        offlineMessage: "オフラインのようです",
        securityNotice: "セキュア接続",
        needHelp: "ヘルプが必要ですか？"
    },
    
    // ============================================================
    // ARABIC (RTL)
    // ============================================================
    ar: {
        _meta: {
            name: "Arabic",
            nativeName: "العربية",
            dir: "rtl",
            flag: "🇸🇦"
        },
        
        welcomeTitle: "مرحباً بعودتك",
        welcomeSubtitle: "يرجى تسجيل الدخول للوصول إلى تطبيقاتك",
        
        usernameLabel: "اسم المستخدم",
        usernamePlaceholder: "أدخل اسم المستخدم",
        passwordLabel: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        loginButton: "تسجيل الدخول",
        signingIn: "جاري تسجيل الدخول...",
        
        rememberMe: "تذكرني على هذا الجهاز",
        forgotPassword: "نسيت كلمة المرور؟",
        
        mfaTitle: "المصادقة الثنائية",
        mfaSubtitle: "أدخل رمز التحقق",
        
        captchaLabel: "التحقق الأمني",
        captchaRefresh: "رمز جديد",
        captchaAudio: "استماع",
        captchaAudioInstructions: "استمع إلى الصوت واكتب ما تسمعه",
        
        passwordStrength: "قوة كلمة المرور",
        passwordWeak: "ضعيفة",
        passwordGood: "جيدة",
        passwordStrong: "قوية",
        
        ssoSeparator: "أو سجل الدخول باستخدام",
        
        sessionWarningTitle: "انتهاء الجلسة",
        sessionExtendButton: "البقاء متصلاً",
        sessionLogoutButton: "تسجيل الخروج",
        
        error2: "اسم المستخدم أو كلمة المرور غير صحيحة",
        error3: "انتهت صلاحية جلستك",
        
        webauthnButton: "تسجيل الدخول باستخدام مفتاح المرور",
        
        offlineMessage: "يبدو أنك غير متصل بالإنترنت",
        securityNotice: "اتصال آمن",
        needHelp: "تحتاج مساعدة؟"
    },
    
    // ============================================================
    // HEBREW (RTL)
    // ============================================================
    he: {
        _meta: {
            name: "Hebrew",
            nativeName: "עברית",
            dir: "rtl",
            flag: "🇮🇱"
        },
        
        welcomeTitle: "ברוך שובך",
        welcomeSubtitle: "אנא התחבר כדי לגשת ליישומים שלך",
        
        usernameLabel: "שם משתמש",
        usernamePlaceholder: "הזן את שם המשתמש",
        passwordLabel: "סיסמה",
        passwordPlaceholder: "הזן את הסיסמה",
        loginButton: "התחבר",
        signingIn: "מתחבר...",
        
        rememberMe: "זכור אותי במכשיר זה",
        forgotPassword: "שכחת סיסמה?",
        
        mfaTitle: "אימות דו-שלבי",
        captchaLabel: "אימות אבטחה",
        
        passwordStrength: "חוזק הסיסמה",
        passwordWeak: "חלשה",
        passwordGood: "טובה",
        passwordStrong: "חזקה",
        
        ssoSeparator: "או התחבר באמצעות",
        
        error2: "שם משתמש או סיסמה שגויים",
        error3: "פג תוקף החיבור שלך",
        
        offlineMessage: "נראה שאתה לא מחובר לאינטרנט",
        securityNotice: "חיבור מאובטח",
        needHelp: "צריך עזרה?"
    },
    
    // ============================================================
    // HINDI
    // ============================================================
    hi: {
        _meta: {
            name: "Hindi",
            nativeName: "हिन्दी",
            dir: "ltr",
            flag: "🇮🇳"
        },
        
        welcomeTitle: "वापसी पर स्वागत है",
        welcomeSubtitle: "अपने एप्लिकेशन तक पहुंचने के लिए कृपया साइन इन करें",
        
        usernameLabel: "उपयोगकर्ता नाम",
        usernamePlaceholder: "अपना उपयोगकर्ता नाम दर्ज करें",
        passwordLabel: "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        loginButton: "साइन इन करें",
        signingIn: "साइन इन हो रहा है...",
        
        rememberMe: "इस डिवाइस पर मुझे याद रखें",
        forgotPassword: "पासवर्ड भूल गए?",
        
        mfaTitle: "दो-कारक प्रमाणीकरण",
        captchaLabel: "सुरक्षा सत्यापन",
        captchaAudio: "सुनें",
        captchaAudioInstructions: "ऑडियो सुनें और जो सुनें वह टाइप करें",
        
        passwordStrength: "पासवर्ड की मजबूती",
        passwordWeak: "कमजोर",
        passwordGood: "अच्छा",
        passwordStrong: "मजबूत",
        
        ssoSeparator: "या इसके साथ साइन इन करें",
        
        error2: "अमान्य उपयोगकर्ता नाम या पासवर्ड",
        error3: "आपका सत्र समाप्त हो गया है",
        
        offlineMessage: "आप ऑफ़लाइन प्रतीत होते हैं",
        securityNotice: "सुरक्षित कनेक्शन",
        needHelp: "मदद चाहिए?"
    }
};

// Helper function to get translation
function getTranslation(langCode, key, fallback = null) {
    const lang = DominoLoginI18n[langCode] || DominoLoginI18n['en'];
    return lang[key] || DominoLoginI18n['en'][key] || fallback || key;
}

// Helper function to get all available languages
function getAvailableLanguages() {
    return Object.keys(DominoLoginI18n).map(code => ({
        code,
        ...DominoLoginI18n[code]._meta
    }));
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DominoLoginI18n, getTranslation, getAvailableLanguages };
}
