# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 17 octobre 2025  
**Version** : 4.0.0  
**Status** : 🟢 **Production - Entièrement Fonctionnel**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients (ventes ET locations), suivre les transactions, valider les contrats et calculer automatiquement les commissions.

**⚠️ IMPORTANT** : Tous les fichiers sont édités directement sur **GitHub** (pas de VSCode local). Les déploiements sont automatiques via **Vercel**.

---

## 🌐 Accès et URLs

### URLs Actuelles
- **Site web** : https://real-estate-referrer-3kp6.vercel.app
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

### Domaine personnalisé (à configurer)
- **Domaine acheté** : real-estate-referrer.com
- **Registrar** : OVH
- **Status** : ⏳ En attente de configuration DNS

---

## 🔑 Compte Admin

- **Email** : admin@realestate-referrer.com
- **Mot de passe** : Défini dans Supabase Auth
- **UUID** : 68817a49-b31c-4edf-85fe-691eb33d6014
- **Contract Status** : validated (automatiquement validé)

---

## ✅ ÉTAT ACTUEL DU PROJET (17 octobre 2025)

### 🎯 Fonctionnalités 100% Complètes

#### 1. Authentification & Sécurité ✅
- ✅ Système d'authentification sécurisé Supabase Auth
- ✅ Mots de passe hashés automatiquement (bcrypt)
- ✅ Sessions sécurisées avec JWT tokens
- ✅ Inscription avec confirmation du mot de passe
- ✅ Connexion sécurisée (admin + apporteurs)
- ✅ Mot de passe oublié avec email de réinitialisation
- ✅ Page de changement de mot de passe
- ✅ Déconnexion sécurisée avec nettoyage de session
- ✅ Création automatique du profil utilisateur

#### 2. Système de Validation de Contrat ✅
**Flux complet implémenté :**
1. Nouvel apporteur s'inscrit → Status `pending`
2. Dashboard bloqué → Message "Contract Required"
3. Télécharge le template → Bouton "Download Contract Template"
4. Signe le contrat → Imprime, remplit, signe
5. Upload le PDF signé → Formulaire d'upload (max 5MB)
6. Status change → `uploaded` (en attente validation admin)
7. Admin reçoit notification → Badge rouge sur onglet "Contracts"
8. Admin voit le contrat → Bouton "View" ouvre le PDF
9. Admin valide ou rejette → Boutons "Validate" / "Reject"
10. Si validé → Apporteur peut ajouter des leads
11. Si rejeté → Apporteur doit re-uploader

**Sécurité Storage :**
- ✅ Bucket Contracts (privé)
- ✅ Policies RLS configurées
- ✅ Fichiers stockés par UUID : `{user_id}/contract_{timestamp}.pdf`

#### 3. 4 Types de Leads ✅
L'application gère 4 types de leads distincts :

**Ventes :**
- 🏠 **Sale - Buyer** : Client cherche à acheter
- 🏡 **Sale - Seller** : Propriétaire cherche à vendre

**Locations :**
- 🏢 **Rental - Landlord** : Cherche à louer son bien
- 🔑 **Rental - Tenant** : Client cherche à louer

#### 4. Statuts Distincts ✅
- **Pour les ventes** : nouveau → visite → offre → **vendu**
- **Pour les locations** : nouveau → visite → offre → **loué**
- ✅ Dropdown adapté selon le type de lead
- ✅ Badges colorés pour chaque statut
- ✅ Boutons adaptés ("Mark Sold" / "Mark Rented")

#### 5. Système de Commissions ✅

**Structure :**
```
Transaction immobilière (vente ou location)
└─ Commission totale (2% vente / 5% location)
   ├─ Agence : 50%
   └─ Agent (vous) : 50%
      ├─ Apporteur : 20% de la part agent
      └─ Vous : 80% de la part agent
```

**Taux de commission :**
- **Ventes** : 2% du prix de vente
  - Commission apporteur : 0.2% du prix de vente
- **Locations** : 5% du loyer annuel
  - Commission apporteur : 0.5% du loyer annuel

