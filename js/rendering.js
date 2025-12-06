// ============================================
// 🎨 MODULE RENDERING.JS
// ============================================
// Fonctions de génération HTML pour :
// - Landing Page
// - Pages d'authentification
// - Dashboard (admin et referrer)
// - Modal complétion profil OAuth
// ============================================
// Version: 3.14.0 - Format adresse UAE (sans code postal)
// Date: 6 décembre 2025
// ============================================

/**
 * Vérifie si le profil est complet (nom, téléphone, adresse, email)
 * @param {object} profile - Le profil utilisateur
 * @returns {boolean} true si complet
 */
export function isProfileComplete(profile) {
    if (!profile) return false;
    const hasName = profile.name && profile.name.trim().length > 0;
    const hasPhone = profile.phone && profile.phone.trim().length > 0;
    const hasAddress = profile.address && profile.address.trim().length > 0;
    const hasEmail = profile.email && profile.email.trim().length > 0 && !profile.email.includes('privaterelay.appleid.com');
    return hasName && hasPhone && hasAddress && hasEmail;
}

/**
 * Génère le HTML du modal de complétion de profil (pour OAuth)
 * ✅ v3.14.0 - Format d'adresse UAE (sans code postal)
 * @returns {string} HTML du modal
 */
export function renderProfileCompletionModal() {
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);
    
    // ✅ Traductions 8 langues - Format UAE
    const translations = {
        fr: {
            title: "Complétez votre profil",
            subtitle: "Pour recevoir vos commissions, nous avons besoin de quelques informations",
            name_label: "Nom complet",
            name_placeholder: "Votre nom complet",
            email_label: "Email",
            email_placeholder: "votre@email.com",
            email_help: "Utilisé pour les notifications et paiements",
            phone_label: "Numéro de téléphone",
            phone_placeholder: "Ex: 501234567",
            address_label: "Adresse (Bâtiment, Rue)",
            address_placeholder: "Ex: Beach Isle, Palm Jumeirah",
            area_label: "Zone / Quartier",
            area_placeholder: "Ex: Jumeirah, Downtown, Al Quoz",
            emirate_label: "Émirat",
            select_emirate: "-- Sélectionnez --",
            makani_label: "Numéro Makani",
            makani_placeholder: "Code 10 chiffres (optionnel)",
            makani_help: "Code GPS unique (voir label sur votre bâtiment)",
            submit_button: "Enregistrer et continuer",
            required_notice: "Ces informations sont nécessaires pour recevoir vos commissions"
        },
        en: {
            title: "Complete your profile",
            subtitle: "To receive your commissions, we need some information",
            name_label: "Full name",
            name_placeholder: "Your full name",
            email_label: "Email",
            email_placeholder: "your@email.com",
            email_help: "Used for notifications and payments",
            phone_label: "Phone number",
            phone_placeholder: "Ex: 501234567",
            address_label: "Address (Building, Street)",
            address_placeholder: "Ex: Beach Isle, Palm Jumeirah",
            area_label: "Area / District",
            area_placeholder: "Ex: Jumeirah, Downtown, Al Quoz",
            emirate_label: "Emirate",
            select_emirate: "-- Select --",
            makani_label: "Makani Number",
            makani_placeholder: "10-digit code (optional)",
            makani_help: "Unique GPS code (see label on your building)",
            submit_button: "Save and continue",
            required_notice: "This information is required to receive your commissions"
        },
        ar: {
            title: "أكمل ملفك الشخصي",
            subtitle: "لتلقي عمولاتك، نحتاج بعض المعلومات",
            name_label: "الاسم الكامل",
            name_placeholder: "اسمك الكامل",
            email_label: "البريد الإلكتروني",
            email_placeholder: "email@example.com",
            email_help: "يُستخدم للإشعارات والمدفوعات",
            phone_label: "رقم الهاتف",
            phone_placeholder: "مثال: ٥٠١٢٣٤٥٦٧",
            address_label: "العنوان (المبنى، الشارع)",
            address_placeholder: "مثال: بيتش آيل، نخلة جميرا",
            area_label: "المنطقة / الحي",
            area_placeholder: "مثال: جميرا، داون تاون، القوز",
            emirate_label: "الإمارة",
            select_emirate: "-- اختر --",
            makani_label: "رقم مكاني",
            makani_placeholder: "رمز من ١٠ أرقام (اختياري)",
            makani_help: "رمز GPS الفريد (انظر الملصق على مبناك)",
            submit_button: "حفظ والمتابعة",
            required_notice: "هذه المعلومات مطلوبة لتلقي عمولاتك"
        },
        ru: {
            title: "Заполните профиль",
            subtitle: "Для получения комиссий нам нужна информация",
            name_label: "Полное имя",
            name_placeholder: "Ваше полное имя",
            email_label: "Электронная почта",
            email_placeholder: "your@email.com",
            email_help: "Для уведомлений и платежей",
            phone_label: "Номер телефона",
            phone_placeholder: "Пример: 501234567",
            address_label: "Адрес (Здание, Улица)",
            address_placeholder: "Пример: Beach Isle, Palm Jumeirah",
            area_label: "Район / Зона",
            area_placeholder: "Пример: Jumeirah, Downtown, Al Quoz",
            emirate_label: "Эмират",
            select_emirate: "-- Выберите --",
            makani_label: "Номер Makani",
            makani_placeholder: "10-значный код (необязательно)",
            makani_help: "Уникальный GPS-код (см. табличку на здании)",
            submit_button: "Сохранить и продолжить",
            required_notice: "Эта информация необходима для получения комиссий"
        },
        hi: {
            title: "अपनी प्रोफ़ाइल पूरी करें",
            subtitle: "अपना कमीशन प्राप्त करने के लिए, हमें कुछ जानकारी चाहिए",
            name_label: "पूरा नाम",
            name_placeholder: "आपका पूरा नाम",
            email_label: "ईमेल",
            email_placeholder: "your@email.com",
            email_help: "सूचनाओं और भुगतान के लिए",
            phone_label: "फ़ोन नंबर",
            phone_placeholder: "उदा: 501234567",
            address_label: "पता (बिल्डिंग, सड़क)",
            address_placeholder: "उदा: Beach Isle, Palm Jumeirah",
            area_label: "क्षेत्र / जिला",
            area_placeholder: "उदा: Jumeirah, Downtown, Al Quoz",
            emirate_label: "अमीरात",
            select_emirate: "-- चुनें --",
            makani_label: "मकानी नंबर",
            makani_placeholder: "10 अंकों का कोड (वैकल्पिक)",
            makani_help: "अद्वितीय GPS कोड (अपनी इमारत पर लेबल देखें)",
            submit_button: "सहेजें और जारी रखें",
            required_notice: "अपना कमीशन प्राप्त करने के लिए यह जानकारी आवश्यक है"
        },
        ur: {
            title: "اپنی پروفائل مکمل کریں",
            subtitle: "اپنا کمیشن حاصل کرنے کے لیے، ہمیں کچھ معلومات چاہیے",
            name_label: "پورا نام",
            name_placeholder: "آپ کا پورا نام",
            email_label: "ای میل",
            email_placeholder: "your@email.com",
            email_help: "اطلاعات اور ادائیگیوں کے لیے",
            phone_label: "فون نمبر",
            phone_placeholder: "مثال: 501234567",
            address_label: "پتہ (عمارت، گلی)",
            address_placeholder: "مثال: Beach Isle, Palm Jumeirah",
            area_label: "علاقہ / ضلع",
            area_placeholder: "مثال: Jumeirah, Downtown, Al Quoz",
            emirate_label: "امارات",
            select_emirate: "-- منتخب کریں --",
            makani_label: "مکانی نمبر",
            makani_placeholder: "10 ہندسوں کا کوڈ (اختیاری)",
            makani_help: "منفرد GPS کوڈ (اپنی عمارت پر لیبل دیکھیں)",
            submit_button: "محفوظ کریں اور جاری رکھیں",
            required_notice: "اپنا کمیشن حاصل کرنے کے لیے یہ معلومات ضروری ہیں"
        },
        zh: {
            title: "完善您的个人资料",
            subtitle: "为了接收您的佣金，我们需要一些信息",
            name_label: "全名",
            name_placeholder: "您的全名",
            email_label: "电子邮件",
            email_placeholder: "your@email.com",
            email_help: "用于通知和付款",
            phone_label: "电话号码",
            phone_placeholder: "例如: 501234567",
            address_label: "地址（建筑物、街道）",
            address_placeholder: "例如: Beach Isle, Palm Jumeirah",
            area_label: "区域 / 地区",
            area_placeholder: "例如: Jumeirah, Downtown, Al Quoz",
            emirate_label: "酋长国",
            select_emirate: "-- 选择 --",
            makani_label: "Makani 号码",
            makani_placeholder: "10位数代码（可选）",
            makani_help: "唯一GPS代码（见建筑物标签）",
            submit_button: "保存并继续",
            required_notice: "此信息是接收佣金所必需的"
        },
        tl: {
            title: "Kumpletuhin ang iyong profile",
            subtitle: "Para matanggap ang iyong mga komisyon, kailangan namin ng ilang impormasyon",
            name_label: "Buong pangalan",
            name_placeholder: "Ang iyong buong pangalan",
            email_label: "Email",
            email_placeholder: "your@email.com",
            email_help: "Ginagamit para sa mga notification at bayad",
            phone_label: "Numero ng telepono",
            phone_placeholder: "Hal: 501234567",
            address_label: "Address (Building, Kalye)",
            address_placeholder: "Hal: Beach Isle, Palm Jumeirah",
            area_label: "Lugar / Distrito",
            area_placeholder: "Hal: Jumeirah, Downtown, Al Quoz",
            emirate_label: "Emirate",
            select_emirate: "-- Pumili --",
            makani_label: "Makani Number",
            makani_placeholder: "10-digit code (opsyonal)",
            makani_help: "Natatanging GPS code (tingnan ang label sa building)",
            submit_button: "I-save at magpatuloy",
            required_notice: "Ang impormasyong ito ay kinakailangan para matanggap ang iyong mga komisyon"
        }
    };
    
    const t = translations[currentLang] || translations['en'];
    
    // Pré-remplir avec les données existantes
    const profile = window.userProfile || {};
    const user = window.currentUser || {};
    const existingName = profile.name || user.user_metadata?.full_name || user.user_metadata?.name || '';
    const existingEmail = profile.email || user.email || '';
    const existingPhone = profile.phone || '';
    
    // Détecter si c'est un email relay Apple
    const isAppleRelay = existingEmail.includes('privaterelay.appleid.com');
    
    // Les 7 Émirats des EAU
    const emirates = [
        { code: 'Dubai', name: 'Dubai / دبي' },
        { code: 'Abu Dhabi', name: 'Abu Dhabi / أبوظبي' },
        { code: 'Sharjah', name: 'Sharjah / الشارقة' },
        { code: 'Ajman', name: 'Ajman / عجمان' },
        { code: 'Umm Al Quwain', name: 'Umm Al Quwain / أم القيوين' },
        { code: 'Ras Al Khaimah', name: 'Ras Al Khaimah / رأس الخيمة' },
        { code: 'Fujairah', name: 'Fujairah / الفجيرة' }
    ];
    
    const emirateOptions = emirates.map(e => 
        `<option value="${e.code}" ${e.code === 'Dubai' ? 'selected' : ''}>${e.name}</option>`
    ).join('');

    return `
        <div id="profileCompletionModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 max-w-xl w-full border-2 border-yellow-500/50 shadow-2xl my-4 max-h-[95vh] overflow-y-auto">
                <!-- Header -->
                <div class="text-center mb-5">
                    <div class="text-5xl mb-3">👤</div>
                    <h2 class="text-2xl font-bold text-yellow-400 mb-2">${t.title}</h2>
                    <p class="text-blue-200 text-sm">${t.subtitle}</p>
                </div>
                
                <!-- Notice -->
                <div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-5">
                    <p class="text-yellow-300 text-sm text-center">
                        ⚠️ ${t.required_notice}
                    </p>
                </div>
                
                <!-- Form -->
                <form id="profileCompletionForm" class="space-y-4">
                    <!-- Nom -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.name_label} *</label>
                        <input type="text" id="completionName" value="${existingName}" required minlength="2" placeholder="${t.name_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.email_label} *</label>
                        <input type="email" id="completionEmail" value="${isAppleRelay ? '' : existingEmail}" required placeholder="${t.email_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                        <p class="text-xs text-blue-300 mt-1">📧 ${t.email_help}</p>
                        ${isAppleRelay ? '<p class="text-xs text-orange-400 mt-1">⚠️ Votre email Apple masqué ne peut pas recevoir les paiements. Entrez votre vraie adresse email.</p>' : ''}
                    </div>
                    
                    <!-- Téléphone -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.phone_label} *</label>
                        <div class="flex gap-2">
                            <select id="completionCountryCode" class="w-24 px-2 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm">
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
                            <input type="tel" id="completionPhone" value="${existingPhone.replace(/^\+\d+/, '')}" required placeholder="${t.phone_placeholder}" class="flex-1 px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                        </div>
                    </div>
                    
                    <!-- Adresse (Bâtiment, Rue) -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.address_label} *</label>
                        <input type="text" id="completionAddress" required placeholder="${t.address_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    
                    <!-- Zone / Quartier -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.area_label} *</label>
                        <input type="text" id="completionArea" required placeholder="${t.area_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    
                    <!-- Émirat (dropdown) -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.emirate_label} *</label>
                        <select id="completionEmirate" required class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                            <option value="">${t.select_emirate}</option>
                            ${emirateOptions}
                        </select>
                    </div>
                    
                    <!-- Numéro Makani (optionnel) -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.makani_label}</label>
                        <input type="text" id="completionMakani" pattern="[0-9]{10}" maxlength="10" placeholder="${t.makani_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                        <p class="text-xs text-blue-300 mt-1">📍 ${t.makani_help}</p>
                    </div>
                    
                    <!-- Error -->
                    <div id="completionError" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"></div>
                    
                    <!-- Submit -->
                    <button type="submit" id="completionSubmitBtn" class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-4 rounded-lg transition transform hover:scale-[1.02] mt-4">${t.submit_button} →</button>
                </form>
            </div>
        </div>
    `;
}

