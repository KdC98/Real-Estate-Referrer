// ============================================
// GESTION DU DASHBOARD
// ============================================

import { currentUser, userProfile } from './auth.js';
import { STATUS_COLORS } from './config.js';
import { t } from './translations.js';
import { loadLeads } from './leads.js';

// Charger le contenu du dashboard
export async function loadDashboardContent(supabase) {
    if (!userProfile) return;
    
    const isAdmin = userProfile.role === 'admin';
    
    // Charger les leads
    const { leads, error } = await loadLeads(supabase, isAdmin);
    
    if (error) {
        document.getElementById('leadsTable').innerHTML = `
            <div class="text-red-400 p-4">
                Erreur lors du chargement des leads: ${error.message}
            </div>
        `;
        return;
    }
    
    // Calculer les statistiques
    const totalEarnings = leads.filter(l => l.status === 'vendu').reduce((sum, l) => sum + (l.referrer_commission || 0), 0);
    const activeLeads = leads.filter(l => l.status !== 'vendu').length;
    const closedSales = leads.filter(l => l.status === 'vendu').length;
    
    // Afficher les stats
    renderStats(isAdmin, leads.length, totalEarnings, activeLeads, closedSales);
    
    // Afficher le tableau des leads
    renderLeadsTable(isAdmin, leads);
}

// Afficher les statistiques
function renderStats(isAdmin, totalLeads, totalEarnings, activeLeads, closedSales) {
    document.getElementById('stats').innerHTML = `
        ${isAdmin ? `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalLeads}</div>
                <div class="text-gray-300">${t('dashboard:total_referrers')}</div>
            </div>
        ` : `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalEarnings.toLocaleString()} AED</div>
                <div class="text-gray-300">${t('dashboard:total_earnings')}</div>
            </div>
        `}
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
            <div class="text-3xl font-bold text-yellow-500">${activeLeads}</div>
            <div class="text-gray-300">${t('dashboard:active_leads')}</div>
        </div>
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
            <div class="text-3xl font-bold text-yellow-500">${closedSales}</div>
            <div class="text-gray-300">${t('dashboard:closed_sales')}</div>
        </div>
        ${isAdmin ? `
            <div class="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6">
                <div class="text-3xl font-bold text-yellow-500">${totalEarnings.toLocaleString()} AED</div>
                <div class="text-gray-300">${t('dashboard:commissions_paid')}</div>
            </div>
        ` : ''}
    `;
}

