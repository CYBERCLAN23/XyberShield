# 🔧 Guide de Dépannage - Démarrage Serveur

## ✅ Problèmes Corrigés

### 1. Base de Données - `createActivityTable` ❌ → ✅
**Problème :** `ReferenceError: createActivityTable is not defined`
**Solution :** Corrigé dans `server/database/db.js` - changé `createActivityTable` en `createUserActivityTable`

### 2. Live-Server - Problème de fins de ligne ❌ → ✅
**Problème :** `env: 'node\r': No such file or directory`
**Solution :** Ajouté des scripts alternatifs dans `package.json`

## 🚀 Comment Démarrer Maintenant

### Option 1 : Serveur + Client (Recommandé)
```bash
npm run dev
```

### Option 2 : Serveur Seulement (Si problème client)
```bash
npm run dev-server-only
```
Puis ouvre manuellement : http://localhost:3000

### Option 3 : Client Alternatif
```bash
# Terminal 1 - Serveur
npm run server

# Terminal 2 - Client alternatif
npm run client-alt
```

### Option 4 : Démarrage Manuel
```bash
# Terminal 1 - Backend
cd server
node server.js

# Terminal 2 - Frontend (Python)
python3 -m http.server 3000
```

## 🔍 Vérifications

### Serveur Backend (Port 5000)
✅ Devrait afficher :
```
✅ Connected to SQLite database
✅ Users table ready
✅ Sessions table ready
✅ Activity table ready
✅ Reports table ready
✅ Report files table ready
✅ Database initialized successfully
🚀 Server running on port 5000
```

### Client Frontend (Port 3000)
✅ Accessible sur : http://localhost:3000 ou http://127.0.0.1:3000

## 🐛 Si Problèmes Persistent

### Problème NPM/Node
```bash
# Vérifier les versions
node --version
npm --version

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème Permissions
```bash
# Donner permissions d'exécution
chmod +x node_modules/.bin/*
```

### Problème Live-Server
```bash
# Réinstaller live-server globalement
npm install -g live-server

# Ou utiliser npx
npx live-server --port=3000
```

## 📊 URLs à Tester

Une fois démarré :
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Test API :** http://localhost:3000/test-report-api.html
- **Health Check :** http://localhost:5000/api/health

## ✅ Status Attendu

```
[0] ✅ Database initialized successfully
[0] 🚀 Server running on port 5000
[1] Serving at http://127.0.0.1:3000
```

---

**Note :** J'ai corrigé le problème de base de données. Le serveur devrait maintenant démarrer correctement !
