# 🔧 Installation de Multer - Guide Rapide

## ❌ Problème Rencontré
Le serveur ne démarre pas car le module `multer` n'est pas installé :
```
Error: Cannot find module 'multer'
```

## ✅ Solutions

### Solution 1 : Installation NPM Standard
```bash
cd /home/toto/Downloads/XyberShield-saves/FRONT\ xybershield/FRONT
npm install multer
```

### Solution 2 : Réinstaller toutes les dépendances
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller toutes les dépendances
npm install
```

### Solution 3 : Installation avec Yarn (si npm ne fonctionne pas)
```bash
# Installer yarn si pas déjà fait
npm install -g yarn

# Installer les dépendances avec yarn
yarn install
```

### Solution 4 : Installation manuelle
```bash
# Installer multer spécifiquement
npm install multer@1.4.5-lts.1 --save
```

## 🔄 Après Installation

1. **Décommenter le code multer** dans `server/routes/reports.js`
2. **Créer le dossier uploads** :
   ```bash
   mkdir -p server/uploads/reports
   ```
3. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

## 📝 Code à Décommenter

Dans `server/routes/reports.js`, remplacer :
```javascript
// const multer = require('multer'); // Temporairement commenté
```

Par :
```javascript
const multer = require('multer');
```

Et décommenter tout le bloc de configuration multer (lignes 34-77).

## ✅ Vérification

Le serveur devrait démarrer sans erreur et afficher :
```
✅ Server running on port 5000
✅ Database initialized successfully
```

## 🎯 Test Upload

Une fois multer installé, tu pourras :
- Soumettre des signalements avec fichiers joints
- Uploader jusqu'à 5 fichiers de 10MB chacun
- Types supportés : images, PDF, documents Word

---

**Note :** J'ai temporairement commenté multer pour que le serveur puisse démarrer. Une fois multer installé, décommente le code pour avoir la fonctionnalité complète d'upload de fichiers.
