# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 18 octobre 2025 - 23h30  
**Version** : 5.0.0  
**Status** : 🟢 **Production - Domaine Personnalisé Actif**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients (ventes ET locations), suivre les transactions, valider les contrats et calculer automatiquement les commissions.

---

## 🌐 Accès et URLs

### **URLs Actuelles (ACTIVES)**

- **Site web principal** : https://real-estate-referrer.com ✅
- **Site web www** : https://www.real-estate-referrer.com ✅
- **Ancien domaine Vercel** : https://real-estate-referrer-3kp6.vercel.app (toujours actif)
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

### **Domaine Personnalisé**

- **Domaine acheté** : real-estate-referrer.com ✅
- **Registrar** : OVH
- **DNS configurés** : ✅ Actif
- **Certificats SSL** : ✅ Générés automatiquement par Vercel

---

## 🔑 Compte Admin

- **Email** : admin@realestate-referrer.com ⚠️ **(Email fictif - à changer)**
- **Mot de passe** : **MODIFIÉ - Sécurisé** ✅
- **UUID** : e9a7f64f-49e2-41fd-86ef-2a37f63e5bf0
- **Contract Status** : validated (automatiquement validé)

---

## 📁 Structure du Projet

```
Real-Estate-Referrer/ (GitHub Repository)
├── index.html                 ← Application principale (SPA) - FR ✅ (DOMAINE MIS À JOUR)
├── reset-password.html        ← Page reset password ✅ (À METTRE À JOUR)
├── contract-template.html     ← Template de contrat téléchargeable
├── how-it-works.html          ← Page "Comment ça marche" - FR ✅
├── terms.html                 ← CGU - FR ✅
├── privacy.html               ← Politique de confidentialité - FR ✅
└── README.md                  ← Ce fichier
```

---

## 🚀 Stack Technique

- **Frontend** : React 18 (ESM modules via CDN)
- **Styling** : Tailwind CSS (via CDN)
- **Backend/Auth** : Supabase (PostgreSQL + Auth + Storage)
- **Hébergement** : Vercel
- **Domaine** : OVH (real-estate-referrer.com)
- **Contrôle de version** : GitHub (édition directe)
- **Déploiement** : Automatique via GitHub → Vercel

---

## ✅ ÉTAT ACTUEL DU PROJET (Version 5.0.0)

### **🌐 Configuration Domaine - 100% COMPLET ✅**

**DNS OVH configurés :**
- ✅ Record A : `real-estate-referrer.com` → `76.76.21.21`
- ✅ Record CNAME : `www.real-estate-referrer.com` → `cname.vercel-dns.com.`
- ✅ Propagation DNS : **COMPLÈTE** (< 30 minutes)

**Vercel :**
- ✅ Domaine `real-estate-referrer.com` ajouté et actif
- ✅ Domaine `www.real-estate-referrer.com` ajouté et actif
- ✅ Certificats SSL générés automatiquement
- ✅ HTTPS actif sur les deux domaines

**Résultat :**
- ✅ https://real-estate-referrer.com fonctionne parfaitement
- ✅ https://www.real-estate-referrer.com fonctionne parfaitement

---

### **🔐 Supabase Configuration - 100% COMPLET ✅**

**Authentication → URL Configuration :**
- ✅ **Site URL** : `https://real-estate-referrer.com`
- ✅ **Redirect URLs** :
  - `https://real-estate-referrer.com/**`
  - `https://www.real-estate-referrer.com/**`
  - `https://real-estate-referrer.com/reset-password.html`

**Résultat :**
- ✅ L'authentification fonctionne avec le nouveau domaine
- ✅ Le reset password est configuré pour le nouveau domaine

---

### **📝 Fichiers Application - PARTIELLEMENT MIS À JOUR**

