# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 17 octobre 2025  
**Version** : 3.0.0  
**Status** : 🟢 **En production - Pleinement fonctionnel**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients (ventes ET locations), suivre les transactions et calculer automatiquement les commissions.

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

---

## ✅ ÉTAT ACTUEL DU PROJET (17 octobre 2025)

### 🎯 Fonctionnalités Complètes

#### 1. **Authentification & Sécurité - 100% COMPLET** ✅
- ✅ Système d'authentification sécurisé Supabase Auth
- ✅ Mots de passe hashés automatiquement (bcrypt)
- ✅ Sessions sécurisées avec JWT tokens
- ✅ Inscription avec confirmation du mot de passe
- ✅ Connexion sécurisée (admin + apporteurs)
- ✅ Mot de passe oublié avec email de réinitialisation
- ✅ Page de changement de mot de passe
- ✅ Déconnexion sécurisée avec nettoyage de session
- ✅ Création automatique du profil utilisateur

#### 2. **4 Types de Leads - 100% COMPLET** ✅
L'application gère maintenant 4 types de leads distincts :

**Ventes :**
- 🏠 **Vente - Acheteur** : Client cherche à acheter
- 🏡 **Vente - Vendeur** : Propriétaire cherche à vendre

**Locations :**
- 🏢 **Location - Propriétaire** : Cherche à louer son bien
- 🔑 **Location - Locataire** : Client cherche à louer

#### 3. **Statuts Distincts - 100% COMPLET** ✅
- **Pour les ventes** : nouveau → visite → offre → **vendu**
- **Pour les locations** : nouveau → visite → offre → **loué**
- ✅ Dropdown adapté selon le type de lead
- ✅ Badges colorés pour chaque statut
- ✅ Boutons adaptés ("Marquer vendu" / "Marquer loué")

#### 4. **Système de Commissions - 100% COMPLET** ✅

**Structure :**
```
Transaction immobilière (vente ou location)
└─ Commission totale
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

#### 5. **Base de données - 100% COMPLET** ✅

**Table `profiles` :**
```sql
- id UUID PRIMARY KEY (référence auth.users)
- name TEXT
- phone TEXT
- role TEXT ('admin' ou 'referrer')
- created_at TIMESTAMP
- contract_status TEXT (pour futur système de validation)
- contract_validated_at TIMESTAMP
```

**Table `leads` :**
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
- Création automatique d'un profil dans `profiles` lors de l'inscription
- Liaison automatique avec `auth.users`

#### 6. **Interface Utilisateur - 100% COMPLET** ✅

**Landing Page :**
- Design premium "Dubai Real Estate"
- Gradient bleu/or élégant
- Call-to-action clair
- Exemples de gains (6K, 10K, 20K AED)
- Stats du programme (20%, 24/7, 48h)
- Responsive mobile

**Dashboard Apporteur :**
- Statistiques personnelles :
  - Gains totaux (AED)
  - Leads en cours
  - Ventes/Locations conclues
- Bouton "Ajouter un lead"
- Formulaire dynamique selon le type de lead :
  - Budget d'achat (vente acheteur)
  - Prix de vente souhaité (vente vendeur)
  - Budget de loyer annuel (location locataire)
  - Loyer annuel souhaité (location propriétaire)
- Table de tous les leads avec :
  - Type de lead avec emoji
  - Statut avec badge coloré
  - Commission gagnée

**Dashboard Admin :**
- Vue d'ensemble globale :
  - Nombre d'apporteurs
  - Leads actifs
  - Ventes/Locations totales
  - Commissions versées
- Table de tous les leads avec :
  - Nom de l'apporteur
  - Type de lead
  - Informations client complètes
  - Dropdown pour changer le statut
  - Bouton adapté ("Marquer vendu" ou "Marquer loué")
  - Calcul automatique des commissions

#### 7. **Supabase Storage - CONFIGURÉ** ✅
- ✅ Bucket "Contracts" créé
- ✅ Policies de sécurité configurées :
  - Apporteurs peuvent uploader leur contrat
  - Apporteurs peuvent lire leur propre contrat
  - Admin peut lire tous les contrats
- ⏳ Intégration dans l'interface en attente

---

## 🚀 Stack Technique

- **Frontend** : React 18 (ESM modules via CDN)
- **Styling** : Tailwind CSS (via CDN)
- **Backend/Auth** : Supabase (PostgreSQL + Auth + Storage)
- **Hébergement** : Vercel
- **Contrôle de version** : GitHub
- **Déploiement** : Automatique via GitHub → Vercel

---

## ⚠️ POINTS D'ATTENTION

### 🔓 Row Level Security (RLS) Désactivé
**Status** : ⚠️ **À activer avant lancement public**

**Situation actuelle :**
- Les politiques RLS sont désactivées sur les tables `profiles` et `leads`
- Tous les utilisateurs authentifiés peuvent théoriquement accéder à toutes les données
- Pas de séparation au niveau base de données entre admin et apporteurs

**Pourquoi :**
- Les politiques initiales causaient des problèmes de récursion
- Désactivation temporaire pour assurer le bon fonctionnement

**Impact :**
- ✅ L'application fonctionne parfaitement
- ⚠️ Sécurité optimale nécessite RLS activé
- ⚠️ Recommandé pour production publique avec plusieurs utilisateurs

---

## 🎯 NEXT STEPS

### 🔴 PRIORITÉ 1 - Configuration Domaine (Quand actif chez OVH)

**1. Configurer DNS sur OVH**

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

**2. Configurer Vercel**
- Aller sur Vercel → Settings → Domains
- Ajouter : `real-estate-referrer.com`
- Ajouter : `www.real-estate-referrer.com`
- Attendre la propagation DNS (10-30 min)

**3. Mettre à jour Supabase**

Dans Supabase → Authentication → URL Configuration :
- **Site URL** : `https://real-estate-referrer.com`
- **Redirect URLs** :
  - `https://real-estate-referrer.com/**`
  - `https://www.real-estate-referrer.com/**`

