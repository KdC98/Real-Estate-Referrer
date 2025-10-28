# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 28 octobre 2025  
**Version** : 3.5.0  
**Status** : 🟡 **En développement - Fonctionnel avec corrections en cours**

---

## 🌐 **ACCÈS ET URLs**

- **Site web** : https://real-estate-referrer.com (domaine personnalisé OVH)
- **Site Vercel** : https://real-estate-referrer-3kp6.vercel.app
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

**Compte Admin** :
- Email : admin@realestate-referrer.com
- UUID : 68817a49-b31c-4edf-85fe-691eb33d6014

---

## ✅ **ÉTAT ACTUEL DU PROJET (28 octobre 2025)**

### 🎯 **Ce qui fonctionne à 100%**

#### **Authentification & Sécurité**
- ✅ Système Supabase Auth complet
- ✅ Mots de passe hashés (bcrypt)
- ✅ Sessions sécurisées JWT
- ✅ Inscription avec confirmation mot de passe
- ✅ Connexion sécurisée (admin + apporteurs)
- ✅ Mot de passe oublié fonctionnel
- ✅ Déconnexion avec nettoyage session

#### **Base de données PostgreSQL**
- ✅ Table `profiles` (id, name, phone, role, contract_status, contract_file_url)
- ✅ Table `leads` (avec 4 types : sale_buyer, sale_seller, rental_landlord, rental_tenant)
- ✅ Trigger auto-création profil lors inscription
- ✅ Row Level Security (RLS) **DÉSACTIVÉ** temporairement

#### **Interface utilisateur**
- ✅ Landing page premium Dubai
- ✅ Pages d'authentification complètes
- ✅ Dashboard Apporteur (stats + leads + ajout lead)
- ✅ Dashboard Admin (vue globale + gestion leads)
- ✅ Calcul automatique commissions (2% vente, 5% location → 20% pour apporteur)

#### **Multilingue - 8 langues opérationnelles** 🌍
- ✅ Français 🇫🇷
- ✅ Anglais 🇬🇧
- ✅ Arabe 🇦🇪
- ✅ Russe 🇷🇺
- ✅ Hindi 🇮🇳
- ✅ Ourdou 🇵🇰
- ✅ Chinois 🇨🇳
- ✅ Tagalog 🇵🇭

**Traductions complètes** :
- ✅ `index.html` - Page d'accueil (100%)
- ✅ Authentification (login, signup, reset) (100%)
- ✅ `privacy.html` - Politique de confidentialité (100% - 8 langues)

**Traductions partielles** :
- ⏳ Dashboard (≈70%)
- ⏳ Pages statiques (how-it-works.html, terms.html, contract-template.html)

---

## 🔴 **PROBLÈME CRITIQUE À RÉSOUDRE : SYSTÈME DE CONTRAT**

### **Problématique actuelle**

Lorsqu'un apporteur s'inscrit, il arrive sur un dashboard qui affiche :

```
📋 Contrat requis
Pour commencer à ajouter des leads, vous devez d'abord signer le contrat d'apporteur d'affaires.
[Input file pour upload PDF]
[Bouton "Télécharger le contrat"]
```

**Le problème** : 
- ❌ L'utilisateur ne peut PAS télécharger le contrat template
- ❌ Il peut seulement uploader un contrat déjà signé
- ❌ Expérience utilisateur brisée

### **Erreur technique identifiée**

Lorsqu'on tente de télécharger le contrat, erreur dans la console :
```
Erreur Supabase Storage: "otp_expired"
```

**Cause probable** : Politique de sécurité Supabase Storage mal configurée ou token expiré.

### **Solution attendue**

**Workflow idéal** :
1. Apporteur s'inscrit → Email validation → Connexion
2. Dashboard affiche : "Téléchargez le contrat template"
3. **Bouton "Télécharger le contrat template"** → Download PDF pré-rempli
4. Apporteur imprime, signe, scanne
5. **Upload du contrat signé** via le formulaire
6. Admin reçoit notification → Vérifie → Change status à "signed"
7. Apporteur peut maintenant ajouter des leads

---

## 📊 **STRUCTURE DU PROJET**

### **Architecture technique**

**Frontend** :
- React 18 (ESM modules via CDN)
- Tailwind CSS (via CDN)
- i18next pour multilingue (8 langues)

