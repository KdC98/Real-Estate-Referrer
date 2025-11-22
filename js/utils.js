// ============================================
// FONCTIONS UTILITAIRES
// Real Estate Referrer - Dubai
// ============================================

// Lire les paramètres d'URL
export function getQueryParams() {
    const params = {};
    const search = window.location.search.substring(1);
    if (!search) return params;
    
    for (const part of search.split('&')) {
        const [key, value] = part.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return params;
}

// Toggle menu mobile
export function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.textContent = '✕';
    } else {
        menu.classList.add('hidden');
        icon.textContent = '☰';
    }
}

// Pré-remplir données de test
export function prefillTestData() {
    if (document.getElementById('name')) {
        document.getElementById('name').value = 'Test User';
        document.getElementById('countryCode').value = '+33';
        document.getElementById('phone').value = '612345678';
        document.getElementById('email').value = 'test@example.com';
        document.getElementById('password').value = 'Test1234!';
        document.getElementById('confirmPassword').value = 'Test1234!';
        
        // Déclencher les validations
        if (window.validateName) window.validateName();
        if (window.validatePhone) window.validatePhone();
        if (window.validateEmail) window.validateEmail();
        if (window.validatePassword) window.validatePassword();
        if (window.validateConfirmPassword) window.validateConfirmPassword();
        
        console.log('✅ Données de test pré-remplies');
    }
}

// Télécharger le template de contrat
export async function downloadContractTemplate() {
    const supabase = window.supabase; // ✅ Récupérer depuis window
    
    try {
        console.log('📥 Downloading contract template...');
        const { data, error } = await supabase.storage
            .from('contracts')
            .getPublicUrl('contract_template_en.pdf');
        
        if (error) {
            console.error('❌ Error getting template URL:', error);
            alert('Error downloading contract. Please contact support.');
            return;
        }
        
        console.log('✅ Template URL:', data.publicUrl);
        window.open(data.publicUrl, '_blank');
    } catch (error) {
        console.error('❌ Exception downloading template:', error);
        alert('Error downloading: ' + error.message);
    }
}

// Vérifier si un numéro de téléphone existe déjà
export async function checkPhoneExists(phone) {
    const supabase = window.supabase; // ✅ Récupérer depuis window
    
    try {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('phone', cleanPhone)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking phone:', error);
            return { exists: false, error: error.message };
        }
        
        return { exists: !!data, userName: data?.name };
    } catch (err) {
        console.error('Exception checking phone:', err);
        return { exists: false, error: err.message };
    }
}