**4. Tester**
- [ ] Accès au site via le nouveau domaine
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Inscription nouveau compte
- [ ] Mot de passe oublié
- [ ] Ajout de lead (4 types)
- [ ] Modification de statut
- [ ] Certificat SSL (HTTPS) actif

---

### 🔴 PRIORITÉ 2 - Système de Validation de Contrat (Optionnel)

**Objectif :** Conformité RERA - Les apporteurs doivent signer un contrat avant d'ajouter des leads.

**Flux proposé :**
1. Nouvel apporteur s'inscrit → Status "pending"
2. Dashboard bloqué avec message + bouton télécharger contrat
3. Apporteur télécharge, signe et upload le contrat PDF
4. Admin voit le contrat dans un onglet "Contrats à valider"
5. Admin valide → Status "validated"
6. Apporteur peut maintenant ajouter des leads

**Modifications nécessaires :**
- [ ] Interface d'upload de contrat (apporteur)
- [ ] Onglet "Contrats à valider" (admin)
- [ ] Système de validation/rejet (admin)
- [ ] Blocage d'ajout de leads si contrat non validé
- [ ] Template de contrat PDF à créer

**Temps estimé :** 3-4 heures de développement

---

### 🟡 PRIORITÉ 3 - Documentation Juridique (1 semaine)

#### 1. **Conditions Générales d'Utilisation (CGU)**

**Sections obligatoires :**
1. Définitions (Apporteur, Lead, Commission)
2. Inscription et validation
3. Programme de référencement
4. Commissions (taux, délais, modalités)
5. Obligations de l'apporteur
6. Obligations de l'agent
7. Propriété intellectuelle
8. Résiliation
9. Responsabilité
10. Données personnelles (RGPD/GDPR)
11. Loi applicable (Émirats Arabes Unis)

**Éléments à personnaliser :**
- [ ] Nom de votre agence
- [ ] Numéro de licence RERA
- [ ] Email de contact professionnel
- [ ] Téléphone professionnel
- [ ] Adresse à Dubai

**Délais de paiement à définir dans les CGU :**
- Ventes : Entre 45-60 jours après signature du Title Deed
- Locations : Entre 7-14 jours après signature du Tenancy Contract

#### 2. **Page "Comment ça marche"**

Créer une page explicative avec :
- 🎯 Comment devenir apporteur (5 étapes)
- 💰 Exemples de gains concrets (ventes + locations)
- 📋 Critères d'un bon lead
- 🔒 Sécurité & transparence
- ❓ FAQ (10-15 questions/réponses)

#### 3. **Politique de confidentialité (RGPD)**

**Sections obligatoires :**
- Données collectées (nom, email, téléphone, etc.)
- Utilisation des données
- Partage des données
- Sécurité des données
- Droits des utilisateurs
- Gestion des cookies
- Contact pour questions RGPD

#### 4. **Intégration dans le site**
- [ ] Créer page `/terms` (CGU)
- [ ] Créer page `/privacy` (Politique de confidentialité)
- [ ] Créer page `/how-it-works` (Comment ça marche)
- [ ] Ajouter footer avec liens vers ces pages
- [ ] Ajouter checkbox "J'accepte les CGU" à l'inscription

---

### 🟡 PRIORITÉ 4 - Sécurité Base de Données (1-2 heures)

**1. Réactiver RLS avec fonction PostgreSQL**

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
CREATE POLICY "Utilisateurs lisent leur profil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Utilisateurs modifient leur profil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins lisent tous les profils"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Politiques pour leads
CREATE POLICY "Apporteurs lisent leurs leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR is_admin());

CREATE POLICY "Apporteurs créent leurs leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins gèrent tous les leads"
  ON leads FOR ALL
  TO authenticated
  USING (is_admin());
