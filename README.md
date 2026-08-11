# 📋 README — Real Estate Referrer

**Dernière mise à jour :** 10 août 2026
**Version :** 3.25.6 (app) / leads.js 3.6.3 / rendering.js 3.23.0
**Status :** 🟢 En production — Fonctionnel, sécurisé, testé de bout en bout

---

## 📌 Description
Application web de gestion d'apporteurs d'affaires immobilier à Dubaï. Permet de recruter des apporteurs, gérer les leads clients, suivre les ventes et calculer automatiquement les commissions.

**Langue :** Anglais uniquement (les autres langues ont été retirées le 8 août 2026).

---

## 🌐 Accès et URLs
- **Site web :** https://real-estate-referrer.com
- **GitHub :** https://github.com/KdC98/Real-Estate-Referrer (branche `main`)
- **Supabase :** https://cgizcgwhwxswvoodqver.supabase.co (projet « Real-Estate-Referrer », région eu-west-1, plan **PRO**)
- **Hébergement :** Vercel (déploiement automatique depuis GitHub → `main`)

### 📤 Rappel déploiement (important)
Upload GitHub en **2 endroits distincts** :
- `index.html` et les `.html` racine → **racine** : `.../upload/main`
- Les fichiers JS (`leads.js`, `dashboard.js`, `rendering.js`, `config.js`) → **dossier `js/`** : `.../upload/main/js`
> ⚠️ Ne jamais glisser les fichiers JS à la racine : ils doivent atterrir dans `js/`, sinon le site casse. Après upload, vérifier le n° de `// Version:` en tête du fichier sur GitHub pour confirmer qu'il est bien monté.

---

## 🪪 Identité & Conformité
- **Courtière :** Karyne de Clercq
- **Agence :** Solo Gate Real Estate (Alliance by EMAAR)
- **BRN (RERA) :** **94777**
- **Permis annonceur réseaux sociaux (National Media Authority) :** n° **8159983** — valable jusqu'au **12 mars 2027** (couvre LinkedIn / Facebook / Instagram)

> Les identifiants personnels (Emirates ID, Media File Number, Trade License) ne sont volontairement pas stockés ici, le dépôt étant public.

---