// Afficher le tableau des leads
function renderLeadsTable(isAdmin, leads) {
    document.getElementById('leadsTable').innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-700">
                    ${isAdmin ? `<th class="text-left py-3 px-4">${t('dashboard:referrer')}</th>` : ''}
                    <th class="text-left py-3 px-4">${t('dashboard:client_name')}</th>
                    <th class="text-left py-3 px-4">${t('dashboard:property_type')}</th>
                    <th class="text-left py-3 px-4">${t('dashboard:budget')}</th>
                    <th class="text-left py-3 px-4">${t('dashboard:status')}</th>
                    <th class="text-left py-3 px-4">${t('dashboard:commission')}</th>
                    ${isAdmin ? `<th class="text-left py-3 px-4">${t('dashboard:actions')}</th>` : ''}
                </tr>
            </thead>
            <tbody>
                ${leads.length === 0 ? `
                    <tr>
                        <td colspan="${isAdmin ? '7' : '5'}" class="py-8 text-center text-gray-400">
                            ${t('dashboard:no_leads')}
                        </td>
                    </tr>
                ` : leads.map(lead => `
                    <tr class="border-b border-gray-700">
                        ${isAdmin ? `<td class="py-3 px-4">${lead.referrer_name}</td>` : ''}
                        <td class="py-3 px-4">${lead.client_name}</td>
                        <td class="py-3 px-4">${t('dashboard:' + lead.property_type)}</td>
                        <td class="py-3 px-4">${lead.budget?.toLocaleString()} AED</td>
                        <td class="py-3 px-4">
                            ${isAdmin ? `
                                <select onchange="window.updateLeadStatus(${lead.id}, this.value)" class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status]} text-gray-900 font-bold text-sm">
                                    <option value="nouveau" ${lead.status === 'nouveau' ? 'selected' : ''}>${t('dashboard:status_new')}</option>
                                    <option value="visite" ${lead.status === 'visite' ? 'selected' : ''}>${t('dashboard:status_visit')}</option>
                                    <option value="offre" ${lead.status === 'offre' ? 'selected' : ''}>${t('dashboard:status_offer')}</option>
                                    <option value="vendu" ${lead.status === 'vendu' ? 'selected' : ''}>${t('dashboard:status_sold')}</option>
                                </select>
                            ` : `
                                <span class="px-3 py-1 rounded-full ${STATUS_COLORS[lead.status]} text-gray-900 font-bold text-sm">
                                    ${t('dashboard:status_' + lead.status.replace('é', 'e'))}
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
                                        ${t('dashboard:mark_sold')}
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

// Gérer l'upload de contrat
export function handleContractUpload(supabase, SUPABASE_URL, reloadCallback) {
    const contractForm = document.getElementById('contractForm');
    if (!contractForm) return;
    
    let globalIsUploading = false;
    
    console.log('✅ Contract form found, attaching submit handler');
    
    contractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (globalIsUploading) {
            console.log('⚠️ Upload already in progress, ignoring duplicate submit');
            return;
        }
        
        globalIsUploading = true;
        console.log('📄 Starting contract upload...');
        
        const submitBtn = document.getElementById('contractSubmitBtn');
        const errorDiv = document.getElementById('uploadError');
        const progressDiv = document.getElementById('uploadProgress');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Upload en cours...';
        errorDiv.classList.add('hidden');
        progressDiv.classList.remove('hidden');
        progressDiv.textContent = '⏳ Préparation du fichier...';
        
        try {
            const fileInput = document.getElementById('contractFile');
            const file = fileInput.files[0];
            
            if (!file) {
                throw new Error('Veuillez sélectionner un fichier');
            }
            if (file.type !== 'application/pdf') {
                throw new Error('Seuls les fichiers PDF sont acceptés');
            }
            
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                throw new Error('Le fichier est trop volumineux. Taille maximum : 10MB');
            }
            
            console.log('📄 File validated:', file.name, 'Size:', file.size, 'bytes');
            
            progressDiv.textContent = '⏳ Téléchargement vers le serveur...';
            
            const fileName = `${currentUser.id}_${Date.now()}_${file.name}`;
            console.log('📄 Uploading to Storage with name:', fileName);
            
            // Utiliser l'API REST directement
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Session expirée, veuillez vous reconnecter');
            }
            
            const uploadUrl = `${SUPABASE_URL}/storage/v1/object/contracts/${fileName}`;
            
            console.log('🚀 Uploading via REST API to:', uploadUrl);
            
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': file.type,
                    'x-upsert': 'false'
                },
                body: file
            });
            
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('❌ Upload failed:', uploadResponse.status, errorText);
                throw new Error(`Erreur d'upload: ${uploadResponse.status} - ${errorText}`);
            }
            
            const uploadData = await uploadResponse.json();
            console.log('✅ File uploaded successfully to Storage');
            console.log('📝 Upload response:', uploadData);
            
            progressDiv.textContent = '⏳ Mise à jour de votre profil...';
            
            // Mise à jour du profil
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    contract_path: fileName,
                    contract_status: 'signed',
                    contract_file_url: fileName
                })
                .eq('id', currentUser.id);
            
            if (updateError) {
                console.error('❌ Error updating profile:', updateError);
                throw new Error(`Erreur de mise à jour : ${updateError.message}`);
            }
            
            console.log('✅ Profile updated successfully with contract_path:', fileName);
            
            alert('✅ Contrat uploadé avec succès !');
            globalIsUploading = false;
            reloadCallback();
            
        } catch (error) {
            console.error('❌ Upload exception:', error);
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
            progressDiv.classList.add('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            globalIsUploading = false;
        }
    });
}
