# 🛡️ Backend Signalements XyberShield - Guide Complet

## 📋 Vue d'ensemble

Le backend de signalements XyberShield est un système complet pour gérer les rapports d'incidents de cybersécurité. Il inclut :

- **API RESTful** pour la soumission et gestion des signalements
- **Base de données SQLite** avec tables optimisées
- **Upload de fichiers** avec validation et sécurité
- **Authentification optionnelle** (signalements anonymes supportés)
- **Rate limiting** pour prévenir les abus
- **Validation complète** des données

## 🗄️ Structure de la Base de Données

### Table `reports`
```sql
- id (INTEGER PRIMARY KEY)
- reference_number (TEXT UNIQUE) - Ex: XS-ABC123-DEF4
- user_id (INTEGER, optionnel) - Lié à l'utilisateur si connecté
- full_name (TEXT) - Nom complet du rapporteur
- email (TEXT) - Email de contact
- phone (TEXT, optionnel) - Téléphone
- organization (TEXT, optionnel) - Organisation
- incident_type (TEXT) - Type d'incident
- incident_date (DATETIME) - Date de l'incident
- incident_location (TEXT, optionnel) - Lieu de l'incident
- description (TEXT) - Description détaillée
- impact_level (TEXT) - Niveau d'impact (low/medium/high/critical)
- affected_systems (TEXT, optionnel) - Systèmes affectés
- previous_incidents (BOOLEAN) - Incidents précédents
- security_measures (TEXT, optionnel) - Mesures de sécurité
- additional_comments (TEXT, optionnel) - Commentaires
- status (TEXT) - Statut (pending/in_progress/resolved/closed)
- priority (TEXT) - Priorité (low/medium/high/critical)
- created_at, updated_at (DATETIME)
```

### Table `report_files`
```sql
- id (INTEGER PRIMARY KEY)
- report_id (INTEGER) - Lié au signalement
- filename (TEXT) - Nom du fichier sur le serveur
- original_name (TEXT) - Nom original du fichier
- file_path (TEXT) - Chemin complet du fichier
- file_size (INTEGER) - Taille en bytes
- mime_type (TEXT) - Type MIME
- uploaded_at (DATETIME)
```

## 🚀 Installation et Configuration

### 1. Installer les dépendances
```bash
npm install multer
```

### 2. Structure des dossiers
```
server/
├── routes/
│   └── reports.js          # Routes API signalements
├── database/
│   └── db.js              # Fonctions base de données (mis à jour)
├── uploads/
│   └── reports/           # Dossier pour les fichiers uploadés
└── server.js              # Serveur principal (mis à jour)
```

### 3. Démarrer le serveur
```bash
npm run server
# ou
npm run dev
```

## 📡 Endpoints API

### POST /api/reports
**Soumettre un nouveau signalement**

**Content-Type:** `multipart/form-data`

**Champs requis:**
- `fullName` - Nom complet
- `email` - Email valide
- `incidentType` - Type d'incident
- `incidentDate` - Date ISO 8601
- `description` - Description (min 10 caractères)
- `impactLevel` - low/medium/high/critical

**Champs optionnels:**
- `phone` - Numéro de téléphone
- `organization` - Organisation
- `incidentLocation` - Lieu de l'incident
- `affectedSystems` - Systèmes affectés
- `previousIncidents` - true/false
- `securityMeasures` - Mesures de sécurité
- `additionalComments` - Commentaires
- `files` - Fichiers joints (max 5, 10MB chacun)

**Headers optionnels:**
- `Authorization: Bearer <token>` - Pour les utilisateurs connectés

