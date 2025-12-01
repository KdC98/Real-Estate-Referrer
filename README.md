# 📋 README - Real Estate Referrer Application

**Dernière mise à jour** : 1er décembre 2025  
**Version** : 2.3.0  
**Status** : 🟢 **En production - Fonctionnel**

---

## 📌 Description du Projet

Application web complète de gestion d'apporteurs d'affaires pour agent immobilier à Dubai. Permet de recruter des apporteurs, gérer les leads clients, suivre les ventes et calculer automatiquement les commissions.

**8 langues supportées** : Français, English, العربية, Русский, हिंदी, اردو, 中文, Tagalog

---

## 🌐 Accès et URLs

- **Site web** : https://real-estate-referrer.com
- **GitHub** : https://github.com/KdC98/Real-Estate-Referrer
- **Supabase** : https://cgizcgwhwxswvoodqver.supabase.co

---

## ✅ ÉTAT ACTUEL (1er décembre 2025)

### 🟢 Fonctionnel à 100%
- ✅ Authentification Supabase Auth avec SMS 2FA (Itooki.fr)
- ✅ Dashboard Admin et Apporteur
- ✅ Gestion des leads (4 types : Acheteur, Vendeur, Propriétaire, Locataire)
- ✅ Calcul automatique des commissions (25% acheteurs, 20% autres)
- ✅ Upload et validation des contrats
- ✅ Signature électronique
- ✅ Notifications email (Resend API)
- ✅ Widget Crisp Chat sur toutes les pages

### 🟢 Multilingue - Pages terminées
- ✅ `terms.html` - CGU multilingues (8 langues)
- ✅ `how-it-works.html` - Comment ça marche (8 langues)
- ✅ Fichiers JSON créés : `/locales/{lang}/terms.json` (8 langues)

### 🟡 Style unifié - En cours
- ✅ `terms.html` - Style unifié (dégradé bleu slate/blue)
- ✅ `privacy.html` - Style unifié (à commiter)
- ⏳ `index.html` - À mettre à jour
- ⏳ `reset-password.html` - À mettre à jour
- ⏳ `contract-signature.html` - À mettre à jour
- ⏳ `contract-template.html` - À mettre à jour
- ⏳ `referrer-dashboard.html` - À vérifier

---

## 🎨 Style unifié du site

**Thème adopté** (basé sur `how-it-works.html`) :
```html
<!-- Body -->
<body class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen text-white">

<!-- Header/Nav -->
<nav class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">

<!-- Cards/Sections -->
<div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

<!-- Footer -->
<footer class="bg-slate-900 border-t border-white/10">

<!-- Textes -->
- Titres : text-yellow-400
- Sous-titres : text-blue-100
- Texte normal : text-blue-200
- Liens actifs : text-yellow-400
- Liens inactifs : text-white/70 hover:text-white
```

---

## 📁 Structure des fichiers de traduction
```
/locales/
├── fr/
│   ├── terms.json ✅
│   ├── privacy.json ✅ (existait déjà)
│   └── how-it-works.json ✅ (existait déjà)
├── en/
│   ├── terms.json ✅
│   ├── privacy.json ✅
│   └── how-it-works.json ✅
├── ar/
│   └── terms.json ✅
├── ru/
│   └── terms.json ✅
├── hi/
│   └── terms.json ✅
├── ur/
│   └── terms.json ✅
├── zh/
│   └── terms.json ✅
└── tl/
    └── terms.json ✅
```

---

## 🐛 BUGS À CORRIGER

### 🔴 Bug 1 : Message post-inscription en anglais
**Problème** : Après validation SMS, le message "compte créé avec succès" s'affiche en anglais au lieu de la langue sélectionnée par l'utilisateur.

**Fichier concerné** : `index.html` ou composant d'inscription

**Solution** : Utiliser i18next pour le message de succès

---

### 🔴 Bug 2 : Pas de feedback visuel sur bouton "Vérifier" SMS
**Problème** : Lors de la validation du code SMS 2FA, le bouton "Vérifier" n'affiche pas de spinner de chargement. L'utilisateur ne sait pas si sa demande est en cours de traitement.

**Fichier concerné** : `index.html` ou composant SMS verification

**Solution** : Ajouter un spinner et désactiver le bouton pendant le chargement

---

## 🎯 PROCHAINES ÉTAPES

### Priorité 1 - Style unifié (pages restantes)
1. `index.html` - Appliquer le thème slate/blue
2. `reset-password.html` - Appliquer le thème
3. `contract-signature.html` - Appliquer le thème
4. `contract-template.html` - Appliquer le thème

### Priorité 2 - Correction des bugs UX
1. Corriger message post-inscription multilingue
2. Ajouter spinner sur bouton "Vérifier" SMS

### Priorité 3 - Traductions manquantes
- Créer `/locales/{ar,ru,hi,ur,zh,tl}/privacy.json`
- Créer `/locales/{ar,ru,hi,ur,zh,tl}/how-it-works.json`

---

## 🔧 Configuration technique

### Supabase
- **URL** : https://cgizcgwhwxswvoodqver.supabase.co
- **Tables** : profiles, leads, contracts

### SMS (Itooki.fr)
- **User ID** : 1584221834
- **Utilisé pour** : 2FA à l'inscription uniquement (pas à chaque connexion)

### Email (Resend)
- **Domaine** : notifications.real-estate-referrer.com

### Chat (Crisp)
- **Website ID** : 3fc5eae0-c8f6-4c08-98e9-8f83cc5712e2
- **Intégré sur** : Toutes les pages ✅

---

## 📝 Commits récents (1er décembre 2025)

1. `feat: Add Crisp chat to all pages` (8 fichiers)
2. `fix: Add i18next to terms.html for multilingual support`
3. `feat: Add terms.json for all 8 languages`
4. `fix: Update terms.html styling to match site theme`
5. `fix: Update privacy.html styling to match site theme` (à faire)

---

## 📞 Contact

Pour toute question, reprendre cette conversation avec Claude en fournissant ce fichier README.

---

*Version 2.3.0 - 1er décembre 2025*