**Exemples concrets :**
- Villa vendue 5M AED → Apporteur : **10,000 AED**
- Appartement loué 150K AED/an → Apporteur : **750 AED**

**Délais de paiement :**
- **Ventes** : 45-60 jours après émission du Title Deed
- **Locations** : 7-14 jours après signature du Tenancy Contract

#### 6. Base de données PostgreSQL ✅

**Table profiles :**
```sql
- id UUID PRIMARY KEY (référence auth.users)
- name TEXT
- phone TEXT
- role TEXT ('admin' ou 'referrer')
- created_at TIMESTAMP
- contract_status TEXT DEFAULT 'pending'
- contract_validated_at TIMESTAMP
- contract_file_url TEXT
```

**Table leads :**
```sql
- id BIGSERIAL PRIMARY KEY
- referrer_id UUID (référence auth.users)
- lead_type TEXT ('sale_buyer', 'sale_seller', 'rent_landlord', 'rent_tenant')
- client_name TEXT
- client_email TEXT
- client_phone TEXT
- property_type TEXT
- budget NUMERIC (nullable - pour ventes et location locataire)
- annual_rent NUMERIC (nullable - pour location propriétaire)
- status TEXT ('nouveau', 'visite', 'offre', 'vendu', 'loué')
- sale_price NUMERIC
- agent_commission NUMERIC
- referrer_commission NUMERIC
- created_at TIMESTAMP
- closed_at TIMESTAMP
```

**Trigger automatique :**
- Création automatique d'un profil dans profiles lors de l'inscription
- Liaison automatique avec auth.users

#### 7. Supabase Storage ✅
- ✅ Bucket "Contracts" créé (PRIVÉ)
- ✅ Policies de sécurité configurées et testées
- ✅ Upload de fichiers PDF (max 5MB)
- ✅ Lecture sécurisée par UUID
- ✅ Fonction viewContract pour l'admin

#### 8. Interface Utilisateur 100% en Français ✅

**Landing Page :**
- Design premium "Dubai Real Estate"
- Gradient bleu/or élégant
- Call-to-action clair
- Exemples de gains (6K, 10K, 20K AED)
- Stats du programme (20%, 24/7, délais réalistes)
- Footer avec liens juridiques
- Responsive mobile

**Dashboard Apporteur :**
- **Si contrat non validé** : Écran de blocage avec instructions d'upload
- **Si contrat validé** : Dashboard complet avec :
  - Badge vert "✓ Contract Validated"
  - Statistiques personnelles (gains, leads actifs, ventes)
  - Bouton "Add Lead"
  - Formulaire dynamique selon le type de lead
  - Table de tous les leads avec type, statut, commission

**Dashboard Admin :**
- Vue d'ensemble globale :
  - Nombre d'apporteurs
  - Leads actifs
  - Ventes/Locations totales
  - Commissions versées
- **Onglet "Leads"** :
  - Table de tous les leads
  - Dropdown pour changer le statut
  - Bouton adapté ("Mark Sold" ou "Mark Rented")
  - Calcul automatique des commissions
- **Onglet "Contracts"** :
  - Badge de notification pour contrats en attente
  - Liste de tous les apporteurs avec leur statut de contrat
  - Boutons "View" / "Validate" / "Reject"
  - Affichage des contrats uploadés

#### 9. Pages Juridiques Complètes ✅

**Toutes les pages sont en français avec design harmonisé :**

- ✅ **`how-it-works.html`** - Comment ça marche
  - 5 étapes pour devenir apporteur
  - Exemples de gains concrets
  - Critères d'un bon lead (qualifié vs non qualifié)
  - Sécurité & Transparence (4 garanties)
  - FAQ complète (10 questions/réponses)
  - Délais de paiement réalistes et cohérents

