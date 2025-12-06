// ============================================
// 🎨 MODULE RENDERING.JS
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
