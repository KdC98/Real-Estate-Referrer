// ============================================
// GESTION DES LEADS
// Real Estate Referrer - Dubai
// Version: 3.6.0 - Edit/Delete leads, budget separators, property type/bedrooms/area
// ============================================

import { currentUser } from './auth.js';

// ── CONFIG : types de leads activés ──────────────────────────────
const ENABLED_LEAD_TYPES = ['sale_buyer', 'sale_seller', 'rental_landlord', 'rental_tenant'];
// ─────────────────────────────────────────────────────────────────

// Taux de commission APPORTEUR (en % de la part agent NETTE) selon le type de lead
const COMMISSION_RATES = {
    'sale_buyer': 0.25,      // Acheteur : 25% de la part agent
    'sale_seller': 0.25,     // (non utilisé : vendeur = montant FIXE)
    'rental_landlord': 0.20, // Propriétaire bailleur : 20%
    'rental_tenant': 0.20    // Locataire : 20%
};

// Vendeur : montant FIXE (payé uniquement quand le bien est vendu).
const SELLER_FIXED_REFERRER_AED = 1000;

// ── Options bien immobilier ──────────────────────────────────────
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Plot', 'Office', 'Other'];
const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5+'];

// État : ID du lead en cours d'édition (null = création)
let editingLeadId = null;

// ── Séparateurs de milliers pour le champ budget ─────────────────
export function formatThousands(el) {
    const digits = (el.value || '').replace(/[^0-9]/g, '');
    el.value = digits ? Number(digits).toLocaleString('en-US') : '';
}

// Afficher le formulaire d'ajout de lead (création)
export function showAddLeadForm() {
    const i18next = window.i18next;
    const t = (key) => i18next.t(key);
    const userProfile = window.userProfile;

    const hasValidContract = userProfile?.contract_path ||
                            userProfile?.contract_file_url ||
                            ['signed', 'validated', 'approved'].includes(userProfile?.contract_status);

    if (!hasValidContract) {
        alert(i18next.t('dashboard:contract_required_to_add_lead') || 'You must upload your signed contract before adding leads.');
        return;
    }

    renderAddLeadModal();
    editingLeadId = null;

    const form = document.getElementById('addLeadForm');
    if (form) form.reset();

    const title = document.getElementById('addLeadTitle');
    if (title) title.textContent = t('dashboard:add_lead') || 'Add a lead';
    const submitBtn = document.getElementById('addLeadSubmit');
    if (submitBtn) submitBtn.textContent = t('dashboard:add') || 'Add';

    const modal = document.getElementById('addLeadModal');
    if (modal) {
        modal.classList.remove('hidden');

        if (ENABLED_LEAD_TYPES.length === 1) {
            const onlyType = ENABLED_LEAD_TYPES[0];
            const leadTypeInput = document.getElementById('leadType');
            if (leadTypeInput) leadTypeInput.value = onlyType;
            const radio = document.querySelector(`input[name="leadTypeRadio"][value="${onlyType}"]`);
            if (radio) radio.checked = true;
        }
    }
}

// Éditer un lead existant : ouvre le modal pré-rempli
export async function editLead(leadId) {
    const supabase = window.supabase;

    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

    if (error || !lead) {
        console.error('Error loading lead for edit:', error);
        alert('Error loading this lead.');
        return;
    }

    renderAddLeadModal();
    editingLeadId = leadId;

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
    setVal('clientName', lead.client_name);
    setVal('clientEmail', lead.client_email);
    setVal('clientPhone', lead.client_phone);
    setVal('budget', lead.budget ? Number(lead.budget).toLocaleString('en-US') : '');
    setVal('leadType', lead.lead_type);
    setVal('propertyType', lead.property_type);
    setVal('bedrooms', lead.bedrooms);
    setVal('locationArea', lead.location_area);

    const radio = document.querySelector(`input[name="leadTypeRadio"][value="${lead.lead_type}"]`);
    if (radio) radio.checked = true;

    const consent = document.getElementById('clientConsent');
    if (consent) consent.checked = true;

    const title = document.getElementById('addLeadTitle');
    if (title) title.textContent = 'Edit lead';
    const submitBtn = document.getElementById('addLeadSubmit');
    if (submitBtn) submitBtn.textContent = 'Save changes';

    const modal = document.getElementById('addLeadModal');
    if (modal) modal.classList.remove('hidden');
}

