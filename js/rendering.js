// ============================================
// 🎨 MODULE RENDERING.JS
// ============================================
// Fonctions de génération HTML pour :
// - Landing Page
// - Pages d'authentification
// - Dashboard (admin et referrer)
// ============================================
// Version: 3.5.0 - Ajout illustration Dubai dashboard
// Date: 1 décembre 2025
// ============================================
/**
 * Génère le HTML de la landing page
 * @returns {string} HTML de la landing page
 */
export function renderLandingPage() {
    const t = (key) => window.i18next.t(key);
    
    return `
        <div class="min-h-screen">
            <header class="container mx-auto px-4 py-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-yellow-400">${t('nav.brand')}</h1>
                    
                    <!-- Desktop Navigation -->
                    <div class="hidden lg:flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <button onclick="changeLanguage('fr')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Français">🇫🇷</button>
                            <button onclick="changeLanguage('en')" class="text-2xl hover:scale-125 transition-transform duration-200" title="English">🇬🇧</button>
                            <button onclick="changeLanguage('ar')" class="text-2xl hover:scale-125 transition-transform duration-200" title="العربية">🇦🇪</button>
                            <button onclick="changeLanguage('ru')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Русский">🇷🇺</button>
                            <button onclick="changeLanguage('hi')" class="text-2xl hover:scale-125 transition-transform duration-200" title="हिन्दी">🇮🇳</button>
                            <button onclick="changeLanguage('ur')" class="text-2xl hover:scale-125 transition-transform duration-200" title="اردو">🇵🇰</button>
                            <button onclick="changeLanguage('zh')" class="text-2xl hover:scale-125 transition-transform duration-200" title="中文">🇨🇳</button>
                            <button onclick="changeLanguage('tl')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Tagalog">🇵🇭</button>
                        </div>
                        <a href="how-it-works.html" class="text-white hover:text-yellow-400 transition font-medium px-4 py-2">${t('nav.how_it_works')}</a>
                        <button onclick="showLogin()" class="text-white hover:text-yellow-400 transition font-medium px-4 py-2">${t('nav.login')}</button>
                        <button onclick="showSignup()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-lg transition">${t('nav.signup')}</button>
                    </div>
                    <!-- Mobile Menu Button -->
                    <button onclick="toggleMobileMenu()" class="lg:hidden text-white text-3xl">
                        <span id="menuIcon">☰</span>
                    </button>
                </div>
                
                <!-- Mobile Menu -->
                <div id="mobileMenu" class="hidden lg:hidden mt-4 bg-gray-800/95 backdrop-blur-md rounded-xl p-4 space-y-3">
                    <div class="flex flex-wrap gap-2 justify-center pb-3 border-b border-gray-700">
                        <button onclick="changeLanguage('fr')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Français">🇫🇷</button>
                        <button onclick="changeLanguage('en')" class="text-2xl hover:scale-125 transition-transform duration-200" title="English">🇬🇧</button>
                        <button onclick="changeLanguage('ar')" class="text-2xl hover:scale-125 transition-transform duration-200" title="العربية">🇦🇪</button>
                        <button onclick="changeLanguage('ru')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Русский">🇷🇺</button>
                        <button onclick="changeLanguage('hi')" class="text-2xl hover:scale-125 transition-transform duration-200" title="हिन्दी">🇮🇳</button>
                        <button onclick="changeLanguage('ur')" class="text-2xl hover:scale-125 transition-transform duration-200" title="اردو">🇵🇰</button>
                        <button onclick="changeLanguage('zh')" class="text-2xl hover:scale-125 transition-transform duration-200" title="中文">🇨🇳</button>
                        <button onclick="changeLanguage('tl')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Tagalog">🇵🇭</button>
                    </div>
                    <a href="how-it-works.html" class="block text-center text-white hover:text-yellow-400 transition font-medium py-2">${t('nav.how_it_works')}</a>
                    <button onclick="showLogin(); toggleMobileMenu();" class="w-full text-center text-white hover:text-yellow-400 transition font-medium py-2">${t('nav.login')}</button>
                    <button onclick="showSignup(); toggleMobileMenu();" class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">${t('nav.signup')}</button>
                </div>
            </header>
            
            <main class="container mx-auto px-4 py-20">
                <div class="text-center mb-12">
                    <h2 class="text-5xl md:text-6xl font-bold mb-6">
                        ${t('hero.title')}
                    </h2>
                    <p class="text-xl text-gray-300 mb-8">
                        ${t('hero.subtitle')}
                    </p>
                    <button onclick="showSignup()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg px-8 py-4 rounded-lg transition transform hover:scale-105">
                        ${t('hero.cta_button')}
                    </button>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6 my-16">
                    <div class="rounded-xl overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Burj Khalifa Dubai" class="w-full h-64 object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80" alt="Dubai Marina" class="w-full h-64 object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80" alt="Dubai Skyline" class="w-full h-64 object-cover">
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8 mt-20">
                    <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 text-center">
                        <div class="text-4xl font-bold text-yellow-500 mb-2">${t('stats.commission_value')}</div>
                        <div class="text-gray-300">${t('stats.commission_label')}</div>
                    </div>
                    <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 text-center">
                        <div class="text-4xl font-bold text-yellow-500 mb-2">${t('stats.support_value')}</div>
                        <div class="text-gray-300">${t('stats.support_label')}</div>
                    </div>
                    <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 text-center">
                        <div class="text-4xl font-bold text-yellow-500 mb-2">${t('stats.timeline_value')}</div>
                        <div class="text-gray-300">${t('stats.timeline_label')}</div>
                    </div>
                </div>
                
                <div class="mt-20 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-12">
                    <h3 class="text-3xl font-bold text-center mb-12">${t('gains.title')}</h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-gray-900 bg-opacity-50 rounded-xl p-8">
                            <div class="text-yellow-500 text-xl font-bold mb-4">${t('gains.sale_title')}</div>
                            <div class="space-y-3 text-gray-300">
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_1_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.sale_example_1_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_2_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.sale_example_2_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_3_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.sale_example_3_commission')}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-900 bg-opacity-50 rounded-xl p-8">
                            <div class="text-yellow-500 text-xl font-bold mb-4">${t('gains.rental_title')}</div>
                            <div class="space-y-3 text-gray-300">
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_1_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.rental_example_1_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_2_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.rental_example_2_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_3_property')}</span>
                                    <span class="font-bold text-yellow-500">${t('gains.rental_example_3_commission')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer class="bg-gray-900 bg-opacity-80 backdrop-blur-md mt-20">
                <div class="container mx-auto px-4 py-12">
                    <div class="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.navigation_title')}</h3>
                            <ul class="space-y-2">
                                <li><button onclick="backToHome()" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.home')}</button></li>
                                <li><a href="how-it-works.html" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.how_it_works')}</a></li>
                                <li><button onclick="showLogin()" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.login')}</button></li>
                                <li><button onclick="showSignup()" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.signup')}</button></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.legal_title')}</h3>
                            <ul class="space-y-2">
                                <li><a href="terms.html" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.terms')}</a></li>
                                <li><a href="privacy.html" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.privacy')}</a></li>
                                <li><button onclick="downloadContractTemplate()" class="text-gray-300 hover:text-yellow-400 transition">${t('common:footer.contract_template')}</button></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.contact_title')}</h3>
                            <ul class="space-y-3 text-gray-300">
                                <li class="flex items-center gap-2">
                                    <span>📧</span>
                                    <a href="mailto:contact@real-estate-referrer.com" class="hover:text-yellow-400 transition">${t('common:footer.email')}</a>
                                </li>
                                <li class="flex items-center gap-2">
                                    <span>📍</span>
                                    <span>${t('common:footer.location')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-700 pt-6 text-center text-gray-400">
                        ${t('common:footer.copyright')}
                    </div>
                </div>
            </footer>
        </div>
    `;
}
/**
 * Génère le HTML des pages d'authentification
 * @param {string} mode - Mode: 'login', 'signup', 'reset', 'change-password', '2fa'
 * @returns {string} HTML de la page d'authentification
 */
