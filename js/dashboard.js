// ============================================
// GESTION DU DASHBOARD
// Real Estate Referrer - Dubai
// Version: 3.3.0 - Fix userProfile loading
// ============================================

import { STATUS_COLORS } from './config.js';

// Charger le contenu du dashboard
export async function loadDashboardContent() {
    const supabase = window.supabase;
    const i18next = window.i18next;
    const userProfile = window.userProfile;
    const currentUser = window.currentUser;
    
    if (!userProfile) {
        console.log('⚠️ No userProfile, skipping dashboard content load');
        return;
    }
    
    console.log('📊 Loading dashboard content for:', userProfile.role);
    
    const isAdmin = userProfile.role === 'admin';
    
    try {
        // Charger les leads
        let query = supabase
            .from('leads')
            .select(`
                *,
                referrer:profiles!leads_referrer_id_fkey(name)
            `)
            .order('created_at', { ascending: false });
        
        if (!isAdmin) {
            query = query.eq('referrer_id', currentUser.id);
        }
        
        const { data: leads, error } = await query;
        
        if (error) {
            console.error('❌ Error loading leads:', error);
            document.getElementById('leadsTable').innerHTML = `
                <div class="text-red-400 p-4">
                    Erreur: ${error.message}
                </div>
            `;
            return;
        }
        
        console.log('✅ Leads loaded:', leads?.length || 0);
        
        // Transformer les données pour avoir referrer_name
        const leadsWithNames = (leads || []).map(lead => ({
            ...lead,
            referrer_name: lead.referrer?.name || 'Unknown'
        }));
        
        // Calculer les statistiques
        const totalEarnings = leadsWithNames
            .filter(l => l.status === 'vendu')
            .reduce((sum, l) => sum + (l.referrer_commission || 0), 0);
        const activeLeads = leadsWithNames.filter(l => l.status !== 'vendu').length;
        const closedSales = leadsWithNames.filter(l => l.status === 'vendu').length;
        
        // Afficher les stats
        renderStats(isAdmin, leadsWithNames.length, totalEarnings, activeLeads, closedSales);
        
        // Afficher le tableau des leads
        renderLeadsTable(isAdmin, leadsWithNames);
        
    } catch (err) {
        console.error('❌ Exception loading dashboard:', err);
    }
}

// Afficher les statistiques
function renderStats(isAdmin, totalLeads, totalEarnings, activeLeads, closedSales) {
    const i18next = window.i18next;
    const statsDiv = document.getElementById('stats');
    
    if (!statsDiv) return;
    
    statsDiv.innerHTML = `
        ${isAdmin ? `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalLeads}</div>
                <div class="text-gray-300">${i18next.t('dashboard:all_leads')}</div>
            </div>
        ` : `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalEarnings.toLocaleString()} AED</div>
                <div class="text-gray-300">${i18next.t('dashboard:total_earnings')}</div>
            </div>
        `}
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
            <div class="text-3xl font-bold text-yellow-500">${activeLeads}</div>
            <div class="text-gray-300">${i18next.t('dashboard:active_leads')}</div>
        </div>
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
            <div class="text-3xl font-bold text-yellow-500">${closedSales}</div>
            <div class="text-gray-300">${i18next.t('dashboard:closed_sales')}</div>
        </div>
        ${isAdmin ? `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalEarnings.toLocaleString()} AED</div>
                <div class="text-gray-300">${i18next.t('dashboard:commissions_paid')}</div>
            </div>
        ` : ''}
    `;
}

// Afficher le tableau des leads
function renderLeadsTable(isAdmin, leads) {
    const i18next = window.i18next;
    const tableDiv = document.getElementById('leadsTable');
    
    if (!tableDiv) return;
    
    tableDiv.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-700">
                    ${isAdmin ? `<th class="text-left py-3 px-4">${i18next.t('dashboard:referrer')}</th>` : ''}
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:client_name')}</th>
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:lead_type')}</th>
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:budget')}</th>
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:status')}</th>
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:commission')}</th>
                    ${isAdmin ? `<th class="text-left py-3 px-4">${i18next.t('dashboard:actions')}</th>` : ''}
                </tr>
            </thead>
            <tbody>
                ${leads.length === 0 ? `
                    <tr>
                        <td colspan="${isAdmin ? '7' : '5'}" class="py-8 text-center text-gray-400">
                            ${i18next.t('dashboard:no_leads')}
                        </td>
                    </tr>
                ` : leads.map(lead => {
                    const leadTypeKey = lead.lead_type || 'sale_buyer';
                    const leadTypeLabel = i18next.t('dashboard:' + leadTypeKey) || leadTypeKey;
                    const commissionRate = lead.commission_rate ? (lead.commission_rate * 100) + '%' : '20%';
                    
                    return `
                    <tr class="border-b border-gray-700 hover:bg-gray-700/30">
                        ${isAdmin ? `<td class="py-3 px-4">${lead.referrer_name}</td>` : ''}
                        <td class="py-3 px-4 font-medium">${lead.client_name}</td>
                        <td class="py-3 px-4">
                            <span class="${leadTypeKey === 'sale_buyer' ? 'text-yellow-400 font-bold' : 'text-gray-300'}">
                                ${leadTypeKey === 'sale_buyer' ? '🏆 ' : ''}${leadTypeLabel}
                            </span>
                            <span class="text-xs text-gray-500 ml-1">(${commissionRate})</span>
                        </td>
                        <td class="py-3 px-4">${lead.budget?.toLocaleString() || '-'} AED</td>
                        <td class="py-3 px-4">
                            ${isAdmin ? `
                                <select onchange="window.updateLeadStatus(${lead.id}, this.value)" class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-500'} text-gray-900 font-bold text-sm">
                                    <option value="nouveau" ${lead.status === 'nouveau' ? 'selected' : ''}>${i18next.t('dashboard:status_new')}</option>
                                    <option value="visite" ${lead.status === 'visite' ? 'selected' : ''}>${i18next.t('dashboard:status_visit')}</option>
                                    <option value="offre" ${lead.status === 'offre' ? 'selected' : ''}>${i18next.t('dashboard:status_offer')}</option>
                                    <option value="vendu" ${lead.status === 'vendu' ? 'selected' : ''}>${i18next.t('dashboard:status_sold')}</option>
                                </select>
                            ` : `
                                <span class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-500'} text-gray-900 font-bold text-sm">
                                    ${i18next.t('dashboard:status_' + lead.status) || lead.status}
                                </span>
                            `}
                        </td>
                        <td class="py-3 px-4 font-bold text-yellow-500">
                            ${lead.referrer_commission ? lead.referrer_commission.toLocaleString() + ' AED' : '-'}
                        </td>
                        ${isAdmin ? `
                            <td class="py-3 px-4">
                                ${lead.status !== 'vendu' ? `
                                    <button onclick="window.markAsSold(${lead.id})" class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm">
                                        ${i18next.t('dashboard:mark_sold')}
                                    </button>
                                ` : '✅'}
                            </td>
                        ` : ''}
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;
}

// Exposer globalement
window.loadDashboardContent = loadDashboardContent;
