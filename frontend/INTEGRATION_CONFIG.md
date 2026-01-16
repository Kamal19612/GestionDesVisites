# Intégration Frontend-Backend - Guide de Configuration

## ✅ Configuration complétée

### Frontend (React + Vite)

#### 1. **Variables d'environnement** 
- Fichier créé: `.env.local`
```
VITE_API_BASE=http://localhost:8080/api
```

#### 2. **Services d'authentification**
- `authService.js` - Endpoints API configurés:
  - `POST /auth/register` - Inscription
  - `POST /auth/login` - Connexion  
  - `POST /auth/verify-email` - Vérification email
  - `POST /auth/resend-verification` - Renvoi code
  - `POST /auth/logout` - Déconnexion
  - `GET /auth/me` - Profil utilisateur

- `api.js` - Client Axios configuré:
  - Base URL: `http://localhost:8080/api`
  - Token JWT automatiquement ajouté aux requêtes
  - Credentials activés

#### 3. **Pages d'authentification**
- `Login.jsx` - Connexion avec redirection vers `/visitor`
- `Register.jsx` - Inscription avec validation
- `VerifyEmail.jsx` - Vérification d'email avec code
- `useAuth.jsx` - Context pour gestion état utilisateur

#### 4. **Routes protégées**
Routes accessibles après authentification selon le rôle:
- `/visitor` - Visiteur (VISITEUR)
- `/secretary/*` - Secrétaire (SECRETAIRE)
- `/agent/*` - Agent sécurité (AGENT_SECURITE)
- `/employee/*` - Employé (EMPLOYE)
- `/admin/*` - Admin (ADMIN)

#### 5. **Styles Tailwind**
- `postcss.config.cjs` - Configuration PostCSS avec Tailwind
- `index.css` - Directives @tailwind ajoutées

---

## 🚀 Pour démarrer

### Backend (Spring Boot)
```bash
# Vérifier que le service s'exécute sur le port 8080
mvn spring-boot:run
```

**Configuration requise:**
- Base de données PostgreSQL: `GestionVisite`
- Email configuré dans `application.properties` pour la vérification

### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur: `http://localhost:5173`

---

## 📋 Flux d'authentification

### 1. **Inscription**
1. Utilisateur remplit le formulaire d'inscription
2. `POST /auth/register` → Backend enregistre l'utilisateur
3. Email de vérification envoyé
4. Redirection vers `/auth/verify-email`
5. Utilisateur entre le code
6. `POST /auth/verify-email` → Email vérifié
7. Redirection vers `/auth/login`

### 2. **Connexion**
1. Utilisateur entre email/mot de passe
2. `POST /auth/login` → Backend valide et retourne JWT
3. Token stocké en localStorage
4. `GET /auth/me` → Récupère le profil utilisateur
5. Redirection vers tableau de bord selon le rôle

### 3. **Déconnexion**
1. `POST /auth/logout` → Token révoqué au backend
2. Token supprimé du localStorage
3. Redirection vers `/auth/login`

---

## 🔒 Sécurité

- ✅ CORS configuré pour accepter `http://localhost:5173`
- ✅ JWT utilisé pour l'authentification
- ✅ CSRF désactivé (tokens stateless)
- ✅ Credentials inclus dans les requêtes
- ✅ Tokens auto-attachés aux requêtes Axios
- ✅ Protection des routes avec rôles

---

## ⚠️ Troubleshooting

### Les styles n'apparaissent pas ?
- PostCSS et Tailwind ont été reconfigurés
- Redémarrez: `npm run dev`

### Erreur "CORS" ou "401" ?
- Vérifiez que le backend s'exécute sur `http://localhost:8080`
- Vérifiez `VITE_API_BASE` dans `.env.local`
- Vérifiez que `CorsConfig.java` accepte `http://localhost:5173`

### Connexion échoue ?
- Vérifiez la base de données PostgreSQL
- Vérifiez les identifiants dans `application.properties`

### Erreur "Email service" ?
- C'est normal en développement si l'email n'est pas configuré
- Le code de vérification s'affiche en console