- ✅ **index.html** : Domaine mis à jour (`real-estate-referrer.com`)
- ⏳ **reset-password.html** : **À METTRE À JOUR** (contient encore l'ancien domaine Vercel)

---

### **🔒 Sécurité des Mots de Passe - 100% COMPLET ✅**

**Validation stricte implémentée :**
- ✅ Minimum 12 caractères
- ✅ 1 majuscule minimum (A-Z)
- ✅ 1 minuscule minimum (a-z)
- ✅ 1 chiffre minimum (0-9)
- ✅ 1 caractère spécial minimum (@#$%^&*!?.)
- ✅ Indicateur visuel de force du mot de passe
- ✅ Appliqué sur inscription + reset password

---

### **📋 Système de Validation de Contrat - 100% COMPLET ✅**

**Flux complet :**
1. ✅ Nouvel apporteur s'inscrit → Status pending
2. ✅ Dashboard bloqué → Écran d'upload de contrat
3. ✅ Télécharge template → Bouton "Download Contract Template"
4. ✅ Upload PDF signé → Formulaire (max 5MB)
5. ✅ Status uploaded → Badge jaune "En attente validation"
6. ✅ Admin voit notification → Badge rouge sur onglet "Contracts"
7. ✅ Admin télécharge PDF → Bouton "View" (compatible Safari)
8. ✅ Admin valide/rejette → Boutons "Validate" / "Reject"
9. ✅ Si validé → Badge vert "✓ Contract Validated"
10. ✅ Si rejeté → Doit re-uploader

---

### **🏠 4 Types de Leads - 100% COMPLET ✅**

**Types disponibles :**
- 🏠 **Sale - Buyer** : Client cherche à acheter
- 🏡 **Sale - Seller** : Propriétaire cherche à vendre
- 🏢 **Rental - Landlord** : Cherche à louer son bien
- 🔑 **Rental - Tenant** : Client cherche à louer

**Statuts distincts :**
- **Ventes** : nouveau → visite → offre → **vendu**
- **Locations** : nouveau → visite → offre → **loué**

---

### **💰 Système de Commissions - 100% COMPLET ✅**

**Taux :**
- **Ventes** : 2% du prix → Commission apporteur : 0.2%
- **Locations** : 5% du loyer annuel → Commission apporteur : 0.5%

**Délais de paiement :**
- **Ventes** : 45-60 jours après Title Deed
- **Locations** : 7-14 jours après Tenancy Contract

---

### **📊 Base de données PostgreSQL - 100% COMPLET ✅**

**Tables :**
- ✅ `profiles` (avec contract_status, contract_file_url)
- ✅ `leads` (avec lead_type, budget, annual_rent)
- ✅ RLS (Row Level Security) **ACTIVÉ** avec politiques optimisées

---

### **📄 Pages Juridiques - 100% COMPLÈTES ✅**

Toutes en français avec design harmonisé :
- ✅ **how-it-works.html** - Comment ça marche
- ✅ **terms.html** - CGU (13 articles)
- ✅ **privacy.html** - Politique de Confidentialité (13 sections)

---

## 🎯 NEXT STEPS

### **🔴 PRIORITÉ 1 - Finaliser Migration Domaine (15 minutes)**

**1. Mettre à jour reset-password.html**

Aller sur GitHub → reset-password.html → Éditer :

Rechercher : `real-estate-referrer-3kp6.vercel.app`  
Remplacer par : `real-estate-referrer.com`

Commit : `fix: Update reset-password.html to use custom domain`

---

**2. Vérifier que tout fonctionne**

Tester :
- ✅ Landing page : https://real-estate-referrer.com
- ✅ Landing page www : https://www.real-estate-referrer.com
- ⏳ Connexion admin
- ⏳ Connexion apporteur
- ⏳ Ajout de lead
- ⏳ "Mot de passe oublié" (flux complet)
- ⏳ Reset password depuis email

---

**3. Supprimer les références à l'ancien domaine Vercel**

Une fois que tout fonctionne, tu peux :
- Retirer l'ancien domaine Vercel des Redirect URLs Supabase (optionnel)
- Garder l'ancien domaine Vercel actif comme backup (recommandé)

---

### **🟡 PRIORITÉ 2 - Sécurité Avancée (30 minutes)**

**Changer l'email admin vers un email réel :**

Sur Supabase SQL Editor :

```sql
UPDATE auth.users
SET email = 'votre-email@reel.com',
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{email}',
      '"votre-email@reel.com"'
    )
WHERE id = 'e9a7f64f-49e2-41fd-86ef-2a37f63e5bf0';
```

---

### **🟢 PRIORITÉ 3 - Email Professionnel (1 jour)**

**Options recommandées :**
- Google Workspace (6 USD/mois) - Recommandé
- Zoho Mail (1-3 USD/mois) - Économique
- ProtonMail (4 USD/mois) - Sécurité maximale

**Emails à créer :**
- contact@real-estate-referrer.com
- admin@real-estate-referrer.com
- support@real-estate-referrer.com (optionnel)

---

### **🟢 PRIORITÉ 4 - Système Multilingue (1-2 semaines)**

Ajouter traductions Anglais + Arabe avec :
- Sélecteur de langue (drapeaux FR 🇫🇷 / EN 🇬🇧 / AR 🇦🇪)
- localStorage (langue persiste après refresh)
- Support RTL pour l'arabe
- Fichiers JSON de traduction

---

### **🟢 PRIORITÉ 5 - Conformité RERA Dubai (2-4 semaines)**

**⚠️ AMENDES JUSQU'À 50,000 AED**

**Requis :**
- Licence RERA (Real Estate Regulatory Agency)
- Examen DREI (Dubai Real Estate Institute)
- Permis publicitaire Trakheesi (5,000 AED)
- Form A avec propriétaires

**Ressources :**
- Site RERA : https://www.reraproperty.ae
- Contact : +971 4 362 2222

---

### **🟢 PRIORITÉ 6 - Personnalisation (1-2 jours)**

- Remplacer "Dubai Real Estate" par votre nom d'agence
- Ajouter votre logo
- Ajouter vos coordonnées (téléphone, adresse)
- Mettre à jour les CGU avec vos informations

---

### **🟢 PRIORITÉ 7 - Tests Utilisateurs (1 semaine)**

- Inviter 2-3 apporteurs bêta
- Tester le cycle complet
- Valider les calculs de commission
- Recueillir les feedbacks

---

### **🟢 PRIORITÉ 8 - Fonctionnalités Avancées (Optionnel)**

- Notifications par Email
- Dashboard Analytics
- Système de Parrainage
- 2FA (Two-Factor Authentication)

---

## 🛠️ MÉTHODE DE TRAVAIL

### **⚠️ RÈGLES CRITIQUES**

**1. Validation étape par étape**
- ✅ **UNE seule modification à la fois**
- ✅ **Toujours valider avec une capture d'écran**
- ❌ Ne JAMAIS enchaîner plusieurs modifications sans validation

**2. Modifications de code HTML**
- ✅ Toujours demander le code complet dans un artifact
- ✅ Remplacer TOUT le contenu du fichier
- ❌ Ne JAMAIS accepter de code partiel avec "..." ou "// reste ici"

**3. Édition sur GitHub**
- ✅ Tous les fichiers sont édités directement sur GitHub
- ✅ Attendre 2-3 minutes après commit pour déploiement Vercel
- ✅ Faire Cmd+Shift+R (Mac) pour vider le cache
- ✅ Envoyer une capture après chaque modification

**4. Messages de commit**
- Format : `fix:` / `feat:` / `docs:` / `refactor:`
- Exemple : `fix: Update domain URLs in reset-password.html`

---

## 📝 Commandes SQL Utiles

**Voir tous les profils :**
```sql
SELECT * FROM profiles;
```

**Voir tous les leads avec noms d'apporteurs :**
```sql
SELECT l.*, p.name as referrer_name
FROM leads l
LEFT JOIN profiles p ON l.referrer_id = p.id;
```

**Statistiques globales :**
```sql
SELECT
  COUNT(*) as total_leads,
  SUM(CASE WHEN status = 'vendu' THEN 1 ELSE 0 END) as ventes,
  SUM(CASE WHEN status = 'loué' THEN 1 ELSE 0 END) as locations,
  SUM(referrer_commission) as commissions_totales
FROM leads;
```

---

## 🆘 Support & Ressources

**Documentation :**
- Supabase : https://docs.supabase.com
- Vercel : https://vercel.com/docs
- Tailwind CSS : https://tailwindcss.com/docs

**RERA Dubai :**
- Site officiel : https://www.reraproperty.ae
- Contact : +971 4 362 2222

---

## 🎉 Historique du Projet

### **18 octobre 2025 - Soir (23h00)**
- ✅ **MIGRATION DOMAINE PERSONNALISÉ COMPLÈTE**
- Configuration DNS OVH (records A + CNAME)
- Ajout domaines sur Vercel
- Configuration Supabase URL Configuration
- Mise à jour index.html avec nouveau domaine
- **Version 5.0.0 - DOMAINE CUSTOM ACTIF** 🎉

### **18 octobre 2025 - Après-midi (14h00)**
- ✅ Système de sécurité mot de passe renforcé
- Validation stricte : 12 caractères minimum
- Indicateur visuel de force
- **Version 4.3.0 - Production Sécurisée**

### **18 octobre 2025 - Matin**
- ✅ Réactivation RLS avec politiques optimisées
- ✅ Correction visualisation PDF (Safari)
- ✅ Correction affichage commissions
- **Version 4.1.0 - Production Sécurisée**

### **17 octobre 2025 - Soir**
- ✅ Création pages juridiques complètes
- **Version 4.0.0 - Production Complète**

### **17 octobre 2025 - Après-midi**
- ✅ Système de validation de contrat complet
- **Version 3.1.0 - Système Complet**

### **17 octobre 2025 - Matin**
- ✅ Ajout des 4 types de leads
- **Version 3.0.0 - Pleinement Fonctionnel**

---

## 🏆 Conclusion

### **✅ Ce qui fonctionne parfaitement**

1. ✅ **Domaine personnalisé actif** (real-estate-referrer.com)
2. ✅ Authentification complète (signup, login, logout)
3. ✅ Sécurité des mots de passe renforcée (12 caractères + critères)
4. ✅ Système "Mot de passe oublié" configuré
5. ✅ Système de contrat de A à Z
6. ✅ 4 types de leads (vente/location × 2)
7. ✅ Calcul automatique des commissions
8. ✅ Dashboard admin et apporteur complets
9. ✅ Storage sécurisé (téléchargement PDF compatible Safari)
10. ✅ Design premium Dubai
11. ✅ Pages juridiques complètes (CGU, Confidentialité, Comment ça marche)
12. ✅ RLS (Row Level Security) activé et fonctionnel
13. ✅ Configuration DNS et Vercel complète
14. ✅ Configuration Supabase mise à jour

### **⏳ À finaliser maintenant (15 min)**

1. ⏳ Mettre à jour reset-password.html avec le nouveau domaine
2. ⏳ Tester le flux "Mot de passe oublié" complet

### **⏳ À faire avant lancement public**

1. 🔐 Changer l'email admin vers un email réel
2. 📧 Configurer email professionnel
3. 🏛️ Obtenir licences RERA
4. 👥 Tests bêta avec 2-3 apporteurs

---

**Dernière mise à jour** : 18 octobre 2025 - 23h30  
**Version** : 5.0.0  
**Status** : 🟢 **Production - Domaine Custom Actif**

