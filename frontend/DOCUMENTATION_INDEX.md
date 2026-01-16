# 📚 Frontend Documentation Index

Voir le guide complet racine: [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)

## 🎯 Fichiers Frontend

### Configuration & Setup
- **[.env.local](.env.local)** - Variables d'environnement (API URL)
- **[.env.example](.env.example)** - Template pour développeurs
- **[INTEGRATION_CONFIG.md](./INTEGRATION_CONFIG.md)** - Configuration détaillée

### Tests & Validation
- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Guide de tests manuels complets

### Documentation Technique
- **[MODIFICATIONS_SUMMARY.md](./MODIFICATIONS_SUMMARY.md)** - Résumé des modifications
- **[package.json](./package.json)** - Dépendances et scripts

## 🔗 Architecture Frontend

```
src/
├── main.jsx                 # Point d'entrée
├── index.css               # Styles globaux + Tailwind
├── App.jsx                 # Landing page
├── AppRoutes.jsx           # Routes de l'app
│
├── services/
│   ├── api.js             # Client Axios (intercepteurs)
│   ├── authService.js     # Endpoints d'auth
│   └── appointmentService.js
│
├── hooks/
│   └── useAuth.jsx        # Context d'authentification
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx      # Connexion
│   │   ├── Register.jsx   # Inscription
│   │   └── VerifyEmail.jsx # Vérification email
│   └── (autres pages)
│
├── components/
│   ├── Form/
│   │   └── Input.jsx      # Composant input
│   ├── ui/
│   │   └── Button.jsx     # Composant button
│   └── layout/
│
└── layouts/
    └── MainLayout.jsx     # Layout principal
```

## 🚀 Quick Links

1. **Je veux configurer l'API** → [INTEGRATION_CONFIG.md](./INTEGRATION_CONFIG.md)
2. **Je veux tester l'authentification** → [TEST_GUIDE.md](./TEST_GUIDE.md)
3. **Je veux comprendre les changements** → [MODIFICATIONS_SUMMARY.md](./MODIFICATIONS_SUMMARY.md)
4. **Je veux démarrer rapidement** → [../QUICK_START.md](../QUICK_START.md)
5. **Je veux une guide visuelle** → [../STARTUP_VISUAL_GUIDE.md](../STARTUP_VISUAL_GUIDE.md)

## 📝 Fichiers Clés Modifiés

| Fichier | Modification |
|---------|--------------|
| `src/services/api.js` | URL API configurée |
| `src/services/authService.js` | Endpoints correctifs |
| `src/pages/auth/Login.jsx` | Navigation et gestion d'erreurs |
| `src/pages/auth/Register.jsx` | Validation et envoi de données |
| `src/pages/auth/VerifyEmail.jsx` | Vérification d'email |
| `src/hooks/useAuth.jsx` | Gestion du contexte d'auth |
| `src/AppRoutes.jsx` | Routes correctes |
| `src/index.css` | Directives Tailwind ajoutées |
| `postcss.config.cjs` | Configuration Tailwind CSS |

## 🧪 Étapes de Test

1. Démarrer le backend: `mvn spring-boot:run`
2. Démarrer le frontend: `npm run dev`
3. Aller à: `http://localhost:5173/auth/register`
4. Tester l'inscription complète
5. Vérifier les styles Tailwind apparaissent

Voir [TEST_GUIDE.md](./TEST_GUIDE.md) pour les détails.

## ✅ Configuration Checklist

- [x] `.env.local` créé avec `VITE_API_BASE`
- [x] Services API configurés
- [x] Pages d'auth complètes
- [x] Routes protégées configurées
- [x] Styles Tailwind activés
- [x] Contexte d'authentification fonctionnel

## 🔐 Sécurité

- JWT token en localStorage
- Auto-inclusion du token dans les requêtes
- CORS activé avec credentials
- Routes protégées par rôle
- Validation côté client

---

**Voir aussi:** [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md) pour l'index complet
