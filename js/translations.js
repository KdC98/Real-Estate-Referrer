// ============================================
// CONFIGURATION i18next (TRADUCTIONS)
// ============================================

export async function initTranslations() {
    await i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: 'fr',
            debug: true,
            load: 'languageOnly',
            ns: ['translation', 'auth', 'dashboard', 'common'],
            defaultNS: 'translation',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json'
            },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage']
            }
        });
    
    console.log('🌐 Loading translations...');
    await i18next.loadNamespaces(['translation', 'auth', 'dashboard', 'common']);
    console.log('✅ All translations loaded!');
}

// Fonction helper pour traduire
export const t = (key) => i18next.t(key);

// Changer de langue
export async function changeLanguage(langCode) {
    try {
        await i18next.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        window.location.reload();
    } catch (error) {
        console.error('Erreur changement de langue:', error);
    }
}

// Traductions OAuth (8 langues)
export const oauthTranslations = {
    fr: {
        security_info: "Information de sécurité",
        redirect_message: "Vous allez être redirigé vers notre service d'authentification sécurisé <strong>(Supabase)</strong> pour vous connecter avec",
        normal_secure: "C'est normal et sécurisé.",
        will_return: "Vous reviendrez automatiquement sur notre site après connexion.",
        continue_btn: "Continuer",
        cancel_btn: "Annuler"
    },
    en: {
        security_info: "Security Information",
        redirect_message: "You will be redirected to our secure authentication service <strong>(Supabase)</strong> to sign in with",
        normal_secure: "This is normal and secure.",
        will_return: "You will automatically return to our site after signing in.",
        continue_btn: "Continue",
        cancel_btn: "Cancel"
    },
    ar: {
        security_info: "معلومات الأمان",
        redirect_message: "سيتم إعادة توجيهك إلى خدمة المصادقة الآمنة <strong>(Supabase)</strong> لتسجيل الدخول باستخدام",
        normal_secure: "هذا طبيعي وآمن.",
        will_return: "ستعود تلقائياً إلى موقعنا بعد تسجيل الدخول.",
        continue_btn: "متابعة",
        cancel_btn: "إلغاء"
    },
    ru: {
        security_info: "Информация о безопасности",
        redirect_message: "Вы будете перенаправлены на нашу защищенную службу аутентификации <strong>(Supabase)</strong> для входа через",
        normal_secure: "Это нормально и безопасно.",
        will_return: "Вы автоматически вернетесь на наш сайт после входа.",
        continue_btn: "Продолжить",
        cancel_btn: "Отмена"
    },
    hi: {
        security_info: "सुरक्षा जानकारी",
        redirect_message: "आपको हमारी सुरक्षित प्रमाणीकरण सेवा <strong>(Supabase)</strong> पर पुनर्निर्देशित किया जाएगा",
        normal_secure: "यह सामान्य और सुरक्षित है।",
        will_return: "साइन इन करने के बाद आप स्वचालित रूप से हमारी साइट पर लौट आएंगे।",
        continue_btn: "जारी रखें",
        cancel_btn: "रद्द करें"
    },
    ur: {
        security_info: "سیکیورٹی کی معلومات",
        redirect_message: "آپ کو ہماری محفوظ تصدیق خدمت <strong>(Supabase)</strong> پر بھیجا جائے گا",
        normal_secure: "یہ نارمل اور محفوظ ہے۔",
        will_return: "سائن ان کے بعد آپ خود بخود ہماری سائٹ پر واپس آ جائیں گے۔",
        continue_btn: "جاری رکھیں",
        cancel_btn: "منسوخ کریں"
    },
    zh: {
        security_info: "安全信息",
        redirect_message: "您将被重定向到我们的安全认证服务<strong>(Supabase)</strong>以使用以下方式登录",
        normal_secure: "这是正常且安全的。",
        will_return: "登录后您将自动返回我们的网站。",
        continue_btn: "继续",
        cancel_btn: "取消"
    },
    tl: {
        security_info: "Impormasyon sa Seguridad",
        redirect_message: "Ire-redirect ka sa aming secure authentication service <strong>(Supabase)</strong> para mag-sign in gamit ang",
        normal_secure: "Ito ay normal at secure.",
        will_return: "Awtomatikong babalik ka sa aming site pagkatapos mag-sign in.",
        continue_btn: "Magpatuloy",
        cancel_btn: "Kanselahin"
    }
};
