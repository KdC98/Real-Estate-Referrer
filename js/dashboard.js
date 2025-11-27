// ============================================
// GESTION DU DASHBOARD
// Real Estate Referrer - Dubai
// Version: 3.4.0 - Ajout colonne Apporteur
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
            .select('*')
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
        
        // Si admin, charger les noms des apporteurs
        let referrerNames = {};
        if (isAdmin && leads && leads.length > 0) {
            const referrerIds = [...new Set(leads.map(l => l.referrer_id).filter(Boolean))];
            
            if (referrerIds.length > 0) {
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, name, email')
                    .in('id', referrerIds);
                
                if (!profilesError && profiles) {
                    profiles.forEach(p => {
                        referrerNames[p.id] = p.name || p.email || 'Unknown';
                    });
                }
            }
        }
        
        // Calculer les statistiques
        const totalEarnings = (leads || [])
            .filter(l => l.status === 'vendu')
            .reduce((sum, l) => sum + (l.referrer_commission || 0), 0);
        const activeLeads = (leads || []).filter(l => l.status !== 'vendu').length;
        const closedSales = (leads || []).filter(l => l.status === 'vendu').length;
        
        // Afficher les stats
        renderStats(isAdmin, (leads || []).length, totalEarnings, activeLeads, closedSales);
        
        // Afficher le tableau des leads
        renderLeadsTable(isAdmin, leads || [], referrerNames);
        
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
function renderLeadsTable(isAdmin, leads, referrerNames = {}) {
    const i18next = window.i18next;
    const tableDiv = document.getElementById('leadsTable');
    
    if (!tableDiv) return;
    
    const STATUS_COLORS = {
        'nouveau': 'bg-blue-500',
        'visite': 'bg-purple-500',
        'offre': 'bg-orange-500',
        'vendu': 'bg-green-500'
    };
    
    tableDiv.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:client_name')}</th>
                    ${isAdmin ? `<th class="text-left py-3 px-4">${i18next.t('dashboard:referrer')}</th>` : ''}
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
                            ${i18next.t('dashboard:no_leads')}<br>
                            <span class="text-sm">${i18next.t('dashboard:start_adding')}</span>
                        </td>
                    </tr>
                ` : leads.map(lead => {
                    const leadTypeKey = lead.lead_type || 'sale_buyer';
                    const leadTypeLabel = i18next.t('dashboard:' + leadTypeKey) || leadTypeKey;
                    const commissionRate = lead.commission_rate ? (lead.commission_rate * 100) + '%' : '20%';
                    const statusColor = STATUS_COLORS[lead.status] || 'bg-gray-500';
                    const referrerName = referrerNames[lead.referrer_id] || '-';
                    
                    return `
                    <tr class="border-b border-gray-700 hover:bg-gray-700/30">
                        <td class="py-3 px-4">
                            <div class="font-medium">${lead.client_name}</div>
                            <div class="text-xs text-gray-400">${lead.client_email}</div>
                        </td>
                        ${isAdmin ? `
                            <td class="py-3 px-4">
                                <span class="text-cyan-400 font-medium">${referrerName}</span>
                            </td>
                        ` : ''}
                        <td class="py-3 px-4">
                            <span class="${leadTypeKey === 'sale_buyer' ? 'text-yellow-400 font-bold' : 'text-gray-300'}">
                                ${leadTypeKey === 'sale_buyer' ? '🏆 ' : ''}${leadTypeLabel}
                            </span>
                            <span class="text-xs text-gray-500 ml-1">(${commissionRate})</span>
                        </td>
                        <td class="py-3 px-4">${lead.budget?.toLocaleString() || '-'} AED</td>
                        <td class="py-3 px-4">
                            ${isAdmin ? `
                                <select onchange="window.updateLeadStatus(${lead.id}, this.value)" class="px-3 py-1 rounded-full ${statusColor} text-gray-900 font-bold text-sm cursor-pointer">
                                    <option value="nouveau" ${lead.status === 'nouveau' ? 'selected' : ''}>${i18next.t('dashboard:status_new')}</option>
                                    <option value="visite" ${lead.status === 'visite' ? 'selected' : ''}>${i18next.t('dashboard:status_visit')}</option>
                                    <option value="offre" ${lead.status === 'offre' ? 'selected' : ''}>${i18next.t('dashboard:status_offer')}</option>
                                    <option value="vendu" ${lead.status === 'vendu' ? 'selected' : ''}>${i18next.t('dashboard:status_sold')}</option>
                                </select>
                            ` : `
                                <span class="px-3 py-1 rounded-full ${statusColor} text-gray-900 font-bold text-sm">
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
                                    <button onclick="window.markAsSold(${lead.id})" class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition">
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
