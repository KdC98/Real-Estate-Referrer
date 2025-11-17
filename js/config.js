// ============================================
// CONFIGURATION SUPABASE
// ============================================

export const SUPABASE_URL = 'https://cgizcgwhwxswvoodqver.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaXpjZ3dod3hzd3Zvb2RxdmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzY1NDYsImV4cCI6MjA3NjAxMjU0Nn0.d5PWoeuz6Z322dnvLLKg4LBb6jUhWo4MyxlIGdxA3oc';

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
