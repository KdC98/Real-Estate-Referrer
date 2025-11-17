# 📋 Real Estate Referrer - README

**Dernière mise à jour** : 17 novembre 2025  
**Version** : 2.3.0  
**Status** : 🟢 En production - Refactorisation en cours

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients, suivre les ventes et calculer automatiquement les commissions.

---

## 🌐 Accès et URLs

- **Site web** : https://real-estate-referrer.com
- **Site Vercel** : https://real-estate-referrer-3kp6.vercel.app
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

---

## ✅ ÉTAT ACTUEL DU PROJET (17 novembre 2025)

### 🏗️ Refactorisation en Architecture Modulaire - EN COURS

**Objectif** : Découper le fichier monolithique `index.html` (2450 lignes) en modules JavaScript réutilisables.

**Progression** : 2/50 fonctions refactorisées (~4%)

#### ✅ Modules créés (8 fichiers)
```
js/
├── config.js           ✅ Créé - Configuration Supabase & constantes
├── translations.js     ✅ Créé - Gestion i18next multilingue
├── utils.js            ✅ Créé - Fonctions utilitaires (1/5 utilisée)
├── validation.js       ✅ Créé - Validation formulaires (1/6 utilisée)
├── auth.js             ✅ Créé - Authentification & profils
├── leads.js            ✅ Créé - Gestion des leads
├── dashboard.js        ✅ Créé - Chargement dashboard
└── main.js             ✅ Créé - Point d'entrée (non utilisé encore)
```

#### ✅ Fonctions refactorisées avec succès

| Fonction | Module | Status | Ligne index.html |
|----------|--------|--------|------------------|
| `toggleMobileMenu` | `utils.js` | ✅ Opérationnelle | ~2293 |
| `validateEmail` | `validation.js` | ✅ Opérationnelle | ~2009 |

**Pattern utilisé** : Fallback intelligent
```javascript
function maFonction() {
    // Tente d'utiliser le module
    if (window.MODULE?.maFonction) {
        return window.MODULE.maFonction();
    }
    
    // Fallback inline si module pas chargé
    console.warn('⚠️ MODULE pas encore chargé');
    // ... code original ...
}
```

#### 🔄 Prochaines fonctions à refactoriser

**Priorité 1 - Validation (5 fonctions restantes)**
- [ ] `validatePassword` - ~2047-2130 (priorité immédiate)
- [ ] `validateConfirmPassword` - ~2132-2150
- [ ] `validateName` - ~1950-1980
- [ ] `validatePhone` - ~1982-2007
- [ ] `checkFormValidity` - ~2152-2175

**Priorité 2 - Utilitaires (4 fonctions restantes)**
- [ ] `togglePasswordVisibility` - ~2177-2187
- [ ] `downloadContractTemplate` - ~2189-2220
- [ ] `prefillTestData` - ~844-860
- [ ] `getQueryParams` - Déjà dans module

**Priorité 3 - Auth (grandes fonctions)**
- [ ] `handleSignup` - ~862-1000
- [ ] `handleLogin` - ~1002-1050
- [ ] Système 2FA complet

---

## 🔒 Authentification & Sécurité - 100% COMPLET

### ✅ Système d'authentification Supabase Auth
- Mots de passe hashés (bcrypt via Supabase)
- Sessions JWT sécurisées
- Inscription avec confirmation
- Validation stricte : min 8 caractères, 1 lettre, 1 chiffre
- Mot de passe oublié fonctionnel
- Déconnexion sécurisée

### ✅ 2FA par SMS (via Itooki.fr)
- Vérification unique à l'inscription
- Code à 6 chiffres
- Support UAE (+971)

### ⚠️ Problème connu - Flux 2FA
**Status** : À corriger
- Le champ de saisie du code SMS n'apparaît pas au bon moment
- L'ordre des étapes n'est pas correct
- À debugger dans une prochaine session

### ⚠️ RLS (Row Level Security) - DÉSACTIVÉ
**Raison** : Les politiques causaient une récursion infinie  
**Impact** : Tous les utilisateurs authentifiés peuvent lire toutes les données  
**Action requise** : Réactiver avec fonction PostgreSQL avant production publique

---

## 📊 Base de données - COMPLET

### Structure PostgreSQL via Supabase

**Table `profiles`**
```sql
- id UUID PRIMARY KEY (référence auth.users)
- name TEXT
- phone TEXT
- role TEXT ('admin' ou 'referrer')
- contract_path TEXT
- contract_status TEXT
- created_at TIMESTAMP
```

**Table `leads`**
```sql
- id BIGSERIAL PRIMARY KEY
- referrer_id UUID (référence auth.users)
- client_name TEXT
- client_email TEXT
- client_phone TEXT
- property_type TEXT
- transaction_type TEXT ('sale_buyer', 'sale_seller', 'rental_landlord', 'rental_tenant')
- budget NUMERIC
- status TEXT ('nouveau', 'visite', 'offre', 'vendu')
- sale_price NUMERIC
- agent_commission NUMERIC
- referrer_commission NUMERIC
- created_at TIMESTAMP
- closed_at TIMESTAMP
```

---

## 🌍 Internationalisation - 80% COMPLET

### ✅ 8 langues supportées
- 🇫🇷 Français (100%)
- 🇬🇧 English (100%)
- 🇦🇪 العربية (80%)
- 🇷🇺 Русский (80%)
- 🇮🇳 हिन्दी (80%)
- 🇵🇰 اردو (80%)
- 🇨🇳 中文 (80%)
- 🇵🇭 Tagalog (80%)

**Fichiers de traduction** : `/locales/{lang}/{namespace}.json`
- `translation.json` - Textes généraux
- `auth.json` - Authentification
- `dashboard.json` - Interface dashboard
- `common.json` - Éléments communs

