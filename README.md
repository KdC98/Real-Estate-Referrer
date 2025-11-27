# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 28 novembre 2025 - 00h20  
**Version** : 3.4.1  
**Status** : 🟢 **Fonctionnel - En production**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs dans 8 langues, gérer les leads clients, suivre les ventes et calculer automatiquement les commissions avec système 2FA SMS obligatoire.

**Langues supportées** : 🇫🇷 Français, 🇬🇧 English, 🇦🇪 العربية, 🇷🇺 Русский, 🇮🇳 हिन्दी, 🇵🇰 اردو, 🇨🇳 中文, 🇵🇭 Tagalog

---

## 🌐 Accès et URLs

| Service | URL |
|---------|-----|
| **Site web** | https://real-estate-referrer.com |
| **GitHub** | https://github.com/KdC98/Real-Estate-Referrer |
| **Supabase** | https://cgizcgwhwxswvoodqver.supabase.co |
| **Vercel** | Auto-deploy depuis GitHub |

---

## ✅ CE QUI FONCTIONNE (100%)

### Core Features
| Fonctionnalité | Status |
|----------------|--------|
| Landing page multilingue (8 langues) | ✅ |
| Inscription avec 2FA SMS (Itooki.fr) | ✅ |
| Page 2FA multilingue (8 langues) | ✅ |
| Connexion email/mot de passe | ✅ |
| OAuth Google & Apple | ✅ |
| Mot de passe oublié | ✅ |
| Changement mot de passe | ✅ |

### Dashboard
| Fonctionnalité | Status |
|----------------|--------|
| Dashboard apporteur | ✅ |
| Dashboard admin avec colonne "Apporteur" | ✅ |
| Ajout de leads (4 types) | ✅ |
| Checkbox consentement RGPD | ✅ |
| Suivi statuts (New → Viewing → Offer → Sold) | ✅ |

### Contrats
| Fonctionnalité | Status |
|----------------|--------|
| Signature électronique du contrat | ✅ |
| Canvas signature corrigé (desktop + mobile) | ✅ |
| Upload contrats PDF | ✅ |
| Bandeau "Contrat signé et validé" | ✅ |

### Commissions
| Fonctionnalité | Status |
|----------------|--------|
| Calcul ventes : 2-5% ajustable (off-plan) | ✅ |
| Calcul locations : 5% fixe | ✅ |
| Commission acheteur : 25% | ✅ |
| Commission autres : 20% | ✅ |

### Pages statiques
| Page | Status |
|------|--------|
| how-it-works.html (8 langues, montants à jour) | ✅ |
| terms.html (CGU) | ✅ |
| privacy.html | ✅ |
| contract-signature.html | ✅ |

---

## 💰 Système de Commissions (v3.4)

### Types de leads et commissions

| Type de Lead | Commission Apporteur | Priorité |
|--------------|---------------------|----------|
| 🏆 **ACHETEUR (Buyer)** | **25%** | ⭐ PREMIUM - Mis en avant |
| Vendeur (Seller) | 20% | Standard |
| Propriétaire bailleur (Landlord) | 20% | Standard |
| Locataire (Tenant) | 20% | Standard |

### Calcul pour les VENTES

```
Vente d'un bien à 2,000,000 AED (taux 2% par défaut)
├─ Commission totale : 40,000 AED (2%)
├─ Part agent : 20,000 AED (50%)
└─ Commission apporteur :
   - Si ACHETEUR (25%) → 5,000 AED ⭐
   - Si VENDEUR (20%)  → 4,000 AED

Vente OFF-PLAN à 2,000,000 AED (taux 5%)
├─ Commission totale : 100,000 AED (5%)
├─ Part agent : 50,000 AED (50%)
└─ Commission apporteur :
   - Si ACHETEUR (25%) → 12,500 AED ⭐
```

### Calcul pour les LOCATIONS

```
Location annuelle 300,000 AED
├─ Commission totale : 15,000 AED (5% fixe)
├─ Part agent : 7,500 AED (50%)
└─ Commission apporteur (20%) : 1,500 AED
```

---

## 🟠 PRIORITÉ 2 - À FAIRE

### Notifications Email

Envoyer des emails automatiques quand :

| Événement | Destinataire | Contenu |
|-----------|--------------|---------|
| Nouveau lead ajouté | Admin | Nom client, apporteur, type |
| Statut lead change | Apporteur | Nouveau statut, prochaines étapes |
| Vente conclue | Apporteur | Montant commission, délai paiement |

**Solution technique** : Supabase Edge Functions + Resend ou SendGrid

---

## 🟡 PRIORITÉ 3 - Avant lancement public

### Licence RERA requise

| Étape | Temps estimé | Coût |
|-------|--------------|------|
| Formation DREI | 2-3 jours | ~3,000 AED |
| Examen RERA | 1 jour | ~500 AED |
| Permis Trakheesi | 1-2 semaines | ~5,000 AED |
| **Total** | **2-4 semaines** | **~8,500 AED** |

---

## 🔵 Améliorations optionnelles

| Amélioration | Description | Priorité |
|--------------|-------------|----------|
| 📊 Analytics | Google Analytics ou Plausible | Basse |
| 📱 PWA | App installable sur mobile | Basse |
| 🔔 Push notifications | Alertes en temps réel | Moyenne |
| 📄 Export PDF | Rapports pour apporteurs | Basse |
| 💳 Paiements auto | Intégration Stripe | Future |

---

## 📊 Base de données

