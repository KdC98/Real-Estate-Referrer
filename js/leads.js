// ============================================
// GESTION DES LEADS
// Real Estate Referrer - Dubai
// ============================================

import { currentUser } from './auth.js';

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
        hasValidContract
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
export async function addLead() {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    const form = document.getElementById('addLeadForm');
    if (!form) return;
    
    const leadData = {
        referrer_id: currentUser.id,
        client_name: document.getElementById('clientName')?.value,
        client_email: document.getElementById('clientEmail')?.value,
        client_phone: document.getElementById('clientPhone')?.value,
        property_type: document.getElementById('propertyType')?.value,
        budget: parseFloat(document.getElementById('budget')?.value),
        status: 'nouveau'
    };
    
    console.log('📝 Adding lead:', leadData);
    
    try {
        const { error } = await supabase
            .from('leads')
            .insert([leadData]);
        
        if (error) throw error;
        
        console.log('✅ Lead added successfully');
        alert(i18next.t('dashboard:lead_added_success') || 'Lead ajouté avec succès !');
        
        closeAddLeadModal();
        form.reset();
        
        // Recharger le dashboard
        if (window.loadDashboardContent) {
            await window.loadDashboardContent();
        }
        
    } catch (error) {
        console.error('❌ Error adding lead:', error);
        alert(i18next.t('dashboard:error_adding_lead') || 'Erreur lors de l\'ajout du lead');
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
        alert(i18next.t('dashboard:error_updating_status') || 'Erreur lors de la mise à jour du statut');
    }
}

// Marquer un lead comme vendu
export async function markAsSold(leadId) {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    const salePrice = prompt(i18next.t('dashboard:enter_sale_price') || 'Prix de vente (AED):');
    if (!salePrice) return;
    
    const price = parseFloat(salePrice);
    
    if (isNaN(price) || price <= 0) {
        alert(i18next.t('dashboard:invalid_price') || 'Prix invalide');
        return;
    }
    
    // Calcul des commissions
    const agentCommission = price * 0.01; // 1% du prix de vente
    const referrerCommission = agentCommission * 0.20; // 20% de la commission agent
    
    console.log(`💰 Marking lead ${leadId} as sold:`, {
        price,
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
        alert(i18next.t('dashboard:lead_sold_success') || `Lead vendu ! Commission apporteur: ${referrerCommission.toLocaleString()} AED`);
        
        // Recharger le dashboard
        if (window.loadDashboardContent) {
            await window.loadDashboardContent();
        }
        
    } catch (error) {
        console.error('❌ Error marking as sold:', error);
        alert(i18next.t('dashboard:error_marking_sold') || 'Erreur lors de la vente');
    }
}

// Afficher le modal d'ajout de lead (appelé depuis le dashboard)
export function renderAddLeadModal() {
    const i18next = window.i18next;
    const app = document.getElementById('app');
    
    // Vérifier si le modal existe déjà
    if (document.getElementById('addLeadModal')) return;
    
    const modalHTML = `
        <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                <h3 class="text-2xl font-bold mb-6">${i18next.t('dashboard:add_lead')}</h3>
                
                <form id="addLeadForm" onsubmit="event.preventDefault(); window.addLead();">
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">${i18next.t('dashboard:client_name')}</label>
                        <input type="text" id="clientName" required class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">${i18next.t('dashboard:client_email')}</label>
                        <input type="email" id="clientEmail" required class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">${i18next.t('dashboard:client_phone')}</label>
                        <input type="tel" id="clientPhone" required class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">${i18next.t('dashboard:property_type')}</label>
                        <select id="propertyType" required class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white">
                            <option value="apartment">${i18next.t('dashboard:apartment')}</option>
                            <option value="villa">${i18next.t('dashboard:villa')}</option>
                            <option value="penthouse">${i18next.t('dashboard:penthouse')}</option>
                            <option value="townhouse">${i18next.t('dashboard:townhouse')}</option>
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-gray-300 mb-2">${i18next.t('dashboard:budget')} (AED)</label>
                        <input type="number" id="budget" required min="0" step="1000" class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white">
                    </div>
                    
                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">
                            ${i18next.t('dashboard:add')}
                        </button>
                        <button type="button" onclick="window.closeAddLeadModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition">
                            ${i18next.t('common:cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    app.insertAdjacentHTML('beforeend', modalHTML);
}
