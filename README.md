# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 18 octobre 2025 - 22h30  
**Version** : 4.2.0  
**Status** : 🟡 **En finalisation - Système de reset password en cours**

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

- **Email** : admin@realestate-referrer.com ⚠️ **(Email fictif - à changer)**
- **Mot de passe** : Défini dans Supabase Auth
- **UUID** : e9a7f64f-49e2-41fd-86ef-2a37f63e5bf0
- **Contract Status** : validated (automatiquement validé)

---

## ✅ ÉTAT ACTUEL DU PROJET (18 octobre 2025 - 22h30)

### 🎯 Fonctionnalités 100% Complètes et Testées

#### 1. Authentification & Sécurité ✅
- ✅ Système d'authentification sécurisé Supabase Auth
- ✅ Mots de passe hashés automatiquement (bcrypt)
- ✅ Sessions sécurisées avec JWT tokens
- ✅ Inscription avec confirmation du mot de passe
- ✅ Connexion sécurisée (admin + apporteurs)
- ✅ Déconnexion sécurisée avec nettoyage de session
- ✅ Création automatique du profil utilisateur
- ✅ **RLS (Row Level Security) ACTIVÉ** avec politiques optimisées

#### 2. Système "Mot de passe oublié" 🔄 EN FINALISATION
**Status** : ⚠️ **90% complet - Ajustements finaux en cours**

**Ce qui fonctionne :**
- ✅ Bouton "Mot de passe oublié ?" sur la page de connexion
- ✅ Formulaire d'envoi de l'email de réinitialisation
- ✅ Page dédiée `reset-password.html` créée
- ✅ Formulaire de changement de mot de passe fonctionnel
- ✅ Validation (mot de passe min 6 caractères, confirmation)
- ✅ Déconnexion automatique après changement
- ✅ Redirection vers page de connexion

**Ce qui reste à faire :**
- ⏳ Modifier `redirectTo` dans index.html ligne 331 (ajouter `.html`)
- ⏳ Configurer Supabase Redirect URLs
- ⏳ Changer l'email admin pour un email réel

**Problème actuel :**
- ❌ L'email admin `admin@realestate-referrer.com` n'existe pas réellement
- ❌ L'URL de redirection pointe vers `/reset-password` au lieu de `/reset-password.html`
- ❌ Erreur 404 lors du clic sur le lien de réinitialisation

#### 3. Système de Validation de Contrat ✅
**Flux complet implémenté et testé :**
1. Nouvel apporteur s'inscrit → Status `pending`
2. Dashboard bloqué → Message "Contract Required"
3. Télécharge le template → Bouton "Download Contract Template"
4. Signe le contrat → Imprime, remplit, signe
5. Upload le PDF signé → Formulaire d'upload (max 5MB)
6. Status change → `uploaded` (en attente validation admin)
7. Admin reçoit notification → Badge rouge sur onglet "Contracts"
8. Admin voit le contrat → Bouton "View" télécharge le PDF
9. Admin valide ou rejette → Boutons "Validate" / "Reject"
10. Si validé → Apporteur peut ajouter des leads
11. Si rejeté → Apporteur doit re-uploader

**Sécurité Storage :**
- ✅ Bucket Contracts (privé)
- ✅ Policies RLS configurées et testées
- ✅ Fichiers stockés par UUID : `{user_id}/contract_{timestamp}.pdf`
- ✅ **Téléchargement via blob (compatible Safari)**

#### 4. 4 Types de Leads ✅
L'application gère 4 types de leads distincts :

**Ventes :**
- 🏠 **Sale - Buyer** : Client cherche à acheter
- 🏡 **Sale - Seller** : Propriétaire cherche à vendre

**Locations :**
- 🏢 **Rental - Landlord** : Cherche à louer son bien
- 🔑 **Rental - Tenant** : Client cherche à louer

#### 5. Statuts Distincts ✅
- **Pour les ventes** : nouveau → visite → offre → **vendu**
- **Pour les locations** : nouveau → visite → offre → **loué**
- ✅ Dropdown adapté selon le type de lead
- ✅ Badges colorés pour chaque statut
- ✅ Boutons adaptés ("Mark Sold" / "Mark Rented")
- ✅ **Affichage correct des commissions pour leads vendus/loués**

