# 📋 README — Real Estate Referrer

**Dernière mise à jour :** 9 août 2026
**Version :** 3.24.0
**Status :** 🟢 En production — Fonctionnel

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

---

## 🪪 Identité & Conformité
- **Courtière :** Karyne de Clercq
- **Agence :** Solo Gate Real Estate (Alliance by EMAAR)
- **BRN (RERA) :** **94777**
- **Permis annonceur réseaux sociaux (National Media Authority) :** n° **8159983** — valable jusqu'au **12 mars 2027** (couvre LinkedIn / Facebook / Instagram)

> Le BRN 94777 atteste de l'enregistrement en tant que courtière auprès de la RERA. Le permis annonceur 8159983 couvre la publicité et le contenu média sur les réseaux sociaux. Pour la publicité de **biens immobiliers précis** (annonces de propriétés), un permis **Trakheesi** (Dubai Land Department) peut rester à confirmer avec un professionnel.
>
> *(Les identifiants personnels — Emirates ID, Media File Number, Trade License — ne sont volontairement pas stockés ici, le dépôt étant public.)*

---

## 🔐 Authentification (mis à jour le 8 août 2026)
- ✅ **Email + mot de passe avec vérification par email** (réglage Supabase « Confirm email » activé)
- ✅ **Connexion Google** (OAuth)
- ✅ **Connexion Apple** (Sign in with Apple)
- ❌ **SMS 2FA supprimé** — remplacé par la vérification email (fini le service SMS Itooki)
- Après clic sur le lien de confirmation → redirection vers le **formulaire de connexion** (`?login=1`)

---

## 📧 Emails (Resend)
Les emails d'authentification passent par **Resend** (SMTP personnalisé branché dans Supabase → Authentication → Emails → SMTP Settings) :
- **Host :** smtp.resend.com — **Port :** 465 — **Username :** resend
- **Domaine vérifié :** notifications.real-estate-referrer.com
- **Expéditeur :** noreply@notifications.real-estate-referrer.com

> ⚠️ **À améliorer :** les emails peuvent partir en spam (domaine récent, sans réputation). Ajouter un enregistrement **DMARC** et remplacer le template d'email de confirmation (très basique) par un email à la marque.

---

## 🍎 Connexion Apple — MAINTENANCE IMPORTANTE
La clé secrète Apple est un **JWT qui expire tous les 6 mois maximum**. Si elle expire, la connexion Apple casse pour tout le monde.
- **Prochaine expiration : 4 février 2027** → à régénérer AVANT.
- **Un rappel automatique est programmé pour le 20 janvier 2027.**
- Éléments nécessaires pour régénérer (dans Supabase → Authentication → Sign In / Providers → Apple → « Secret Key ») :
  - Services ID / Client ID : `com.realestate.referrer.web`
  - Key ID : `8R228NMSP7`
  - Team ID : `2FW34576RD`
  - Fichier de clé privée **`.p8`** (`AuthKey_8R228NMSP7.p8`) — **À GARDER PRIVÉ, ne jamais mettre dans le dépôt.**

---

## 💰 Commissions
- **Acheteurs : 25 %** de la commission agent
- **Vendeurs / propriétaires / locataires : 20 %**

Exemple : appartement vendu 2 000 000 AED → commission agence 2 % = 40 000 AED → part apporteur 25 % = **10 000 AED**.

---

## 🚀 Stack technique
- **Frontend :** modules JavaScript (ESM via CDN) + Tailwind CSS (CDN)
- **Backend / Auth / Storage :** Supabase (PostgreSQL)
- **Emails :** Resend
- **Hébergement :** Vercel (déploiement auto via GitHub)

---

## 🕓 Historique récent (8–9 août 2026)
- Suppression des langues inutiles → **anglais uniquement**
- Correction du bug **404** sur les liens du contrat (« Back to signature », Terms, Privacy, How It Works)
- **SMS supprimé → vérification par email**
- **Resend** branché à Supabase (envoi d'emails fiable et illimité)
- Connexions **Google, Apple** (clé Apple régénérée) **et email** : les 3 fonctionnent
- Base utilisateurs repartie propre + parcours d'inscription **testé de bout en bout**
- Finitions : redirection vers le login après confirmation, **téléphone pré-rempli** dans le profil, texte SMS trompeur corrigé

---

## 🎯 Prochaines étapes
1. **Délivrabilité email** : ajouter un DMARC + un template d'email de marque (réduire le spam)
2. **Conformité Dubaï** : courtage (BRN 94777) ✅ et publicité réseaux sociaux (permis 8159983, exp. 12/03/2027) ✅ — bien couvert. À confirmer seulement si vous faites de la pub sur des biens précis : permis **Trakheesi** (DLD)
3. **Sécurité avant ouverture large** : revoir les politiques RLS Supabase, changer le mot de passe admin par défaut
4. (Optionnel) Régénérer le fichier `.p8` Apple par précaution (il a transité par une conversation)

---

*Version 3.24.0 — 9 août 2026*