## 🔐 Sécurité (COMPLÉTÉE le 10 août 2026)
- ✅ **RLS activée sur `leads`** — policies `leads_select / insert / update / delete` (chaque apporteur ne voit/gère que ses leads ; l'admin voit tout). Suppression autorisée au propriétaire OU à l'admin.
- ✅ **RLS activée sur `profiles`** — policies `profiles_select / insert / update` : chaque utilisateur ne gère que **son propre profil** (`id = auth.uid()`), l'admin gère tout. **Ces policies étaient le chaînon manquant** qui bloquait la complétion de profil des apporteurs (erreur 409).
- ✅ **Fonction `public.is_admin()`** — SECURITY DEFINER STABLE, évite la récursion RLS.
- ✅ **Anti-bot CAPTCHA Cloudflare Turnstile** sur login / signup / reset. Site Key `0x4AAAAAAEL_sdyN59YOdeJP` (publique, dans index.html) ; Secret Key dans Supabase → Auth → Attack Protection. La connexion Apple/Google ne passe pas par le CAPTCHA (garantit l'accès admin).
- ✅ **Migration des clés API Supabase** : le site utilise désormais la **clé publishable** `sb_publishable_djUSMqQj2fmuyU20mb5iZg_zvTTqY06` (dans `js/config.js` + 4 pages HTML). Les **clés legacy (anon/service_role) sont DÉSACTIVÉES**.
- ✅ **Clé `service_role` compromise révoquée** — elle avait fuité dans l'historique Git (alerte GitHub Secret Scanning). Neutralisée en désactivant les clés legacy. Alerte GitHub fermée (Revoked). Anciennes PR obsolètes fermées.
- **Admin :** compte `karyne.declercq@icloud.com` (rôle `admin` dans la table `profiles`), connexion via Apple.

> ⚠️ **Ne jamais committer** : la clé `service_role`, un mot de passe SMTP, ou le fichier Apple `.p8`. La clé anon/publishable, elle, est publique par design (protégée par la RLS).

---

## 🔑 Authentification
- ✅ Email + mot de passe **avec vérification par email**
- ✅ Connexion **Google** (OAuth) et **Apple** (Sign in with Apple)
- ❌ SMS 2FA supprimé (remplacé par la vérification email)
- Le lien de confirmation email ramène proprement sur la **page de connexion** (`?login=1`) — fonctionne quel que soit le navigateur qui ouvre le lien (on n'exécute pas l'échange PKCE pour ces liens).

---

## 📧 Emails (Resend) — habillés à la marque
Envoi via **Resend** (SMTP dans Supabase → Auth → Emails) : host `smtp.resend.com`, port 465, user `resend`, domaine `notifications.real-estate-referrer.com`, expéditeur `noreply@notifications.real-estate-referrer.com`.

**8 templates HTML aux couleurs du site (fond quasi-noir #0b0d12 + or #facc15)** collés dans Supabase :
1. Confirm sign up · 2. Invite user · 3. Magic link/OTP · 4. Change email · 5. Reset password · 6. Reauthentication (code 6 chiffres) · 7. Password changed · 8. Email address changed.

> ⚠️ **À améliorer :** délivrabilité (spam) → ajouter un enregistrement **DMARC** au DNS.

---

## 🍎 Connexion Apple — MAINTENANCE
Clé secrète Apple = JWT qui **expire tous les 6 mois**. **Prochaine expiration : 4 février 2027** (rappel auto programmé le 20 janvier 2027).
Régénération (Supabase → Auth → Providers → Apple → Secret Key) : Services ID `com.realestate.referrer.web`, Key ID `8R228NMSP7`, Team ID `2FW34576RD`, fichier `.p8` privé (`AuthKey_8R228NMSP7.p8`).

---

## 💰 Commissions apporteur
Base de calcul = **part agent NETTE** de Karyne (≈ 1 % du prix, Solo Gate prenant la moitié).
- **Acheteur** → 25 % de la part agent nette
- **Vendeur (bien à vendre)** → **1 000 AED fixe**, versé quand le bien est vendu
- **Propriétaire bailleur** → 20 % · **Locataire** → 20 %

Les **4 types de leads sont activés** (`ENABLED_LEAD_TYPES` dans `js/leads.js`).

---

## 🧾 Gestion des leads (ajouté le 10 août 2026)
Formulaire « Add Lead » complet :
- **4 types** : Buyer / Seller / Landlord / Tenant (Buyer pré-sélectionné et pris en compte automatiquement)
- **Type de bien** (Apartment / Villa / Townhouse / Penthouse / Plot / Office / Other), **Chambres** (Studio → 5+), **Quartier** (colonnes DB `property_type`, `bedrooms`, `location_area`)
- **Budget** avec séparateurs de milliers pendant la frappe
- **Téléphone international** (+971 par défaut, autres pays possibles, intl-tel-input)
- **Edit / Delete** d'un lead (apporteur sur ses leads non vendus ; admin toujours) — détails du bien affichés sous le type dans le tableau
- **Popups de succès habillées** (dark + or, coche verte) au lieu des alertes natives — via `window.showNiceModal()` dans index.html.

> 🐞 **Bug résolu majeur :** un **formulaire « Add Lead » dupliqué existait dans `rendering.js`** (limité à 1 seul type, sans les champs bien) et masquait la bonne version de `leads.js`. Il a été **retiré de `rendering.js`** → `leads.js` (`renderAddLeadModal`) est désormais la **source unique** du formulaire.

---

## 🚀 Stack technique
Frontend : modules JavaScript (ESM via CDN) + Tailwind CSS (CDN). Backend/Auth/Storage : Supabase (PostgreSQL + RLS). Emails : Resend. Hébergement : Vercel (auto-deploy GitHub). Cache-busting via `?v=` sur les imports JS dans `index.html`.

---

## 🕓 Historique récent
**10 août 2026 — Sécurité + Leads + Polish**
- Sécurité finalisée : RLS `leads` + `profiles`, `is_admin()`, CAPTCHA Turnstile, migration clés publishable + désactivation legacy, **révocation de la clé service_role compromise**, fermeture alerte GitHub + PR obsolètes
- Fonctionnalités leads : 4 types, type de bien/chambres/quartier (+ colonnes DB), budget formaté, téléphone intl, Edit/Delete
- Correction du **formulaire dupliqué** (rendering.js) + du champ type de lead non pré-rempli
- Emails : 8 templates habillés à la marque ; popups de succès stylées
- Parcours apporteur **retesté de bout en bout** : inscription → CAPTCHA → email → profil → ajout de lead ✅

**8–9 août 2026** — Anglais uniquement ; fix 404 contrat ; SMS→email ; Resend ; Google/Apple/email ; redirection login après confirmation ; téléphone pré-rempli profil.

---

## 🎯 Prochaines étapes (optionnel, non bloquant)
1. **Délivrabilité email** : ajouter DMARC au DNS (réduire le spam)
2. **« Supabase timeout, using temp profile »** : avertissement jaune non bloquant (lecture de profil > 5 s sur cold start) → possibilité d'allonger le délai `withTimeout` de 5 s à 10 s dans `index.html`
3. **Tailwind en prod** : le CDN Tailwind affiche un warning console — passer à une version compilée si on veut l'enlever (cosmétique)
4. **Conformité pub biens précis** : permis **Trakheesi** (DLD) à confirmer seulement si publicité d'annonces de propriétés
5. Anti-doublon de lead (empêcher qu'un même email/téléphone soit soumis deux fois)
6. Vérification légale du contrat (Channel Partner Agreement) par un professionnel

---

*Version app 3.25.6 — 10 août 2026*
