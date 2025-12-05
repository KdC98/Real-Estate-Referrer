/**
 * Génère le HTML du modal de complétion de profil (pour OAuth)
 * @returns {string} HTML du modal
 */
export function renderProfileCompletionModal() {
    const currentLang = (window.i18next?.language || 'fr').substring(0, 2);
    
    // ✅ Traductions 8 langues
    const translations = {
        fr: {
            title: "Complétez votre profil",
            subtitle: "Pour recevoir vos commissions, nous avons besoin de quelques informations",
            name_label: "Nom complet",
            name_placeholder: "Votre nom complet",
            phone_label: "Numéro de téléphone",
            phone_placeholder: "Ex: 501234567",
            address_label: "Adresse complète",
            address_placeholder: "Votre adresse pour les paiements",
            address_help: "Nécessaire pour l'envoi des paiements",
            submit_button: "Enregistrer et continuer",
            required_notice: "Ces informations sont obligatoires pour recevoir vos commissions"
        },
        en: {
            title: "Complete your profile",
            subtitle: "To receive your commissions, we need some information",
            name_label: "Full name",
            name_placeholder: "Your full name",
            phone_label: "Phone number",
            phone_placeholder: "Ex: 501234567",
            address_label: "Full address",
            address_placeholder: "Your address for payments",
            address_help: "Required for payment delivery",
            submit_button: "Save and continue",
            required_notice: "This information is required to receive your commissions"
        },
        ar: {
            title: "أكمل ملفك الشخصي",
            subtitle: "لتلقي عمولاتك، نحتاج إلى بعض المعلومات",
            name_label: "الاسم الكامل",
            name_placeholder: "اسمك الكامل",
            phone_label: "رقم الهاتف",
            phone_placeholder: "مثال: 501234567",
            address_label: "العنوان الكامل",
            address_placeholder: "عنوانك للدفعات",
            address_help: "مطلوب لإرسال المدفوعات",
            submit_button: "حفظ ومتابعة",
            required_notice: "هذه المعلومات مطلوبة لتلقي عمولاتك"
        },
        ru: {
            title: "Заполните свой профиль",
            subtitle: "Для получения комиссионных нам нужна некоторая информация",
            name_label: "Полное имя",
            name_placeholder: "Ваше полное имя",
            phone_label: "Номер телефона",
            phone_placeholder: "Пример: 501234567",
            address_label: "Полный адрес",
            address_placeholder: "Ваш адрес для платежей",
            address_help: "Необходим для отправки платежей",
            submit_button: "Сохранить и продолжить",
            required_notice: "Эта информация необходима для получения комиссионных"
        },
        hi: {
            title: "अपनी प्रोफ़ाइल पूरी करें",
            subtitle: "अपना कमीशन प्राप्त करने के लिए, हमें कुछ जानकारी चाहिए",
            name_label: "पूरा नाम",
            name_placeholder: "आपका पूरा नाम",
            phone_label: "फ़ोन नंबर",
            phone_placeholder: "उदा: 501234567",
            address_label: "पूरा पता",
            address_placeholder: "भुगतान के लिए आपका पता",
            address_help: "भुगतान भेजने के लिए आवश्यक",
            submit_button: "सहेजें और जारी रखें",
            required_notice: "अपना कमीशन प्राप्त करने के लिए यह जानकारी आवश्यक है"
        },
        ur: {
            title: "اپنا پروفائل مکمل کریں",
            subtitle: "اپنا کمیشن حاصل کرنے کے لیے، ہمیں کچھ معلومات درکار ہیں",
            name_label: "پورا نام",
            name_placeholder: "آپ کا پورا نام",
            phone_label: "فون نمبر",
            phone_placeholder: "مثال: 501234567",
            address_label: "مکمل پتہ",
            address_placeholder: "ادائیگیوں کے لیے آپ کا پتہ",
            address_help: "ادائیگی بھیجنے کے لیے ضروری ہے",
            submit_button: "محفوظ کریں اور جاری رکھیں",
            required_notice: "اپنا کمیشن حاصل کرنے کے لیے یہ معلومات ضروری ہیں"
        },
        zh: {
            title: "完善您的资料",
            subtitle: "为了接收您的佣金，我们需要一些信息",
            name_label: "全名",
            name_placeholder: "您的全名",
            phone_label: "电话号码",
            phone_placeholder: "例如: 501234567",
            address_label: "完整地址",
            address_placeholder: "您的付款地址",
            address_help: "付款发送所需",
            submit_button: "保存并继续",
            required_notice: "此信息是接收佣金所必需的"
        },
        tl: {
            title: "Kumpletuhin ang iyong profile",
            subtitle: "Para matanggap ang iyong mga komisyon, kailangan namin ng ilang impormasyon",
            name_label: "Buong pangalan",
            name_placeholder: "Ang iyong buong pangalan",
            phone_label: "Numero ng telepono",
            phone_placeholder: "Hal: 501234567",
            address_label: "Kumpletong address",
            address_placeholder: "Ang iyong address para sa mga bayad",
            address_help: "Kinakailangan para sa pagpapadala ng bayad",
            submit_button: "I-save at magpatuloy",
            required_notice: "Ang impormasyong ito ay kinakailangan para matanggap ang iyong mga komisyon"
        }
    };
    
    const t = translations[currentLang] || translations['en'];
    
    // Pré-remplir avec les données existantes si disponibles
    const profile = window.userProfile || {};
    const existingName = profile.name || '';
    const existingPhone = profile.phone || '';
    const existingAddress = profile.address || '';
    
    return `
        <div id="profileCompletionModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full border-2 border-yellow-500/50 shadow-2xl">
                <!-- Header -->
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">👤</div>
                    <h2 class="text-2xl font-bold text-yellow-400 mb-2">${t.title}</h2>
                    <p class="text-blue-200">${t.subtitle}</p>
                </div>
                
                <!-- Notice -->
                <div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-6">
                    <p class="text-yellow-300 text-sm text-center">
                        ⚠️ ${t.required_notice}
                    </p>
                </div>
                
                <!-- Form -->
                <form id="profileCompletionForm" class="space-y-4">
                    <!-- Nom -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-2">
                            ${t.name_label} *
                        </label>
                        <input 
                            type="text" 
                            id="completionName" 
                            value="${existingName}"
                            required
                            minlength="2"
                            placeholder="${t.name_placeholder}"
                            class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
                        >
                    </div>
                    
                    <!-- Téléphone -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-2">
                            ${t.phone_label} *
                        </label>
                        <div class="flex gap-2">
                            <select 
                                id="completionCountryCode" 
                                class="w-28 px-3 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
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
                                id="completionPhone" 
                                value="${existingPhone.replace(/^\+\d+/, '')}"
                                required
                                placeholder="${t.phone_placeholder}"
                                class="flex-1 px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
                            >
                        </div>
                    </div>
                    
                    <!-- Adresse -->
                    <div>
                        <label class="block text-sm font-medium text-blue-100 mb-2">
                            ${t.address_label} *
                        </label>
                        <textarea 
                            id="completionAddress" 
                            required
                            rows="2"
                            placeholder="${t.address_placeholder}"
                            class="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition resize-none"
                        >${existingAddress}</textarea>
                        <p class="text-xs text-blue-300 mt-1">📍 ${t.address_help}</p>
                    </div>
                    
                    <!-- Error message -->
                    <div id="completionError" class="hidden bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"></div>
                    
                    <!-- Submit button -->
                    <button 
                        type="submit"
                        id="completionSubmitBtn"
                        class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-4 rounded-lg transition transform hover:scale-[1.02] mt-6"
                    >
                        ${t.submit_button} →
                    </button>
                </form>
            </div>
        </div>
    `;
}