**Backend/Auth** :
- Supabase (PostgreSQL + Auth + Storage)

**Hébergement** :
- Vercel (déploiement automatique via GitHub)
- Domaine OVH : real-estate-referrer.com

### **Structure des fichiers**

```
Real-Estate-Referrer/
├── index.html                    # Page d'accueil (100% traduit)
├── privacy.html                  # Politique confidentialité (100% traduit 8 langues)
├── how-it-works.html            # Page explicative (à traduire)
├── terms.html                    # CGU (à traduire)
├── contract-template.html        # Template contrat (à traduire)
├── locales/
│   ├── fr/
│   │   ├── translation.json     # Traductions générales FR
│   │   ├── auth.json            # Traductions auth FR
│   │   ├── dashboard.json       # Traductions dashboard FR
│   │   ├── common.json          # Traductions communes FR
│   │   └── privacy.json         # Traductions privacy FR ✅
│   ├── en/
│   │   ├── translation.json
│   │   ├── auth.json
│   │   ├── dashboard.json
│   │   ├── common.json
│   │   └── privacy.json         # ✅ NOUVEAU
│   ├── ar/, ru/, hi/, ur/, zh/, tl/  # Idem pour chaque langue
│   │   └── privacy.json         # ✅ TOUS CRÉÉS
└── README.md                     # Ce fichier
```

---

## 🔧 **CONFIGURATION SUPABASE**

### **Tables**

**profiles**
```sql
- id: UUID (PRIMARY KEY, référence auth.users)
- name: TEXT
- phone: TEXT
- role: TEXT ('admin' ou 'referrer')
- contract_status: TEXT ('pending', 'uploaded', 'signed')
- contract_file_url: TEXT (nom du fichier dans Storage)
- created_at: TIMESTAMP
```

**leads**
```sql
- id: BIGSERIAL PRIMARY KEY
- referrer_id: UUID (référence auth.users)
- client_name: TEXT
- client_email: TEXT
- client_phone: TEXT
- property_type: TEXT ('sale_buyer', 'sale_seller', 'rental_landlord', 'rental_tenant')
- budget: NUMERIC
- status: TEXT ('nouveau', 'visite', 'offre', 'vendu', 'loué')
- sale_price: NUMERIC
- agent_commission: NUMERIC (2% vente, 5% location)
- referrer_commission: NUMERIC (20% de agent_commission)
- created_at: TIMESTAMP
- closed_at: TIMESTAMP
```

### **Storage Bucket**

**Bucket** : `contracts`

**Politiques actuelles** : À CORRIGER
- ⚠️ Les politiques empêchent le download du template
- ⚠️ Erreur "otp_expired" lors du téléchargement

**Politiques nécessaires** :
1. **Public read** sur le fichier template : `contract_template_fr.pdf`
2. **Authenticated upload** pour les contrats signés par utilisateur
3. **Admin read all** pour que l'admin puisse voir tous les contrats

---

## 💰 **SYSTÈME DE COMMISSIONS**

### **Modèle de calcul**

#### **Pour les VENTES** (property_type: sale_buyer ou sale_seller)
```
Prix de vente : 1,000,000 AED
├─ Commission totale agence : 20,000 AED (2%)
├─ Part agence : 10,000 AED (50%)
└─ Part agent (Karyne) : 10,000 AED (50%)
    ├─ Commission apporteur : 2,000 AED (20%)
    └─ Reste Karyne : 8,000 AED (80%)
```

#### **Pour les LOCATIONS** (property_type: rental_landlord ou rental_tenant)
```
Loyer annuel : 100,000 AED
├─ Commission totale agence : 5,000 AED (5%)
├─ Part agence : 2,500 AED (50%)
└─ Part agent (Karyne) : 2,500 AED (50%)
    ├─ Commission apporteur : 500 AED (20%)
    └─ Reste Karyne : 2,000 AED (80%)
```

**Calcul automatique** : Lors du passage à "vendu" ou "loué", l'admin entre le prix final et les commissions sont calculées automatiquement.

---

## 🎯 **PROCHAINES ÉTAPES (PAR PRIORITÉ)**

### **🔴 PRIORITÉ 1 - URGENT : Réparer le système de contrat**

**Étapes** :
1. Diagnostiquer l'erreur "otp_expired" Supabase Storage
2. Corriger les politiques Storage pour :
   - Permettre le téléchargement public du template
   - Permettre l'upload authentifié des contrats signés
   - Permettre à l'admin de lire tous les contrats