#### 6. Système de Commissions ✅
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

#### 7. Base de données PostgreSQL ✅
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

#### 8. Supabase Storage ✅
- ✅ Bucket "Contracts" créé (PRIVÉ)
- ✅ Policies de sécurité configurées et testées
- ✅ Upload de fichiers PDF (max 5MB)
- ✅ Lecture sécurisée par UUID
- ✅ **Téléchargement via blob (compatible Safari)**

#### 9. Interface Utilisateur 100% en Français ✅
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
  - **Affichage correct** : Commission en vert pour leads vendus/loués, boutons pour leads actifs
  - Calcul automatique des commissions
- **Onglet "Contracts"** :
  - Badge de notification pour contrats en attente
  - Liste de tous les apporteurs avec leur statut de contrat
  - Boutons "View" / "Validate" / "Reject"
  - **Téléchargement PDF fonctionnel (compatible Safari)**

#### 10. Pages Juridiques Complètes ✅
**Toutes les pages sont en français avec design harmonisé :**
- ✅ **`how-it-works.html`** - Comment ça marche
- ✅ **`terms.html`** - Conditions Générales d'Utilisation (13 articles)
- ✅ **`privacy.html`** - Politique de Confidentialité (13 sections)
- ✅ **`reset-password.html`** - Page de réinitialisation du mot de passe
- ✅ **Footer cohérent** sur toutes les pages

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
├── index.html                  ← Application principale (SPA) - FR ✅
├── contract-template.html      ← Template de contrat téléchargeable
├── reset-password.html         ← Page de réinitialisation ⚠️ (en finalisation)
├── how-it-works.html          ← Page "Comment ça marche" - FR ✅
├── terms.html                 ← CGU - FR ✅
├── privacy.html               ← Politique de confidentialité - FR ✅
└── README.md                  ← Ce fichier
```

---

## 🔒 Sécurité - État Actuel

### ✅ Row Level Security (RLS) - ACTIVÉ
**Status** : ✅ **RLS activé avec politiques fonctionnelles**

**Configuration actuelle :**
- ✅ Fonction `is_admin()` créée avec SECURITY DEFINER
- ✅ RLS activé sur les tables `profiles` et `leads`
- ✅ Politiques configurées et testées
- ✅ Storage sécurisé avec policies
- ✅ Base de données sécurisée
- ✅ Prêt pour production

---

## ⚠️ PROBLÈMES CONNUS

### 🔴 CRITIQUE - Système "Mot de passe oublié" incomplet

**Problème 1 : URL de redirection incorrecte**
- **Status** : ⚠️ À corriger immédiatement
- **Description** : Le lien de réinitialisation redirige vers `/reset-password` mais le fichier s'appelle `reset-password.html`
- **Impact** : Erreur 404 lors du clic sur le lien de réinitialisation
- **Solution** :
  1. Modifier `index.html` ligne 331
  2. Changer `redirectTo: '.../reset-password'` en `redirectTo: '.../reset-password.html'`

**Problème 2 : Email admin fictif**
- **Status** : ⚠️ À corriger avant utilisation admin
- **Description** : L'email `admin@realestate-referrer.com` n'existe pas
- **Impact** : L'admin ne peut pas recevoir d'email de réinitialisation
- **Solution** :
  1. Dans Supabase → Authentication → Users
  2. Modifier l'email admin vers un email réel (ex: `karyne@itooki.fr`)
  3. Ou configurer un serveur email pour `admin@realestate-referrer.com`

**Problème 3 : Redirect URLs Supabase non configurée**
- **Status** : ⚠️ À configurer
- **Description** : L'URL `/reset-password.html` n'est pas dans les Redirect URLs autorisées
- **Impact** : Possible rejet de la redirection par Supabase
- **Solution** :
  1. Supabase Dashboard → Authentication → URL Configuration
  2. Ajouter : `https://real-estate-referrer-3kp6.vercel.app/reset-password.html`

---

## 🎯 NEXT STEPS

### 🔴 PRIORITÉ 0 - Finaliser "Mot de passe oublié" (15 minutes)