// Supprimer un lead
export async function deleteLead(leadId) {
    const supabase = window.supabase;
    if (!confirm('Delete this lead? This action cannot be undone.')) return;

    try {
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) throw error;
        if (window.loadDashboardContent) await window.loadDashboardContent();
    } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Error deleting lead: ' + error.message);
    }
}

// Fermer le modal d'ajout de lead
export function closeAddLeadModal() {
    const modal = document.getElementById('addLeadModal');
    if (modal) modal.classList.add('hidden');
    editingLeadId = null;
}

// Ajouter OU mettre à jour un lead
export async function addLead(event) {
    if (event) event.preventDefault();

    const supabase = window.supabase;
    const i18next = window.i18next;

    const clientName = document.getElementById('clientName')?.value?.trim();
    const clientEmail = document.getElementById('clientEmail')?.value?.trim();
    const clientPhone = document.getElementById('clientPhone')?.value?.trim();
    let leadType = document.getElementById('leadType')?.value;
    const budgetValue = document.getElementById('budget')?.value?.replace(/[^0-9]/g, '');
    const budget = budgetValue ? parseFloat(budgetValue) : null;
    const clientConsent = document.getElementById('clientConsent')?.checked;

    const propertyType = document.getElementById('propertyType')?.value || null;
    const bedrooms = document.getElementById('bedrooms')?.value || null;
    const locationArea = document.getElementById('locationArea')?.value?.trim() || null;

    if (ENABLED_LEAD_TYPES.length === 1 && !leadType) {
        leadType = ENABLED_LEAD_TYPES[0];
    }
    if (leadType && !ENABLED_LEAD_TYPES.includes(leadType)) {
        leadType = ENABLED_LEAD_TYPES[0];
    }

    if (!clientName || !clientEmail || !clientPhone || !leadType || !budget) {
        alert(i18next.t('dashboard:fill_all_fields') || 'Please fill in all required fields.');
        return;
    }
    if (!clientConsent) {
        alert(i18next.t('dashboard:consent_required') || 'You must confirm that the client has agreed to be contacted.');
        return;
    }

    const commissionRate = COMMISSION_RATES[leadType] || 0.20;
    const userId = currentUser?.id || window.currentUser?.id;

    if (!userId) {
        alert('Error: User not authenticated. Please refresh and try again.');
        return;
    }

    try {
        if (editingLeadId) {
            // ===== MISE À JOUR =====
            const { error } = await supabase
                .from('leads')
                .update({
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    lead_type: leadType,
                    budget: budget,
                    commission_rate: commissionRate,
                    property_type: propertyType,
                    bedrooms: bedrooms,
                    location_area: locationArea
                })
                .eq('id', editingLeadId);

            if (error) throw error;
            alert('Lead updated successfully!');
        } else {
            // ===== CRÉATION =====
            const leadData = {
                referrer_id: userId,
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone,
                lead_type: leadType,
                budget: budget,
                status: 'nouveau',
                client_consent: true,
                commission_rate: commissionRate,
                property_type: propertyType,
                bedrooms: bedrooms,
                location_area: locationArea
            };
            const { error } = await supabase.from('leads').insert([leadData]).select();
            if (error) throw error;
            alert(i18next.t('dashboard:lead_added_success') || 'Lead added successfully!');
        }

        editingLeadId = null;
        closeAddLeadModal();
        document.getElementById('addLeadForm')?.reset();

        if (window.loadDashboardContent) await window.loadDashboardContent();

    } catch (error) {
        console.error('Error saving lead:', error);
        alert((i18next.t('dashboard:error_adding_lead') || 'Error saving lead: ') + error.message);
    }
}

// Mettre à jour le statut d'un lead
export async function updateLeadStatus(leadId, newStatus) {
    const supabase = window.supabase;
    const i18next = window.i18next;

    try {
        const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
        if (error) throw error;
        if (window.loadDashboardContent) await window.loadDashboardContent();
    } catch (error) {
        console.error('Error updating status:', error);
        alert(i18next.t('dashboard:error_updating_status') || 'Error updating status');
    }
}

