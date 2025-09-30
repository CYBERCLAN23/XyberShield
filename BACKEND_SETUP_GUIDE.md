# 🚀 Guide de Configuration Backend XyberShield

## ✅ **PROBLÈME RÉSOLU !**

Votre backend est maintenant parfaitement configuré pour recevoir les données du formulaire de signalement avec le mapping correct des champs français → anglais.

---

## 🔧 **Ce qui a été corrigé :**

### **1. Mapping des champs français → anglais**
```javascript
// Dans animation/report.js
const mappedData = {
  fullName: frenchData.nom || '',           // nom → fullName
  email: frenchData.email || '',            // email → email
  phone: frenchData.telephone || '',        // telephone → phone
  incidentType: frenchData.type || '',      // type → incidentType
  incidentDate: frenchData.date || '',      // date → incidentDate
  incidentLocation: frenchData.region || '', // region → incidentLocation
  description: frenchData.description || '', // description → description
  affectedSystems: frenchData.systeme || '', // systeme → affectedSystems
  additionalComments: frenchData.evidence_links || '', // evidence_links → additionalComments
  anonymous: frenchData.anonyme === 'on' || false,     // anonyme → anonymous
  consent: frenchData.consent === 'on' || false        // consent → consent
};
```

### **2. Calcul automatique du niveau d'impact**
```javascript
const impactLevelMap = {
  'malware': 'high',
  'data-breach': 'high', 
  'account-hijacking': 'high',
  'phishing': 'medium',
  'scam': 'medium',
  'other': 'low'
};
```

### **3. Champs requis ajoutés automatiquement**
- `impactLevel` : calculé selon le type d'incident
- `organization` : chaîne vide par défaut
- `previousIncidents` : false par défaut
- `securityMeasures` : chaîne vide par défaut

---

## 🚀 **Installation et démarrage :**

### **1. Installer les dépendances**
```bash
cd server
npm install
```

### **2. Configurer l'environnement**
```bash
# Copier le fichier de configuration
cp .env.example .env

# Éditer le fichier .env avec vos paramètres
nano .env
```

### **3. Démarrer le serveur**
```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

Le serveur démarrera sur `http://localhost:5000`

---

## 📡 **API Endpoints disponibles :**

### **POST /api/reports** - Soumettre un signalement
- **URL :** `http://localhost:5000/api/reports`
- **Méthode :** POST
- **Content-Type :** multipart/form-data
- **Champs requis :**
  - `fullName` (string)
  - `email` (string)
  - `phone` (string)
  - `incidentType` (string)
  - `incidentDate` (datetime)
  - `description` (string)
  - `impactLevel` (string: low/medium/high/critical)
  - `consent` (boolean)

### **GET /api/reports/:reference** - Récupérer un signalement
- **URL :** `http://localhost:5000/api/reports/REF123456`
- **Méthode :** GET

### **GET /api/health** - Vérifier l'état du serveur
- **URL :** `http://localhost:5000/api/health`
- **Méthode :** GET

---

## 🧪 **Test du formulaire :**

### **1. Démarrer le serveur**
```bash
cd server
npm run dev
```

### **2. Ouvrir le formulaire**
Ouvrez `report.html` dans votre navigateur

### **3. Remplir et soumettre**
- Remplissez tous les champs requis
- Cliquez sur "Envoyer le signalement"
- Vérifiez la console du navigateur pour les logs

---

## 🔍 **Debugging :**

### **Vérifier les logs du serveur**
```bash
# Le serveur affiche des logs détaillés :
📝 New report submission received
📋 French form data collected: {...}
🔄 Mapped data for backend: {...}
✅ Report created successfully: REF123456
```

### **Vérifier les logs du frontend**
```javascript
// Ouvrez la console du navigateur (F12)
// Vous verrez :
🚀 Starting form submission...
📋 French form data collected: {...}
🔄 Mapped data for backend: {...}
✅ Form submitted successfully: {...}
```

---

## 📊 **Structure de la base de données :**

Le serveur utilise SQLite avec les tables suivantes :
- **reports** - Signalements d'incidents
- **report_files** - Fichiers joints aux signalements
- **users** - Utilisateurs (optionnel)
- **activity_logs** - Logs d'activité

---

## 🛡️ **Sécurité implémentée :**

- ✅ **Rate limiting** - Maximum 5 signalements par 15 minutes
- ✅ **Validation des données** - Validation côté serveur
- ✅ **Helmet.js** - Headers de sécurité
- ✅ **CORS** - Configuration des origines autorisées
- ✅ **File upload sécurisé** - Types de fichiers limités
- ✅ **Sanitisation** - Nettoyage des données d'entrée

---

## 🎉 **Résultat :**

**Votre formulaire de signalement fonctionne maintenant parfaitement !**

- ✅ **Mapping correct** des champs français → anglais
- ✅ **Validation complète** côté client et serveur
- ✅ **Upload de fichiers** fonctionnel
- ✅ **Messages d'erreur** informatifs
- ✅ **Numéro de référence** généré automatiquement
- ✅ **Base de données** SQLite intégrée
- ✅ **API REST** complète

**Plus d'erreurs 400 "Validation failed" ! 🚀**