#### **Étape 1 : Modifier index.html (5 min)**
1. Ouvrir `index.html` sur GitHub
2. Aller à la ligne 331
3. Chercher : `redirectTo: 'https://real-estate-referrer-3kp6.vercel.app/reset-password'`
4. Remplacer par : `redirectTo: 'https://real-estate-referrer-3kp6.vercel.app/reset-password.html'`
5. Commit : `Fix password reset redirect URL - add .html extension`

#### **Étape 2 : Configurer Supabase (5 min)**
1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet
3. Authentication → URL Configuration
4. Dans "Redirect URLs", ajouter :
   ```
   https://real-estate-referrer-3kp6.vercel.app/reset-password.html
   ```
5. Sauvegarder

#### **Étape 3 : Changer l'email admin (5 min)**
1. Supabase → Authentication → Users
2. Cliquer sur l'utilisateur admin (UUID: `e9a7f64f-49e2-41fd-86ef-2a37f63e5bf0`)
3. Modifier l'email vers un email réel (ex: `karyne@itooki.fr`)
4. Sauvegarder

#### **Étape 4 : Tester le flux complet (5 min)**
1. Aller sur la page de connexion
2. Cliquer "Mot de passe oublié ?"
3. Entrer l'email admin (le nouveau)
4. Vérifier l'email reçu
5. Cliquer sur le lien
6. ✅ Vérifier que la page `/reset-password.html` s'affiche
7. Changer le mot de passe
8. Se reconnecter avec le nouveau mot de passe

---

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
  - `https://real-estate-referrer.com/reset-password.html`

#### 4. Mettre à jour index.html
- Changer tous les `https://real-estate-referrer-3kp6.vercel.app` en `https://real-estate-referrer.com`

---

### 🟡 PRIORITÉ 2 - Sécurité Avancée (1 heure)

#### Changer le mot de passe admin :
- [ ] Utiliser un mot de passe fort (12+ caractères)
- [ ] Le stocker dans un gestionnaire de mots de passe
- [ ] Ne jamais le partager

#### Configurer les alertes Supabase :
- [ ] Activer les notifications pour tentatives de connexion suspectes
- [ ] Configurer des limites de taux (rate limiting)

---

### 🟢 PRIORITÉ 3 - Configuration Email Professionnelle (1 jour)

**Options recommandées :**
- Google Workspace (6 USD/mois) - Recommandé
- Zoho Mail (1-3 USD/mois) - Économique
- ProtonMail (4 USD/mois) - Sécurité maximale

**Emails à créer :**
- `contact@real-estate-referrer.com`
- `admin@real-estate-referrer.com`
- `support@real-estate-referrer.com` (optionnel)

---

### 🟢 PRIORITÉ 4 - Système Multilingue (1-2 semaines)

Ajouter traductions Anglais + Arabe avec sélecteur de langue, localStorage, et fichiers JSON de traduction.

---

### 🟢 PRIORITÉ 5 - Conformité RERA Dubai (2-4 semaines)

**⚠️ AMENDES JUSQU'À 50,000 AED EN CAS DE NON-CONFORMITÉ**

**Requis obligatoires :**
- [ ] **Licence RERA** (Real Estate Regulatory Agency)
- [ ] **Examen DREI** (Dubai Real Estate Institute)
- [ ] **Permis publicitaire Trakheesi** (5,000 AED)
- [ ] **Form A** avec propriétaires (pour chaque bien)

**Ressources :**
- Site RERA : https://www.reraproperty.ae
- Contact : +971 4 362 2222
- Email : info@reraproperty.ae

---

### 🟢 PRIORITÉ 6 - Personnalisation (1-2 jours)

- [ ] Remplacer "Dubai Real Estate" par votre nom d'agence
- [ ] Ajouter votre logo
- [ ] Ajouter vos coordonnées (téléphone, adresse)
- [ ] Mettre à jour les CGU avec vos informations réelles

---

### 🟢 PRIORITÉ 7 - Tests Utilisateurs (1 semaine)

- [ ] Inviter 2-3 apporteurs bêta
- [ ] Tester le cycle complet
- [ ] Valider les calculs de commission
- [ ] Recueillir les feedbacks