3. Créer un vrai PDF template de contrat (avec les champs à remplir)
4. Tester le workflow complet : Download → Sign → Upload → Admin review

### **🟡 PRIORITÉ 2 - Finaliser traductions (2-3 jours)**

**Pages à traduire en 8 langues** :
- Dashboard (30% restant)
- how-it-works.html
- terms.html (CGU)
- contract-template.html

**Objectif** : 80% de l'application traduite

### **🟡 PRIORITÉ 3 - Sécurité (avant lancement public)**

#### **A. Réactiver Row Level Security (RLS)**

**Réactiver Row Level Security** avec fonction PostgreSQL pour éviter récursion :

```sql
-- Fonction sécurisée
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politiques RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- (Politiques détaillées dans le README original v2.1.0)
```

#### **B. 🆕 Implémenter 2FA (Two-Factor Authentication)**

**Service** : Itooki.fr (SMS)  
**Durée estimée** : 1-2 jours

**Étapes d'implémentation** :
1. [ ] Créer compte sur Itooki.fr
2. [ ] Obtenir clés API Itooki
3. [ ] Ajouter colonne `phone_verified` et `two_factor_enabled` dans table `profiles`
4. [ ] Créer fonction d'envoi de code SMS via API Itooki
5. [ ] Ajouter page/modal de vérification de code
6. [ ] Modifier flux de connexion pour inclure 2FA si activé
7. [ ] Créer paramètre dans dashboard pour activer/désactiver 2FA
8. [ ] Tester avec numéros UAE (+971)

**Avantages 2FA** :
- ✅ Sécurité renforcée pour les comptes
- ✅ Protection contre le vol de mot de passe
- ✅ Conformité avec les meilleures pratiques de sécurité
- ✅ Confiance accrue des apporteurs

**Configuration Itooki.fr** :
```javascript
// À implémenter dans index.html
const ITOOKI_API_URL = 'https://api.itooki.fr/v1/sms';
const ITOOKI_API_KEY = 'VOTRE_CLE_API';

async function sendVerificationCode(phoneNumber) {
  const code = Math.floor(100000 + Math.random() * 900000); // 6 digits
  const message = `Votre code de vérification Real Estate Referrer : ${code}`;
  
  const response = await fetch(ITOOKI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ITOOKI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: phoneNumber,
      message: message
    })
  });
  
  return code; // Stocker dans session temporaire
}
```

**Note** : Le 2FA peut être optionnel au début, puis obligatoire pour admin après la phase bêta.

### **🟢 PRIORITÉ 4 - Conformité RERA & Légal (3-4 semaines)**

**Avant lancement public** :
- [ ] Licence RERA agent
- [ ] Examen DREI
- [ ] Permis publicitaire Trakheesi (5,000 AED)
- [ ] Form A avec propriétaires
- [ ] Validation CGU par avocat
- [ ] Finalisation contrat apporteur conforme RERA

### **🟢 PRIORITÉ 5 - Tests utilisateurs**

- [ ] Tester avec 2-3 apporteurs bêta
- [ ] Valider workflow complet (inscription → contrat → leads → commission)
- [ ] Tester 2FA avec différents opérateurs UAE (Etisalat, Du)
- [ ] Corrections bugs identifiés

---

## 🔍 **COMMANDES SQL UTILES**

```sql
-- Voir tous les profils
SELECT * FROM profiles;

-- Voir tous les leads avec noms d'apporteurs
SELECT 
  l.*,
  p.name as referrer_name
FROM leads l
LEFT JOIN profiles p ON l.referrer_id = p.id;

-- Statistiques globales
SELECT 
  COUNT(*) as total_leads,
  SUM(CASE WHEN status IN ('vendu', 'loué') THEN 1 ELSE 0 END) as ventes,
  SUM(referrer_commission) as commissions_totales
FROM leads;

-- Changer status contrat d'un utilisateur
UPDATE profiles 
SET contract_status = 'signed' 
WHERE id = 'UUID_USER';

-- Voir tous les contrats uploadés
SELECT 
  p.name,
  p.contract_status,
  p.contract_file_url,
  p.created_at
FROM profiles p
WHERE contract_status != 'pending'
ORDER BY p.created_at DESC;

-- Vérifier statut 2FA des utilisateurs
SELECT 
  name,
  phone,
  phone_verified,
  two_factor_enabled
FROM profiles
WHERE role = 'referrer';
```

