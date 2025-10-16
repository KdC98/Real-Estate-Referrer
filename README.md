# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 17 octobre 2025 - 01:00  
**Version** : 3.0.0  
**Status** : 🟡 **En développement - Multi-langue en cours**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients, suivre les ventes et calculer automatiquement les commissions.

**Personnalisé pour** : **Karyne de Clercq** - Agent immobilier indépendant à Dubai

---

## 🌐 Accès et URLs

### URLs Actuelles
- **Site web temporaire** : https://real-estate-referrer-3kp6.vercel.app
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

### 🆕 Nouveau domaine (à configurer demain 17 octobre)
- **Domaine acheté** : **real-estate-referrer.com**
- **Registrar** : OVH
- **Status** : ⏳ Activation en attente
- **Action requise** : Configuration DNS + Mise à jour Supabase

---

## 🔑 Compte Admin

- **Email** : admin@realestate-referrer.com
- **Mot de passe** : Défini dans Supabase Auth
- **UUID** : 68817a49-b31c-4edf-85fe-691eb33d6014

---

## ✅ ÉTAT ACTUEL DU PROJET (17 octobre 2025)

### 🎨 Interface utilisateur - COMPLET ✅

**Pages créées et déployées :**
- ✅ `index.html` - Landing page avec photos de Dubai
- ✅ `how-it-works.html` - Page "Comment ça marche" complète
- ✅ `terms.html` - Conditions Générales d'Utilisation (15 sections)
- ✅ `privacy.html` - Politique de Confidentialité RGPD (12 sections)
- ✅ `login.html` / `signup.html` - Authentification
- ✅ `dashboard.html` - Dashboard apporteur
- ✅ `admin-dashboard.html` - Dashboard admin

**Design :**
- ✅ Couleurs harmonisées sur toutes les pages (bleu dégradé cohérent)
- ✅ Footer avec liens vers CGU, Privacy, How it works, Contact
- ✅ Photos de Dubai sur la landing page (Burj Khalifa, Marina, Skyline)
- ✅ Design responsive mobile
- ✅ Branding personnalisé : "Karyne de Clercq" partout

### 🌍 Système Multi-langue - EN COURS 🟡

**✅ Ce qui fonctionne :**
- Sélecteur de 6 langues dans le header : 🇫🇷 🇬🇧 🇸🇦 🇷🇺 🇮🇳 🇨🇳
- Traduction instantanée de la landing page (index.html)
- Mémorisation de la langue choisie (localStorage)
- Support RTL (right-to-left) pour l'arabe

**🔴 Ce qui ne fonctionne PAS encore :**
- ❌ Les autres pages (how-it-works, terms, privacy) ne sont pas traduites
- ❌ Quand on change de page et qu'on revient, la langue n'est pas conservée
- ❌ Les liens dans le menu ne conservent pas la langue

**Langues disponibles :**
1. 🇫🇷 Français (par défaut)
2. 🇬🇧 Anglais
3. 🇸🇦 Arabe (avec support RTL)
4. 🇷🇺 Russe
5. 🇮🇳 Hindi
6. 🇨🇳 Chinois

### 🔒 Authentification & Sécurité - COMPLET ✅

- ✅ Système d'authentification sécurisé Supabase Auth
- ✅ Mots de passe hashés (bcrypt via Supabase)
- ✅ Sessions sécurisées avec JWT tokens
- ✅ Inscription avec confirmation du mot de passe
- ✅ Mot de passe oublié : Email de réinitialisation fonctionnel
- ✅ Page de changement de mot de passe
- ✅ Déconnexion sécurisée

### 📊 Base de données - COMPLET ✅

**Structure PostgreSQL via Supabase**

**Table profiles**
- id UUID PRIMARY KEY (référence auth.users)
- name TEXT
- phone TEXT
- role TEXT ('admin' ou 'referrer')
- created_at TIMESTAMP

