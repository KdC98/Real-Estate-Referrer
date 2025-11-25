// ============================================
// GESTION DU DASHBOARD
// Real Estate Referrer - Dubai
// ============================================

import { currentUser, userProfile } from './auth.js';
import { STATUS_COLORS } from './config.js';

// Charger le contenu du dashboard
export async function loadDashboardContent() {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
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
                    ${i18next.t('dashboard:error_loading_leads')}: ${error.message}
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
                <div class="text-gray-300">${i18next.t('dashboard:total_leads')}</div>
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
                    <th class="text-left py-3 px-4">${i18next.t('dashboard:property_type')}</th>
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
                ` : leads.map(lead => `
                    <tr class="border-b border-gray-700">
                        ${isAdmin ? `<td class="py-3 px-4">${lead.referrer_name}</td>` : ''}
                        <td class="py-3 px-4">${lead.client_name}</td>
                        <td class="py-3 px-4">${lead.property_type}</td>
                        <td class="py-3 px-4">${lead.budget?.toLocaleString()} AED</td>
                        <td class="py-3 px-4">
                            ${isAdmin ? `
                                <select onchange="window.updateLeadStatus(${lead.id}, this.value)" class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status]} text-gray-900 font-bold text-sm">
                                    <option value="nouveau" ${lead.status === 'nouveau' ? 'selected' : ''}>${i18next.t('dashboard:status_new')}</option>
                                    <option value="visite" ${lead.status === 'visite' ? 'selected' : ''}>${i18next.t('dashboard:status_visit')}</option>
                                    <option value="offre" ${lead.status === 'offre' ? 'selected' : ''}>${i18next.t('dashboard:status_offer')}</option>
                                    <option value="vendu" ${lead.status === 'vendu' ? 'selected' : ''}>${i18next.t('dashboard:status_sold')}</option>
                                </select>
                            ` : `
                                <span class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status]} text-gray-900 font-bold text-sm">
                                    ${i18next.t('dashboard:status_' + lead.status)}
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
                                ` : '-'}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Afficher le dashboard (appelé par render)
export function renderDashboard() {
    const i18next = window.i18next;
    const app = document.getElementById('app');
    
    if (!userProfile) {
        console.error('❌ Cannot render dashboard: no userProfile');
        return;
    }
    
    const isAdmin = userProfile.role === 'admin';
    const contractStatus = userProfile.contract_status?.trim().replace(/\*+/g, '') || 'pending';
    const contractJustSigned = window.contractJustSigned || false;
    
    console.log('🎨 Rendering dashboard for:', userProfile.role, 'Contract status:', contractStatus);
    
    // Message de contrat si nécessaire
    let contractMessage = '';
    
    if (contractJustSigned) {
        contractMessage = `
            <div class="bg-green-500 bg-opacity-20 border-2 border-green-500 rounded-xl p-6 mb-6">
                <div class="flex items-start gap-4">
                    <div class="text-4xl">✅</div>
                    <div>
                        <h3 class="text-2xl font-bold text-green-400 mb-2">${i18next.t('dashboard:contract_signed_title')}</h3>
                        <p class="text-gray-300">${i18next.t('dashboard:contract_signed_message')}</p>
                    </div>
                </div>
            </div>
        `;
        window.contractJustSigned = false;
    } else if (!isAdmin && contractStatus === 'pending') {
        contractMessage = `
            <div class="bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-xl p-6 mb-6">
                <div class="flex items-start gap-4">
                    <div class="text-4xl">⚠️</div>
                    <div>
                        <h3 class="text-2xl font-bold text-yellow-400 mb-2">${i18next.t('dashboard:contract_required_title')}</h3>
                        <p class="text-gray-300 mb-4">${i18next.t('dashboard:contract_required_message')}</p>
                        <a href="/contract-signature.html" class="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition">
                            ${i18next.t('dashboard:sign_contract_now')}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    app.innerHTML = `
        <div class="min-h-screen flex flex-col">
            <!-- Header -->
            <header class="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700">
                <div class="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-yellow-500 bg-clip-text text-transparent">
                        ${i18next.t('common:app_name')}
                    </h1>
                    <div class="flex items-center gap-4">
                        <span class="text-gray-300">${userProfile.name}</span>
                        <button onclick="window.logout()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                            ${i18next.t('common:logout')}
                        </button>
                    </div>
                </div>
            </header>
            
            <!-- Main Content -->
            <main class="flex-1 container mx-auto px-4 py-8">
                <h2 class="text-3xl font-bold mb-8">
                    ${i18next.t(isAdmin ? 'dashboard:admin_dashboard' : 'dashboard:referrer_dashboard')}
                </h2>
                
                ${contractMessage}
                
                <!-- Stats -->
                <div id="stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>
                
                <!-- Add Lead Button (Referrers only) -->
                ${!isAdmin && ['signed', 'validated', 'approved'].includes(contractStatus) ? `
                    <div class="mb-6">
                        <button onclick="window.showAddLeadForm()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition">
                            ${i18next.t('dashboard:add_lead')}
                        </button>
                    </div>
                ` : ''}
                
                <!-- Leads Table -->
                <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                    <h3 class="text-xl font-bold mb-4">${i18next.t('dashboard:my_leads')}</h3>
                    <div id="leadsTable"></div>
                </div>
            </main>
        </div>
    `;
    
    // Charger le contenu
    loadDashboardContent();
}