// Marquer un lead comme vendu - CALCUL VENTE + LOCATION
export async function markAsSold(leadId) {
    const supabase = window.supabase;
    const i18next = window.i18next;

    const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('lead_type, commission_rate, budget')
        .eq('id', leadId)
        .single();

    if (fetchError) {
        console.error('Error fetching lead:', fetchError);
        alert('Error fetching lead details');
        return;
    }

    const isRental = lead.lead_type === 'rental_landlord' || lead.lead_type === 'rental_tenant';

    let price, totalCommissionRate, agentCommission, referrerCommission;

    if (isRental) {
        const annualRent = prompt((i18next.t('dashboard:enter_annual_rent') || 'Annual rent (AED):'), lead.budget || '');
        if (!annualRent) return;
        price = parseFloat(annualRent.replace(/[^0-9]/g, ''));
        if (isNaN(price) || price <= 0) { alert(i18next.t('dashboard:invalid_price') || 'Invalid amount'); return; }
        totalCommissionRate = 0.05;
        const totalCommission = price * totalCommissionRate;
        agentCommission = totalCommission * 0.5;
    } else {
        const salePrice = prompt((i18next.t('dashboard:enter_sale_price') || 'Sale price (AED):'), lead.budget || '');
        if (!salePrice) return;
        price = parseFloat(salePrice.replace(/[^0-9]/g, ''));
        if (isNaN(price) || price <= 0) { alert(i18next.t('dashboard:invalid_price') || 'Invalid price'); return; }
        const commissionInput = prompt((i18next.t('dashboard:enter_commission_rate') || 'Total commission rate % (default 2%, up to 5% for off-plan):'), '2');
        if (!commissionInput) return;
        totalCommissionRate = parseFloat(commissionInput.replace(/[^0-9.]/g, '')) / 100;
        if (isNaN(totalCommissionRate) || totalCommissionRate <= 0 || totalCommissionRate > 0.10) {
            alert(i18next.t('dashboard:invalid_commission_rate') || 'Invalid commission rate (must be between 1% and 10%)');
            return;
        }
        const totalCommission = price * totalCommissionRate;
        agentCommission = totalCommission * 0.5;
    }

    let referrerRate = null;
    if (lead.lead_type === 'sale_seller') {
        referrerCommission = SELLER_FIXED_REFERRER_AED;
    } else {
        referrerRate = lead.commission_rate || COMMISSION_RATES[lead.lead_type] || 0.25;
        referrerCommission = agentCommission * referrerRate;
    }

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

        const typeLabel = isRental ? 'Rental' : 'Sale';
        const referrerLine = referrerRate !== null
            ? '\nReferrer commission (' + (referrerRate * 100) + '%): ' + referrerCommission.toLocaleString() + ' AED'
            : '\nReferrer bonus (fixed, seller lead): ' + referrerCommission.toLocaleString() + ' AED';
        alert(
            (i18next.t('dashboard:lead_sold_success') || 'Lead completed!') +
            '\n\n' + typeLabel + ': ' + price.toLocaleString() + ' AED' +
            '\nAgent commission: ' + agentCommission.toLocaleString() + ' AED' +
            referrerLine
        );

        if (window.loadDashboardContent) await window.loadDashboardContent();

    } catch (error) {
        console.error('Error marking as sold:', error);
        alert(i18next.t('dashboard:error_marking_sold') || 'Error processing transaction');
    }
}