/**
 * Génère le HTML de la landing page
 * @returns {string} HTML de la landing page
 */
export function renderLandingPage() {
    const t = (key) => window.i18next.t(key);
    
    return `
        <div class="min-h-screen">
            <!-- ✅ Header avec style unifié -->
            <nav class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div class="container mx-auto px-4 py-4">
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
                            <a href="how-it-works.html" class="text-white/70 hover:text-white transition font-medium px-4 py-2">${t('nav.how_it_works')}</a>
                            <button onclick="showLogin()" class="text-white/70 hover:text-white transition font-medium px-4 py-2">${t('nav.login')}</button>
                            <button onclick="showSignup()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-lg transition">${t('nav.signup')}</button>
                        </div>
                        <!-- Mobile Menu Button -->
                        <button onclick="toggleMobileMenu()" class="lg:hidden text-white text-3xl">
                            <span id="menuIcon">☰</span>
                        </button>
                    </div>
                    
                    <!-- Mobile Menu -->
                    <div id="mobileMenu" class="hidden lg:hidden mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/20">
                        <div class="flex flex-wrap gap-2 justify-center pb-3 border-b border-white/20">
                            <button onclick="changeLanguage('fr')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Français">🇫🇷</button>
                            <button onclick="changeLanguage('en')" class="text-2xl hover:scale-125 transition-transform duration-200" title="English">🇬🇧</button>
                            <button onclick="changeLanguage('ar')" class="text-2xl hover:scale-125 transition-transform duration-200" title="العربية">🇦🇪</button>
                            <button onclick="changeLanguage('ru')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Русский">🇷🇺</button>
                            <button onclick="changeLanguage('hi')" class="text-2xl hover:scale-125 transition-transform duration-200" title="हिन्दी">🇮🇳</button>
                            <button onclick="changeLanguage('ur')" class="text-2xl hover:scale-125 transition-transform duration-200" title="اردو">🇵🇰</button>
                            <button onclick="changeLanguage('zh')" class="text-2xl hover:scale-125 transition-transform duration-200" title="中文">🇨🇳</button>
                            <button onclick="changeLanguage('tl')" class="text-2xl hover:scale-125 transition-transform duration-200" title="Tagalog">🇵🇭</button>
                        </div>
                        <a href="how-it-works.html" class="block text-center text-white/70 hover:text-white transition font-medium py-2">${t('nav.how_it_works')}</a>
                        <button onclick="showLogin(); toggleMobileMenu();" class="w-full text-center text-white/70 hover:text-white transition font-medium py-2">${t('nav.login')}</button>
                        <button onclick="showSignup(); toggleMobileMenu();" class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">${t('nav.signup')}</button>
                    </div>
                </div>
            </nav>
            
            <main class="container mx-auto px-4 py-20">
                <div class="text-center mb-12">
                    <h2 class="text-5xl md:text-6xl font-bold mb-6 text-yellow-400">
                        ${t('hero.title')}
                    </h2>
                    <p class="text-xl text-blue-200 mb-8">
                        ${t('hero.subtitle')}
                    </p>
                    <button onclick="showSignup()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg px-8 py-4 rounded-lg transition transform hover:scale-105">
                        ${t('hero.cta_button')}
                    </button>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6 my-16">
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Burj Khalifa Dubai" class="w-full h-64 object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80" alt="Dubai Marina" class="w-full h-64 object-cover">
                    </div>
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80" alt="Dubai Skyline" class="w-full h-64 object-cover">
                    </div>
                </div>
                
                <!-- ✅ Stats avec style unifié -->
                <div class="grid md:grid-cols-3 gap-8 mt-20">
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                        <div class="text-4xl font-bold text-yellow-400 mb-2">${t('stats.commission_value')}</div>
                        <div class="text-blue-200">${t('stats.commission_label')}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                        <div class="text-4xl font-bold text-yellow-400 mb-2">${t('stats.support_value')}</div>
                        <div class="text-blue-200">${t('stats.support_label')}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                        <div class="text-4xl font-bold text-yellow-400 mb-2">${t('stats.timeline_value')}</div>
                        <div class="text-blue-200">${t('stats.timeline_label')}</div>
                    </div>
                </div>
                
                <!-- ✅ Section gains avec style unifié -->
                <div class="mt-20 bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                    <h3 class="text-3xl font-bold text-center text-yellow-400 mb-12">${t('gains.title')}</h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-slate-800/50 rounded-xl p-8 border border-white/10">
                            <div class="text-yellow-400 text-xl font-bold mb-4">${t('gains.sale_title')}</div>
                            <div class="space-y-3 text-blue-200">
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_1_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.sale_example_1_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_2_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.sale_example_2_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.sale_example_3_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.sale_example_3_commission')}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 rounded-xl p-8 border border-white/10">
                            <div class="text-yellow-400 text-xl font-bold mb-4">${t('gains.rental_title')}</div>
                            <div class="space-y-3 text-blue-200">
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_1_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.rental_example_1_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_2_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.rental_example_2_commission')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>${t('gains.rental_example_3_property')}</span>
                                    <span class="font-bold text-yellow-400">${t('gains.rental_example_3_commission')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <!-- ✅ Footer avec style unifié -->
            <footer class="bg-slate-900 border-t border-white/10 mt-20">
                <div class="container mx-auto px-4 py-12">
                    <div class="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.navigation_title')}</h3>
                            <ul class="space-y-2">
                                <li><button onclick="backToHome()" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.home')}</button></li>
                                <li><a href="how-it-works.html" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.how_it_works')}</a></li>
                                <li><button onclick="showLogin()" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.login')}</button></li>
                                <li><button onclick="showSignup()" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.signup')}</button></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.legal_title')}</h3>
                            <ul class="space-y-2">
                                <li><a href="terms.html" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.terms')}</a></li>
                                <li><a href="privacy.html" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.privacy')}</a></li>
                                <li><button onclick="downloadContractTemplate()" class="text-blue-200 hover:text-yellow-400 transition">${t('common:footer.contract_template')}</button></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">${t('common:footer.contact_title')}</h3>
                            <ul class="space-y-3 text-blue-200">
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
                    
                    <div class="border-t border-white/10 pt-6 text-center text-blue-300">
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
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);
    
    let title, subtitle, formContent, buttonText, linkText, linkAction;
    
    // ✅ v3.10.0: Traductions RGPD opt-in email (8 langues)
    const emailOptInTranslations = {
        fr: {
            label: "J'accepte de recevoir des notifications par email",
            description: "Mises à jour sur vos leads, commissions et opportunités. Vous pourrez vous désabonner à tout moment."
        },
        en: {
            label: "I agree to receive email notifications",
            description: "Updates about your leads, commissions and opportunities. You can unsubscribe at any time."
        },
        ar: {
            label: "أوافق على تلقي إشعارات البريد الإلكتروني",
            description: "تحديثات حول العملاء المحتملين والعمولات والفرص. يمكنك إلغاء الاشتراك في أي وقت."
        },
        ru: {
            label: "Я согласен получать уведомления по электронной почте",
            description: "Обновления о ваших лидах, комиссиях и возможностях. Вы можете отписаться в любое время."
        },
        hi: {
            label: "मैं ईमेल सूचनाएं प्राप्त करने के लिए सहमत हूं",
            description: "आपके लीड्स, कमीशन और अवसरों के बारे में अपडेट। आप किसी भी समय सदस्यता समाप्त कर सकते हैं।"
        },
        ur: {
            label: "میں ای میل نوٹیفیکیشنز حاصل کرنے پر راضی ہوں",
            description: "آپ کے لیڈز، کمیشنز اور مواقع کے بارے میں اپڈیٹس۔ آپ کسی بھی وقت ان سبسکرائب کر سکتے ہیں۔"
        },
        zh: {
            label: "我同意接收电子邮件通知",
            description: "关于您的线索、佣金和机会的更新。您可以随时取消订阅。"
        },
        tl: {
            label: "Sumasang-ayon akong tumanggap ng mga email notification",
            description: "Mga update tungkol sa iyong leads, commissions at opportunities. Maaari kang mag-unsubscribe anumang oras."
        }
    };
    const emailOptIn = emailOptInTranslations[currentLang] || emailOptInTranslations['en'];
    
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
        
        // ✅ CORRIGÉ: Style unifié + IDs verify2faBtn et error2fa
        return `
            <div class="min-h-screen flex items-center justify-center px-4">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
                    <button onclick="window.backTo2FASignup()" class="text-blue-200 hover:text-white mb-6 flex items-center">
                        ${trans.back_button}
                    </button>
                    
                    <h2 class="text-3xl font-bold mb-2 text-center text-yellow-400">${trans.title}</h2>
                    <p class="text-center text-blue-200 mb-6">${trans.subtitle}</p>
                    
                    <form id="form2FA" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-2 text-blue-100">
                                ${trans.code_label}
                            </label>
                            <input 
                                type="text" 
                                id="code2fa" 
                                inputmode="numeric"
                                pattern="[0-9]{6}"
                                maxlength="6"
                                placeholder="000000"
                                class="w-full px-4 py-3 bg-slate-800/50 text-white rounded-lg border border-white/20 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 text-center text-2xl tracking-widest font-mono"
                                required
                                autocomplete="one-time-code"
                            />
                            <p class="mt-2 text-sm text-blue-300">
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
                                class="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                            >
                                ${trans.resend_code}
                            </button>
                        </div>
                        <div class="text-center">
                            <button 
                                type="button"
                                onclick="window.backTo2FASignup()"
                                class="text-blue-300 hover:text-white text-sm"
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
    
    // ✅ Style unifié pour toutes les pages auth
    return `
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
                <button onclick="backToHome()" class="text-blue-200 hover:text-white mb-6 flex items-center">
                    ← ${t('auth:back_home')}
                </button>
                
                <h2 class="text-3xl font-bold mb-6 text-center text-yellow-400">${title}</h2>
                
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
                            <div class="w-full border-t border-white/20"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-slate-900/50 text-blue-200 rounded">OR</span>
                        </div>
                    </div>
                ` : ''}
                
                <form id="authForm" class="space-y-4">
                    ${mode === 'signup' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:name_label')}</label>
                            <input 
                                type="text" 
                                id="name" 
                                required 
                                minlength="2"
                                maxlength="100"
                                placeholder="${t('auth:full_name_placeholder')}"
                                class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50"
                                oninput="validateName()"
                            >
                            <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                        
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:phone_label')}</label>
                            <div class="flex gap-2">
                                <select 
                                    id="countryCode" 
                                    class="w-32 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white"
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
                                    class="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50"
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
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:email_label')}</label>
                            <input 
                                type="email" 
                                id="email" 
                                required 
                                placeholder="${t('auth:email_placeholder')}"
                                class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50"
                                ${mode === 'signup' ? 'oninput="validateEmail()"' : ''}
                            >
                            ${mode === 'signup' ? '<div id="emailError" class="text-red-400 text-sm mt-1 hidden"></div>' : ''}
                        </div>
                    ` : ''}
                    
                    ${mode !== 'reset' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${mode === 'change-password' ? 'Nouveau mot de passe' : t('auth:password_label')}</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="${mode === 'change-password' ? 'newPassword' : 'password'}" 
                                    required 
                                    minlength="8" 
                                    placeholder="••••••••"
                                    class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none pr-12 transition-colors text-white placeholder-blue-300/50"
                                    ${mode === 'signup' || mode === 'change-password' ? 'oninput="validatePassword()"' : ''}
                                >
                                <button 
                                    type="button" 
                                    onclick="togglePasswordVisibility('${mode === 'change-password' ? 'newPassword' : 'password'}', this)" 
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                                >
                                    <span class="text-xl">👁️</span>
                                </button>
                            </div>
                            ${mode === 'signup' || mode === 'change-password' ? `
                                <div class="mt-2">
                                    <div class="flex items-center gap-2 text-xs text-blue-300">
                                        <div id="passwordStrength" class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div id="passwordStrengthBar" class="h-full w-0 transition-all duration-300"></div>
                                        </div>
                                        <span id="passwordStrengthText" class="min-w-[60px]"></span>
                                    </div>
                                    <div class="text-xs text-blue-300 mt-1.5 space-y-0.5">
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
                            ` : '<div class="text-sm text-blue-300 mt-1">' + t('auth:password_hint') + '</div>'}
                            <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                            <div id="passwordStrength" class="hidden mt-2"></div>
                        </div>
                    ` : ''}
                    
                    ${mode === 'signup' || mode === 'change-password' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${mode === 'change-password' ? 'Confirmer le nouveau mot de passe' : t('auth:confirm_password_label')}</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}" 
                                    required 
                                    minlength="8" 
                                    placeholder="••••••••"
                                    class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none pr-12 transition-colors text-white placeholder-blue-300/50"
                                    oninput="validateConfirmPassword()"
                                >
                                <button 
                                    type="button" 
                                    onclick="togglePasswordVisibility('${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}', this)" 
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
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
                    
                    ${mode === 'signup' ? `
                        <!-- ✅ v3.10.0: RGPD Email Opt-in Checkbox -->
                        <div class="mt-4 p-4 bg-slate-800/30 border border-white/10 rounded-xl">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="emailOptIn"
                                    class="w-5 h-5 mt-0.5 text-yellow-500 bg-slate-700 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2"
                                >
                                <div>
                                    <span class="text-white font-medium">${emailOptIn.label}</span>
                                    <p class="text-blue-300 text-sm mt-1">${emailOptIn.description}</p>
                                </div>
                            </label>
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
                
                <p class="text-center mt-6 text-blue-200">
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
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);
    
    // ✅ Traductions des badges de commission (8 langues)
    const badgeTranslations = {
        fr: { buyers: '25% commission acheteurs', others: '20% autres leads' },
        en: { buyers: '25% commission buyers', others: '20% other leads' },
        ar: { buyers: '٢٥٪ عمولة المشترين', others: '٢٠٪ العملاء الآخرين' },
        ru: { buyers: '25% комиссия покупатели', others: '20% другие лиды' },
        hi: { buyers: '25% कमीशन खरीदार', others: '20% अन्य लीड' },
        ur: { buyers: '25% کمیشن خریدار', others: '20% دیگر لیڈز' },
        zh: { buyers: '25% 买家佣金', others: '20% 其他线索' },
        tl: { buyers: '25% commission buyers', others: '20% other leads' }
    };
    const badges = badgeTranslations[currentLang] || badgeTranslations['en'];
    
    // ✅ Traductions du bouton Mon Profil (8 langues)
    const profileTranslations = {
        fr: 'Mon Profil',
        en: 'My Profile',
        ar: 'ملفي الشخصي',
        ru: 'Мой профиль',
        hi: 'मेरी प्रोफ़ाइल',
        ur: 'میری پروفائل',
        zh: '我的资料',
        tl: 'Aking Profile'
    };
    const myProfileText = profileTranslations[currentLang] || profileTranslations['en'];
    
    console.log('🧭 DEBUG renderDashboard called', {
        userProfile,
        role: userProfile?.role,
        contract_path: userProfile?.contract_path,
        contract_file_url: userProfile?.contract_file_url,
        contract_status: userProfile?.contract_status,
    });
    
    if (!userProfile) {
        return '<div class="min-h-screen flex items-center justify-center"><div class="text-xl text-blue-200">⏳ Chargement du profil...</div></div>';
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
    
    // Vérifier si le profil est complet
    const profileComplete = isProfileComplete(userProfile);
    const canAddLeads = profileComplete && hasValidContract;
    
    // Générer le HTML du bouton/bloc d'ajout de leads
    let addLeadSection = '';
    if (!isAdmin) {
        if (canAddLeads) {
            addLeadSection = `
                <button 
                    id="addLeadBtn"
                    onclick="showAddLeadForm()" 
                    class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition"
                >
                    ${t('dashboard:add_lead')}
                </button>
            `;
        } else {
            const stepContractDone = hasValidContract;
            const stepProfileDone = profileComplete;
            
            addLeadSection = `
                <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500 rounded-2xl p-6 mb-6 shadow-lg">
                    <div class="flex items-start gap-4">
                        <div class="text-5xl">🚨</div>
                        <div class="flex-1">
                            <h3 class="text-2xl font-bold text-orange-400 mb-2">
                                Complétez votre inscription pour gagner des commissions !
                            </h3>
                            <p class="text-white mb-4">
                                Pour pouvoir soumettre des leads et <strong class="text-yellow-400">recevoir vos commissions</strong>, 
                                vous devez compléter ces 2 étapes :
                            </p>
                            
                            <div class="space-y-3">
                                <!-- Étape 1: Contrat -->
                                <div class="flex items-center gap-3 p-3 rounded-lg ${stepContractDone ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}">
                                    <div class="text-3xl">${stepContractDone ? '✅' : '❌'}</div>
                                    <div class="flex-1">
                                        <div class="font-bold ${stepContractDone ? 'text-green-400' : 'text-red-400'}">
                                            Étape 1 : Signer le contrat d'apporteur
                                        </div>
                                        <div class="text-sm text-blue-200">
                                            ${stepContractDone ? 'Contrat signé ✓' : 'Obligatoire pour recevoir vos paiements'}
                                        </div>
                                    </div>
                                    ${!stepContractDone ? `
                                        <a href="/contract-signature.html" 
                                           class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded-lg transition text-sm">
                                            Signer maintenant →
                                        </a>
                                    ` : ''}
                                </div>
                                
                                <!-- Étape 2: Profil -->
                                <div class="flex items-center gap-3 p-3 rounded-lg ${stepProfileDone ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}">
                                    <div class="text-3xl">${stepProfileDone ? '✅' : '❌'}</div>
                                    <div class="flex-1">
                                        <div class="font-bold ${stepProfileDone ? 'text-green-400' : 'text-red-400'}">
                                            Étape 2 : Compléter votre profil
                                        </div>
                                        <div class="text-sm text-blue-200">
                                            ${stepProfileDone ? 'Profil complet ✓' : 'Nom, téléphone et adresse requis pour les paiements'}
                                        </div>
                                    </div>
                                    ${!stepProfileDone ? `
                                        <a href="profile.html" 
                                           class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition text-sm">
                                            Compléter →
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                                <p class="text-yellow-300 text-sm">
                                    💡 <strong>Pourquoi ces étapes ?</strong> Le contrat protège vos commissions et votre profil complet 
                                    nous permet de vous payer. Sans ces informations, nous ne pourrons pas vous verser vos gains !
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                    id="addLeadBtn"
                    disabled
                    class="bg-gray-500 text-gray-300 font-bold px-6 py-3 rounded-lg cursor-not-allowed opacity-60"
                >
                    🔒 ${t('dashboard:add_lead')} (Complétez les étapes ci-dessus)
                </button>
            `;
        }
    }
    
    // ✅ Style unifié pour le dashboard
    return `
        <div class="min-h-screen">
            <!-- ✅ Header avec style unifié + BOUTON MON PROFIL -->
            <header class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-yellow-400">${dashboardTitle}</h1>
                        <div class="flex items-center gap-4">
                            <span class="text-yellow-400 font-medium hidden md:inline">${userProfile.name}</span>
                            <a href="profile.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                                ${myProfileText}
                            </a>
                            <button onclick="logout()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                                ${t('dashboard:logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="container mx-auto px-4 py-8">
                ${!hasValidContract && !isAdmin ? `
                    <div id="contractRequirement" class="mb-6 bg-gradient-to-r from-blue-900/50 to-yellow-900/50 border-2 border-yellow-500 p-8 rounded-2xl shadow-2xl">
                        <div class="flex flex-col lg:flex-row gap-8">
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-yellow-400 mb-4">
                                    📝 ${t('dashboard:contract.required')}
                                </h3>
                                
                                <div class="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                                    <h4 class="font-bold text-white mb-3">
                                        ❓ ${t('dashboard:contract.what_is_it')}
                                    </h4>
                                    <p class="text-blue-200 text-sm mb-3">
                                        ${t('dashboard:contract.explanation')}
                                    </p>
                                    <ul class="space-y-2 text-sm text-blue-200 ml-4">
                                        <li>✅ <strong>${t('dashboard:contract.benefit1_title')}</strong> ${t('dashboard:contract.benefit1_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit2_title')}</strong> ${t('dashboard:contract.benefit2_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit3_title')}</strong> ${t('dashboard:contract.benefit3_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit4_title')}</strong> ${t('dashboard:contract.benefit4_desc')}</li>
                                        <li>✅ <strong>${t('dashboard:contract.benefit5_title')}</strong> ${t('dashboard:contract.benefit5_desc')}</li>
                                    </ul>
                                </div>
                                <div class="grid md:grid-cols-2 gap-8">
                                    <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-2 border-green-500/50 p-6 rounded-xl">
                                        <div class="flex items-center gap-3 mb-4">
                                            <span class="text-4xl">✍️</span>
                                            <div>
                                                <h4 class="font-bold text-green-300 text-lg">${t('dashboard:contract.electronic_signature')}</h4>
                                                <p class="text-xs text-blue-300">${t('dashboard:contract.electronic_signature_intro')}</p>
                                            </div>
                                        </div>
                                        
                                        <ul class="space-y-2 text-sm text-blue-200 mb-4">
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
                    <div id="contractUploaded" class="mb-6 relative overflow-hidden bg-gradient-to-r from-green-900/50 to-blue-900/30 border border-green-500/50 p-6 rounded-2xl shadow-lg">
                        <!-- ✅ Skyline Dubai en arrière-plan subtil -->
                        <div class="absolute bottom-0 left-0 right-0 h-20 opacity-[0.07] pointer-events-none">
                            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" class="w-full h-full text-white">
                                <!-- Burj Khalifa (centre) -->
                                <polygon points="600,5 594,100 606,100" fill="currentColor"/>
                                <!-- Buildings gauche -->
                                <rect x="80" y="50" width="35" height="50" fill="currentColor"/>
                                <rect x="125" y="35" width="28" height="65" fill="currentColor"/>
                                <rect x="160" y="45" width="40" height="55" fill="currentColor"/>
                                <rect x="210" y="30" width="25" height="70" fill="currentColor"/>
                                <rect x="245" y="50" width="45" height="50" fill="currentColor"/>
                                <rect x="300" y="25" width="30" height="75" fill="currentColor"/>
                                <rect x="340" y="40" width="35" height="60" fill="currentColor"/>
                                <rect x="385" y="20" width="25" height="80" fill="currentColor"/>
                                <rect x="420" y="45" width="40" height="55" fill="currentColor"/>
                                <rect x="470" y="30" width="30" height="70" fill="currentColor"/>
                                <rect x="510" y="55" width="35" height="45" fill="currentColor"/>
                                <rect x="555" y="40" width="25" height="60" fill="currentColor"/>
                                <!-- Buildings droite -->
                                <rect x="630" y="50" width="30" height="50" fill="currentColor"/>
                                <rect x="670" y="35" width="35" height="65" fill="currentColor"/>
                                <rect x="715" y="25" width="40" height="75" fill="currentColor"/>
                                <rect x="765" y="45" width="30" height="55" fill="currentColor"/>
                                <rect x="805" y="20" width="25" height="80" fill="currentColor"/>
                                <rect x="840" y="40" width="45" height="60" fill="currentColor"/>
                                <rect x="895" y="30" width="30" height="70" fill="currentColor"/>
                                <rect x="935" y="50" width="35" height="50" fill="currentColor"/>
                                <rect x="980" y="35" width="40" height="65" fill="currentColor"/>
                                <rect x="1030" y="55" width="25" height="45" fill="currentColor"/>
                                <rect x="1065" y="45" width="35" height="55" fill="currentColor"/>
                                <rect x="1110" y="40" width="30" height="60" fill="currentColor"/>
                            </svg>
                        </div>
                        
                        <!-- ✅ Contenu par-dessus -->
                        <div class="relative z-10 flex items-center gap-4">
                            <div class="text-4xl flex-shrink-0">✅</div>
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-green-300 mb-2">${t('dashboard:contract.signed_validated')}</h3>
                                <p class="text-blue-200 mb-3">${t('dashboard:contract.can_add_leads')}</p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="bg-yellow-500/20 text-yellow-400 text-sm px-3 py-1 rounded-full">💰 ${badges.buyers}</span>
                                    <span class="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full">🏠 ${badges.others}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div id="stats" class="grid md:grid-cols-4 gap-6 mb-8"></div>
                
                ${!isAdmin ? `<div class="mb-6">${addLeadSection}</div>` : ''}
                
                <!-- ✅ Table leads avec style unifié -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
                    <h2 class="text-2xl font-bold mb-4 text-yellow-400">${isAdmin ? t('dashboard:all_leads') : t('dashboard:my_leads')}</h2>
                    <div id="leadsTable" class="overflow-x-auto"></div>
                </div>
            </main>
            
            <!-- ✅ MODAL AJOUT LEAD avec style unifié -->
            <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-slate-800/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-400">${t('dashboard:add_lead')}</h3>
                    
                    <form id="addLeadForm" onsubmit="event.preventDefault(); window.addLead(event);">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_name')} *</label>
                                <input type="text" id="clientName" required 
                                       class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_email')} *</label>
                                <input type="email" id="clientEmail" required 
                                       class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_phone')} *</label>
                                <input type="tel" id="clientPhone" required 
                                       class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:budget')} (AED) *</label>
                                <input type="text" id="budget" required inputmode="numeric" placeholder="1,500,000"
                                       class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                        </div>
                        
                        <!-- Type de lead avec commissions -->
                        <div class="mt-6">
                            <label class="block text-blue-200 mb-3">${t('dashboard:lead_type')} *</label>
                            
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
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="sale_seller" 
                                           onchange="document.getElementById('leadType').value='sale_seller'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:sale_seller')}</span>
                                        <span class="text-blue-300 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
                                    </div>
                                </label>
                                
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_landlord" 
                                           onchange="document.getElementById('leadType').value='rental_landlord'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:rental_landlord')}</span>
                                        <span class="text-blue-300 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
                                    </div>
                                </label>
                                
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_tenant" 
                                           onchange="document.getElementById('leadType').value='rental_tenant'"
                                           class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white">${t('dashboard:rental_tenant')}</span>
                                        <span class="text-blue-300 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span>
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
                                    <p class="text-blue-300 text-sm mt-1">${t('dashboard:consent_checkbox_description')}</p>
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
                                    class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition border border-white/20">
                                ${t('dashboard:cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
