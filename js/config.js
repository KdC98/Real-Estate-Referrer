// ============================================
// CONFIGURATION SUPABASE
// ============================================

export const SUPABASE_URL = 'https://cgizcgwhwxswvoodqver.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_djUSMqQj2fmuyU20mb5iZg_zvTTqY06';

// Status colors pour les leads
export const STATUS_COLORS = {
    'nouveau': 'bg-blue-500',
    'visite': 'bg-yellow-500',
    'offre': 'bg-orange-500',
    'vendu': 'bg-green-500'
};

// Limites
export const MAX_PROFILE_LOAD_ATTEMPTS = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