---

## 📝 **NOTES TECHNIQUES IMPORTANTES**

### **Validation du téléphone**

Le système accepte les numéros UAE au format :
- **Mobiles** : préfixes 50, 52, 54, 55, 56, 58, 59
- **Fixes** : commence par 2, 3, 4, 6, 7, 9
- **Format** : 9 chiffres après +971

Exemple valide : `+971505059595`

### **Gestion du cache navigateur**

Lors des déploiements Vercel, le cache peut empêcher de voir les nouveautés :
1. Ouvrir en **navigation privée** pour tester
2. Ou vider le cache : `Cmd + Shift + R` (Mac) / `Ctrl + F5` (Windows)

### **Structure i18next**

Le système multilingue utilise :
- **Namespaces** : translation, auth, dashboard, common, privacy
- **Fallback** : français (fr) par défaut
- **Détection** : localStorage → navigator
- **Fichiers** : `/locales/{langue}/{namespace}.json`

---

## 🆘 **PROBLÈMES CONNUS & SOLUTIONS**

### **1. Erreur "otp_expired" lors téléchargement contrat**
- **Status** : 🔴 En cours de résolution (PRIORITÉ 1)
- **Cause** : Politique Supabase Storage mal configurée
- **Solution** : À implémenter

### **2. RLS désactivé**
- **Status** : ⚠️ Connu, acceptable en développement
- **Impact** : Tous les utilisateurs authentifiés peuvent voir toutes les données
- **Solution** : Réactiver avec fonction PostgreSQL (PRIORITÉ 3A)

### **3. Traductions incomplètes**
- **Status** : ⏳ En cours (70% fait)
- **Pages restantes** : Dashboard, how-it-works, terms, contract
- **Solution** : Création des JSON manquants (PRIORITÉ 2)

### **4. 2FA non implémenté**
- **Status** : 📋 Sur la roadmap (PRIORITÉ 3B)
- **Impact** : Sécurité de base OK, mais 2FA recommandé pour production
- **Solution** : Intégration Itooki.fr SMS

---

## 📞 **CONTACT & SUPPORT**

**Agent** : Karyne de Clercq  
**Localisation** : Dubai, UAE  
**Email** : contact@real-estate-referrer.com  
**Support technique** : Via conversation Claude

---

## 🎉 **HISTORIQUE DES VERSIONS**

**v3.5.0** (28 octobre 2025)
- ✅ Page privacy.html complète avec 5 sections RGPD
- ✅ Traductions complètes en 8 langues pour privacy.html
- 🔴 Identification problème contrat "otp_expired"
- 📋 Ajout 2FA Itooki.fr dans la todolist

**v3.0.0** (20-27 octobre 2025)
- ✅ Implémentation système multilingue i18next
- ✅ 8 langues : FR, EN, AR, RU, HI, UR, ZH, TL
- ✅ Traduction complète authentification
- ✅ Traduction partielle dashboard et landing page

**v2.1.0** (16 octobre 2025)
- ✅ Correction affichage noms apporteurs
- ✅ Désactivation RLS pour résoudre récursion
- ✅ Application 100% fonctionnelle

**v2.0.0** (15 octobre 2025)
- ✅ Migration vers Supabase Auth
- ✅ Première version déployée

**v1.0.0** (14 octobre 2025)
- ✅ Création initiale du projet

---

## 🚀 **CONCLUSION**

**Ce qui marche bien** :
- Architecture solide (React + Supabase + Vercel)
- Authentification sécurisée complète
- Dashboard fonctionnel pour admin et apporteurs
- Système de commissions automatique opérationnel
- Multilingue 8 langues avec i18next

**Ce qui doit être corrigé en priorité** :
1. 🔴 Système de contrat (download + upload)
2. 🟡 Finaliser traductions (80% objectif)
3. 🟡 Réactiver RLS + Implémenter 2FA avant production publique
4. 🟢 Conformité RERA avant lancement

**État général** : Application fonctionnelle à 85%, prête pour tests internes, corrections nécessaires avant lancement public.

---

**📅 Prochaine session : Correction du système de contrat**

_Document mis à jour le 28 octobre 2025 - Version 3.5.0 - Ajout 2FA_