export function renderAuthPage(mode) {
    const t = (key) => window.i18next.t(key);
    
    let title, subtitle, formContent, buttonText, linkText, linkAction;
    
    // Configuration selon le mode
    if (mode === 'login') {
        title = t('auth:login_title');
        buttonText = t('auth:login_button');
        linkText = t('auth:no_account');
        linkAction = 'showSignup()';
    } else if (mode === 'signup') {
        title = t('auth:signup_title');
        buttonText = t('auth:signup_button');
        linkText = t('auth:have_account');
        linkAction = 'showLogin()';
    } else if (mode === 'reset') {
        title = t('auth:reset_title');
        buttonText = t('auth:reset_button');
        linkText = t('auth:back_to_login');
        linkAction = 'showLogin()';
    } 
    // ✅ MODE 2FA - Vérification du code SMS (CORRIGÉ v3.4.2 - IDs ajoutés)
    else if (mode === '2fa') {
        const tempPhone = window.tempPhone || '';
        const maskedPhone = tempPhone ? (tempPhone.slice(0, -4).replace(/\d/g, '*') + tempPhone.slice(-4)) : '***';
        const currentLang = (window.i18next?.language || 'fr').substring(0, 2);
        
        // ✅ Traductions directes pour éviter les problèmes d'interpolation
        const twoFactorTranslations = {
            fr: {
                title: 'Vérification SMS',
                subtitle: `Code envoyé au ${maskedPhone}`,
                code_label: 'Code de vérification (6 chiffres)',
                code_help: 'Entrez le code à 6 chiffres reçu par SMS',
                verify_button: 'Vérifier',
                resend_code: 'Renvoyer le code',
                back_to_signup: '← Retour à l\'inscription',
                back_button: '← Retour'
            },
            en: {
                title: 'SMS Verification',
                subtitle: `Code sent to ${maskedPhone}`,
                code_label: 'Verification code (6 digits)',
                code_help: 'Enter the 6-digit code received by SMS',
                verify_button: 'Verify',
                resend_code: 'Resend code',
                back_to_signup: '← Back to signup',
                back_button: '← Back'
            },
            ar: {
                title: 'التحقق عبر الرسائل القصيرة',
                subtitle: `تم إرسال الرمز إلى ${maskedPhone}`,
                code_label: 'رمز التحقق (6 أرقام)',
                code_help: 'أدخل الرمز المكون من 6 أرقام المستلم عبر الرسائل القصيرة',
                verify_button: 'تحقق',
                resend_code: 'إعادة إرسال الرمز',
                back_to_signup: '← العودة إلى التسجيل',
                back_button: '← رجوع'
            },
            ru: {
                title: 'Проверка по SMS',
                subtitle: `Код отправлен на ${maskedPhone}`,
                code_label: 'Код подтверждения (6 цифр)',
                code_help: 'Введите 6-значный код, полученный по SMS',
                verify_button: 'Подтвердить',
                resend_code: 'Отправить код повторно',
                back_to_signup: '← Вернуться к регистрации',
                back_button: '← Назад'
            },
            hi: {
                title: 'SMS सत्यापन',
                subtitle: `कोड ${maskedPhone} पर भेजा गया`,
                code_label: 'सत्यापन कोड (6 अंक)',
                code_help: 'SMS द्वारा प्राप्त 6 अंकों का कोड दर्ज करें',
                verify_button: 'सत्यापित करें',
                resend_code: 'कोड पुनः भेजें',
                back_to_signup: '← पंजीकरण पर वापस जाएं',
                back_button: '← वापस'
            },
            ur: {
                title: 'SMS تصدیق',
                subtitle: `کوڈ ${maskedPhone} پر بھیجا گیا`,
                code_label: 'تصدیقی کوڈ (6 ہندسے)',
                code_help: 'SMS کے ذریعے موصول ہونے والا 6 ہندسوں کا کوڈ درج کریں',
                verify_button: 'تصدیق کریں',
                resend_code: 'کوڈ دوبارہ بھیجیں',
                back_to_signup: '← رجسٹریشن پر واپس جائیں',
                back_button: '← واپس'
            },
            zh: {
                title: '短信验证',
                subtitle: `验证码已发送至 ${maskedPhone}`,
                code_label: '验证码（6位数字）',
                code_help: '请输入短信收到的6位验证码',
                verify_button: '验证',
                resend_code: '重新发送验证码',
                back_to_signup: '← 返回注册',
                back_button: '← 返回'
            },
            tl: {
                title: 'SMS Verification',
                subtitle: `Code ipinadala sa ${maskedPhone}`,
                code_label: 'Verification code (6 digits)',
                code_help: 'Ilagay ang 6-digit code na natanggap sa SMS',
                verify_button: 'I-verify',
                resend_code: 'Ipadala muli ang code',
                back_to_signup: '← Bumalik sa signup',
                back_button: '← Bumalik'
            }
        };
        
        const trans = twoFactorTranslations[currentLang] || twoFactorTranslations['en'];
        
        // ✅ CORRIGÉ: Ajout des IDs verify2faBtn et error2fa
        return `
            <div class="min-h-screen flex items-center justify-center px-4">
                <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
                    <button onclick="window.backTo2FASignup()" class="text-gray-400 hover:text-white mb-6 flex items-center">
                        ${trans.back_button}
                    </button>
                    
                    <h2 class="text-3xl font-bold mb-2 text-center">${trans.title}</h2>
                    <p class="text-center text-gray-400 mb-6">${trans.subtitle}</p>
                    
                    <form id="form2FA" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                ${trans.code_label}
                            </label>
                            <input 
                                type="text" 
                                id="code2fa" 
                                inputmode="numeric"
                                pattern="[0-9]{6}"
                                maxlength="6"
                                placeholder="000000"
                                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 text-center text-2xl tracking-widest font-mono"
                                required
                                autocomplete="one-time-code"
                            />
                            <p class="mt-2 text-sm text-gray-400">
                                ${trans.code_help}
                            </p>
                        </div>
                        
                        <!-- ✅ CORRIGÉ: ID changé de authError à error2fa -->
                        <div id="error2fa" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"></div>
                        
                        <!-- ✅ CORRIGÉ: Ajout de id="verify2faBtn" -->
                        <button 
                            type="submit" 
                            id="verify2faBtn"
                            class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 rounded-lg transition transform hover:scale-105"
                        >
                            ${trans.verify_button}
                        </button>
                        
                        <div class="text-center">
                            <button 
                                type="button"
                                id="resendBtn"
                                onclick="window.resend2FACode()"
                                class="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                            >
                                ${trans.resend_code}
                            </button>
                        </div>
                        <div class="text-center">
                            <button 
                                type="button"
                                onclick="window.backTo2FASignup()"
                                class="text-gray-400 hover:text-white text-sm"
                            >
                                ${trans.back_to_signup}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
    else if (mode === 'change-password') {
        title = 'Nouveau mot de passe';
        buttonText = 'Changer le mot de passe';
        linkText = 'Retour à la connexion';
        linkAction = 'showLogin()';
    }
    
    return `
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
                <button onclick="backToHome()" class="text-gray-400 hover:text-white mb-6 flex items-center">
                    ← ${t('auth:back_home')}
                </button>
                
                <h2 class="text-3xl font-bold mb-6 text-center">${title}</h2>
                
                ${mode === 'login' || mode === 'signup' ? `
                    <!-- OAuth Buttons -->
                    <div class="space-y-3 mb-6">
                        <button onclick="signInWithGoogle()" type="button"
                                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span class="font-semibold">${t('auth:continue_with_google')}</span>
                        </button>
                        
                        <button onclick="signInWithApple()" type="button"
                                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-lg border-2 border-gray-800 hover:border-gray-700 transition-all">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span class="font-semibold">${t('auth:continue_with_apple')}</span>
                        </button>
                    </div>
                    
                    <!-- Separator -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-600"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-gray-800 text-gray-400">OR</span>
                        </div>
                    </div>
                ` : ''}
                
                <form id="authForm" class="space-y-4">
                    ${mode === 'signup' ? `
                        <div>
                            <label class="block mb-2 font-medium">${t('auth:name_label')}</label>
                            <input 
                                type="text" 
                                id="name" 
                                required 
                                minlength="2"
                                maxlength="100"
                                placeholder="${t('auth:full_name_placeholder')}"
                                class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
                                oninput="validateName()"
                            >
                            <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                        
                        <div>
                            <label class="block mb-2 font-medium">${t('auth:phone_label')}</label>
                            <div class="flex gap-2">
                                <select 
                                    id="countryCode" 
                                    class="w-32 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
                                >
                                    <option value="+971">🇦🇪 +971</option>
                                    <option value="+33">🇫🇷 +33</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+966">🇸🇦 +966</option>
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+92">🇵🇰 +92</option>
                                    <option value="+86">🇨🇳 +86</option>
                                    <option value="+63">🇵🇭 +63</option>
                                    <option value="+7">🇷🇺 +7</option>
                                    <option value="+20">🇪🇬 +20</option>
                                    <option value="+1">🇺🇸 +1</option>
                                </select>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    required 
                                    placeholder="${t('auth:phone_placeholder')}"
                                    class="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
                                    oninput="validatePhone()"
                                >
                            </div>
                            <div class="flex items-start gap-2 bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-2">
                                <span class="text-blue-400 text-lg flex-shrink-0">ℹ️</span>
                                <p class="text-xs text-blue-200">${t('auth:sms_verification_notice')}</p>
                            </div>
                            <div id="phoneError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                    ` : ''}
                    
                    ${mode !== 'change-password' ? `
                        <div>
                            <label class="block mb-2 font-medium">${t('auth:email_label')}</label>
                            <input 
                                type="email" 
                                id="email" 
                                required 
                                placeholder="${t('auth:email_placeholder')}"
                                class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors"
                                ${mode === 'signup' ? 'oninput="validateEmail()"' : ''}
                            >
                            ${mode === 'signup' ? '<div id="emailError" class="text-red-400 text-sm mt-1 hidden"></div>' : ''}
                        </div>
                    ` : ''}
                    
                    ${mode !== 'reset' ? `
                        <div>
                            <label class="block mb-2 font-medium">${mode === 'change-password' ? 'Nouveau mot de passe' : t('auth:password_label')}</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="${mode === 'change-password' ? 'newPassword' : 'password'}" 
                                    required 
                                    minlength="8" 
                                    placeholder="••••••••"
                                    class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none pr-12 transition-colors"
                                    ${mode === 'signup' || mode === 'change-password' ? 'oninput="validatePassword()"' : ''}
                                >
                                <button 
                                    type="button" 
                                    onclick="togglePasswordVisibility('${mode === 'change-password' ? 'newPassword' : 'password'}', this)" 
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <span class="text-xl">👁️</span>
                                </button>
                            </div>
                            ${mode === 'signup' || mode === 'change-password' ? `
                                <div class="mt-2">
                                    <div class="flex items-center gap-2 text-xs text-gray-400">
                                        <div id="passwordStrength" class="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                                            <div id="passwordStrengthBar" class="h-full w-0 transition-all duration-300"></div>
                                        </div>
                                        <span id="passwordStrengthText" class="min-w-[60px]"></span>
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1.5 space-y-0.5">
                                        <div id="req-length" class="flex items-center gap-1">
                                            <span class="w-3">•</span>
                                            <span>${t('auth:password_req_length')}</span>
                                        </div>
                                        <div id="req-letter" class="flex items-center gap-1">
                                            <span class="w-3">•</span>
                                            <span>${t('auth:password_req_letter')}</span>
                                        </div>
                                        <div id="req-number" class="flex items-center gap-1">
                                            <span class="w-3">•</span>
                                            <span>${t('auth:password_req_number')}</span>
                                        </div>
                                        <div id="req-special" class="flex items-center gap-1">
                                            <span class="w-3">•</span>
                                            <span>${t('auth:password_req_special')}</span>
                                        </div>
                                    </div>
                                </div>
                            ` : '<div class="text-sm text-gray-400 mt-1">' + t('auth:password_hint') + '</div>'}
                            <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                            <div id="passwordStrength" class="hidden mt-2"></div>
                        </div>
                    ` : ''}
                    
                    ${mode === 'signup' || mode === 'change-password' ? `
                        <div>
                            <label class="block mb-2 font-medium">${mode === 'change-password' ? 'Confirmer le nouveau mot de passe' : t('auth:confirm_password_label')}</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}" 
                                    required 
                                    minlength="8" 
                                    placeholder="••••••••"
                                    class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none pr-12 transition-colors"
                                    oninput="validateConfirmPassword()"
                                >
                                <button 
                                    type="button" 
                                    onclick="togglePasswordVisibility('${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}', this)" 
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <span class="text-xl">👁️</span>
                                </button>
                            </div>
                            <div id="confirmPasswordError" class="text-red-400 text-sm mt-1 hidden"></div>
                            <div id="confirmPasswordSuccess" class="text-green-400 text-sm mt-1 hidden flex items-center gap-1">
                                <span>✓</span>
                                <span>${t('auth:password_validation.passwords_match')}</span>
                            </div>
                            <div id="passwordMatchIndicator" class="hidden mt-2"></div>
                        </div>
                    ` : ''}
                    
                    ${mode === 'login' ? `
                        <div class="text-right">
                            <button type="button" onclick="showReset()" class="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                                ${t('auth:forgot_password')}
                            </button>
                        </div>
                    ` : ''}
                    
                    <div id="authError" class="text-red-400 text-sm hidden bg-red-900/20 border border-red-500/50 rounded-lg p-3"></div>
                    
                    <button 
                        type="submit" 
                        id="submitButton"
                        class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        ${mode === 'signup' || mode === 'change-password' ? 'disabled' : ''}
                    >
                        ${buttonText}
                    </button>
                </form>
                
                <p class="text-center mt-6 text-gray-400">
                    <button onclick="${linkAction}" class="text-yellow-400 hover:text-yellow-300 transition-colors">
                        ${linkText}
                    </button>
                </p>
            </div>
        </div>
    `;
}
/**
 * Génère le HTML du dashboard (admin ou referrer)
 * @returns {string} HTML du dashboard
 */
export function renderDashboard() {
    const t = (key) => window.i18next.t(key);
    const userProfile = window.userProfile;
    
    console.log('🧭 DEBUG renderDashboard called', {
        userProfile,
        role: userProfile?.role,
        contract_path: userProfile?.contract_path,
        contract_file_url: userProfile?.contract_file_url,
        contract_status: userProfile?.contract_status,
    });
    
    if (!userProfile) {
        return '<div class="min-h-screen flex items-center justify-center"><div class="text-xl">⏳ Chargement du profil...</div></div>';
    }
    
    const isAdmin = userProfile.role === 'admin';
    
    // Vérification contrat - accepte signed, validated, approved
    const hasValidContract = userProfile.contract_path || 
                            userProfile.contract_file_url || 
                            ['signed', 'validated', 'approved'].includes(userProfile.contract_status);
    
    console.log('📄 Contract check:', {
        contract_path: userProfile.contract_path,
        contract_file_url: userProfile.contract_file_url,
        contract_status: userProfile.contract_status,
        hasValidContract: hasValidContract
    });
    
    const dashboardTitle = isAdmin ? t('dashboard:admin_title') : t('dashboard:referrer_title');
    
    return `
        <div class="min-h-screen">
            <header class="bg-gray-800 bg-opacity-50 backdrop-blur-md">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-yellow-400">${dashboardTitle}</h1>
                        <div class="flex items-center gap-4">
                            <span class="text-gray-300">${userProfile.name}</span>
                            <button onclick="logout()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                                ${t('dashboard:logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="container mx-auto px-4 py-8">
                ${!hasValidContract && !isAdmin ? `
                    <div id="contractRequirement" class="mb-6 bg-gradient-to-r from-blue-900/50 to-yellow-900/50 border-2 border-yellow-500 p-8 rounded-xl shadow-2xl">
                        <div class="flex flex-col lg:flex-row gap-8">
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-yellow-400 mb-4">
                                    📝 ${t('dashboard:contract.required')}
                                </h3>
                                
                                <div class="bg-white/10 rounded-lg p-4 mb-6">
                                    <h4 class="font-bold text-white mb-3">
                                        ❓ ${t('dashboard:contract.what_is_it')}
                                    </h4>
                                    <p class="text-gray-300 text-sm mb-3">
                                        ${t('dashboard:contract.explanation')}
                                    </p>
                                    <ul class="space-y-2 text-sm text-gray-300 ml-4">
                                        <li>✅ <strong>${t('dashboard:contract.benefit1_title')}</strong> ${t('dashboard:contract.benefit1_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit2_title')}</strong> ${t('dashboard:contract.benefit2_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit3_title')}</strong> ${t('dashboard:contract.benefit3_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit4_title')}</strong> ${t('dashboard:contract.benefit4_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit5_title')}</strong> ${t('dashboard:contract.benefit5_desc')}</li>
                                    </ul>
                                </div>
                                <div class="grid md:grid-cols-2 gap-8">
                                    <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-2 border-green-500/50 p-6 rounded-lg">
                                        <div class="flex items-center gap-3 mb-4">
                                            <span class="text-4xl">✍️</span>
                                            <div>
                                                <h4 class="font-bold text-green-300 text-lg">${t('dashboard:contract.electronic_signature')}</h4>
                                                <p class="text-xs text-gray-400">${t('dashboard:contract.electronic_signature_intro')}</p>
                                            </div>
                                        </div>
                                        
                                        <ul class="space-y-2 text-sm text-gray-300 mb-4">
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>${t('dashboard:contract.signature_feature_1')}</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>${t('dashboard:contract.signature_feature_2')}</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>${t('dashboard:contract.signature_feature_3')}</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>${t('dashboard:contract.signature_feature_4')}</span>
                                            </li>
                                        </ul>
                                        
                                        <a href="/contract-signature.html" 
                                           class="block w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition text-center">
                                            🖊️ ${t('dashboard:contract.sign_now_button')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${hasValidContract && !isAdmin ? `
                    <div id="contractUploaded" class="mb-6 bg-gradient-to-r from-green-900/50 to-blue-900/30 border border-green-500/50 p-6 rounded-xl shadow-lg">
                        <div class="flex flex-col md:flex-row items-center gap-6">
                            <!-- Illustration Dubai Skyline -->
                            <div class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
                                <svg viewBox="0 0 200 200" class="w-full h-full">
                                    <!-- Ciel gradient -->
                                    <defs>
                                        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0.3" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="200" height="200" fill="url(#skyGrad)" rx="20"/>
                                    
                                    <!-- Soleil/Lune -->
                                    <circle cx="160" cy="40" r="20" fill="#fbbf24" opacity="0.8"/>
                                    
                                    <!-- Burj Khalifa (centre) -->
                                    <polygon points="100,30 95,150 105,150" fill="#1e293b"/>
                                    <polygon points="100,30 92,150 108,150" fill="#334155" opacity="0.5"/>
                                    <rect x="97" y="50" width="6" height="3" fill="#fbbf24" opacity="0.8"/>
                                    <rect x="97" y="60" width="6" height="3" fill="#fbbf24" opacity="0.8"/>
                                    <rect x="97" y="70" width="6" height="3" fill="#fbbf24" opacity="0.8"/>
                                    <rect x="97" y="80" width="6" height="3" fill="#fbbf24" opacity="0.8"/>
                                    
                                    <!-- Buildings gauche -->
                                    <rect x="20" y="100" width="25" height="50" fill="#1e293b" rx="2"/>
                                    <rect x="50" y="80" width="20" height="70" fill="#334155" rx="2"/>
                                    <rect x="22" y="105" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    <rect x="28" y="105" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    <rect x="22" y="115" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    <rect x="28" y="115" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    
                                    <!-- Buildings droite -->
                                    <rect x="130" y="90" width="22" height="60" fill="#1e293b" rx="2"/>
                                    <rect x="155" y="110" width="25" height="40" fill="#334155" rx="2"/>
                                    <rect x="133" y="95" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    <rect x="140" y="95" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    <rect x="133" y="105" width="4" height="4" fill="#fbbf24" opacity="0.6"/>
                                    
                                    <!-- Sol/Eau -->
                                    <rect x="0" y="150" width="200" height="50" fill="#1e293b" rx="0 0 20 20"/>
                                    <rect x="10" y="155" width="180" height="2" fill="#fbbf24" opacity="0.3"/>
                                    <rect x="20" y="162" width="160" height="1" fill="#fbbf24" opacity="0.2"/>
                                    
                                    <!-- Checkmark de succès -->
                                    <circle cx="165" cy="165" r="20" fill="#22c55e"/>
                                    <polyline points="155,165 162,172 177,157" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            
                            <!-- Texte -->
                            <div class="text-center md:text-left flex-1">
                                <h3 class="text-2xl font-bold text-green-300 mb-2">${t('dashboard:contract.signed_validated')}</h3>
                                <p class="text-gray-300 mb-3">${t('dashboard:contract.can_add_leads')}</p>
                                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span class="bg-yellow-500/20 text-yellow-400 text-sm px-3 py-1 rounded-full">💰 25% commission acheteurs</span>
                                    <span class="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full">🏠 20% autres leads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div id="stats" class="grid md:grid-cols-4 gap-6 mb-8"></div>
                
                ${!isAdmin && hasValidContract ? `
                    <div class="mb-6">
                        <button 
                            id="addLeadBtn"
                            onclick="showAddLeadForm()" 
                            class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition"
                        >
                            ${t('dashboard:add_lead')}
                        </button>
                    </div>
                ` : ''}
                
                <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4">${isAdmin ? t('dashboard:all_leads') : t('dashboard:my_leads')}</h2>
                    <div id="leadsTable" class="overflow-x-auto"></div>
                </div>
            </main>
            
            <!-- ✅ NOUVEAU MODAL AJOUT LEAD avec commissions 25%/20% -->
            <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 class="text-2xl font-bold mb-6">${t('dashboard:add_lead')}</h3>
                    
                    <form id="addLeadForm" onsubmit="event.preventDefault(); window.addLead(event);">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-300 mb-2">${t('dashboard:client_name')} *</label>
                                <input type="text" id="clientName" required 
                                       class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-gray-300 mb-2">${t('dashboard:client_email')} *</label>
                                <input type="email" id="clientEmail" required 
                                       class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-gray-300 mb-2">${t('dashboard:client_phone')} *</label>
                                <input type="tel" id="clientPhone" required 
                                       class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-gray-300 mb-2">${t('dashboard:budget')} (AED) *</label>
                                <input type="text" id="budget" required inputmode="numeric" placeholder="1,500,000"
                                       class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                        </div>
                        
                        <!-- Type de lead avec commissions -->
                        <div class="mt-6">
                            <label class="block text-gray-300 mb-3">${t('dashboard:lead_type')} *</label>
                            
                            <div class="space-y-3">
                                <!-- 🏆 ACHETEUR - MIS EN AVANT -->
                                <label class="flex items-center p-4 bg-gradient-to-r from-yellow-900/50 to-yellow-700/30 border-2 border-yellow-500 rounded-xl cursor-pointer hover:bg-yellow-900/70 transition">
                                    <input type="radio" name="leadTypeRadio" value="sale_buyer" 
                                           onchange="document.getElementById('leadType').value='sale_buyer'"
                                           class="w-5 h-5 text-yellow-500 mr-4">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="text-2xl">🏆</span>
                                            <span class="font-bold text-yellow-400 text-lg">${t('dashboard:sale_buyer')}</span>
                                            <span class="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">${t('dashboard:recommended')}</span>
                                        </div>
                                        <p class="text-yellow-300 text-sm mt-1">${t('dashboard:commission')}: <strong>25%</strong> ${t('dashboard:of_agent_commission')}</p>
                                    </div>
                                </label>
                                
                                <!-- Autres types - Standard -->
                                <label class="flex items-center p-3 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="sale_seller" 
                                           onchange="document.getElementById('leadType').value='sale_seller'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:sale_seller')}</span>
                                        <span class="text-gray-400 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
                                    </div>
                                </label>
                                
                                <label class="flex items-center p-3 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_landlord" 
                                           onchange="document.getElementById('leadType').value='rental_landlord'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:rental_landlord')}</span>
                                        <span class="text-gray-400 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
                                    </div>
                                </label>
                                
                                <label class="flex items-center p-3 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_tenant" 
                                           onchange="document.getElementById('leadType').value='rental_tenant'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:rental_tenant')}</span>
                                        <span class="text-gray-400 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
                                    </div>
                                </label>
                            </div>
                            
                            <!-- Champ caché pour stocker la valeur -->
                            <input type="hidden" id="leadType" name="leadType" required>
                        </div>
                        
                        <!-- ✅ CHECKBOX CONSENTEMENT OBLIGATOIRE -->
                        <div class="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-xl">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" id="clientConsent" required
                                       class="w-5 h-5 mt-0.5 text-blue-500 rounded border-gray-500 focus:ring-blue-500">
                                <div>
                                    <span class="text-white font-medium">${t('dashboard:consent_checkbox_label')} *</span>
                                    <p class="text-gray-400 text-sm mt-1">${t('dashboard:consent_checkbox_description')}</p>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Boutons -->
                        <div class="flex gap-4 mt-8">
                            <button type="submit" 
                                    class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">
                                ${t('dashboard:add')}
                            </button>
                            <button type="button" onclick="window.closeAddLeadModal()" 
                                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition">
                                ${t('dashboard:cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
