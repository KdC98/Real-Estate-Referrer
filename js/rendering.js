// ============================================
// 🎨 MODULE RENDERING.JS
// ============================================
// Fonctions de génération HTML pour :
// - Landing Page
// - Pages d'authentification
// - Dashboard (admin et referrer)
// ============================================
// Version: 2.1 - Correction affichage téléphone 2FA
// Date: 24 novembre 2025
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
    // ✅ MODE 2FA - Vérification du code SMS
    else if (mode === '2fa') {
        const tempPhone = window.tempPhone || '';
        const maskedPhone = tempPhone.slice(0, -4).replace(/\d/g, '*') + tempPhone.slice(-4);
        
        title = t('auth:two_factor.title') || 'Vérification SMS';
        // ✅ CORRECTION : Utiliser la concaténation au lieu de template literal
        subtitle = t('auth:two_factor.subtitle', { phone: maskedPhone }) || 'Code envoyé au ' + maskedPhone;
        
        formContent = `
            <form id="form2FA" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-2">
                        ${t('auth:two_factor.code_label') || 'Code de vérification (6 chiffres)'}
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
                        ${t('auth:two_factor.code_help') || 'Entrez le code à 6 chiffres reçu par SMS'}
                    </p>
                </div>

                <div id="authError" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"></div>

                <button 
                    type="submit" 
                    class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                    ${t('auth:two_factor.verify_button') || 'Vérifier'}
                </button>

                <div class="text-center">
                    <button 
                        type="button"
                        onclick="window.resend2FACode()"
                        class="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                    >
                        ${t('auth:two_factor.resend_code') || 'Renvoyer le code'}
                    </button>
                </div>

                <div class="text-center">
                    <button 
                        type="button"
                        onclick="window.showSignup()"
                        class="text-gray-400 hover:text-white text-sm"
                    >
                        ${t('auth:two_factor.back_to_signup') || '← Retour à l\'inscription'}
                    </button>
                </div>
            </form>
        `;
        
        return `
            <div class="min-h-screen flex items-center justify-center px-4">
                <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
                    <button onclick="window.showSignup()" class="text-gray-400 hover:text-white mb-6 flex items-center">
                        ← Retour
                    </button>
                    
                    <h2 class="text-3xl font-bold mb-2 text-center">${title}</h2>
                    ${subtitle ? `<p class="text-center text-gray-400 mb-6">${subtitle}</p>` : ''}
                    
                    ${formContent}
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
                                    </div>
                                </div>
                            ` : `<div class="text-sm text-gray-400 mt-1">${t('auth:password_hint')}</div>`}
                            <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                            <!-- ✅ Indicateur de force du mot de passe EN TEMPS RÉEL -->
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
                                <span>Les mots de passe correspondent</span>
                            </div>
                            <!-- ✅ Indicateur de correspondance des mots de passe -->
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
    
    // Vérification contrat
    const hasValidContract = userProfile.contract_path || 
                            userProfile.contract_file_url || 
                            userProfile.contract_status === 'signed' || 
                            userProfile.contract_status === 'approved';
    
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
                                                <h4 class="font-bold text-green-300 text-lg">Signature Électronique</h4>
                                                <p class="text-xs text-gray-400">Nouveau : Signez votre contrat en ligne en 2 minutes</p>
                                            </div>
                                        </div>
                                        
                                        <ul class="space-y-2 text-sm text-gray-300 mb-4">
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>Signature au doigt ou à la souris</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>Validation instantanée</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>Légalement valide à Dubai</span>
                                            </li>
                                            <li class="flex items-center gap-2">
                                                <span class="text-green-400">✓</span>
                                                <span>Aucun téléchargement nécessaire</span>
                                            </li>
                                        </ul>
                                        
                                        <a href="/contract-signature.html" 
                                           class="block w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition text-center">
                                            🖊️ Signer mon contrat maintenant
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${hasValidContract && !isAdmin ? `
                    <div id="contractUploaded" class="mb-6 bg-green-900 bg-opacity-50 border-l-4 border-green-500 p-6 rounded-lg shadow-lg">
                        <div class="flex items-center gap-4">
                            <div class="text-3xl flex-shrink-0">✅</div>
                            <div>
                                <h3 class="text-xl font-bold text-green-300">Contrat signé et validé</h3>
                                <p class="text-gray-300">Vous pouvez maintenant ajouter des leads</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div id="stats" class="grid md:grid-cols-4 gap-6 mb-8"></div>
                
                ${!isAdmin ? `
                    <div class="mb-6">
                        <button 
                            id="addLeadBtn"
                            onclick="showAddLeadForm()" 
                            ${!hasValidContract ? 'disabled' : ''}
                            class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition ${!hasValidContract ? 'opacity-50 cursor-not-allowed' : ''}"
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
            
            <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div class="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
                    <h3 class="text-2xl font-bold mb-6">${t('dashboard:add_lead')}</h3>
                    <form id="addLeadForm" class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block mb-2">${t('dashboard:client_name')}</label>
                                <input type="text" id="clientName" required class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block mb-2">${t('dashboard:client_email')}</label>
                                <input type="email" id="clientEmail" required class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block mb-2">${t('dashboard:client_phone')}</label>
                                <input type="tel" id="clientPhone" required class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block mb-2">${t('dashboard:property_type')}</label>
                                <select id="propertyType" required class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none">
                                    <option value="">${t('dashboard:select_type')}</option>
                                    <option value="sale_buyer">${t('dashboard:sale_buyer')}</option>
                                    <option value="sale_seller">${t('dashboard:sale_seller')}</option>
                                    <option value="rental_landlord">${t('dashboard:rental_landlord')}</option>
                                    <option value="rental_tenant">${t('dashboard:rental_tenant')}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block mb-2">${t('dashboard:budget')}</label>
                                <input type="number" id="budget" required class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:outline-none">
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">
                                ${t('dashboard:add')}
                            </button>
                            <button type="button" onclick="document.getElementById('addLeadModal').classList.add('hidden')" class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg transition">
                                ${t('dashboard:cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