// Générer le HTML du modal d'ajout / édition de lead
export function renderAddLeadModal() {
    const i18next = window.i18next;
    const t = (key) => i18next.t(key);
    const app = document.getElementById('app');

    if (document.getElementById('addLeadModal')) return;

    const buyerOption = ENABLED_LEAD_TYPES.includes('sale_buyer') ? `
        <label class="flex items-center p-4 bg-slate-700/50 border border-yellow-500/40 rounded-xl cursor-pointer hover:bg-slate-700 transition">
            <input type="radio" name="leadTypeRadio" value="sale_buyer"
                   onchange="document.getElementById('leadType').value='sale_buyer'"
                   class="w-5 h-5 text-yellow-500 mr-4" checked>
            <div class="flex-1">
                <span class="font-bold text-yellow-400 text-lg">${t('dashboard:sale_buyer')}</span>
                <p class="text-slate-300 text-sm mt-1">${t('dashboard:commission')}: <strong>25%</strong> ${t('dashboard:of_agent_commission')}</p>
            </div>
        </label>
    ` : '';

    const sellerOption = ENABLED_LEAD_TYPES.includes('sale_seller') ? `
        <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
            <input type="radio" name="leadTypeRadio" value="sale_seller"
                   onchange="document.getElementById('leadType').value='sale_seller'"
                   class="w-4 h-4 text-yellow-500 mr-3">
            <div class="flex-1"><span class="text-white">${t('dashboard:sale_seller')}</span><span class="text-slate-300 text-sm ml-2">- AED 1,000 (fixed)</span></div>
        </label>
    ` : '';

    const landlordOption = ENABLED_LEAD_TYPES.includes('rental_landlord') ? `
        <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
            <input type="radio" name="leadTypeRadio" value="rental_landlord"
                   onchange="document.getElementById('leadType').value='rental_landlord'"
                   class="w-4 h-4 text-yellow-500 mr-3">
            <div class="flex-1"><span class="text-white">${t('dashboard:rental_landlord')}</span><span class="text-slate-300 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span></div>
        </label>
    ` : '';

    const tenantOption = ENABLED_LEAD_TYPES.includes('rental_tenant') ? `
        <label class="flex items-center p-3 bg-slate-700/50 border border-white/20 rounded-lg cursor-pointer hover:bg-slate-700 transition">
            <input type="radio" name="leadTypeRadio" value="rental_tenant"
                   onchange="document.getElementById('leadType').value='rental_tenant'"
                   class="w-4 h-4 text-yellow-500 mr-3">
            <div class="flex-1"><span class="text-white">${t('dashboard:rental_tenant')}</span><span class="text-slate-300 text-sm ml-2">- ${t('dashboard:commission')}: 20%</span></div>
        </label>
    ` : '';

    const defaultLeadType = ENABLED_LEAD_TYPES.length === 1 ? ENABLED_LEAD_TYPES[0] : '';

    const propertyTypeOptions = ['<option value="">— Select —</option>']
        .concat(PROPERTY_TYPES.map(p => `<option value="${p}">${p}</option>`)).join('');
    const bedroomOptions = ['<option value="">— Select —</option>']
        .concat(BEDROOM_OPTIONS.map(b => `<option value="${b}">${b === 'Studio' ? 'Studio' : b + ' BR'}</option>`)).join('');

    const modalHTML = `
        <div id="addLeadModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 id="addLeadTitle" class="text-2xl font-bold mb-6">${t('dashboard:add_lead')}</h3>

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
                                   oninput="window.formatThousands(this)"
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                    </div>

                    <div class="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label class="block text-gray-300 mb-2">Property type</label>
                            <select id="propertyType"
                                    class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                                ${propertyTypeOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-300 mb-2">Bedrooms</label>
                            <select id="bedrooms"
                                    class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                                ${bedroomOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-300 mb-2">Preferred area</label>
                            <input type="text" id="locationArea" placeholder="e.g. Dubai Marina"
                                   class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:outline-none">
                        </div>
                    </div>

                    <div class="mt-6">
                        <label class="block text-gray-300 mb-3">${t('dashboard:lead_type')} *</label>
                        <div class="space-y-3">
                            ${buyerOption}
                            ${sellerOption}
                            ${landlordOption}
                            ${tenantOption}
                        </div>
                        <input type="hidden" id="leadType" name="leadType" value="${defaultLeadType}" required>
                    </div>

                    <div class="mt-6 p-4 bg-slate-900/40 border border-yellow-500/30 rounded-xl">
                        <label class="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" id="clientConsent" required
                                   class="w-5 h-5 mt-0.5 text-yellow-500 rounded border-gray-500 focus:ring-yellow-500">
                            <div>
                                <span class="text-white font-medium">${t('dashboard:consent_checkbox_label')} *</span>
                                <p class="text-gray-400 text-sm mt-1">${t('dashboard:consent_checkbox_description')}</p>
                            </div>
                        </label>
                    </div>

                    <div class="flex gap-4 mt-8">
                        <button type="submit" id="addLeadSubmit"
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
window.editLead = editLead;
window.deleteLead = deleteLead;
window.closeAddLeadModal = closeAddLeadModal;
window.showAddLeadForm = showAddLeadForm;
window.formatThousands = formatThousands;
window.renderAddLeadModal = renderAddLeadModal;
