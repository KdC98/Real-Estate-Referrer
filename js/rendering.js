// ============================================
// MODULE RENDERING.JS
// Version: 3.21.1 - Fix: remove emojis, tone down lead type, address pre-fill
// Date: 13 mars 2026
// ============================================

const COUNTRY_CODES = [
    { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+213', country: 'Algeria', flag: '🇩🇿' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+374', country: 'Armenia', flag: '🇦🇲' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+375', country: 'Belarus', flag: '🇧🇾' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
    { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+995', country: 'Georgia', flag: '🇬🇪' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+354', country: 'Iceland', flag: '🇮🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+218', country: 'Libya', flag: '🇱🇾' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+960', country: 'Maldives', flag: '🇲🇻' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+230', country: 'Mauritius', flag: '🇲🇺' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+373', country: 'Moldova', flag: '🇲🇩' },
    { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+212', country: 'Morocco', flag: '🇲🇦' },
    { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+970', country: 'Palestine', flag: '🇵🇸' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+221', country: 'Senegal', flag: '🇸🇳' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+249', country: 'Sudan', flag: '🇸🇩' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
    { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' }
];

const PRIORITY_COUNTRIES = [
    'United Arab Emirates', 'India', 'Pakistan', 'Philippines',
    'United Kingdom', 'France', 'Russia', 'China', 'Saudi Arabia',
    'Egypt', 'United States', 'Canada', 'Germany', 'Lebanon',
    'Jordan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Indonesia', 'Iran'
];

function generateCountryOptions(selectedCode = '+971') {
    const priority = COUNTRY_CODES.filter(c => PRIORITY_COUNTRIES.includes(c.country));
    const others = COUNTRY_CODES.filter(c => !PRIORITY_COUNTRIES.includes(c.country));
    priority.sort((a, b) => PRIORITY_COUNTRIES.indexOf(a.country) - PRIORITY_COUNTRIES.indexOf(b.country));
    others.sort((a, b) => a.country.localeCompare(b.country));
    let html = '';
    for (const country of priority) {
        const selected = country.code === selectedCode && country.country === 'United Arab Emirates' ? 'selected' : '';
        html += `<option value="${country.code}" ${selected}>${country.flag} ${country.country} (${country.code})</option>`;
    }
    html += '<option disabled>────────────────────</option>';
    for (const country of others) {
        html += `<option value="${country.code}">${country.flag} ${country.country} (${country.code})</option>`;
    }
    return html;
}

export function isProfileComplete(profile) {
    if (!profile) return false;
    const hasName = profile.name && profile.name.trim().length > 0;
    const hasPhone = profile.phone && profile.phone.trim().length > 0;
    const hasAddress = profile.address && profile.address.trim().length > 0;
    const hasEmail = profile.email && profile.email.trim().length > 0 && !profile.email.includes('privaterelay.appleid.com');
    return hasName && hasPhone && hasAddress && hasEmail;
}

// Fix #7 — Pre-fill address fields from stored profile data
// Address is stored as "Building, Area, Emirate" — we parse it back
function parseStoredAddress(address) {
    if (!address) return { building: '', area: '', emirate: '' };
    const parts = address.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 1) return { building: parts[0], area: '', emirate: '' };
    if (parts.length === 2) return { building: parts[0], area: '', emirate: parts[1] };
    // 3+ parts: last is emirate, second-to-last is area, rest is building
    const emirate = parts[parts.length - 1];
    const area = parts[parts.length - 2];
    const building = parts.slice(0, parts.length - 2).join(', ');
    return { building, area, emirate };
}

export function renderProfileCompletionModal() {
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);

    const translations = {
        fr: { title: "Complétez votre profil", subtitle: "Pour recevoir vos commissions, nous avons besoin de quelques informations", name_label: "Nom complet", name_placeholder: "Votre nom complet", email_label: "Email", email_placeholder: "votre@email.com", email_help: "Utilisé pour les notifications et paiements", phone_label: "Numéro de téléphone", phone_placeholder: "501234567", phone_help: "Numéro sans le 0 initial", address_label: "Adresse (Bâtiment, Rue)", address_placeholder: "Ex: Beach Isle, Palm Jumeirah", area_label: "Zone / Quartier", area_placeholder: "Ex: Jumeirah, Downtown, Marina", location_label: "Pays / Émirat", select_location: "-- Sélectionnez --", submit_button: "Enregistrer et continuer", required_notice: "Ces informations sont nécessaires pour recevoir vos commissions" },
        en: { title: "Complete your profile", subtitle: "To receive your commissions, we need some information", name_label: "Full name", name_placeholder: "Your full name", email_label: "Email", email_placeholder: "your@email.com", email_help: "Used for notifications and payments", phone_label: "Phone number", phone_placeholder: "501234567", phone_help: "Number without leading 0", address_label: "Address (Building, Street)", address_placeholder: "Ex: Beach Isle, Palm Jumeirah", area_label: "Area / District", area_placeholder: "Ex: Jumeirah, Downtown, Marina", location_label: "Country / Emirate", select_location: "-- Select --", submit_button: "Save and continue", required_notice: "This information is required to receive your commissions" },
        ar: { title: "أكمل ملفك الشخصي", subtitle: "لتلقي عمولاتك، نحتاج بعض المعلومات", name_label: "الاسم الكامل", name_placeholder: "اسمك الكامل", email_label: "البريد الإلكتروني", email_placeholder: "email@example.com", email_help: "يُستخدم للإشعارات والمدفوعات", phone_label: "رقم الهاتف", phone_placeholder: "501234567", phone_help: "الرقم بدون الصفر الأول", address_label: "العنوان (المبنى، الشارع)", address_placeholder: "مثال: Beach Isle, Palm Jumeirah", area_label: "المنطقة / الحي", area_placeholder: "مثال: Jumeirah, Downtown, Marina", location_label: "الدولة / الإمارة", select_location: "-- اختر --", submit_button: "حفظ والمتابعة", required_notice: "هذه المعلومات مطلوبة لتلقي عمولاتك" },
        ru: { title: "Заполните профиль", subtitle: "Для получения комиссий нам нужна информация", name_label: "Полное имя", name_placeholder: "Ваше полное имя", email_label: "Электронная почта", email_placeholder: "your@email.com", email_help: "Для уведомлений и платежей", phone_label: "Номер телефона", phone_placeholder: "501234567", phone_help: "Номер без начального 0", address_label: "Адрес (Здание, Улица)", address_placeholder: "Пример: Beach Isle, Palm Jumeirah", area_label: "Район / Зона", area_placeholder: "Пример: Jumeirah, Downtown, Marina", location_label: "Страна / Эмират", select_location: "-- Выберите --", submit_button: "Сохранить и продолжить", required_notice: "Эта информация необходима для получения комиссий" },
        hi: { title: "अपनी प्रोफ़ाइल पूरी करें", subtitle: "अपना कमीशन प्राप्त करने के लिए, हमें कुछ जानकारी चाहिए", name_label: "पूरा नाम", name_placeholder: "आपका पूरा नाम", email_label: "ईमेल", email_placeholder: "your@email.com", email_help: "सूचनाओं और भुगतान के लिए", phone_label: "फ़ोन नंबर", phone_placeholder: "501234567", phone_help: "0 के बिना नंबर", address_label: "पता (बिल्डिंग, सड़क)", address_placeholder: "उदा: Beach Isle, Palm Jumeirah", area_label: "क्षेत्र / जिला", area_placeholder: "उदा: Jumeirah, Downtown, Marina", location_label: "देश / अमीरात", select_location: "-- चुनें --", submit_button: "सहेजें और जारी रखें", required_notice: "अपना कमीशन प्राप्त करने के लिए यह जानकारी आवश्यक है" },
        ur: { title: "اپنی پروفائل مکمل کریں", subtitle: "اپنا کمیشن حاصل کرنے کے لیے، ہمیں کچھ معلومات چاہیے", name_label: "پورا نام", name_placeholder: "آپ کا پورا نام", email_label: "ای میل", email_placeholder: "your@email.com", email_help: "اطلاعات اور ادائیگیوں کے لیے", phone_label: "فون نمبر", phone_placeholder: "501234567", phone_help: "0 کے بغیر نمبر", address_label: "پتہ (عمارت، گلی)", address_placeholder: "مثال: Beach Isle, Palm Jumeirah", area_label: "علاقہ / ضلع", area_placeholder: "مثال: Jumeirah, Downtown, Marina", location_label: "ملک / امارات", select_location: "-- منتخب کریں --", submit_button: "محفوظ کریں اور جاری رکھیں", required_notice: "اپنا کمیشن حاصل کرنے کے لیے یہ معلومات ضروری ہیں" },
        zh: { title: "完善您的个人资料", subtitle: "为了接收您的佣金，我们需要一些信息", name_label: "全名", name_placeholder: "您的全名", email_label: "电子邮件", email_placeholder: "your@email.com", email_help: "用于通知和付款", phone_label: "电话号码", phone_placeholder: "501234567", phone_help: "不带前导0的号码", address_label: "地址（建筑物、街道）", address_placeholder: "例如: Beach Isle, Palm Jumeirah", area_label: "区域 / 地区", area_placeholder: "例如: Jumeirah, Downtown, Marina", location_label: "国家 / 酋长国", select_location: "-- 选择 --", submit_button: "保存并继续", required_notice: "此信息是接收佣金所必需的" },
        tl: { title: "Kumpletuhin ang iyong profile", subtitle: "Para matanggap ang iyong mga komisyon, kailangan namin ng ilang impormasyon", name_label: "Buong pangalan", name_placeholder: "Ang iyong buong pangalan", email_label: "Email", email_placeholder: "your@email.com", email_help: "Ginagamit para sa mga notification at bayad", phone_label: "Numero ng telepono", phone_placeholder: "501234567", phone_help: "Numero na walang 0 sa unahan", address_label: "Address (Building, Kalye)", address_placeholder: "Hal: Beach Isle, Palm Jumeirah", area_label: "Lugar / Distrito", area_placeholder: "Hal: Jumeirah, Downtown, Marina", location_label: "Bansa / Emirate", select_location: "-- Pumili --", submit_button: "I-save at magpatuloy", required_notice: "Ang impormasyong ito ay kinakailangan para matanggap ang iyong mga komisyon" }
    };

    const t = translations[currentLang] || translations['en'];
    const profile = window.userProfile || {};
    const user = window.currentUser || {};
    const existingName = profile.name || user.user_metadata?.full_name || user.user_metadata?.name || '';
    const existingEmail = profile.email || user.email || '';
    const existingPhone = profile.phone || '';
    const isAppleRelay = existingEmail.includes('privaterelay.appleid.com');

    // Fix #7 — Parse stored address back into fields
    const parsedAddress = parseStoredAddress(profile.address);
    const existingBuilding = parsedAddress.building;
    const existingArea = parsedAddress.area;
    const existingEmirate = parsedAddress.emirate;

    const locationOptions = `
        <optgroup label="UAE — Emirates">
            <option value="Dubai" ${existingEmirate === 'Dubai' ? 'selected' : ''}>🇦🇪 Dubai</option>
            <option value="Abu Dhabi" ${existingEmirate === 'Abu Dhabi' ? 'selected' : ''}>🇦🇪 Abu Dhabi</option>
            <option value="Sharjah" ${existingEmirate === 'Sharjah' ? 'selected' : ''}>🇦🇪 Sharjah</option>
            <option value="Ajman" ${existingEmirate === 'Ajman' ? 'selected' : ''}>🇦🇪 Ajman</option>
            <option value="Umm Al Quwain" ${existingEmirate === 'Umm Al Quwain' ? 'selected' : ''}>🇦🇪 Umm Al Quwain</option>
            <option value="Ras Al Khaimah" ${existingEmirate === 'Ras Al Khaimah' ? 'selected' : ''}>🇦🇪 Ras Al Khaimah</option>
            <option value="Fujairah" ${existingEmirate === 'Fujairah' ? 'selected' : ''}>🇦🇪 Fujairah</option>
        </optgroup>
        <optgroup label="Other Countries">
            <option value="France" ${existingEmirate === 'France' ? 'selected' : ''}>🇫🇷 France</option>
            <option value="United Kingdom" ${existingEmirate === 'United Kingdom' ? 'selected' : ''}>🇬🇧 United Kingdom</option>
            <option value="Germany" ${existingEmirate === 'Germany' ? 'selected' : ''}>🇩🇪 Germany</option>
            <option value="Switzerland" ${existingEmirate === 'Switzerland' ? 'selected' : ''}>🇨🇭 Switzerland</option>
            <option value="Belgium" ${existingEmirate === 'Belgium' ? 'selected' : ''}>🇧🇪 Belgium</option>
            <option value="Luxembourg" ${existingEmirate === 'Luxembourg' ? 'selected' : ''}>🇱🇺 Luxembourg</option>
            <option value="Russia" ${existingEmirate === 'Russia' ? 'selected' : ''}>🇷🇺 Russia</option>
            <option value="Ukraine" ${existingEmirate === 'Ukraine' ? 'selected' : ''}>🇺🇦 Ukraine</option>
            <option value="India" ${existingEmirate === 'India' ? 'selected' : ''}>🇮🇳 India</option>
            <option value="Pakistan" ${existingEmirate === 'Pakistan' ? 'selected' : ''}>🇵🇰 Pakistan</option>
            <option value="Philippines" ${existingEmirate === 'Philippines' ? 'selected' : ''}>🇵🇭 Philippines</option>
            <option value="China" ${existingEmirate === 'China' ? 'selected' : ''}>🇨🇳 China</option>
            <option value="Lebanon" ${existingEmirate === 'Lebanon' ? 'selected' : ''}>🇱🇧 Lebanon</option>
            <option value="Egypt" ${existingEmirate === 'Egypt' ? 'selected' : ''}>🇪🇬 Egypt</option>
            <option value="Saudi Arabia" ${existingEmirate === 'Saudi Arabia' ? 'selected' : ''}>🇸🇦 Saudi Arabia</option>
            <option value="Qatar" ${existingEmirate === 'Qatar' ? 'selected' : ''}>🇶🇦 Qatar</option>
            <option value="Kuwait" ${existingEmirate === 'Kuwait' ? 'selected' : ''}>🇰🇼 Kuwait</option>
            <option value="Oman" ${existingEmirate === 'Oman' ? 'selected' : ''}>🇴🇲 Oman</option>
            <option value="Bahrain" ${existingEmirate === 'Bahrain' ? 'selected' : ''}>🇧🇭 Bahrain</option>
            <option value="Jordan" ${existingEmirate === 'Jordan' ? 'selected' : ''}>🇯🇴 Jordan</option>
            <option value="Morocco" ${existingEmirate === 'Morocco' ? 'selected' : ''}>🇲🇦 Morocco</option>
            <option value="Tunisia" ${existingEmirate === 'Tunisia' ? 'selected' : ''}>🇹🇳 Tunisia</option>
            <option value="United States" ${existingEmirate === 'United States' ? 'selected' : ''}>🇺🇸 United States</option>
            <option value="Canada" ${existingEmirate === 'Canada' ? 'selected' : ''}>🇨🇦 Canada</option>
            <option value="Australia" ${existingEmirate === 'Australia' ? 'selected' : ''}>🇦🇺 Australia</option>
            <option value="Singapore" ${existingEmirate === 'Singapore' ? 'selected' : ''}>🇸🇬 Singapore</option>
            <option value="South Africa" ${existingEmirate === 'South Africa' ? 'selected' : ''}>🇿🇦 South Africa</option>
            <option value="Nigeria" ${existingEmirate === 'Nigeria' ? 'selected' : ''}>🇳🇬 Nigeria</option>
        </optgroup>
    `;

    // Fix #2 — No emoji in modal content (flag emojis in country options are kept)
    return `
        <div id="profileCompletionModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 max-w-xl w-full border-2 border-yellow-500/50 shadow-2xl my-4 max-h-[95vh] overflow-y-auto">
                <div class="text-center mb-5">
                    <h2 class="text-2xl font-bold text-yellow-400 mb-2">${t.title}</h2>
                    <p class="text-blue-200 text-sm">${t.subtitle}</p>
                </div>
                <div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-5">
                    <p class="text-yellow-300 text-sm text-center">${t.required_notice}</p>
                </div>
                <form id="profileCompletionForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.name_label} *</label>
                        <input type="text" id="completionName" value="${existingName}" required minlength="2" placeholder="${t.name_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.email_label} *</label>
                        <input type="email" id="completionEmail" value="${isAppleRelay ? '' : existingEmail}" required placeholder="${t.email_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                        <p class="text-xs text-blue-300 mt-1">${t.email_help}</p>
                        ${isAppleRelay ? '<p class="text-xs text-orange-400 mt-1">Votre email Apple masqué ne peut pas recevoir les paiements. Entrez votre vraie adresse email.</p>' : ''}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.phone_label} *</label>
                        <input type="tel" id="completionPhone" required placeholder="${t.phone_placeholder}" class="w-full py-3 pr-4 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                        <p class="text-xs text-blue-300 mt-1">${t.phone_help}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.address_label} *</label>
                        <input type="text" id="completionAddress" value="${existingBuilding}" required placeholder="${t.address_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.area_label}</label>
                        <input type="text" id="completionArea" value="${existingArea}" placeholder="${t.area_placeholder}" class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-1">${t.location_label} *</label>
                        <select id="completionEmirate" required class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition">
                            <option value="">${t.select_location}</option>
                            ${locationOptions}
                        </select>
                    </div>
                    <div id="completionError" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"></div>
                    <button type="submit" id="completionSubmitBtn" class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-4 rounded-lg transition transform hover:scale-[1.02] mt-4">${t.submit_button}</button>
                </form>
            </div>
        </div>
    `;
}

export function renderLandingPage() {
    const t = (key) => window.i18next.t(key);

    return `
        <div class="min-h-screen">
            <nav class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-yellow-400">${t('nav.brand')}</h1>
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
                        <button onclick="toggleMobileMenu()" class="lg:hidden text-white text-3xl"><span id="menuIcon">☰</span></button>
                    </div>
                    <div id="mobileMenu" class="hidden lg:hidden mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/20">
                        <div class="flex flex-wrap gap-2 justify-center pb-3 border-b border-white/20">
                            <button onclick="changeLanguage('fr')" class="text-2xl hover:scale-125 transition-transform duration-200">🇫🇷</button>
                            <button onclick="changeLanguage('en')" class="text-2xl hover:scale-125 transition-transform duration-200">🇬🇧</button>
                            <button onclick="changeLanguage('ar')" class="text-2xl hover:scale-125 transition-transform duration-200">🇦🇪</button>
                            <button onclick="changeLanguage('ru')" class="text-2xl hover:scale-125 transition-transform duration-200">🇷🇺</button>
                            <button onclick="changeLanguage('hi')" class="text-2xl hover:scale-125 transition-transform duration-200">🇮🇳</button>
                            <button onclick="changeLanguage('ur')" class="text-2xl hover:scale-125 transition-transform duration-200">🇵🇰</button>
                            <button onclick="changeLanguage('zh')" class="text-2xl hover:scale-125 transition-transform duration-200">🇨🇳</button>
                            <button onclick="changeLanguage('tl')" class="text-2xl hover:scale-125 transition-transform duration-200">🇵🇭</button>
                        </div>
                        <a href="how-it-works.html" class="block text-center text-white/70 hover:text-white transition font-medium py-2">${t('nav.how_it_works')}</a>
                        <button onclick="showLogin(); toggleMobileMenu();" class="w-full text-center text-white/70 hover:text-white transition font-medium py-2">${t('nav.login')}</button>
                        <button onclick="showSignup(); toggleMobileMenu();" class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">${t('nav.signup')}</button>
                    </div>
                </div>
            </nav>
            <main class="container mx-auto px-4 py-20">
                <div class="text-center mb-12">
                    <h2 class="text-5xl md:text-6xl font-bold mb-6 text-yellow-400">${t('hero.title')}</h2>
                    <p class="text-xl text-blue-200 mb-8">${t('hero.subtitle')}</p>
                    <button onclick="showSignup()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg px-8 py-4 rounded-lg transition transform hover:scale-105">${t('hero.cta_button')}</button>
                </div>
                <div class="grid md:grid-cols-3 gap-6 my-16">
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10"><img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Burj Khalifa Dubai" class="w-full h-64 object-cover"></div>
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10"><img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80" alt="Dubai Marina" class="w-full h-64 object-cover"></div>
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10"><img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80" alt="Dubai Skyline" class="w-full h-64 object-cover"></div>
                </div>
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
                <div class="mt-20 bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                    <h3 class="text-3xl font-bold text-center text-yellow-400 mb-12">${t('gains.title')}</h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-slate-800/50 rounded-xl p-8 border border-white/10">
                            <div class="text-yellow-400 text-xl font-bold mb-4">${t('gains.sale_title')}</div>
                            <div class="space-y-3 text-blue-200">
                                <div class="flex justify-between"><span>${t('gains.sale_example_1_property')}</span><span class="font-bold text-yellow-400">${t('gains.sale_example_1_commission')}</span></div>
                                <div class="flex justify-between"><span>${t('gains.sale_example_2_property')}</span><span class="font-bold text-yellow-400">${t('gains.sale_example_2_commission')}</span></div>
                                <div class="flex justify-between"><span>${t('gains.sale_example_3_property')}</span><span class="font-bold text-yellow-400">${t('gains.sale_example_3_commission')}</span></div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 rounded-xl p-8 border border-white/10">
                            <div class="text-yellow-400 text-xl font-bold mb-4">${t('gains.rental_title')}</div>
                            <div class="space-y-3 text-blue-200">
                                <div class="flex justify-between"><span>${t('gains.rental_example_1_property')}</span><span class="font-bold text-yellow-400">${t('gains.rental_example_1_commission')}</span></div>
                                <div class="flex justify-between"><span>${t('gains.rental_example_2_property')}</span><span class="font-bold text-yellow-400">${t('gains.rental_example_2_commission')}</span></div>
                                <div class="flex justify-between"><span>${t('gains.rental_example_3_property')}</span><span class="font-bold text-yellow-400">${t('gains.rental_example_3_commission')}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
                                <li><a href="mailto:contact@real-estate-referrer.com" class="hover:text-yellow-400 transition">${t('common:footer.email')}</a></li>
                                <li><span>${t('common:footer.location')}</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-white/10 pt-6 text-center text-blue-300">${t('common:footer.copyright')}</div>
                </div>
            </footer>
        </div>
    `;
}

// SVG eye icon for password toggle (reused in template)
const SVG_EYE = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.957 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.957-9.542-7z"/></svg>`;

export function renderAuthPage(mode) {
    const t = (key) => window.i18next.t(key);
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);

    let title, buttonText, linkText, linkAction;

    const emailOptInTranslations = {
        fr: { label: "J'accepte de recevoir des notifications par email", description: "Mises à jour sur vos leads, commissions et opportunités. Vous pourrez vous désabonner à tout moment." },
        en: { label: "I agree to receive email notifications", description: "Updates about your leads, commissions and opportunities. You can unsubscribe at any time." },
        ar: { label: "أوافق على تلقي إشعارات البريد الإلكتروني", description: "تحديثات حول العملاء المحتملين والعمولات والفرص. يمكنك إلغاء الاشتراك في أي وقت." },
        ru: { label: "Я согласен получать уведомления по электронной почте", description: "Обновления о ваших лидах, комиссиях и возможностях. Вы можете отписаться в любое время." },
        hi: { label: "मैं ईमेल सूचनाएं प्राप्त करने के लिए सहमत हूं", description: "आपके लीड्स, कमीशन और अवसरों के बारे में अपडेट। आप किसी भी समय सदस्यता समाप्त कर सकते हैं।" },
        ur: { label: "میں ای میل نوٹیفیکیشنز حاصل کرنے پر راضی ہوں", description: "آپ کے لیڈز، کمیشنز اور مواقع کے بارے میں اپڈیٹس۔ آپ کسی بھی وقت ان سبسکرائب کر سکتے ہیں۔" },
        zh: { label: "我同意接收电子邮件通知", description: "关于您的线索、佣金和机会的更新。您可以随时取消订阅。" },
        tl: { label: "Sumasang-ayon akong tumanggap ng mga email notification", description: "Mga update tungkol sa iyong leads, commissions at opportunities. Maaari kang mag-unsubscribe anumang oras." }
    };
    const emailOptIn = emailOptInTranslations[currentLang] || emailOptInTranslations['en'];

    const phoneHelpTranslations = { fr: "Numéro sans le 0 initial", en: "Number without leading 0", ar: "الرقم بدون الصفر الأول", ru: "Номер без начального 0", hi: "0 के बिना नंबर", ur: "0 کے بغیر نمبر", zh: "不带前导0的号码", tl: "Numero na walang 0 sa unahan" };
    const phoneHelp = phoneHelpTranslations[currentLang] || phoneHelpTranslations['en'];

    if (mode === 'login') {
        title = t('auth:login_title'); buttonText = t('auth:login_button'); linkText = t('auth:no_account'); linkAction = 'showSignup()';
    } else if (mode === 'signup') {
        title = t('auth:signup_title'); buttonText = t('auth:signup_button'); linkText = t('auth:have_account'); linkAction = 'showLogin()';
    } else if (mode === 'reset') {
        title = t('auth:reset_title'); buttonText = t('auth:reset_button'); linkText = t('auth:back_to_login'); linkAction = 'showLogin()';
    } else if (mode === '2fa') {
        const tempPhone = window.tempPhone || '';
        const maskedPhone = tempPhone ? (tempPhone.slice(0, -4).replace(/\d/g, '*') + tempPhone.slice(-4)) : '***';
        const twoFactorTranslations = {
            fr: { title: 'Vérification SMS', subtitle: `Code envoyé au ${maskedPhone}`, code_label: 'Code de vérification (6 chiffres)', code_help: 'Entrez le code à 6 chiffres reçu par SMS', verify_button: 'Vérifier', resend_code: 'Renvoyer le code', back_to_signup: '← Retour à l\'inscription', back_button: '← Retour' },
            en: { title: 'SMS Verification', subtitle: `Code sent to ${maskedPhone}`, code_label: 'Verification code (6 digits)', code_help: 'Enter the 6-digit code received by SMS', verify_button: 'Verify', resend_code: 'Resend code', back_to_signup: '← Back to signup', back_button: '← Back' },
            ar: { title: 'التحقق عبر الرسائل القصيرة', subtitle: `تم إرسال الرمز إلى ${maskedPhone}`, code_label: 'رمز التحقق (6 أرقام)', code_help: 'أدخل الرمز المكون من 6 أرقام', verify_button: 'تحقق', resend_code: 'إعادة إرسال', back_to_signup: '← العودة', back_button: '← رجوع' },
            ru: { title: 'Проверка SMS', subtitle: `Код отправлен на ${maskedPhone}`, code_label: 'Код (6 цифр)', code_help: 'Введите код из SMS', verify_button: 'Подтвердить', resend_code: 'Отправить снова', back_to_signup: '← Назад', back_button: '← Назад' },
            hi: { title: 'SMS सत्यापन', subtitle: `कोड ${maskedPhone} पर भेजा गया`, code_label: 'कोड (6 अंक)', code_help: 'SMS से प्राप्त कोड दर्ज करें', verify_button: 'सत्यापित करें', resend_code: 'पुनः भेजें', back_to_signup: '← वापस', back_button: '← वापस' },
            ur: { title: 'SMS تصدیق', subtitle: `کوڈ ${maskedPhone} پر بھیجا گیا`, code_label: 'کوڈ (6 ہندسے)', code_help: 'SMS سے کوڈ درج کریں', verify_button: 'تصدیق', resend_code: 'دوبارہ بھیجیں', back_to_signup: '← واپس', back_button: '← واپس' },
            zh: { title: '短信验证', subtitle: `验证码已发送至 ${maskedPhone}`, code_label: '验证码（6位）', code_help: '输入短信验证码', verify_button: '验证', resend_code: '重新发送', back_to_signup: '← 返回', back_button: '← 返回' },
            tl: { title: 'SMS Verification', subtitle: `Code sa ${maskedPhone}`, code_label: 'Code (6 digits)', code_help: 'Ilagay ang code', verify_button: 'I-verify', resend_code: 'Ipadala muli', back_to_signup: '← Bumalik', back_button: '← Bumalik' }
        };
        const trans = twoFactorTranslations[currentLang] || twoFactorTranslations['en'];
        return `
            <div class="min-h-screen flex items-center justify-center px-4">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
                    <button onclick="window.backTo2FASignup()" class="text-blue-200 hover:text-white mb-6 flex items-center">${trans.back_button}</button>
                    <h2 class="text-3xl font-bold mb-2 text-center text-yellow-400">${trans.title}</h2>
                    <p class="text-center text-blue-200 mb-6">${trans.subtitle}</p>
                    <form id="form2FA" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-2 text-blue-100">${trans.code_label}</label>
                            <input type="text" id="code2fa" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000" class="w-full px-4 py-3 bg-slate-800/50 text-white rounded-lg border border-white/20 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 text-center text-2xl tracking-widest font-mono" required autocomplete="one-time-code">
                            <p class="mt-2 text-sm text-blue-300">${trans.code_help}</p>
                        </div>
                        <div id="error2fa" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"></div>
                        <button type="submit" id="verify2faBtn" class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 rounded-lg transition transform hover:scale-105">${trans.verify_button}</button>
                        <div class="text-center"><button type="button" id="resendBtn" onclick="window.resend2FACode()" class="text-yellow-400 hover:text-yellow-300 text-sm font-medium">${trans.resend_code}</button></div>
                        <div class="text-center"><button type="button" onclick="window.backTo2FASignup()" class="text-blue-300 hover:text-white text-sm">${trans.back_to_signup}</button></div>
                    </form>
                </div>
            </div>
        `;
    } else if (mode === 'change-password') {
        title = 'Nouveau mot de passe'; buttonText = 'Changer le mot de passe'; linkText = 'Retour à la connexion'; linkAction = 'showLogin()';
    }

    return `
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
                <button onclick="backToHome()" class="text-blue-200 hover:text-white mb-6 flex items-center">← ${t('auth:back_home')}</button>
                <h2 class="text-3xl font-bold mb-6 text-center text-yellow-400">${title}</h2>
                ${mode === 'login' || mode === 'signup' ? `
                    <div class="space-y-3 mb-6">
                        <button onclick="signInWithGoogle()" type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all">
                            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            <span class="font-semibold">${t('auth:continue_with_google')}</span>
                        </button>
                        <button onclick="signInWithApple()" type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-lg border-2 border-gray-800 hover:border-gray-700 transition-all">
                            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                            <span class="font-semibold">${t('auth:continue_with_apple')}</span>
                        </button>
                    </div>
                    <div class="relative my-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/20"></div></div><div class="relative flex justify-center text-sm"><span class="px-4 bg-slate-900/50 text-blue-200 rounded">OR</span></div></div>
                ` : ''}
                <form id="authForm" class="space-y-4">
                    ${mode === 'signup' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:name_label')}</label>
                            <input type="text" id="name" required minlength="2" maxlength="100" placeholder="${t('auth:full_name_placeholder')}" class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50" oninput="validateName()">
                            <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:phone_label')}</label>
                            <input type="tel" id="phone" required placeholder="${t('auth:phone_placeholder')}" class="w-full py-2 pr-4 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50">
                            <p class="text-xs text-blue-300 mt-1">${phoneHelp}</p>
                            <div class="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-2">
                                <p class="text-xs text-blue-200">${t('auth:sms_verification_notice')}</p>
                            </div>
                            <div id="phoneError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                    ` : ''}
                    ${mode !== 'change-password' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${t('auth:email_label')}</label>
                            <input type="email" id="email" required placeholder="${t('auth:email_placeholder')}" class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none transition-colors text-white placeholder-blue-300/50" ${mode === 'signup' ? 'oninput="validateEmail()"' : ''}>
                            ${mode === 'signup' ? '<div id="emailError" class="text-red-400 text-sm mt-1 hidden"></div>' : ''}
                        </div>
                    ` : ''}
                    ${mode !== 'reset' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${mode === 'change-password' ? 'Nouveau mot de passe' : t('auth:password_label')}</label>
                            <div class="relative">
                                <input type="password" id="${mode === 'change-password' ? 'newPassword' : 'password'}" required minlength="8" placeholder="••••••••" class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none pr-12 transition-colors text-white placeholder-blue-300/50" ${mode === 'signup' || mode === 'change-password' ? 'oninput="validatePassword()"' : ''}>
                                <button type="button" onclick="togglePasswordVisibility('${mode === 'change-password' ? 'newPassword' : 'password'}', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors">${SVG_EYE}</button>
                            </div>
                            ${mode === 'signup' || mode === 'change-password' ? `
                                <div class="mt-2">
                                    <div class="flex items-center gap-2 text-xs text-blue-300"><div id="passwordStrength" class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div id="passwordStrengthBar" class="h-full w-0 transition-all duration-300"></div></div><span id="passwordStrengthText" class="min-w-[60px]"></span></div>
                                    <div class="text-xs text-blue-300 mt-1.5 space-y-0.5">
                                        <div id="req-length" class="flex items-center gap-1"><span class="w-3">•</span><span>${t('auth:password_req_length')}</span></div>
                                        <div id="req-letter" class="flex items-center gap-1"><span class="w-3">•</span><span>${t('auth:password_req_letter')}</span></div>
                                        <div id="req-number" class="flex items-center gap-1"><span class="w-3">•</span><span>${t('auth:password_req_number')}</span></div>
                                        <div id="req-special" class="flex items-center gap-1"><span class="w-3">•</span><span>${t('auth:password_req_special')}</span></div>
                                    </div>
                                </div>
                            ` : '<div class="text-sm text-blue-300 mt-1">' + t('auth:password_hint') + '</div>'}
                            <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                        </div>
                    ` : ''}
                    ${mode === 'signup' || mode === 'change-password' ? `
                        <div>
                            <label class="block mb-2 font-medium text-blue-100">${mode === 'change-password' ? 'Confirmer le nouveau mot de passe' : t('auth:confirm_password_label')}</label>
                            <div class="relative">
                                <input type="password" id="${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}" required minlength="8" placeholder="••••••••" class="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/20 focus:border-yellow-500 focus:outline-none pr-12 transition-colors text-white placeholder-blue-300/50" oninput="validateConfirmPassword()">
                                <button type="button" onclick="togglePasswordVisibility('${mode === 'change-password' ? 'confirmNewPassword' : 'confirmPassword'}', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors">${SVG_EYE}</button>
                            </div>
                            <div id="confirmPasswordError" class="text-red-400 text-sm mt-1 hidden"></div>
                            <div id="confirmPasswordSuccess" class="text-green-400 text-sm mt-1 hidden flex items-center gap-1"><span>✓</span><span>${t('auth:password_validation.passwords_match')}</span></div>
                        </div>
                    ` : ''}
                    ${mode === 'signup' ? `
                        <div class="mt-4 p-4 bg-slate-800/30 border border-white/10 rounded-xl">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" id="emailOptIn" class="w-5 h-5 mt-0.5 text-yellow-500 bg-slate-700 border-gray-500 rounded focus:ring-yellow-500 focus:ring-2">
                                <div><span class="text-white font-medium">${emailOptIn.label}</span><p class="text-blue-300 text-sm mt-1">${emailOptIn.description}</p></div>
                            </label>
                        </div>
                    ` : ''}
                    ${mode === 'login' ? `<div class="text-right"><button type="button" onclick="showReset()" class="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">${t('auth:forgot_password')}</button></div>` : ''}
                    <div id="authError" class="text-red-400 text-sm hidden bg-red-900/20 border border-red-500/50 rounded-lg p-3"></div>
                    <button type="submit" id="submitButton" class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" ${mode === 'signup' || mode === 'change-password' ? 'disabled' : ''}>${buttonText}</button>
                </form>
                <p class="text-center mt-6 text-blue-200"><button onclick="${linkAction}" class="text-yellow-400 hover:text-yellow-300 transition-colors">${linkText}</button></p>
            </div>
        </div>
    `;
}

export function renderDashboard() {
    const t = (key) => window.i18next.t(key);
    const userProfile = window.userProfile;
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);

    // Fix #2 — Removed all emoji from badge labels
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

    const profileTranslations = { fr: 'Mon Profil', en: 'My Profile', ar: 'ملفي الشخصي', ru: 'Мой профиль', hi: 'मेरी प्रोफ़ाइल', ur: 'میری پروفائل', zh: '我的资料', tl: 'Aking Profile' };
    const myProfileText = profileTranslations[currentLang] || profileTranslations['en'];

    if (!userProfile) {
        return '<div class="min-h-screen flex items-center justify-center"><div class="text-xl text-blue-200">Chargement du profil...</div></div>';
    }

    const isAdmin = userProfile.role === 'admin';
    const hasValidContract = userProfile.contract_path || userProfile.contract_file_url || ['signed', 'validated', 'approved'].includes(userProfile.contract_status);
    const dashboardTitle = isAdmin ? t('dashboard:admin_title') : t('dashboard:referrer_title');
    const profileComplete = isProfileComplete(userProfile);
    const canAddLeads = profileComplete && hasValidContract;

    // Fix #2 — Removed emoji from all translated strings
    const dwt = {
        fr: { complete_title: "Complétez votre inscription pour accéder à toutes les fonctionnalités", complete_desc: 'Pour pouvoir soumettre des leads et <strong class="text-yellow-400">recevoir vos commissions</strong>, veuillez compléter ces 2 étapes :', step1_title: "Étape 1 : Signer le contrat d'apporteur", step1_done: "Contrat signé ✓", step1_todo: "Obligatoire pour recevoir vos paiements", step1_btn: "Signer maintenant", step2_title: "Étape 2 : Compléter votre profil", step2_done: "Profil complet ✓", step2_todo: "Nom, téléphone et adresse requis pour les paiements", step2_btn: "Compléter", why_title: "Pourquoi ces étapes ?", why_desc: "Le contrat protège vos commissions et votre profil complet nous permet de vous payer.", locked_btn: "(Complétez les étapes ci-dessus)" },
        en: { complete_title: "Complete your registration to access all features", complete_desc: 'To submit leads and <strong class="text-yellow-400">receive your commissions</strong>, please complete these 2 steps:', step1_title: "Step 1: Sign the referrer agreement", step1_done: "Contract signed ✓", step1_todo: "Required to receive your payments", step1_btn: "Sign now", step2_title: "Step 2: Complete your profile", step2_done: "Profile complete ✓", step2_todo: "Name, phone and address required for payments", step2_btn: "Complete", why_title: "Why these steps?", why_desc: "The contract protects your commissions and your complete profile allows us to pay you.", locked_btn: "(Complete the steps above)" },
        ar: { complete_title: "أكمل تسجيلك للوصول إلى جميع الميزات", complete_desc: 'لتقديم العملاء المحتملين و<strong class="text-yellow-400">استلام عمولاتك</strong>، يرجى إكمال هاتين الخطوتين:', step1_title: "الخطوة 1: توقيع عقد الإحالة", step1_done: "العقد موقع ✓", step1_todo: "مطلوب لاستلام مدفوعاتك", step1_btn: "وقّع الآن", step2_title: "الخطوة 2: أكمل ملفك الشخصي", step2_done: "الملف الشخصي مكتمل ✓", step2_todo: "الاسم والهاتف والعنوان مطلوبة للمدفوعات", step2_btn: "أكمل", why_title: "لماذا هذه الخطوات؟", why_desc: "العقد يحمي عمولاتك وملفك الشخصي الكامل يسمح لنا بدفعك.", locked_btn: "(أكمل الخطوات أعلاه)" },
        ru: { complete_title: "Завершите регистрацию для доступа ко всем функциям", complete_desc: 'Для подачи лидов и <strong class="text-yellow-400">получения комиссий</strong> выполните 2 шага:', step1_title: "Шаг 1: Подписать договор", step1_done: "Договор подписан ✓", step1_todo: "Необходимо для получения выплат", step1_btn: "Подписать", step2_title: "Шаг 2: Заполнить профиль", step2_done: "Профиль заполнен ✓", step2_todo: "Имя, телефон и адрес необходимы для выплат", step2_btn: "Заполнить", why_title: "Зачем?", why_desc: "Договор защищает ваши комиссии, профиль позволяет нам вам платить.", locked_btn: "(Выполните шаги выше)" },
        hi: { complete_title: "सभी सुविधाओं तक पहुंच के लिए पंजीकरण पूरा करें", complete_desc: 'लीड जमा करने और <strong class="text-yellow-400">कमीशन प्राप्त करने</strong> के लिए ये 2 चरण पूरे करें:', step1_title: "चरण 1: अनुबंध पर हस्ताक्षर करें", step1_done: "अनुबंध हस्ताक्षरित ✓", step1_todo: "भुगतान के लिए आवश्यक", step1_btn: "हस्ताक्षर करें", step2_title: "चरण 2: प्रोफ़ाइल पूरी करें", step2_done: "प्रोफ़ाइल पूर्ण ✓", step2_todo: "नाम, फोन और पता आवश्यक", step2_btn: "पूरा करें", why_title: "क्यों?", why_desc: "अनुबंध कमीशन की रक्षा करता है, प्रोफ़ाइल भुगतान के लिए आवश्यक है।", locked_btn: "(चरण पूरे करें)" },
        ur: { complete_title: "تمام خصوصیات تک رسائی کے لیے رجسٹریشن مکمل کریں", complete_desc: 'لیڈز جمع کروانے اور <strong class="text-yellow-400">کمیشن حاصل کرنے</strong> کے لیے یہ 2 مراحل مکمل کریں:', step1_title: "مرحلہ 1: معاہدے پر دستخط کریں", step1_done: "معاہدے پر دستخط ✓", step1_todo: "ادائیگیوں کے لیے ضروری", step1_btn: "دستخط کریں", step2_title: "مرحلہ 2: پروفائل مکمل کریں", step2_done: "پروفائل مکمل ✓", step2_todo: "نام، فون اور پتہ ضروری", step2_btn: "مکمل کریں", why_title: "کیوں؟", why_desc: "معاہدہ کمیشن کی حفاظت کرتا ہے، پروفائل ادائیگی کے لیے ضروری ہے۔", locked_btn: "(مراحل مکمل کریں)" },
        zh: { complete_title: "完成注册以使用所有功能", complete_desc: '要提交线索并<strong class="text-yellow-400">获得佣金</strong>，请完成2个步骤：', step1_title: "步骤1：签署协议", step1_done: "合同已签署 ✓", step1_todo: "接收付款所必需", step1_btn: "立即签署", step2_title: "步骤2：完善资料", step2_done: "资料已完善 ✓", step2_todo: "付款需要姓名、电话和地址", step2_btn: "完善", why_title: "为什么？", why_desc: "合同保护佣金，完整资料让我们能够付款。", locked_btn: "(完成上述步骤)" },
        tl: { complete_title: "Kumpletuhin ang registration para ma-access ang lahat ng features", complete_desc: 'Para magsumite ng leads at <strong class="text-yellow-400">matanggap ang mga komisyon</strong>, kumpletuhin ang 2 hakbang:', step1_title: "Hakbang 1: Pumirma ng agreement", step1_done: "Kontrata napirmahan ✓", step1_todo: "Kailangan para matanggap ang mga bayad", step1_btn: "Pumirma", step2_title: "Hakbang 2: Kumpletuhin ang profile", step2_done: "Profile kumpleto ✓", step2_todo: "Pangalan, telepono at address kailangan", step2_btn: "Kumpletuhin", why_title: "Bakit?", why_desc: "Pinoprotektahan ng kontrata ang komisyon, kailangan ang profile para sa bayad.", locked_btn: "(Kumpletuhin ang mga hakbang)" }
    };
    const dw = dwt[currentLang] || dwt['en'];

    // Helper: status indicator without emoji
    const stepIndicator = (done) => `
        <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${done ? 'bg-green-500' : 'bg-red-500'}">
            ${done ? '✓' : '✗'}
        </div>
    `;

    let addLeadSection = '';
    if (!isAdmin) {
        if (canAddLeads) {
            addLeadSection = `<button id="addLeadBtn" onclick="showAddLeadForm()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition">${t('dashboard:add_lead')}</button>`;
        } else {
            const stepContractDone = hasValidContract;
            const stepProfileDone = profileComplete;
            // Fix #2 + Fix #3 — No emoji, no promotional styling
            addLeadSection = `
                <div class="bg-orange-500/10 border border-orange-500/50 rounded-2xl p-6 mb-6">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-orange-300 mb-2">${dw.complete_title}</h3>
                        <p class="text-white/80 mb-4">${dw.complete_desc}</p>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 p-3 rounded-lg ${stepContractDone ? 'bg-green-500/10 border border-green-500/40' : 'bg-red-500/10 border border-red-500/40'}">
                                ${stepIndicator(stepContractDone)}
                                <div class="flex-1">
                                    <div class="font-semibold ${stepContractDone ? 'text-green-300' : 'text-red-300'}">${dw.step1_title}</div>
                                    <div class="text-sm text-blue-300">${stepContractDone ? dw.step1_done : dw.step1_todo}</div>
                                </div>
                                ${!stepContractDone ? `<a href="/contract-signature.html" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded-lg transition text-sm">${dw.step1_btn}</a>` : ''}
                            </div>
                            <div class="flex items-center gap-3 p-3 rounded-lg ${stepProfileDone ? 'bg-green-500/10 border border-green-500/40' : 'bg-red-500/10 border border-red-500/40'}">
                                ${stepIndicator(stepProfileDone)}
                                <div class="flex-1">
                                    <div class="font-semibold ${stepProfileDone ? 'text-green-300' : 'text-red-300'}">${dw.step2_title}</div>
                                    <div class="text-sm text-blue-300">${stepProfileDone ? dw.step2_done : dw.step2_todo}</div>
                                </div>
                                ${!stepProfileDone ? `<a href="profile.html" class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition text-sm">${dw.step2_btn}</a>` : ''}
                            </div>
                        </div>
                        <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p class="text-yellow-200 text-sm"><strong>${dw.why_title}</strong> ${dw.why_desc}</p>
                        </div>
                    </div>
                </div>
                <button id="addLeadBtn" disabled class="bg-gray-600/50 text-gray-400 font-bold px-6 py-3 rounded-lg cursor-not-allowed opacity-60">${t('dashboard:add_lead')} ${dw.locked_btn}</button>
            `;
        }
    }

    return `
        <div class="min-h-screen">
            <header class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold text-yellow-400">${dashboardTitle}</h1>
                        <div class="flex items-center gap-4">
                            <span class="text-yellow-400 font-medium hidden md:inline">${userProfile.name}</span>
                            <a href="profile.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">${myProfileText}</a>
                            <button onclick="logout()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">${t('dashboard:logout')}</button>
                        </div>
                    </div>
                </div>
            </header>
            <main class="container mx-auto px-4 py-8">
                ${!hasValidContract && !isAdmin ? `
                    <div id="contractRequirement" class="mb-6 bg-blue-900/20 border border-yellow-500/50 p-8 rounded-2xl shadow-lg">
                        <div class="flex flex-col lg:flex-row gap-8">
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold text-yellow-400 mb-4">${t('dashboard:contract.required')}</h3>
                                <div class="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                    <h4 class="font-bold text-white mb-3">${t('dashboard:contract.what_is_it')}</h4>
                                    <p class="text-blue-200 text-sm mb-3">${t('dashboard:contract.explanation')}</p>
                                    <ul class="space-y-2 text-sm text-blue-200 ml-4">
                                        <li>— <strong>${t('dashboard:contract.benefit1_title')}</strong> ${t('dashboard:contract.benefit1_desc')}</li>
                                        <li>— <strong>${t('dashboard:contract.benefit2_title')}</strong> ${t('dashboard:contract.benefit2_desc')}</li>
                                        <li>— <strong>${t('dashboard:contract.benefit3_title')}</strong> ${t('dashboard:contract.benefit3_desc')}</li>
                                        <li>— <strong>${t('dashboard:contract.benefit4_title')}</strong> ${t('dashboard:contract.benefit4_desc')}</li>
                                        <li>— <strong>${t('dashboard:contract.benefit5_title')}</strong> ${t('dashboard:contract.benefit5_desc')}</li>
                                    </ul>
                                </div>
                                <div class="grid md:grid-cols-2 gap-8">
                                    <div class="bg-green-900/20 border border-green-500/40 p-6 rounded-xl">
                                        <div class="mb-4">
                                            <h4 class="font-bold text-green-300 text-lg">${t('dashboard:contract.electronic_signature')}</h4>
                                            <p class="text-xs text-blue-300">${t('dashboard:contract.electronic_signature_intro')}</p>
                                        </div>
                                        <ul class="space-y-2 text-sm text-blue-200 mb-4">
                                            <li class="flex items-center gap-2"><span class="text-green-400">✓</span><span>${t('dashboard:contract.signature_feature_1')}</span></li>
                                            <li class="flex items-center gap-2"><span class="text-green-400">✓</span><span>${t('dashboard:contract.signature_feature_2')}</span></li>
                                            <li class="flex items-center gap-2"><span class="text-green-400">✓</span><span>${t('dashboard:contract.signature_feature_3')}</span></li>
                                            <li class="flex items-center gap-2"><span class="text-green-400">✓</span><span>${t('dashboard:contract.signature_feature_4')}</span></li>
                                        </ul>
                                        <a href="/contract-signature.html" class="block w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition text-center">${t('dashboard:contract.sign_now_button')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                ${hasValidContract && !isAdmin ? `
                    <div id="contractUploaded" class="mb-6 bg-green-900/20 border border-green-500/40 p-6 rounded-2xl">
                        <div class="flex items-center gap-4">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-green-300 mb-1">${t('dashboard:contract.signed_validated')}</h3>
                                <p class="text-blue-200 mb-3">${t('dashboard:contract.can_add_leads')}</p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="bg-yellow-500/20 text-yellow-400 text-sm px-3 py-1 rounded-full border border-yellow-500/30">${badges.buyers}</span>
                                    <span class="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30">${badges.others}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div id="stats" class="grid md:grid-cols-4 gap-6 mb-8"></div>
                ${!isAdmin ? `<div class="mb-6">${addLeadSection}</div>` : ''}
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
                    <h2 class="text-2xl font-bold mb-4 text-yellow-400">${isAdmin ? t('dashboard:all_leads') : t('dashboard:my_leads')}</h2>
                    <div id="leadsTable" class="overflow-x-auto"></div>
                </div>
            </main>
            <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-slate-800/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-400">${t('dashboard:add_lead')}</h3>
                    <form id="addLeadForm" onsubmit="event.preventDefault(); window.addLead(event);">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_name')} *</label>
                                <input type="text" id="clientName" required class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_email')} *</label>
                                <input type="email" id="clientEmail" required class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:client_phone')} *</label>
                                <input type="tel" id="clientPhone" required class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-blue-200 mb-2">${t('dashboard:budget')} (AED) *</label>
                                <input type="text" id="budget" required inputmode="numeric" placeholder="1,500,000" class="w-full px-4 py-2 bg-slate-700/50 rounded-lg text-white border border-white/20 focus:border-yellow-500 focus:outline-none">
                            </div>
                        </div>
                        <div class="mt-6">
                            <label class="block text-blue-200 mb-3">${t('dashboard:lead_type')} *</label>
                            <!-- Fix #3 — Neutral styling, no trophy, no "RECOMMANDÉ" badge -->
                            <div class="space-y-2">
                                <label class="flex items-center p-3 bg-slate-700/50 border border-yellow-500/40 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="sale_buyer" onchange="document.getElementById('leadType').value='sale_buyer'" class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1">
                                        <span class="text-white font-semibold">${t('dashboard:sale_buyer')}</span>
                                        <span class="text-blue-300 text-sm ml-2">— ${t('dashboard:commission')}: 25% ${t('dashboard:of_agent_commission')}</span>
                                    </div>
                                </label>
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="sale_seller" onchange="document.getElementById('leadType').value='sale_seller'" class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1"><span class="text-white">${t('dashboard:sale_seller')}</span><span class="text-blue-300 text-sm ml-2">— ${t('dashboard:commission')}: 20%</span></div>
                                </label>
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_landlord" onchange="document.getElementById('leadType').value='rental_landlord'" class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1"><span class="text-white">${t('dashboard:rental_landlord')}</span><span class="text-blue-300 text-sm ml-2">— ${t('dashboard:commission')}: 20%</span></div>
                                </label>
                                <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="leadTypeRadio" value="rental_tenant" onchange="document.getElementById('leadType').value='rental_tenant'" class="w-4 h-4 text-yellow-500 mr-3">
                                    <div class="flex-1"><span class="text-white">${t('dashboard:rental_tenant')}</span><span class="text-blue-300 text-sm ml-2">— ${t('dashboard:commission')}: 20%</span></div>
                                </label>
                            </div>
                            <input type="hidden" id="leadType" name="leadType" required>
                        </div>
                        <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" id="clientConsent" required class="w-5 h-5 mt-0.5 text-blue-500 rounded border-gray-500 focus:ring-blue-500">
                                <div>
                                    <span class="text-white font-medium">${t('dashboard:consent_checkbox_label')} *</span>
                                    <p class="text-blue-300 text-sm mt-1">${t('dashboard:consent_checkbox_description')}</p>
                                </div>
                            </label>
                        </div>
                        <div class="flex gap-4 mt-8">
                            <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">${t('dashboard:add')}</button>
                            <button type="button" onclick="window.closeAddLeadModal()" class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition border border-white/20">${t('dashboard:cancel')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