**Table leads**
- id BIGSERIAL PRIMARY KEY
- referrer_id UUID (référence auth.users)
- client_name TEXT
- client_email TEXT
- client_phone TEXT
- property_type TEXT
- budget NUMERIC
- status TEXT ('nouveau', 'visite', 'offre', 'vendu')
- sale_price NUMERIC
- agent_commission NUMERIC
- referrer_commission NUMERIC
- created_at TIMESTAMP
- closed_at TIMESTAMP

### 💰 Système de commissions - COMPLET ✅

**Modèle de calcul**
```
Vente immobilière
└─ Commission totale : 2% du prix de vente
   ├─ Agence : 50% (1% du prix de vente)
   └─ Agent (Karyne) : 50% (1% du prix de vente)
      ├─ Apporteur : 20% de la part agent
      └─ Karyne : 80% de la part agent
```

**Exemple pour 1,000,000 AED**
- Commission totale : 20,000 AED
- Part agent : 10,000 AED
- **Commission apporteur : 2,000 AED (20%)**
- Reste pour Karyne : 8,000 AED

### 📝 Documentation juridique - CRÉÉE ✅

**✅ CGU (Conditions Générales d'Utilisation)**
- 15 sections juridiques complètes
- Conformité RERA Dubai
- Loi applicable : Émirats Arabes Unis
- Personnalisé avec les infos de Karyne

**✅ Politique de Confidentialité**
- 12 sections complètes
- Conformité RGPD/GDPR
- Protection des données
- Droits des utilisateurs

**✅ Page "Comment ça marche"**
- 5 étapes pour devenir apporteur
- Exemples de gains concrets
- Critères de leads qualifiés
- FAQ (10 questions/réponses)
- Sécurité & transparence

### 🚀 Déploiement - COMPLET ✅

**Stack technique**
- **Frontend** : React 18 (ESM modules via CDN)
- **Styling** : Tailwind CSS (via CDN)
- **Backend/Auth** : Supabase (PostgreSQL + Auth)
- **Hébergement** : Vercel
- **Contrôle de version** : GitHub
- **Déploiement** : Automatique via GitHub → Vercel

---

## ⚠️ PROBLÈMES CONNUS

### 🔴 CRITIQUE

**1. Erreur 404 sur les liens internes**
- **Problème** : Quand on clique sur "Comment ça marche" depuis index.html et qu'on veut se connecter, on obtient une 404
- **Cause** : Les liens pointent vers `/login.html` mais le routage Vercel ne trouve pas le fichier
- **Solution** : Vérifier les chemins des fichiers et configuration Vercel

**2. RLS Désactivé (Row Level Security)**
- **Status** : ⚠️ CRITIQUE - À corriger avant production publique
- **Situation** : Les politiques RLS sont désactivées sur les tables profiles et leads
- **Impact** : Tous les utilisateurs authentifiés peuvent lire/modifier toutes les données
- **Solution prévue** : Réactiver RLS avec fonction PostgreSQL (voir Next Steps)

### 🟡 IMPORTANT

**3. Multi-langue incomplet**
- **Problème** : Seule la landing page (index.html) est traduite
- **Manque** : how-it-works.html, terms.html, privacy.html ne sont pas traduits
- **Impact** : Mauvaise expérience utilisateur si on change de langue

**4. Langue non persistée entre les pages**
- **Problème** : La langue choisie n'est pas conservée quand on navigue
- **Impact** : Utilisateur doit rechoisir la langue à chaque page

**5. Licence RERA en cours**
- **Status** : En cours d'obtention (examen dans 3 semaines)
- **Impact** : Mentions "En cours d'obtention" dans les documents légaux

---

## 🎯 PROCHAINES ÉTAPES

### 🔴 PRIORITÉ 1 - Finir le Multi-langue (17-18 octobre)

**1. Intégrer le système de traduction sur toutes les pages**
- [ ] Ajouter le sélecteur de langue dans how-it-works.html
- [ ] Ajouter le sélecteur de langue dans terms.html
- [ ] Ajouter le sélecteur de langue dans privacy.html
- [ ] Créer les traductions pour chaque page (6 langues × 3 pages)
- [ ] Tester la navigation entre pages avec conservation de la langue

**2. Corriger le problème de persistance de langue**
- [ ] S'assurer que localStorage.getItem('language') fonctionne sur toutes les pages
- [ ] Charger automatiquement la langue sauvegardée au chargement de chaque page
- [ ] Tester le parcours complet : choisir langue → naviguer → revenir

**3. Corriger les liens de navigation (erreur 404)**
- [ ] Vérifier tous les liens internes (href="/login.html" vs href="login.html")
- [ ] Tester tous les liens depuis chaque page
- [ ] Vérifier la configuration Vercel pour le routage

### 🔴 PRIORITÉ 2 - Configuration domaine (17 octobre)

**1. Configurer DNS sur OVH**
Une fois le domaine activé :
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
- [ ] Aller sur Vercel → Settings → Domains
- [ ] Ajouter : real-estate-referrer.com
- [ ] Ajouter : www.real-estate-referrer.com
- [ ] Attendre la propagation DNS (10-30 min)

**3. Mettre à jour Supabase**
```
Site URL : https://real-estate-referrer.com
Redirect URLs : 
- https://real-estate-referrer.com/**
- https://real-estate-referrer.com/reset-password
- https://real-estate-referrer.com/dashboard
```

**4. Tester toutes les fonctionnalités**
- [ ] Accès au site via le nouveau domaine
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Inscription nouveau compte
- [ ] Mot de passe oublié
- [ ] Ajout de lead
- [ ] Modification de status
- [ ] Certificat SSL (HTTPS) actif

### 🟡 PRIORITÉ 3 - Sécurité (Avant lancement public)

**1. Réactiver RLS avec politiques optimisées**

Utiliser une fonction PostgreSQL pour éviter la récursion :

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

**2. Changer le mot de passe admin**
- [ ] Utiliser un mot de passe fort et unique (12+ caractères)
- [ ] Le stocker dans un gestionnaire de mots de passe
- [ ] Ne jamais le partager

**3. Tester toutes les fonctionnalités avec RLS activé**
- [ ] Connexion admin
- [ ] Connexion apporteur
- [ ] Ajout de lead (apporteur)
- [ ] Modification de status (admin)
- [ ] Calcul de commission
- [ ] Affichage des noms d'apporteurs
- [ ] Mot de passe oublié

### 🟢 PRIORITÉ 4 - Email professionnel (Semaine prochaine)

**Configuration email personnalisée**

Options recommandées :
- **Google Workspace** (6 USD/mois) - Recommandé
- **Zoho Mail** (1-3 USD/mois) - Économique
- **ProtonMail** (4 USD/mois) - Sécurité

Emails à créer :
- contact@real-estate-referrer.com ✅ (déjà mentionné)
- admin@real-estate-referrer.com
- support@real-estate-referrer.com (optionnel)

**Configuration dans Supabase :**
- [ ] Settings → Auth → SMTP Settings
- [ ] Utiliser identifiants email professionnel
- [ ] Personnaliser les templates d'emails (Welcome, Reset Password, etc.)

### 🟢 PRIORITÉ 5 - Conformité RERA (3-4 semaines)

**⚠️ CRITIQUE - Amendes jusqu'à 50,000 AED en cas de non-conformité**

Requis obligatoires :
- [ ] **Licence RERA** (Real Estate Regulatory Agency) - Examen dans 3 semaines
- [ ] **Examen DREI** (Dubai Real Estate Institute)
- [ ] **Permis publicitaire Trakheesi** (5,000 AED)
- [ ] **Form A** avec propriétaires (pour chaque bien)

**⚠️ ATTENTION** : Ne pas lancer publiquement sans ces licences !

### 🟢 PRIORITÉ 6 - Tests bêta (Après RERA)

**Phase de tests utilisateurs**
- [ ] Inviter 2-3 apporteurs bêta
- [ ] Tester le cycle complet (inscription → lead → vente → commission)
- [ ] Valider les calculs de commission
- [ ] Recueillir les feedbacks
- [ ] Corriger les bugs éventuels

---

## 📝 NOTES TECHNIQUES

### Configuration Supabase

```javascript
SUPABASE_URL: 'https://cgizcgwhwxswvoodqver.supabase.co'
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Commandes SQL utiles

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
  SUM(referrer_commission) as commissions_totales
FROM leads;

-- Statistiques par apporteur
SELECT 
  p.name,
  COUNT(l.id) as total_leads,
  SUM(CASE WHEN l.status = 'vendu' THEN 1 ELSE 0 END) as ventes,
  SUM(l.referrer_commission) as total_commission
FROM profiles p
LEFT JOIN leads l ON p.id = l.referrer_id
WHERE p.role = 'referrer'
GROUP BY p.name
ORDER BY total_commission DESC;
```

---

## 🆘 SUPPORT & DÉPANNAGE

### Ressources officielles
- **Supabase Docs** : https://docs.supabase.com
- **Vercel Docs** : https://vercel.com/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **React Docs** : https://react.dev

### RERA Dubai
- **Site officiel** : https://www.reraproperty.ae
- **Contact** : +971 4 362 2222
- **Email** : info@reraproperty.ae

---

## 🎉 HISTORIQUE DU PROJET

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
- ✅ **CORRECTION MAJEURE** : Affichage des noms d'apporteurs
- Désactivation RLS pour résoudre récursion infinie
- Création des profils manquants
- Application 100% fonctionnelle
- **Version 2.1.0 - Production stable**

**16 octobre 2025 - Soir**
- ✅ Création des CGU complètes (15 sections)
- ✅ Création de la Politique de Confidentialité (12 sections)
- ✅ Achat du domaine : **real-estate-referrer.com** (OVH)
- Préparation configuration domaine
- **Version 2.2.0 - Domaine acheté**

**17 octobre 2025 - Nuit**
- ✅ Personnalisation complète : "Karyne de Clercq"
- ✅ Harmonisation des couleurs sur toutes les pages
- ✅ Création page "Comment ça marche" complète
- ✅ Ajout photos de Dubai sur landing page
- ✅ Footer avec liens CGU/Privacy/Contact
- ✅ Début système multi-langue (6 langues)
- ⚠️ Multi-langue incomplet (seulement index.html)
- ⚠️ Problèmes navigation entre pages
- **Version 3.0.0 - Multi-langue en cours**

---

## 🏆 RÉSUMÉ

### ✅ Ce qui fonctionne PARFAITEMENT

- Application 100% fonctionnelle (auth, dashboards, leads, commissions)
- Design professionnel et cohérent sur toutes les pages
- Documentation juridique complète (CGU, Privacy, How it works)
- Branding personnalisé "Karyne de Clercq"
- Photos de Dubai attractives
- Calcul automatique des commissions
- Système multi-langue sur la landing page (6 langues)

### 🟡 Ce qui est EN COURS

- Multi-langue sur les autres pages (how-it-works, terms, privacy)
- Persistance de la langue entre les pages
- Configuration du domaine real-estate-referrer.com

### 🔴 Ce qu'il faut CORRIGER en priorité

1. **Finir le multi-langue** (toutes les pages + persistance)
2. **Corriger les liens de navigation** (erreur 404)
3. **Configurer le domaine** (DNS + Vercel + Supabase)
4. **Réactiver RLS** (sécurité base de données)

### ⏳ Ce qui viendra PLUS TARD

- Configuration email professionnel
- Obtention licence RERA (3 semaines)
- Tests bêta avec vrais apporteurs
- Lancement public officiel

---

## 📞 Contact

**Agent** : Karyne de Clercq  
**Email** : contact@real-estate-referrer.com  
**Téléphone** : +971 58 587 0448  
**Localisation** : Dubai, United Arab Emirates  
**Licence RERA** : En cours d'obtention (examen prévu dans 3 semaines)

---

**Dernière mise à jour** : 17 octobre 2025 - 01:00  
**Version** : 3.0.0  
**Status** : 🟡 En développement - Multi-langue en cours

**🚀 On reprend demain pour finaliser le multi-langue et configurer le domaine !**