### Table `profiles`
```sql
id UUID PRIMARY KEY
name TEXT
phone TEXT UNIQUE
email TEXT
role TEXT ('admin' ou 'referrer')
contract_status TEXT ('pending', 'signed', 'validated')
contract_path TEXT
contract_file_url TEXT
contract_signed_at TIMESTAMP
phone_verified BOOLEAN
created_at TIMESTAMP
```

### Table `leads`
```sql
id BIGSERIAL PRIMARY KEY
referrer_id UUID REFERENCES profiles(id)
client_name TEXT
client_email TEXT
client_phone TEXT
lead_type TEXT ('sale_buyer', 'sale_seller', 'rental_landlord', 'rental_tenant')
budget NUMERIC
status TEXT ('new', 'contacted', 'viewing', 'offer', 'sold', 'lost')
client_consent BOOLEAN DEFAULT true
commission_rate NUMERIC (0.25 ou 0.20)
sale_price NUMERIC
agent_commission NUMERIC
referrer_commission NUMERIC
created_at TIMESTAMP
closed_at TIMESTAMP
```

### Table `verification_codes`
```sql
id UUID PRIMARY KEY
phone TEXT
code TEXT
expires_at TIMESTAMP
used BOOLEAN DEFAULT false
verified BOOLEAN DEFAULT false
attempts INTEGER DEFAULT 0
user_id UUID
created_at TIMESTAMP
```

### Table `pending_signups`
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE
password TEXT
name TEXT
phone TEXT UNIQUE
expires_at TIMESTAMP
created_at TIMESTAMP
```

### RLS (Row Level Security)
- ✅ 26 politiques actives
- ✅ Testées et fonctionnelles

---

## 🚀 Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Vanilla JS + ESM modules |
| Styling | Tailwind CSS (via CDN) |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| SMS 2FA | Itooki.fr API |
| Hébergement | Vercel (auto-deploy) |
| Domaine | OVH (real-estate-referrer.com) |
| i18n | i18next (8 langues) |

---

## 📁 Structure des fichiers

```
Real-Estate-Referrer/
├── index.html                 # App principale (SPA)
├── how-it-works.html          # Page explicative
├── contract-signature.html    # Signature électronique
├── terms.html                 # CGU
├── privacy.html               # Politique de confidentialité
├── js/
│   ├── config.js              # Configuration Supabase
│   ├── auth.js                # Authentification
│   ├── 2fa.js                 # Vérification SMS
│   ├── dashboard.js           # Logique dashboard
│   ├── leads.js               # Gestion des leads
│   ├── rendering.js           # Génération HTML
│   ├── validation.js          # Validation formulaires
│   └── utils.js               # Fonctions utilitaires
├── locales/
│   ├── en/                    # Anglais
│   ├── fr/                    # Français
│   ├── ar/                    # Arabe
│   ├── ru/                    # Russe
│   ├── hi/                    # Hindi
│   ├── ur/                    # Ourdou
│   ├── zh/                    # Chinois
│   └── tl/                    # Tagalog
└── vercel.json                # Config déploiement
```

---

## 🎉 Historique des versions

| Date | Version | Changements |
|------|---------|-------------|
| 14-16 oct | v2.1.0 | Création initiale, Auth Supabase |
| 31 oct | v2.2.0 | Upload contrats, Storage RLS |
| 22 nov | v3.0.0 | 2FA SMS, Edge Function |
| 23 nov | v3.0.5 | Intégration frontend 2FA |
| 24 nov | v3.1.0 | Corrections console, 2FA 100% |
| 25 nov | v3.2.0 | Traductions dashboard, signature électronique |
| 26 nov | v3.3.0 | Nouveau formulaire leads 25%/20%, checkbox RGPD |
| **27 nov** | **v3.4.0** | Calculs commissions corrigés, colonne Apporteur |
| **28 nov** | **v3.4.1** | Page 2FA multilingue, bouton retour corrigé |

---

## 🐛 Bugs corrigés (27-28 novembre 2025)

| Bug | Solution | Status |
|-----|----------|--------|
| Calcul location utilisait 1% au lieu de 5% | Nouveau système dans `leads.js` | ✅ |
| Pas de colonne Apporteur dans admin | Ajout colonne + requête SQL | ✅ |
| Message succès 2FA en anglais | Forcer langue actuelle | ✅ |
| Bouton "Changer mot de passe" désactivé | Fix `validation.js` pour mode change-password | ✅ |
| Curseur signature décalé | Conversion coordonnées canvas | ✅ |
| Page 2FA en anglais | Traductions directes 8 langues dans `rendering.js` | ✅ |
| Bouton retour 2FA ne fonctionnait pas | Fonction `backTo2FASignup()` | ✅ |
| Numéro affichait `{{phone}}` | Interpolation directe dans template | ✅ |
| Traductions how-it-works obsolètes | Mise à jour 8 langues avec 25% | ✅ |

---

## 🔐 Accès Admin

| Email | Mot de passe |
|-------|--------------|
| karyne.declercq@icloud.com | wyqsuc-Necxur-1pedpy@# |

---

## 📞 Pour reprendre le développement

1. Ouvrir ce README
2. Vérifier la version actuelle sur GitHub
3. Consulter la section "À FAIRE" pour les prochaines priorités
4. Tester en navigation privée après chaque déploiement

---

**Dernière mise à jour** : 28 novembre 2025 - 00h20  
**Version** : 3.4.1  
**Prochaine priorité** : Notifications email