- ✅ **`terms.html`** - Conditions Générales d'Utilisation
  - 13 articles complets
  - Définitions claires
  - Inscription et validation du contrat
  - Programme de référencement (4 types de leads)
  - Commissions détaillées (ventes + locations)
  - Obligations de l'apporteur et de l'agent
  - Propriété intellectuelle
  - Données personnelles (RGPD/GDPR)
  - Résiliation, Responsabilité
  - Loi applicable (UAE)

- ✅ **`privacy.html`** - Politique de Confidentialité
  - 13 sections complètes
  - Responsable du traitement
  - Données collectées (4 catégories)
  - Base légale et finalités (5 types)
  - Partage des données (transparence totale)
  - Sécurité (mesures techniques + organisationnelles)
  - Conservation des données (durées légales)
  - Cookies et technologies similaires
  - Droits des utilisateurs (7 droits RGPD)
  - Transferts internationaux
  - Protection des mineurs
  - Modifications et réclamations
  - Contact

- ✅ **Footer cohérent** sur toutes les pages avec liens vers :
  - CGU
  - Confidentialité
  - Comment ça marche
  - Contact (email)

---

## 🚀 Stack Technique

- **Frontend** : React 18 (ESM modules via CDN)
- **Styling** : Tailwind CSS (via CDN)
- **Backend/Auth** : Supabase (PostgreSQL + Auth + Storage)
- **Hébergement** : Vercel
- **Contrôle de version** : GitHub (édition directe sur GitHub)
- **Déploiement** : Automatique via GitHub → Vercel

---

## 📁 Structure du Projet

```
Real-Estate-Referrer/ (GitHub Repository)
├── index.html                  ← Application principale (SPA) - FR
├── contract-template.html      ← Template de contrat téléchargeable
├── how-it-works.html          ← Page "Comment ça marche" - FR ✅
├── terms.html                 ← CGU - FR ✅
├── privacy.html               ← Politique de confidentialité - FR ✅
└── README.md                  ← Ce fichier
```

---

## ⚠️ POINTS D'ATTENTION

### 🔓 Row Level Security (RLS) - À activer avant lancement public

**Status actuel** : ⚠️ RLS désactivé sur les tables `profiles` et `leads`

**Pourquoi :**
- Les politiques initiales causaient des problèmes de récursion
- Désactivation temporaire pour assurer le bon fonctionnement
- Le Storage est sécurisé avec des policies fonctionnelles

**Impact :**
- ✅ L'application fonctionne parfaitement
- ✅ Le Storage est sécurisé (policies actives)
- ⚠️ Pour production publique, RLS sur les tables SQL est recommandé

**Solution à implémenter avant lancement public** : Voir section "Next Steps"

---

## 🎯 NEXT STEPS

### 🔴 PRIORITÉ 1 - Configuration Domaine (Quand actif chez OVH)

#### 1. Configurer DNS sur OVH
Créer ces enregistrements DNS :
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

#### 2. Configurer Vercel
- Aller sur Vercel → Settings → Domains
- Ajouter : `real-estate-referrer.com`
- Ajouter : `www.real-estate-referrer.com`
- Attendre la propagation DNS (10-30 min)

#### 3. Mettre à jour Supabase
Dans Supabase → Authentication → URL Configuration :
- **Site URL** : `https://real-estate-referrer.com`
- **Redirect URLs** :
  - `https://real-estate-referrer.com/**`
  - `https://www.real-estate-referrer.com/**`

#### 4. Tester
- [ ] Accès au site via le nouveau domaine
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Upload de contrat
- [ ] Validation de contrat
- [ ] Ajout de lead (4 types)
- [ ] Certificat SSL (HTTPS) actif

---

### 🟡 PRIORITÉ 2 - Sécurité Base de Données (1-2 heures)

#### Réactiver RLS avec fonction PostgreSQL

```sql
-- Créer une fonction qui lit sans RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles"
ON profiles FOR SELECT
TO authenticated
USING (is_admin());

-- Politiques pour leads
CREATE POLICY "Referrers read own leads"
ON leads FOR SELECT
TO authenticated
USING (auth.uid() = referrer_id OR is_admin());

CREATE POLICY "Referrers create own leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins manage all leads"
ON leads FOR ALL
TO authenticated
USING (is_admin());
```

