// ============================================
// GESTION DES LEADS
// Real Estate Referrer - Dubai
// Version: 3.7.0 - anti-duplicate lead check (RPC client_already_referred)
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

        // Téléphone international : +971 par défaut, autres pays possibles
        setTimeout(() => { if (window.initPhoneInput) window.initPhoneInput('clientPhone', ''); }, 130);

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
    setVal('budget', lead.budget ? Number(lead.budget).toLocaleString('en-US') : '');
    // Téléphone international pré-rempli
    setTimeout(() => { if (window.initPhoneInput) window.initPhoneInput('clientPhone', lead.client_phone || ''); }, 130);
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
    const clientPhone = (window.getFullPhoneNumber ? window.getFullPhoneNumber('clientPhone') : '') || document.getElementById('clientPhone')?.value?.trim();
    let leadType = document.getElementById('leadType')?.value
        || document.querySelector('input[name="leadTypeRadio"]:checked')?.value;
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

    // Anti-doublon (création uniquement) : vérifie globalement via une fonction
    // sécurisée côté base. Si la fonction n'existe pas encore, on ne bloque pas.
    if (!editingLeadId) {
        try {
            const { data: isDup } = await supabase.rpc('client_already_referred', {
                p_email: clientEmail, p_phone: clientPhone
            });
            if (isDup) {
                if (window.showNiceModal) {
                    window.showNiceModal('This client (email or phone number) has already been referred recently. Please double-check before submitting again.', { title: 'Possible duplicate', type: 'warning' });
                } else {
                    alert('This client has already been referred recently.');
                }
                return;
            }
        } catch (e) { /* fonction absente → on n'empêche pas la création */ }
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
            if (window.showNiceModal) window.showNiceModal('Your changes have been saved.', { title: 'Lead updated!' });
            else alert('Lead updated successfully!');
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
            if (window.showNiceModal) window.showNiceModal('The lead has been added to your dashboard.', { title: 'Lead added!' });
            else alert(i18next.t('dashboard:lead_added_success') || 'Lead added successfully!');
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
// NB : passer un lead en "vendu" ouvre la fenêtre de commission au lieu
// d'écrire le statut directement — sinon la commission resterait vide.
export async function updateLeadStatus(leadId, newStatus) {
    const supabase = window.supabase;
    const i18next = window.i18next;

    if (newStatus === 'vendu') {
        openCommissionModal(leadId);
        if (window.loadDashboardContent) await window.loadDashboardContent();
        return;
    }

    try {
        const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
        if (error) throw error;
        if (window.loadDashboardContent) await window.loadDashboardContent();
    } catch (error) {
        console.error('Error updating status:', error);
        alert(i18next.t('dashboard:error_updating_status') || 'Error updating status');
    }
}

// ============================================
// COMMISSION — fenêtre de saisie et de calcul
// ============================================

// Taux par défaut de la commission d'agence (sur le prix)
const DEFAULT_AGENCY_RATE_SALE = 2;    // %
const DEFAULT_AGENCY_RATE_RENTAL = 5;  // %
const DEFAULT_AGENCY_SPLIT = 50;       // % de la commission d'agence revenant à l'agent

const num = (v) => {
    const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
};
const aed = (n) => (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' AED';

export function closeCommissionModal() {
    document.getElementById('commissionModal')?.remove();
}

// Recalcule et met à jour l'aperçu. Appelée à chaque frappe.
export function recalcCommission() {
    const g = (id) => document.getElementById(id);
    if (!g('commissionModal')) return;

    const isRental = g('cmIsRental').value === '1';
    const isSeller = g('cmIsSeller').value === '1';

    const price = num(g('cmPrice').value);
    const agencyRate = num(g('cmAgencyRate').value) / 100;
    const split = num(g('cmSplit').value) / 100;
    const referrerRate = num(g('cmReferrerRate')?.value) / 100;

    const totalCommission = price * agencyRate;
    const agentCommission = totalCommission * split;
    const computed = isSeller ? SELLER_FIXED_REFERRER_AED : agentCommission * referrerRate;

    g('cmOutTotal').textContent = aed(totalCommission);
    g('cmOutAgent').textContent = aed(agentCommission);
    g('cmOutReferrer').textContent = aed(computed);

    // Le champ final n'est écrasé que si l'utilisateur ne l'a pas modifié à la main
    const finalField = g('cmFinal');
    if (finalField && finalField.dataset.touched !== '1') {
        finalField.value = Math.round(computed * 100) / 100;
    }
    const label = g('cmPriceLabel');
    if (label) label.textContent = isRental ? 'Annual rent (AED)' : 'Sale price (AED)';
}

export function onCommissionOverride() {
    const f = document.getElementById('cmFinal');
    if (f) f.dataset.touched = '1';
    const hint = document.getElementById('cmOverrideHint');
    if (hint) hint.style.display = '';
}

export function resetCommissionOverride() {
    const f = document.getElementById('cmFinal');
    if (f) f.dataset.touched = '0';
    const h = document.getElementById('cmOverrideHint');
    if (h) h.style.display = 'none';
    recalcCommission();
}

// Ouvre la fenêtre de commission pour un lead (nouveau closing OU correction)
export async function openCommissionModal(leadId) {
    const supabase = window.supabase;

    const { data: lead, error } = await supabase
        .from('leads')
        .select('id, client_name, lead_type, commission_rate, budget, sale_price, agent_commission, referrer_commission, status')
        .eq('id', leadId)
        .single();

    if (error || !lead) {
        console.error('Error fetching lead:', error);
        alert('Error fetching lead details');
        return;
    }

    const isRental = lead.lead_type === 'rental_landlord' || lead.lead_type === 'rental_tenant';
    const isSeller = lead.lead_type === 'sale_seller';
    const alreadyClosed = lead.status === 'vendu';

    const typeLabels = {
        sale_buyer: 'Buyer (sale)',
        sale_seller: 'Seller (sale)',
        rental_landlord: 'Landlord (rental)',
        rental_tenant: 'Tenant (rental)'
    };

    // Valeurs de départ : on repart de l'existant si le lead est déjà clos
    const startPrice = lead.sale_price || lead.budget || '';
    const defaultAgencyRate = isRental ? DEFAULT_AGENCY_RATE_RENTAL : DEFAULT_AGENCY_RATE_SALE;
    const startReferrerRate = Math.round(((lead.commission_rate ?? COMMISSION_RATES[lead.lead_type] ?? 0.20) * 100) * 100) / 100;

    closeCommissionModal();

    const el = document.createElement('div');
    el.id = 'commissionModal';
    el.className = 'fixed inset-0 z-[210] flex items-center justify-center p-4 overflow-y-auto';
    el.style.cssText = 'background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);';

    const field = (label, id, value, suffix, extra) => `
        <div>
            <label class="block text-sm text-slate-300 mb-1" ${id === 'cmPrice' ? 'id="cmPriceLabelWrap"' : ''}>
                <span ${id === 'cmPrice' ? 'id="cmPriceLabel"' : ''}>${label}</span>
            </label>
            <div class="relative">
                <input id="${id}" type="text" inputmode="decimal" value="${value}"
                       oninput="window.recalcCommission()" ${extra || ''}
                       class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:outline-none">
                ${suffix ? `<span class="absolute right-3 top-2 text-slate-400 text-sm">${suffix}</span>` : ''}
            </div>
        </div>`;

    el.innerHTML = `
      <div style="background:#14161d;border:1px solid rgba(250,204,21,0.3);border-radius:16px;max-width:34rem;width:100%;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);" class="my-8">
        <div class="px-6 pt-6 pb-4 border-b border-slate-700">
            <h3 class="text-xl font-bold text-white">${alreadyClosed ? 'Edit commission' : 'Close deal & set commission'}</h3>
            <p class="text-slate-400 text-sm mt-1">${lead.client_name} — ${typeLabels[lead.lead_type] || lead.lead_type}</p>
        </div>

        <div class="px-6 py-5 space-y-4">
            <input type="hidden" id="cmIsRental" value="${isRental ? '1' : '0'}">
            <input type="hidden" id="cmIsSeller" value="${isSeller ? '1' : '0'}">

            ${field(isRental ? 'Annual rent (AED)' : 'Sale price (AED)', 'cmPrice', startPrice, 'AED')}

            <div class="grid grid-cols-2 gap-4">
                ${field('Agency commission', 'cmAgencyRate', defaultAgencyRate, '%')}
                ${field('Agency / agent split', 'cmSplit', DEFAULT_AGENCY_SPLIT, '%')}
            </div>

            ${isSeller ? `
                <div class="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                    Seller lead — the referrer receives a <strong class="text-yellow-400">fixed AED ${SELLER_FIXED_REFERRER_AED.toLocaleString()}</strong>, not a percentage.
                </div>
                <input type="hidden" id="cmReferrerRate" value="0">
            ` : field('Referrer share of the agent net commission', 'cmReferrerRate', startReferrerRate, '%')}

            <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2 text-sm">
                <div class="flex justify-between text-slate-300">
                    <span>Total agency commission</span><span id="cmOutTotal" class="font-medium text-white">—</span>
                </div>
                <div class="flex justify-between text-slate-300">
                    <span>Agent net share</span><span id="cmOutAgent" class="font-medium text-white">—</span>
                </div>
                <div class="flex justify-between text-slate-300 pt-2 border-t border-slate-700">
                    <span>Referrer commission (calculated)</span><span id="cmOutReferrer" class="font-bold text-yellow-400">—</span>
                </div>
            </div>

            <div>
                <label class="block text-sm text-slate-300 mb-1">Commission actually paid to the referrer</label>
                <div class="relative">
                    <input id="cmFinal" type="text" inputmode="decimal" data-touched="0"
                           oninput="window.onCommissionOverride()"
                           class="w-full bg-slate-800 border border-yellow-500/50 rounded-lg px-3 py-2 text-white font-bold focus:border-yellow-500 focus:outline-none">
                    <span class="absolute right-3 top-2 text-slate-400 text-sm">AED</span>
                </div>
                <p id="cmOverrideHint" style="display:none" class="text-xs text-yellow-400/80 mt-1">
                    Manual amount — no longer follows the calculation.
                    <button type="button" onclick="window.resetCommissionOverride()" class="underline">recalculate</button>
                </p>
            </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
            <button type="button" onclick="window.closeCommissionModal()"
                    class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition">Cancel</button>
            <button type="button" onclick="window.saveCommission(${lead.id})"
                    class="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold transition">
                ${alreadyClosed ? 'Save' : 'Mark as closed'}
            </button>
        </div>
      </div>`;

    document.body.appendChild(el);
    el.addEventListener('click', (e) => { if (e.target === el) closeCommissionModal(); });

    // Si le lead est déjà clos avec un montant, on le reprend tel quel
    if (alreadyClosed && lead.referrer_commission != null) {
        const f = document.getElementById('cmFinal');
        f.value = lead.referrer_commission;
        f.dataset.touched = '1';
        const h2 = document.getElementById('cmOverrideHint');
        if (h2) h2.style.display = '';
    }
    recalcCommission();
    document.getElementById('cmPrice')?.focus();
}

// Enregistre la commission et clôture le lead
export async function saveCommission(leadId) {
    const supabase = window.supabase;
    const i18next = window.i18next;
    const g = (id) => document.getElementById(id);

    const price = num(g('cmPrice').value);
    const agencyRate = num(g('cmAgencyRate').value) / 100;
    const split = num(g('cmSplit').value) / 100;
    const isSeller = g('cmIsSeller').value === '1';
    const referrerRate = isSeller ? null : num(g('cmReferrerRate').value) / 100;
    const finalAmount = num(g('cmFinal').value);

    if (price <= 0) { alert('Please enter a valid price.'); g('cmPrice').focus(); return; }
    if (agencyRate <= 0 || agencyRate > 0.10) { alert('Agency commission must be between 0 and 10%.'); return; }
    if (split <= 0 || split > 1) { alert('The agency / agent split must be between 0 and 100%.'); return; }
    if (!isSeller && (referrerRate < 0 || referrerRate > 1)) { alert('The referrer share must be between 0 and 100%.'); return; }
    if (finalAmount < 0) { alert('The commission cannot be negative.'); return; }

    const agentCommission = price * agencyRate * split;

    const payload = {
        status: 'vendu',
        sale_price: price,
        agent_commission: Math.round(agentCommission * 100) / 100,
        referrer_commission: Math.round(finalAmount * 100) / 100,
        closed_at: new Date().toISOString()
    };
    if (!isSeller) payload.commission_rate = referrerRate;

    try {
        const { error } = await supabase.from('leads').update(payload).eq('id', leadId);
        if (error) throw error;

        closeCommissionModal();
        const msg = 'Price: ' + aed(price) +
                    '<br>Agent net share: ' + aed(agentCommission) +
                    '<br><strong>Referrer commission: ' + aed(finalAmount) + '</strong>';
        if (window.showNiceModal) window.showNiceModal(msg, { title: 'Deal closed' });
        else alert('Deal closed. Referrer commission: ' + aed(finalAmount));

        if (window.loadDashboardContent) await window.loadDashboardContent();
    } catch (error) {
        console.error('Error saving commission:', error);
        alert((i18next?.t('dashboard:error_marking_sold')) || ('Error saving the commission: ' + error.message));
    }
}

// Compatibilité : l'ancien bouton "Mark as sold" ouvre désormais la fenêtre
export async function markAsSold(leadId) {
    return openCommissionModal(leadId);
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

    // Le premier type (Buyer) est coché par défaut → le champ caché doit refléter ça
    const defaultLeadType = ENABLED_LEAD_TYPES[0] || '';

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
window.markAsSold = markAsSold;
window.updateLeadStatus = updateLeadStatus;
window.openCommissionModal = openCommissionModal;
window.saveCommission = saveCommission;
window.closeCommissionModal = closeCommissionModal;
window.recalcCommission = recalcCommission;
window.onCommissionOverride = onCommissionOverride;
window.resetCommissionOverride = resetCommissionOverride;