---

### 🟢 PRIORITÉ 8 - Fonctionnalités Avancées (Optionnel)

- Notifications par Email
- Dashboard Analytics
- Système de Parrainage

---

## 📝 Notes Techniques

### Configuration Supabase
```javascript
const supabaseUrl = 'https://cgizcgwhwxswvoodqver.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Commandes SQL Utiles
```sql
-- Voir tous les profils
SELECT * FROM profiles;

-- Voir tous les leads avec noms d'apporteurs
SELECT l.*, p.name as referrer_name
FROM leads l
LEFT JOIN profiles p ON l.referrer_id = p.id;

-- Changer l'email admin
UPDATE auth.users 
SET email = 'karyne@itooki.fr'
WHERE id = 'e9a7f64f-49e2-41fd-86ef-2a37f63e5bf0';
```

---

## 🆘 Support & Ressources

### Documentation Officielle
- **Supabase** : https://docs.supabase.com
- **Vercel** : https://vercel.com/docs
- **Tailwind CSS** : https://tailwindcss.com/docs

### RERA Dubai
- **Site officiel** : https://www.reraproperty.ae
- **Contact** : +971 4 362 2222

---

## 🎉 Historique du Projet

**18 octobre 2025 - Soir (22h00-23h00)**
- **AJOUT SYSTÈME "MOT DE PASSE OUBLIÉ"** 🔄 (90% complet)
- Création de `reset-password.html` avec formulaire complet
- Modification de `index.html` pour ajouter `redirectTo`
- Découverte : email admin fictif
- Découverte : problème d'extension `.html` dans l'URL
- **Version 4.2.0 - EN FINALISATION** ⏳

**18 octobre 2025 - Matin**
- **RÉACTIVATION RLS AVEC POLITIQUES OPTIMISÉES** ✅
- **CORRECTION VISUALISATION PDF (SAFARI)** ✅
- **CORRECTION AFFICHAGE COMMISSIONS** ✅
- **Version 4.1.0 - PRODUCTION SÉCURISÉE** 🎊✅

**17 octobre 2025 - Soir**
- **CRÉATION PAGES JURIDIQUES COMPLÈTES** ✅
- **Version 4.0.0 - PRODUCTION COMPLÈTE** 🎊🎉

**17 octobre 2025 - Après-midi**
- **SYSTÈME DE VALIDATION DE CONTRAT COMPLET** ✅
- **Version 3.1.0 - SYSTÈME COMPLET** 🎊

**17 octobre 2025 - Matin**
- **AJOUT DES 4 TYPES DE LEADS** ✅
- **Version 3.0.0 - PLEINEMENT FONCTIONNEL** 🎉

---

## 🏆 Conclusion

### ✅ Ce qui fonctionne parfaitement
1. ✅ Authentification complète (signup, login, logout)
2. ✅ Système de contrat de A à Z
3. ✅ 4 types de leads (vente/location × 2)
4. ✅ Calcul automatique des commissions
5. ✅ Dashboard admin et apporteur complets
6. ✅ Storage sécurisé
7. ✅ Design premium Dubai
8. ✅ Pages juridiques complètes
9. ✅ RLS activé et testé

### 🔄 En finalisation
1. ⏳ Système "Mot de passe oublié" (90% complet - 15 min restantes)

### ⏳ À faire avant lancement public
1. ⏰ Finaliser "Mot de passe oublié"
2. ⏰ Configurer DNS → Vercel
3. 🌐 Email professionnel
4. 🏛️ Licences RERA
5. 👥 Tests bêta

---

**Dernière mise à jour** : 18 octobre 2025 - 22h30  
**Version** : 4.2.0  
**Status** : 🟡 **90% Production - Finalisation reset password en cours**

---

## 🎯 ACTIONS IMMÉDIATES (15 minutes)

1. **[ ] Modifier index.html ligne 331** - Ajouter `.html`
2. **[ ] Configurer Supabase Redirect URLs**
3. **[ ] Changer l'email admin**
4. **[ ] Tester le flux complet**

**Une fois ces 4 étapes terminées → Version 4.2.0 COMPLÈTE ! 🎉**