```

**2. Tester toutes les fonctionnalités avec RLS activé**
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Ajout de lead (4 types)
- [ ] Modification de statut
- [ ] Calcul de commission
- [ ] Affichage des noms d'apporteurs
- [ ] Mot de passe oublié

**3. Changer le mot de passe admin**
- [ ] Utiliser un mot de passe fort (12+ caractères)
- [ ] Le stocker dans un gestionnaire de mots de passe
- [ ] Ne jamais le partager

---

### 🟢 PRIORITÉ 5 - Avant Lancement Public (2-4 semaines)

#### 1. **Configuration Email Professionnelle**

**Options recommandées :**
- Google Workspace (6 USD/mois) - Recommandé
- Zoho Mail (1-3 USD/mois) - Économique
- ProtonMail (4 USD/mois) - Sécurité maximale

**Emails à créer :**
- `contact@real-estate-referrer.com`
- `admin@real-estate-referrer.com`
- `support@real-estate-referrer.com` (optionnel)

#### 2. **Personnalisation de l'Application**
- [ ] Remplacer "Dubai Real Estate" par votre nom d'agence
- [ ] Ajouter votre logo
- [ ] Ajouter vos coordonnées (téléphone, adresse)
- [ ] Personnaliser les couleurs si souhaité
- [ ] Ajouter photo de profil admin

#### 3. **Conformité RERA Dubai** ⚠️ **CRITIQUE**

**⚠️ AMENDES JUSQU'À 50,000 AED EN CAS DE NON-CONFORMITÉ**

**Requis obligatoires :**
- [ ] **Licence RERA** (Real Estate Regulatory Agency)
- [ ] **Examen DREI** (Dubai Real Estate Institute)
- [ ] **Permis publicitaire Trakheesi** (5,000 AED)
- [ ] **Form A** avec propriétaires (pour chaque bien)

**🚨 ATTENTION : Ne lancez pas publiquement sans ces licences !**

#### 4. **Tests Utilisateurs**
- [ ] Inviter 2-3 apporteurs bêta
- [ ] Tester le cycle complet (inscription → lead → transaction → commission)
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
  COUNT(l.id) as total_leads,
  SUM(CASE WHEN l.status = 'vendu' THEN 1 ELSE 0 END) as ventes,
  SUM(CASE WHEN l.status = 'loué' THEN 1 ELSE 0 END) as locations,
  SUM(l.referrer_commission) as total_commission
FROM profiles p
LEFT JOIN leads l ON p.id = l.referrer_id
WHERE p.role = 'referrer'
GROUP BY p.name
ORDER BY total_commission DESC;
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

### 14-15 octobre 2025
- Création initiale
- Problèmes d'authentification

### 15 octobre 2025
- Migration vers Supabase Auth
- Première version déployée

### 16 octobre 2025 - Matin
- Ajout "Mot de passe oublié"
- Flux de reset password complet

### 16 octobre 2025 - Après-midi
- Correction affichage des noms d'apporteurs
- Désactivation RLS pour résoudre récursion
- Version 2.1.0 - Production stable

### 16 octobre 2025 - Soir
- Création des CGU complètes
- Achat du domaine real-estate-referrer.com
- Version 2.2.0

### 17 octobre 2025 - Matin
- **AJOUT DES 4 TYPES DE LEADS** ✅
  - 2 types de vente (acheteur/vendeur)
  - 2 types de location (propriétaire/locataire)
- **AJOUT STATUT "LOUÉ"** ✅
  - Statuts distincts pour ventes et locations
  - Boutons adaptés selon le type
- **CALCULS AUTOMATIQUES** ✅
  - Ventes : 2% du prix
  - Locations : 5% du loyer annuel
- Configuration Supabase Storage (bucket Contracts)
- Correction clé API Supabase
- **Version 3.0.0 - PLEINEMENT FONCTIONNEL** 🎉

---

## 🏆 Conclusion

### ✅ Ce qui fonctionne parfaitement
- Application 100% fonctionnelle avec 4 types de leads
- Authentification sécurisée
- Dashboard admin et apporteur complets
- Calcul automatique des commissions (ventes + locations)
- Statuts "vendu" et "loué" distincts
- Design premium Dubai
- Domaine professionnel acheté
- Création automatique des profils utilisateurs

### ⏳ À faire avant lancement public
1. ⏰ Configurer DNS → Vercel (quand domaine actif)
2. 📝 Créer et intégrer CGU + Politique de confidentialité
3. 📖 Créer page "Comment ça marche"
4. 🔒 Réactiver RLS (sécurité base de données)
5. 🏛️ Obtenir licences RERA
6. 👥 Phase de tests bêta (2-3 apporteurs)
7. 🔐 (Optionnel) Système de validation de contrat

### 🚀 Prêt pour
- Tests internes avec apporteurs de confiance
- Démonstrations clients
- Ajout de leads réels
- Suivi des commissions

---

**📞 Contact**  
Pour toute question sur le projet, consultez cette documentation ou contactez le développeur.

**Dernière mise à jour** : 17 octobre 2025  
**Version** : 3.0.0  
**Status** : 🟢 **Production - Pleinement fonctionnel**
