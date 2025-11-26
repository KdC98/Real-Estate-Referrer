// ============================================
// GESTION DES LEADS
// Real Estate Referrer - Dubai
// Version: 3.3.0 - Nouveau système commissions
// ============================================

import { currentUser } from './auth.js';

// Taux de commission selon le type de lead
const COMMISSION_RATES = {
    'sale_buyer': 0.25,      // 🏆 Acheteur : 25% (PREMIUM)
    'sale_seller': 0.20,     // Vendeur : 20%
    'rental_landlord': 0.20, // Propriétaire bailleur : 20%
    'rental_tenant': 0.20    // Locataire : 20%
};

// Afficher le formulaire d'ajout de lead
export function showAddLeadForm() {
    const i18next = window.i18next;
    const userProfile = window.userProfile; // ✅ Utiliser window.userProfile
    
    const hasValidContract = userProfile?.contract_path || 
                            userProfile?.contract_file_url || 
                            ['signed', 'validated', 'approved'].includes(userProfile?.contract_status);
    
    console.log('🔍 showAddLeadForm check:', {
        contract_path: userProfile?.contract_path,
        contract_status: userProfile?.contract_status,
        hasValidContract: !!hasValidContract
    });
    
    if (!hasValidContract) {
        alert(i18next.t('dashboard:contract_required_to_add_lead') || 'You must upload your signed contract before adding leads.');
        return;
    }
    
    const modal = document.getElementById('addLeadModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Fermer le modal d'ajout de lead
export function closeAddLeadModal() {
    const modal = document.getElementById('addLeadModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Ajouter un lead
export async function addLead(event) {
    // Empêcher le comportement par défaut du formulaire
    if (event) {
        event.preventDefault();
    }
    
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    console.log('📝 addLead() called');
    
    // Récupérer les valeurs du formulaire
    const clientName = document.getElementById('clientName')?.value?.trim();
    const clientEmail = document.getElementById('clientEmail')?.value?.trim();
    const clientPhone = document.getElementById('clientPhone')?.value?.trim();
    const leadType = document.getElementById('leadType')?.value;
    const budget = document.getElementById('budget')?.value;
    const clientConsent = document.getElementById('clientConsent')?.checked;
    
    console.log('📋 Form values:', {
        clientName,
        clientEmail,
        clientPhone,
        leadType,
        budget,
        clientConsent
    });
    
    // Validation
    if (!clientName || !clientEmail || !clientPhone || !leadType || !budget) {
        alert(i18next.t('dashboard:fill_all_fields') || 'Please fill in all fields.');
        return;
    }
    
    // ✅ Vérification du consentement OBLIGATOIRE
    if (!clientConsent) {
        alert(i18next.t('dashboard:consent_required') || 'You must confirm that the client has agreed to be contacted.');
        return;
    }
    
    // Récupérer le taux de commission selon le type
    const commissionRate = COMMISSION_RATES[leadType] || 0.20;
    
    const leadData = {
        referrer_id: currentUser?.id || window.currentUser?.id,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        lead_type: leadType,
        budget: parseFloat(budget),
        status: 'nouveau',
        client_consent: true, // ✅ Consentement confirmé
        commission_rate: commissionRate
    };
    
    console.log('📝 Inserting lead:', leadData);
    
    // Vérifier que referrer_id existe
    if (!leadData.referrer_id) {
        console.error('❌ No referrer_id found!');
        alert('Error: User not authenticated. Please refresh and try again.');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([leadData])
            .select();
        
        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }
        
        console.log('✅ Lead added successfully:', data);
        alert(i18next.t('dashboard:lead_added_success') || 'Lead added successfully!');
        
        // Fermer le modal et réinitialiser le formulaire
        closeAddLeadModal();
        document.getElementById('addLeadForm')?.reset();
        
        // Recharger le dashboard
        if (window.loadDashboardContent) {
            await window.loadDashboardContent();
        }
        
    } catch (error) {
        console.error('❌ Error adding lead:', error);
        alert((i18next.t('dashboard:error_adding_lead') || 'Error adding lead: ') + error.message);
    }
}

// Mettre à jour le statut d'un lead
export async function updateLeadStatus(leadId, newStatus) {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    console.log(`🔄 Updating lead ${leadId} status to: ${newStatus}`);
    
    try {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId);
        
        if (error) throw error;
        
        console.log('✅ Lead status updated');
        
        // Recharger le dashboard
        if (window.loadDashboardContent) {
            await window.loadDashboardContent();
        }
        
    } catch (error) {
        console.error('❌ Error updating status:', error);
        alert(i18next.t('dashboard:error_updating_status') || 'Error updating status');
    }
}

// Marquer un lead comme vendu - NOUVEAU CALCUL
export async function markAsSold(leadId) {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    // Récupérer le lead pour connaître son type
    const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('lead_type, commission_rate')
        .eq('id', leadId)
        .single();
    
    if (fetchError) {
        console.error('❌ Error fetching lead:', fetchError);
        alert('Error fetching lead details');
        return;
    }
    
    const salePrice = prompt(i18next.t('dashboard:enter_sale_price') || 'Sale price (AED):');
    if (!salePrice) return;
    
    const price = parseFloat(salePrice);
    
    if (isNaN(price) || price <= 0) {
        alert(i18next.t('dashboard:invalid_price') || 'Invalid price');
        return;
    }
    
    // ✅ NOUVEAU CALCUL avec taux variable
    const commissionRate = lead.commission_rate || COMMISSION_RATES[lead.lead_type] || 0.20;
    const agentCommission = price * 0.01; // 1% du prix de vente (part agent)
    const referrerCommission = agentCommission * commissionRate; // 25% ou 20% selon type
    
    console.log(`💰 Marking lead ${leadId} as sold:`, {
        price,
        leadType: lead.lead_type,
        commissionRate: `${commissionRate * 100}%`,
        agentCommission,
        referrerCommission
    });
    
    try {
        const { error } = await supabase
            .from('leads')
            .update({
                status: 'vendu',
                sale_price: price,
                agent_commission: agentCommission,
                referrer_commission: referrerCommission,
                closed_at: new Date().toISOString()
            })
            .eq('id', leadId);
        
        if (error) throw error;
        
        console.log('✅ Lead marked as sold');
        
        const ratePercent = commissionRate * 100;
        alert(
            (i18next.t('dashboard:lead_sold_success') || 'Lead sold!') + 
            `\n\nCommission (${ratePercent}%): ${referrerCommission.toLocaleString()} AED`
        );
        
        // Recharger le dashboard
        if (window.loadDashboardContent) {
            await window.loadDashboardContent();
        }
        
    } catch (error) {
        console.error('❌ Error marking as sold:', error);
        alert(i18next.t('dashboard:error_marking_sold') || 'Error processing sale');
    }
}

// Générer le HTML du modal d'ajout de lead - NOUVEAU DESIGN
export function renderAddLeadModal() {
    const i18next = window.i18next;
    const t = (key) => i18next.t(key);
    const app = document.getElementById('app');
    
    // Vérifier si le modal existe déjà
    if (document.getElementById('addLeadModal')) return;
    
    const modalHTML = `
        <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-6">${t('dashboard:add_lead')}</h3>
                
                <form id="addLeadForm" onsubmit="event.preventDefault(); window.addLead(event);">
                    <div class="grid md:grid-cols-2 gap-4">
                        <!-- Nom du client -->
                        <div>
                            <label class="block text-gray-300 mb-2">${t('dashboard:client_name')} *</label>
                            <input type="text" id="clientName" required 
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                        
                        <!-- Email du client -->
                        <div>
                            <label class="block text-gray-300 mb-2">${t('dashboard:client_email')} *</label>
                            <input type="email" id="clientEmail" required 
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                        
                        <!-- Téléphone du client -->
                        <div>
                            <label class="block text-gray-300 mb-2">${t('dashboard:client_phone')} *</label>
                            <input type="tel" id="clientPhone" required 
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                        
                        <!-- Budget -->
                        <div>
                            <label class="block text-gray-300 mb-2">${t('dashboard:budget')} (AED) *</label>
                            <input type="number" id="budget" required min="0" step="1000" 
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                    </div>
                    
                    <!-- Type de lead - NOUVEAU DESIGN avec commissions -->
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
    `;
    
    app.insertAdjacentHTML('beforeend', modalHTML);
}

// Exposer les fonctions globalement
window.addLead = addLead;
window.closeAddLeadModal = closeAddLeadModal;
window.showAddLeadForm = showAddLeadForm;
