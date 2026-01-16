# 📝 Résumé des Modifications - Intégration API

## 🎯 Objectif
Connecter le frontend React au backend Spring Boot pour l'authentification (login/register).

---

## ✏️ Fichiers Modifiés

### 1. **`.env.local`** (CRÉÉ)
```
VITE_API_BASE=http://localhost:8080/api
```
- Configure l'URL de base pour toutes les requêtes API
- Peut être surchargée par la variable d'environnement Vite

### 2. **`.env.example`** (CRÉÉ)
- Template pour les développeurs
- Documenté avec commentaires

### 3. **`src/services/api.js`** (MODIFIÉ)
**Avant:**
```javascript
baseURL: import.meta.env.VITE_API_BASE || '/api',
```

**Après:**
```javascript
baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api',
withCredentials: true,  // Pour les cookies si nécessaire
```

### 4. **`src/services/authService.js`** (MODIFIÉ)
**Changements:**
- ✅ `getProfile()` utilise maintenant `/auth/me` (était `/auth/profile`)
- ✅ `verifyEmail()` utilise les paramètres de requête (email, code)
- ✅ Ajout `logout()` → `POST /auth/logout`
- ✅ Ajout `resendVerification()` → `POST /auth/resend-verification`

**Avant:**
```javascript
export const verifyEmail = (payload) => api.post('/auth/verify-email', payload)
export const getProfile = () => api.get('/auth/profile')
```

**Après:**
```javascript
export const verifyEmail = (email, code) => api.post('/auth/verify-email', null, { params: { email, code } })
export const getProfile = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')
export const resendVerification = (email) => api.post('/auth/resend-verification', null, { params: { email } })
```

### 5. **`src/pages/auth/Login.jsx`** (MODIFIÉ)
**Changements:**
- ✅ Stockage du user dans localStorage
- ✅ Redirection vers `/visitor` (après succès)
- ✅ Gestion des erreurs avec `error` (au lieu de `message`)

**Code clé:**
```javascript
localStorage.setItem('user', JSON.stringify(res.data.user))
navigate('/visitor')  // ← était '/'
```

### 6. **`src/pages/auth/Register.jsx`** (MODIFIÉ)
**Changements:**
- ✅ Envoi de `confirmPassword` au lieu de vérification locale
- ✅ Redirection vers `/auth/verify-email`
- ✅ Gestion des erreurs avec `error`

**Code clé:**
```javascript
authService.register({ 
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  password: data.password,
  confirmPassword: data.confirm  // ← clé importante
})
```

### 7. **`src/pages/auth/VerifyEmail.jsx`** (MODIFIÉ)
**Changements:**
- ✅ Utilise les paramètres de requête pour email/code
- ✅ Gestion des erreurs avec `error`

**Code clé:**
```javascript
authService.verifyEmail(email, data.code)  // ← email et code comme params
```

### 8. **`src/hooks/useAuth.jsx`** (MODIFIÉ)
**Changements majeurs:**
- ✅ Ajout d'un state `loading` pour les opérations asynchrones
- ✅ Chargement du user depuis localStorage au démarrage
- ✅ Vérification du token et du profil au montage
- ✅ Gestion améliorée du logout avec appel API
- ✅ Stockage du user en localStorage

**Code clé:**
```javascript
// Charge le profil depuis /auth/me au démarrage
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    authService.getProfile()
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
  }
}, [])
```

### 9. **`src/AppRoutes.jsx`** (MODIFIÉ)
**Changements:**
- ✅ Route `/auth/verify` → `/auth/verify-email`
- ✅ Ajout route `/visitor` (sans `/dashboard`)
- ✅ Role 'VISITOR' → 'VISITEUR' (correspond au backend)

**Code clé:**
```javascript
<Route path="/auth/verify-email" element={<VerifyEmail />} />
<Route element={<ProtectedRoute allowedRoles={['VISITEUR']} />}>
  <Route path="/visitor" element={<VisitorDashboard />} />
  <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
</Route>
```

### 10. **`src/index.css`** (MODIFIÉ)
**Changements:**
- ✅ Ajout des directives Tailwind CSS
  - `@tailwind base;`
  - `@tailwind components;`
  - `@tailwind utilities;`

**Avant:**
```css
/* Global styles (Tailwind removed to allow clean install). */
```

**Après:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
/* Global styles */
```

### 11. **`postcss.config.cjs`** (MODIFIÉ)
**Changements majeurs - CRITIQUE:**
- ✅ Ajout de la configuration Tailwind CSS
- ✅ Ajout d'Autoprefixer

**Avant:**
```javascript
module.exports = {
  plugins: {},
}
```

**Après:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 📚 Fichiers Créés (Documentation)

### 1. **`INTEGRATION_CONFIG.md`**
- Guide complet de configuration
- Flux d'authentification
- Endpoints API documentés
- Troubleshooting

### 2. **`TEST_GUIDE.md`**
- Tests manuels étape par étape
- Debug tips
- Problèmes courants

---

## 🔗 Endpoints API Utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/auth/verify-email` | Vérifier email |
| POST | `/api/auth/resend-verification` | Renvoyer code |
| GET | `/api/auth/me` | Profil courant |
| POST | `/api/auth/logout` | Déconnexion |

---

## 🚀 Prochaines Étapes

1. **Redémarrer le frontend:**
   ```bash
   npm run dev
   ```

2. **Vérifier que le backend s'exécute:**
   ```bash
   http://localhost:8080
   ```

3. **Tester la connexion:**
   - Allez sur: `http://localhost:5173/auth/register`
   - Suivez le guide TEST_GUIDE.md

4. **Configuration optionnelle:**
   - Configurer les emails (dans backend `application.properties`)
   - Configurer les rôles utilisateurs
   - Ajouter des pages de tableau de bord pour chaque rôle

---

## ⚠️ Points Importants

- **JWT Token:** Stocké en localStorage (pour la persistance)
- **Credentials:** CORS activé avec `withCredentials: true`
- **Rôles:** 'VISITEUR', 'SECRETAIRE', 'AGENT_SECURITE', 'EMPLOYE', 'ADMIN'
- **Erreurs:** Les endpoints retournent `error` (pas `message`)
- **Email:** Code envoyé à moins que EmailService ne soit configuré