#### Tester après activation :
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Ajout de lead (4 types)
- [ ] Modification de statut
- [ ] Calcul de commission
- [ ] Affichage des noms d'apporteurs
- [ ] Upload de contrat
- [ ] Validation de contrat

#### Changer le mot de passe admin :
- [ ] Utiliser un mot de passe fort (12+ caractères)
- [ ] Le stocker dans un gestionnaire de mots de passe
- [ ] Ne jamais le partager

---

### 🟢 PRIORITÉ 3 - Système Multilingue (1-2 semaines)

#### Ajouter traductions Anglais + Arabe

**Stratégie recommandée :**

1. **Créer un système de traduction simple**
   - Ajouter un sélecteur de langue dans le header
   - Stocker la langue préférée dans localStorage
   - Créer des fichiers JSON de traduction

2. **Structure des fichiers de traduction**
   ```
   /translations/
   ├── fr.json  (déjà implémenté dans le code)
   ├── en.json  (à créer)
   └── ar.json  (à créer)
   ```

3. **Pages à traduire :**
   - [ ] `index.html` (Landing page + dashboards)
   - [ ] `how-it-works.html`
   - [ ] `terms.html`
   - [ ] `privacy.html`
   - [ ] `contract-template.html`

4. **Éléments à traduire :**
   - Tous les textes de l'interface
   - Messages d'erreur et de succès
   - Emails de confirmation
   - Templates de contrats

5. **Considérations pour l'arabe :**
   - Direction RTL (right-to-left)
   - Polices adaptées
   - Ajustements CSS pour l'alignement

**Exemple d'implémentation :**

```javascript
// translations.js
const translations = {
  fr: {
    nav: {
      login: "Connexion",
      signup: "S'inscrire",
      logout: "Déconnexion"
    },
    dashboard: {
      totalEarnings: "Gains Totaux",
      activeLeads: "Leads Actifs"
    }
    // ... etc
  },
  en: {
    nav: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout"
    },
    dashboard: {
      totalEarnings: "Total Earnings",
      activeLeads: "Active Leads"
    }
    // ... etc
  },
  ar: {
    nav: {
      login: "تسجيل الدخول",
      signup: "التسجيل",
      logout: "تسجيل الخروج"
    },
    dashboard: {
      totalEarnings: "إجمالي الأرباح",
      activeLeads: "العملاء النشطون"
    }
    // ... etc
  }
};

// Utilisation
function t(key) {
  const lang = localStorage.getItem('language') || 'fr';
  const keys = key.split('.');
  let value = translations[lang];
  for (const k of keys) {
    value = value[k];
  }
  return value;
}
```

**Ajout du sélecteur de langue dans le header :**

```html
<div class="language-selector">
  <button onclick="changeLanguage('fr')" class="lang-btn">🇫🇷 FR</button>
  <button onclick="changeLanguage('en')" class="lang-btn">🇬🇧 EN</button>
  <button onclick="changeLanguage('ar')" class="lang-btn">🇦🇪 AR</button>
</div>
```

---

### 🟢 PRIORITÉ 4 - Conformité RERA Dubai (2-4 semaines)

#### ⚠️ AMENDES JUSQU'À 50,000 AED EN CAS DE NON-CONFORMITÉ

**Requis obligatoires :**
- [ ] **Licence RERA** (Real Estate Regulatory Agency)
- [ ] **Examen DREI** (Dubai Real Estate Institute)
- [ ] **Permis publicitaire Trakheesi** (5,000 AED)
- [ ] **Form A** avec propriétaires (pour chaque bien)

**Ressources :**
- Site RERA : https://www.reraproperty.ae
- Contact : +971 4 362 2222
- Email : info@reraproperty.ae

**🚨 ATTENTION : Ne lancez pas publiquement sans ces licences !**

---

### 🟢 PRIORITÉ 5 - Configuration Email Professionnelle (1 jour)

