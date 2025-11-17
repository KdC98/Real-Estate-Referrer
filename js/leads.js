// ============================================
// GESTION DES LEADS
// ============================================

import { currentUser, userProfile } from './auth.js';
import { t } from './translations.js';

// Afficher le formulaire d'ajout de lead
export function showAddLeadForm() {
    const hasValidContract = userProfile?.contract_path || 
                            userProfile?.contract_file_url || 
                            userProfile?.contract_status === 'signed' || 
                            userProfile?.contract_status === 'approved';
    
    if (!hasValidContract) {
        alert(t('dashboard:contract_required_to_add_lead') || 'Vous devez uploader votre contrat signé avant d\'ajouter des leads.');
        return;
    }
    
    document.getElementById('addLeadModal').classList.remove('hidden');
}

// Gérer la soumission du formulaire d'ajout de lead
export function handleAddLeadForm(supabase, loadDashboardContentCallback) {
    const form = document.getElementById('addLeadForm');
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const leadData = {
            referrer_id: currentUser.id,
            client_name: document.getElementById('clientName').value,
            client_email: document.getElementById('clientEmail').value,
            client_phone: document.getElementById('clientPhone').value,
            property_type: document.getElementById('propertyType').value,
            budget: parseFloat(document.getElementById('budget').value),
            status: 'nouveau'
        };
        
        const { error } = await supabase.from('leads').insert([leadData]);
        
        if (error) {
            console.error('Error adding lead:', error);
            alert('Erreur lors de l\'ajout du lead');
            return;
        }
        
        document.getElementById('addLeadModal').classList.add('hidden');
        form.reset();
        await loadDashboardContentCallback();
    };
}

// Mettre à jour le statut d'un lead
export async function updateLeadStatus(supabase, leadId, newStatus, loadDashboardContentCallback) {
    const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
    
    if (error) {
        console.error('Error updating status:', error);
        alert('Erreur lors de la mise à jour du statut');
        return;
    }
    
    await loadDashboardContentCallback();
}

// Marquer un lead comme vendu
export async function markAsSold(supabase, leadId, loadDashboardContentCallback) {
    const salePrice = prompt('Prix de vente (AED):');
    if (!salePrice) return;
    
    const price = parseFloat(salePrice);
    const agentCommission = price * 0.01; // 1% du prix de vente
    const referrerCommission = agentCommission * 0.20; // 20% de la commission agent
    
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
    
    if (error) {
        console.error('Error marking as sold:', error);
        alert('Erreur lors de la vente');
        return;
    }
    
    await loadDashboardContentCallback();
}

// Charger et afficher les leads
export async function loadLeads(supabase, isAdmin) {
    let leads;
    let profiles = {};
    
    if (isAdmin) {
        console.log('📊 Loading leads for admin...');
        const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (leadsError) {
            console.error('❌ Error loading leads:', leadsError);
            return { error: leadsError };
        }
        
        console.log('✅ Leads loaded:', leadsData?.length);
        console.log('👥 Loading all profiles...');
        
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*');
        
        if (profilesError) {
            console.error('❌ Error loading profiles:', profilesError);
        } else {
            console.log('✅ Profiles loaded:', profilesData?.length);
            profilesData.forEach(profile => {
                profiles[profile.id] = profile;
            });
        }
        
        leads = leadsData.map(lead => ({
            ...lead,
            referrer_name: profiles[lead.referrer_id]?.name || 'N/A'
        }));
    } else {
        console.log('📊 Loading leads for referrer...');
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('referrer_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error loading leads:', error);
            return { error };
        }
        
        console.log('✅ Leads loaded:', data?.length);
        leads = data;
    }
    
    return { leads };
}