**Réponse succès (201):**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "referenceNumber": "XS-ABC123-DEF4",
    "reportId": 123,
    "status": "pending",
    "filesUploaded": 2,
    "files": [...]
  }
}
```

### GET /api/reports/:reference
**Récupérer un signalement par référence**

**Réponse succès (200):**
```json
{
  "success": true,
  "data": {
    "referenceNumber": "XS-ABC123-DEF4",
    "incidentType": "phishing",
    "incidentDate": "2024-01-15T10:30:00Z",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2024-01-15T10:35:00Z",
    "filesCount": 2
  }
}
```

### GET /api/reports/user/my-reports
**Récupérer les signalements de l'utilisateur connecté**

**Authentification:** Requise

**Réponse succès (200):**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### GET /api/reports/stats/overview
**Statistiques des signalements**

**Réponse succès (200):**
```json
{
  "success": true,
  "data": {
    "totalReports": 150,
    "pendingReports": 23,
    "resolvedReports": 120,
    "criticalReports": 7
  }
}
```

## 🔒 Sécurité

### Rate Limiting
- **5 signalements maximum par 15 minutes** par IP
- Protection contre le spam et les abus

### Validation des fichiers
- **Types autorisés:** Images (JPEG, PNG, GIF, WebP), PDF, documents Word, texte
- **Taille maximum:** 10MB par fichier
- **Nombre maximum:** 5 fichiers par signalement

### Validation des données
- Email valide requis
- Numéro de téléphone validé si fourni
- Dates au format ISO 8601
- Longueur minimum pour les descriptions
- Sanitisation des entrées

## 🧪 Tests

### 1. Test automatique
Ouvrez `test-report-api.html` dans votre navigateur pour tester l'API.

### 2. Test manuel avec curl
```bash
# Test de santé de l'API
curl http://localhost:5000/api/health

# Soumission d'un signalement
curl -X POST http://localhost:5000/api/reports \
  -F "fullName=Test User" \
  -F "email=test@example.com" \
  -F "incidentType=phishing" \
  -F "incidentDate=2024-01-15T10:30:00Z" \
  -F "description=Test de signalement" \
  -F "impactLevel=medium"

# Récupération d'un signalement
curl http://localhost:5000/api/reports/XS-ABC123-DEF4
```

## 📁 Fonctions de Base de Données

### Nouvelles fonctions ajoutées à `db.js`:

- `createReport(reportData)` - Créer un signalement
- `getReportByReference(referenceNumber)` - Récupérer par référence
- `getReportsByUserId(userId, limit)` - Signalements d'un utilisateur
- `getAllReports(limit, offset)` - Tous les signalements (admin)
- `updateReportStatus(reportId, status, assignedTo)` - Mettre à jour le statut
- `addReportFile(fileData)` - Ajouter un fichier
- `getReportFiles(reportId)` - Récupérer les fichiers
- `generateReferenceNumber()` - Générer un numéro unique

## 🔄 Intégration Frontend

Le frontend `report.js` a été mis à jour pour :

1. **Utiliser la nouvelle API** (`/api/reports`)
2. **Envoyer les données et fichiers** en une seule requête
3. **Afficher le numéro de référence** après soumission
4. **Gérer l'authentification optionnelle**
5. **Afficher des messages d'erreur détaillés**

## 🎯 Fonctionnalités Avancées

### Signalements Anonymes
- Les utilisateurs peuvent soumettre sans être connectés
- Les signalements sont liés à l'utilisateur si un token est fourni

### Suivi des Activités
- Toutes les soumissions sont loggées dans `user_activity`
- Traçabilité complète des actions

### Gestion des Fichiers
- Upload sécurisé dans `server/uploads/reports/`
- Noms de fichiers uniques pour éviter les conflits
- Métadonnées stockées en base de données

## 🚨 Dépannage

### Erreurs communes

1. **"Multer not found"**
   ```bash
   npm install multer
   ```

2. **"Upload directory not found"**
   ```bash
   mkdir -p server/uploads/reports
   ```

3. **"Rate limit exceeded"**
   - Attendez 15 minutes ou redémarrez le serveur

4. **"Invalid file type"**
   - Vérifiez que le fichier est dans les types autorisés

### Logs utiles
```javascript
// Dans server.js, activez les logs détaillés
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## 📈 Prochaines Étapes

1. **Interface d'administration** pour gérer les signalements
2. **Notifications email** automatiques
3. **API de suivi** pour les utilisateurs
4. **Tableau de bord** des statistiques
5. **Export des données** en CSV/PDF
6. **Intégration avec des outils de sécurité** externes

## ✅ Checklist de Déploiement

- [ ] Base de données initialisée
- [ ] Dossier uploads créé
- [ ] Variables d'environnement configurées
- [ ] Rate limiting activé
- [ ] Tests API passés
- [ ] Frontend intégré
- [ ] Logs configurés
- [ ] Sauvegardes planifiées

---

🎉 **Le backend de signalements XyberShield est maintenant opérationnel !**

Pour toute question ou problème, consultez les logs du serveur ou utilisez la page de test `test-report-api.html`.