**Options recommandées :**
- Google Workspace (6 USD/mois) - Recommandé
- Zoho Mail (1-3 USD/mois) - Économique
- ProtonMail (4 USD/mois) - Sécurité maximale

**Emails à créer :**
- `contact@real-estate-referrer.com`
- `admin@real-estate-referrer.com`
- `support@real-estate-referrer.com` (optionnel)

---

### 🟢 PRIORITÉ 6 - Personnalisation (1-2 jours)

- [ ] Remplacer "Dubai Real Estate" par votre nom d'agence
- [ ] Ajouter votre logo
- [ ] Ajouter vos coordonnées (téléphone, adresse)
- [ ] Personnaliser les couleurs si souhaité
- [ ] Ajouter photo de profil admin
- [ ] Mettre à jour les CGU avec vos informations réelles

---

### 🟢 PRIORITÉ 7 - Tests Utilisateurs (1 semaine)

- [ ] Inviter 2-3 apporteurs bêta
- [ ] Tester le cycle complet :
  - Inscription
  - Upload de contrat
  - Validation par admin
  - Ajout de leads (4 types)
  - Transaction → commission
- [ ] Valider les calculs de commission (ventes ET locations)
- [ ] Recueillir les feedbacks
- [ ] Corriger les bugs éventuels

---

## 📝 Notes Techniques

### Configuration Supabase
```javascript
const supabaseUrl = 'https://cgizcgwhwxswvoodqver.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Bucket Storage
```
Nom: Contracts
Type: Privé
Structure: {user_id}/contract_{timestamp}.pdf
Max size: 5MB
Type accepté: application/pdf
```

### Commandes SQL Utiles

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
  SUM(CASE WHEN status = 'vendu' THEN 1 ELSE 0 END) as ventes,
  SUM(CASE WHEN status = 'loué' THEN 1 ELSE 0 END) as locations,
  SUM(referrer_commission) as commissions_totales
FROM leads;

-- Statistiques par apporteur
SELECT
  p.name,
  p.contract_status,
  COUNT(l.id) as total_leads,
  SUM(CASE WHEN l.status = 'vendu' THEN 1 ELSE 0 END) as ventes,
  SUM(CASE WHEN l.status = 'loué' THEN 1 ELSE 0 END) as locations,
  SUM(l.referrer_commission) as total_commission
FROM profiles p
LEFT JOIN leads l ON p.id = l.referrer_id
WHERE p.role = 'referrer'
GROUP BY p.name, p.contract_status
ORDER BY total_commission DESC;

-- Voir les contrats en attente de validation
SELECT name, contract_status, contract_file_url, created_at
FROM profiles
WHERE role = 'referrer'
AND contract_status = 'uploaded'
ORDER BY created_at DESC;
```

---

## 🆘 Support & Ressources

### Documentation Officielle
- **Supabase** : https://docs.supabase.com
- **Vercel** : https://vercel.com/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **React** : https://react.dev

### RERA Dubai
- **Site officiel** : https://www.reraproperty.ae
- **Contact** : +971 4 362 2222
- **Email** : info@reraproperty.ae

---

## 🎉 Historique du Projet

**14-15 octobre 2025**
- Création initiale
- Problèmes d'authentification

**15 octobre 2025**
- Migration vers Supabase Auth
- Première version déployée

**16 octobre 2025 - Matin**
- Ajout "Mot de passe oublié"
- Flux de reset password complet

**16 octobre 2025 - Après-midi**
- Correction affichage des noms d'apporteurs
- Désactivation RLS pour résoudre récursion
- Version 2.1.0 - Production stable

**16 octobre 2025 - Soir**
- Achat du domaine real-estate-referrer.com
- Version 2.2.0

**17 octobre 2025 - Matin**
- **AJOUT DES 4 TYPES DE LEADS** ✅
  - 2 types de vente (acheteur/vendeur)
  - 2 types de location (propriétaire/locataire)
