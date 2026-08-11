# 📋 README — Real Estate Referrer

**Dernière mise à jour :** 10 août 2026
**Version :** 3.25.6 (app) / leads.js 3.6.3 / rendering.js 3.23.0
**Status :** 🟢 En production — Fonctionnel, sécurisé, testé de bout en bout

---

## 📌 Description
Application web de gestion d'apporteurs d'affaires immobilier à Dubaï : recruter des apporteurs, gérer les leads clients, suivre les ventes et calculer les commissions.

**Langue :** Anglais uniquement.

---

## 🌐 Accès et URLs
- **Site :** https://real-estate-referrer.com
- **GitHub :** https://github.com/KdC98/Real-Estate-Referrer (branche `main`)
- **Supabase :** https://cgizcgwhwxswvoodqver.supabase.co (plan PRO, eu-west-1)
- **Hébergement :** Vercel (déploiement auto depuis `main`)

### 📤 Rappel déploiement (important)
Upload GitHub en **2 endroits** :
- `index.html` + `.html` racine → **racine** : `.../upload/main`
- Fichiers JS (`leads.js`, `dashboard.js`, `rendering.js`, `config.js`) → **dossier `js/`** : `.../upload/main/js`
> ⚠️ Ne jamais mettre les fichiers JS à la racine. Après upload, vérifier le `// Version:` en tête du fichier sur GitHub.

---

## 🪪 Identité & Conformité
- **Courtière :** Karyne de Clercq — **Agence :** Solo Gate Real Estate (Alliance by EMAAR)
- **BRN (RERA) :** 94777
- **Permis annonceur réseaux sociaux :** 8159983 — valable jusqu'au 12 mars 2027
> Identifiants personnels (Emirates ID, Trade License, .p8) volontairement non stockés (dépôt public).

---

## 🔐 Sécurité (complétée le 10 août 2026)
- ✅ **RLS sur `leads`** (chaque apporteur ne gère que ses leads ; admin voit tout)
- ✅ **RLS sur `profiles`** (chacun ne gère que son profil ; admin tout) — corrige le blocage 409 à la complétion de profil
- ✅ Fonction `public.is_admin()` (SECURITY DEFINER STABLE)
- ✅ **CAPTCHA Cloudflare Turnstile** sur login/signup/reset (Apple/Google non concernés → accès admin garanti)
- ✅ **Migration vers la clé publishable** `sb_publishable_...` ; **clés legacy désactivées**
- ✅ **Clé service_role compromise révoquée** (avait fuité dans l'historique Git) ; alerte GitHub fermée
- **Admin :** karyne.declercq@icloud.com (rôle `admin`, connexion Apple)
> ⚠️ Ne jamais committer : service_role, mot de passe SMTP, fichier Apple `.p8`.

---

## 🔑 Authentification
- Email + mot de passe **avec vérification email**, **Google**, **Apple**
- Lien de confirmation → page de connexion (`?login=1`), fiable quel que soit le navigateur

## 📧 Emails (Resend) — 8 templates habillés à la marque
smtp.resend.com:465 · domaine notifications.real-estate-referrer.com · expéditeur noreply@…
> ⚠️ À faire : DMARC (réduire le spam).

## 🍎 Apple — maintenance
Clé secrète Apple = JWT expirant tous les 6 mois. **Prochaine expiration : 4 février 2027** (rappel auto le 20 janvier 2027). Services ID `com.realestate.referrer.web`, Key ID `8R228NMSP7`, Team ID `2FW34576RD`.

---

## 💰 Commissions apporteur
Base = part agent **nette** de Karyne (≈1 %). Acheteur **25 %** · Vendeur **1 000 AED fixe** (quand vendu) · Bailleur **20 %** · Locataire **20 %**. Les 4 types sont activés.

## 🧾 Gestion des leads
Formulaire complet : 4 types (Buyer/Seller/Landlord/Tenant), type de bien / chambres / quartier (colonnes DB `property_type`, `bedrooms`, `location_area`), budget avec séparateurs, téléphone intl (+971 défaut), **Edit / Delete**, popups de succès habillées.
> 🐞 Résolu : formulaire « Add Lead » dupliqué dans `rendering.js` (retiré) → `leads.js` est la source unique.

---

## 🕓 Historique récent
**10 août 2026** — Sécurité finalisée (RLS leads+profiles, CAPTCHA, migration+révocation clés) ; leads (4 types, bien, budget, tél intl, Edit/Delete) ; fix formulaire dupliqué + type de lead ; 8 emails + popups habillés ; parcours apporteur retesté de bout en bout.

**8–9 août 2026** — Anglais uniquement ; fix 404 contrat ; SMS→email ; Resend ; Google/Apple/email ; redirection login ; téléphone pré-rempli.

---

## 🎯 Prochaines étapes (optionnel, non bloquant)
1. **DMARC** au DNS (délivrabilité email / anti-spam)
2. **« Supabase timeout, temp profile »** : warning jaune non bloquant → allonger `withTimeout` de 5 s à 10 s dans `index.html`
3. **Tailwind CDN** : warning console cosmétique → version compilée si on veut l'enlever
4. **Trakheesi (DLD)** : seulement si publicité d'annonces de biens précis
5. **Anti-doublon de lead** (même email/téléphone)
6. **Vérification légale** du contrat (Channel Partner Agreement)

---

*Version app 3.25.6 — 10 août 2026*