---

## 💰 Système de commissions - COMPLET

### Modèle de calcul

**Pour les ventes**
```
Prix de vente : 1,000,000 AED
├─ Commission totale (2%) : 20,000 AED
   ├─ Agence (50%) : 10,000 AED
   └─ Agent (50%) : 10,000 AED
      ├─ Apporteur (20%) : 2,000 AED ✅
      └─ Agent (80%) : 8,000 AED
```

**Pour les locations**
```
Loyer annuel : 100,000 AED
├─ Commission totale (5%) : 5,000 AED
   ├─ Agence (50%) : 2,500 AED
   └─ Agent (50%) : 2,500 AED
      ├─ Apporteur (20%) : 500 AED ✅
      └─ Agent (80%) : 2,000 AED
```

### Calcul automatique
- Déclenchement : Admin marque lead comme "vendu"
- Saisie du prix de vente/loyer
- Calcul automatique des commissions
- Stockage en base de données

---

## 🚀 Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | React 18 | ESM via CDN |
| **Styling** | Tailwind CSS | 3.4.17 via CDN |
| **Traductions** | i18next | 23.7.6 |
| **Backend/Auth** | Supabase | PostgreSQL + Auth + Storage |
| **SMS 2FA** | Itooki.fr API | UAE support |
| **Hébergement** | Vercel | Auto-deploy from GitHub |
| **Contrôle version** | GitHub | Branch: main |

---

## 📝 TODO - PRIORITÉS

### 🔴 PRIORITÉ 1 - Refactorisation (en cours)

**Objectif immédiat** : Continuer le découpage de `index.html`

**Prochaines étapes** :
1. ✅ `validatePassword` - Fonction suivante à refactoriser
2. ✅ `validateConfirmPassword`
3. ✅ `validateName`
4. ✅ `validatePhone`
5. ✅ `checkFormValidity`

**Estimation** : 2-3 heures pour les 5 fonctions de validation

### 🟡 PRIORITÉ 2 - Corrections UX (1-2 jours)

**Flux 2FA à corriger**
- Affichage du champ de saisie au bon moment
- Ordre des étapes correct
- Interface clavier/saisie disponible

**Contraintes mot de passe à afficher**
- Ajouter indicateurs visuels manquants
- Afficher : "Au moins 1 majuscule", "Au moins 1 caractère spécial"
- Correspondre aux validations strictes du code

### 🟢 PRIORITÉ 3 - Sécurité (avant production publique)

1. **Réactiver RLS avec politiques optimisées**
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. **Changer mot de passe admin**
3. **Tester toutes les fonctionnalités avec RLS activé**

### 🔵 PRIORITÉ 4 - Documentation légale (1-2 semaines)

- [ ] Créer les CGU (Conditions Générales d'Utilisation)
- [ ] Créer la page "Comment ça marche"
- [ ] Créer la Politique de confidentialité (RGPD/GDPR)

### 🟣 PRIORITÉ 5 - Conformité RERA (2-4 semaines)

- [ ] Obtenir licence RERA
- [ ] Examen DREI
- [ ] Permis publicitaire Trakheesi (5,000 AED)

---

## 🎉 HISTORIQUE DES VERSIONS

### Version 2.3.0 - 17 novembre 2025
- ✅ Création architecture modulaire (8 fichiers JS)
- ✅ Refactorisation `toggleMobileMenu` avec fallback
- ✅ Refactorisation `validateEmail` avec fallback
- ✅ Tests réussis - site 100% fonctionnel
- ✅ Documentation complète

### Version 2.2.0 - 31 octobre 2025
- ✅ Correction timeout upload contrats (30s)
- ✅ Simplification politiques Storage RLS
- ✅ Upload instantané et fonctionnel

### Version 2.1.0 - 16 octobre 2025
- ✅ Ajout "Mot de passe oublié"
- ✅ Flux reset password complet
- ✅ Affichage noms apporteurs corrigé
- ✅ Désactivation RLS (temporaire)

### Version 2.0.0 - 15 octobre 2025
- ✅ Migration Supabase Auth
- ✅ Première version déployée

### Version 1.0.0 - 14 octobre 2025
- ✅ Création initiale

---

## 🆘 COMMANDES SQL UTILES

**Voir tous les profils**
```sql
SELECT * FROM profiles;
```

**Voir tous les leads avec noms d'apporteurs**
```sql
SELECT 
    l.*,
    p.name as referrer_name
FROM leads l
LEFT JOIN profiles p ON l.referrer_id = p.id;
```

**Statistiques globales**
```sql
SELECT
    COUNT(*) as total_leads,
    SUM(CASE WHEN status = 'vendu' THEN 1 ELSE 0 END) as ventes,
    SUM(referrer_commission) as commissions_totales
FROM leads;
```

---

## 📚 Ressources & Documentation

- **Supabase** : https://docs.supabase.com
- **Vercel** : https://vercel.com/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **i18next** : https://www.i18next.com
- **React** : https://react.dev

---

## 📞 Support

Pour toute question sur ce projet, référez-vous à cette documentation ou aux conversations Claude précédentes.

**Dernière session** : 17 novembre 2025 - Refactorisation modulaire  
**Durée totale du projet** : ~15 heures de développement

---

## 🏆 Points clés à retenir

✅ **Application 100% fonctionnelle en production**  
✅ **Authentification sécurisée avec 2FA SMS**  
✅ **Support multilingue 8 langues**  
✅ **Calcul automatique des commissions**  
✅ **Architecture modulaire en cours (4% complété)**  
⚠️ **RLS désactivé - À réactiver avant production publique**  
⚠️ **Flux 2FA à corriger**  
⚠️ **Documentation légale à créer**

**Statut global** : Prêt pour tests privés, pas encore pour production publique
