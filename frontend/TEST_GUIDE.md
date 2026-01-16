# 🧪 Guide de Test - Intégration Frontend/Backend

## Prérequis
- Backend s'exécute: `http://localhost:8080`
- Frontend s'exécute: `http://localhost:5173`
- Base de données PostgreSQL connectée

## Test 1: Vérifier la connexion API

**Depuis le navigateur console** (F12):
```javascript
// Test la connexion à l'API
fetch('http://localhost:8080/api/auth/me', {
  headers: { 'Authorization': 'Bearer invalid-token' }
})
.then(r => r.json())
.then(d => console.log(d))
```

**Résultat attendu:** Message d'erreur "Not authenticated" (401)

---

## Test 2: Inscription (Register)

1. Allez sur: `http://localhost:5173/auth/register`
2. Remplissez:
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Email: `jean.dupont@example.com`
   - Mot de passe: `Test1234`
   - Confirmer: `Test1234`
3. Cliquez "S'inscrire"

**Résultats attendus:**
- ✅ Message de succès: "Inscription réussie..."
- ✅ Redirection vers page de vérification
- ✅ Vérifiez la console backend pour le code de vérification

---

## Test 3: Vérification Email

1. Vous êtes redirigé vers: `/auth/verify-email`
2. L'email devrait être pré-rempli: `jean.dupont@example.com`
3. Récupérez le code du **backend console** ou **email** (si configuré)
   - Format: `123456`
4. Collez le code et cliquez "Vérifier"

**Résultats attendus:**
- ✅ Message: "Vérification réussie"
- ✅ Redirection vers `/auth/login`

---

## Test 4: Connexion (Login)

1. Allez sur: `http://localhost:5173/auth/login`
2. Entrez:
   - Email: `jean.dupont@example.com`
   - Mot de passe: `Test1234`
3. Cliquez "Se connecter"

**Résultats attendus:**
- ✅ Pas d'erreur réseau
- ✅ Redirection vers `/visitor` (tableau de bord visiteur)
- ✅ Token JWT stocké en localStorage

**Vérifiez dans F12 > Console:**
```javascript
localStorage.getItem('token')  // Affiche le JWT
localStorage.getItem('user')   // Affiche l'objet utilisateur
```

---

## Test 5: Profil Utilisateur

**Si vous êtes connecté**, allez sur les pages protégées:
- `/visitor` - Doit charger VisitorDashboard
- Vérifiez que les styles Tailwind apparaissent

**Dans la console:**
```javascript
// Vérifier le contexte auth
// L'utilisateur doit avoir un rôle: VISITEUR, ADMIN, etc.
```

---

## Test 6: Échec de Connexion

1. Allez sur `/auth/login`
2. Entrez des identifiants incorrects:
   - Email: `invalid@example.com`
   - Mot de passe: `wrongpassword`
3. Cliquez "Se connecter"

**Résultats attendus:**
- ✅ Message d'erreur: "E-mail ou mot de passe incorrect"
- ✅ Après 3 tentatives: "Administrateur averti après 3 tentatives échouées"

---

## Test 7: Déconnexion

1. Si vous êtes connecté, cherchez un bouton "Déconnexion"
2. Cliquez dessus

**Résultats attendus:**
- ✅ Token supprimé du localStorage
- ✅ Redirection vers `/auth/login`

---

## Problèmes Courants

### ❌ "Failed to fetch" / CORS Error
**Solution:**
- Vérifiez que le backend s'exécute sur port 8080
- Vérifiez `VITE_API_BASE` dans `.env.local`
- Vérifiez que `CorsConfig.java` accepte `http://localhost:5173`

### ❌ "Styles invisibles"
**Solution:**
- Vérifiez que PostCSS/Tailwind est configuré
- Redémarrez: `npm run dev`

### ❌ Code de vérification invalide
**Solution:**
- Cherchez le code dans la console backend
- Assurez-vous de copier le code correct
- Les codes expirent après ~15 minutes

### ❌ "Email not found" après vérification
**Solution:**
- Vérifiez la base de données PostgreSQL
- Vérifiez les logs du backend

---

## Debug Tips

**1. Vérifier les requêtes API:**
- Ouvrez F12 > Network
- Effectuez une action (login, register)
- Vérifiez que les requêtes sont envoyées à `http://localhost:8080/api`

**2. Vérifier le token JWT:**
```javascript
// Dans F12 Console
const token = localStorage.getItem('token')
// Décodez le JWT sur: https://jwt.io
```

**3. Vérifier les erreurs backend:**
```bash
# Dans le terminal du backend, cherchez les logs
# Erreurs d'authentification, de base de données, etc.
```

**4. Vérifier l'état du contexte Auth:**
```javascript
// Pendant le développement, inspectez le contexte
// dans React Developer Tools (F12 > Components)
```