- **AJOUT STATUT "LOUÉ"** ✅
- **CALCULS AUTOMATIQUES** ✅
- Configuration Supabase Storage (bucket Contracts)
- **Version 3.0.0 - PLEINEMENT FONCTIONNEL** 🎉

**17 octobre 2025 - Après-midi**
- **SYSTÈME DE VALIDATION DE CONTRAT COMPLET** ✅
- **CORRECTION BUCKET STORAGE** ✅
- **Version 3.1.0 - SYSTÈME COMPLET** 🎊

**17 octobre 2025 - Soir**
- **CRÉATION PAGES JURIDIQUES COMPLÈTES** ✅
  - `how-it-works.html` avec FAQ détaillée
  - `terms.html` avec CGU complets (13 articles)
  - `privacy.html` avec politique RGPD (13 sections)
- **AJOUT FOOTER SUR TOUTES LES PAGES** ✅
- **TRADUCTION 100% FRANÇAIS** ✅
- **CORRECTION DÉLAIS DE PAIEMENT** ✅
  - Cohérence totale entre toutes les pages
  - Délais réalistes : 45-60j (ventes), 7-14j (locations)
- **Version 4.0.0 - PRODUCTION COMPLÈTE** 🎊🎉

---

## 🏆 Conclusion

### ✅ Ce qui fonctionne parfaitement

1. ✅ **Authentification complète** (signup, login, reset password)
2. ✅ **Système de contrat de A à Z** (upload, validation, sécurité)
3. ✅ **4 types de leads** (vente/location × 2)
4. ✅ **Calcul automatique des commissions** (ventes + locations)
5. ✅ **Dashboard admin** (leads + contrats)
6. ✅ **Dashboard apporteur** (avec blocage si contrat non validé)
7. ✅ **Storage sécurisé** (policies fonctionnelles)
8. ✅ **Statuts "vendu" et "loué"** distincts
9. ✅ **Design premium Dubai** avec couleurs harmonisées
10. ✅ **Déploiement automatique** GitHub → Vercel
11. ✅ **Pages juridiques complètes** (CGU, Privacy, How it works)
12. ✅ **Footer cohérent** sur toutes les pages
13. ✅ **Interface 100% en français**
14. ✅ **Délais de paiement cohérents** partout

### ⏳ À faire avant lancement public

1. ⏰ **Configurer DNS** → Vercel (quand domaine actif)
2. 🌐 **Ajouter traductions** EN + AR (optionnel mais recommandé)
3. 🔒 **Réactiver RLS** sur tables SQL (sécurité)
4. 🏛️ **Obtenir licences RERA**
5. 👥 **Phase de tests bêta** (2-3 apporteurs)
6. 📧 **Email professionnel**
7. 🎨 **Personnalisation** (logo, nom agence)

### 🚀 Prêt pour

- ✅ Tests internes avec apporteurs de confiance
- ✅ Démonstrations clients
- ✅ Ajout de leads réels
- ✅ Suivi des commissions
- ✅ Validation de contrats
- ✅ Présentation professionnelle du programme

---

## 📞 Contact

Pour toute question sur le projet, consultez cette documentation ou contactez le développeur via GitHub.

**Dernière mise à jour** : 17 octobre 2025 - 21h00  
**Version** : 4.0.0  
**Status** : 🟢 **Production - Système complet, cohérent et professionnel**

---

## 🎯 QUICK START

### Pour tester l'application :

1. **Aller sur** : https://real-estate-referrer-3kp6.vercel.app
2. **Explorer les pages** :
   - Landing page avec footer
   - Comment ça marche (FAQ)
   - CGU
   - Politique de confidentialité
3. **Créer un compte apporteur** → Sign Up
4. **Télécharger le contrat** → Suivre les instructions
5. **Uploader le contrat signé** → PDF max 5MB
6. **Se connecter en admin** → admin@realestate-referrer.com
7. **Valider le contrat** → Onglet "Contracts" → Validate
8. **Ajouter des leads** → Tester les 4 types
9. **Marquer une vente/location** → Voir le calcul de commission

**🎉 Bon test !**
