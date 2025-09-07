# 🛡️ XyberShield - Plateforme de Signalement d'Incidents Cybersécurité

**Slogan** : _Signalez. Protégez. Prévenez._

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/xybershield)

## 🌐 Présentation

**XyberShield** est une plateforme web innovante conçue pour faciliter la déclaration d'incidents de cybersécurité tout en éduquant les utilisateurs sur les bonnes pratiques de sécurité en ligne.

### Fonctionnalités clés

- 🚨 **Signalement d'incidents** (phishing, piratage, arnaques en ligne, etc.)
- 📱 **Interface responsive** adaptée à tous les appareils
- 🔒 **Sécurisation des données** avec chiffrement
- 📊 **Tableau de bord** de suivi des signalements
- 📚 **Centre d'éducation** sur la cybersécurité

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v14+)
- npm (v6+)
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/yourusername/xybershield.git
   cd xybershield
   ```

2. **Installer les dépendances**
   ```bash
   cd FRONT
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🏗️ Structure du projet

```
XyberShield/
├── FRONT/                    # Dossier frontend
│   ├── animation/           # Animations JavaScript
│   ├── images/              # Images et ressources graphiques
│   ├── js/                  # Fichiers JavaScript
│   ├── style/               # Feuilles de style CSS
│   ├── index.html           # Page d'accueil
│   ├── report.html          # Formulaire de signalement
│   └── login.html           # Pages d'authentification
│
├── BACKEND/                 # Dossier backend
│   ├── api/                 # Points d'API
│   ├── config/              # Fichiers de configuration
│   ├── controllers/         # Contrôleurs
│   └── models/              # Modèles de données
│
├── public/                  # Fichiers statiques
└── src/                     # Code source principal
```

## 🎨 Charte graphique

### Couleurs
- Vert néon : `#39FF14`
- Bleu sombre : `#0A192F`
- Noir : `#000000`
- Blanc cassé : `#f2f2f2`

### Typographie
- Police principale : `Montserrat` (Google Fonts)
- Police secondaire : `Exo 2` (Google Fonts)
- Taille de base : 16px

## 🛠️ Technologies utilisées

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/) pour les icônes
- [Animate.css](https://animate.style/) pour les animations

### Backend (Phase 2)
- Node.js avec Express
- Base de données : SQLite (développement) / MySQL (production)
- Authentification : JWT

### Outils de développement
- Git pour le contrôle de version
- Webpack pour le bundling
- ESLint pour le linting
- Prettier pour le formatage du code

## 📝 Fonctionnalités détaillées

### 1. Signalement d'incidents
- Formulaire en plusieurs étapes
- Téléchargement de pièces jointes
- Suivi en temps réel
- Numéro de suivi unique

### 2. Tableau de bord
- Vue d'ensemble des signalements
- Filtres et recherche
- Export des données (CSV/PDF)

### 3. Centre d'éducation
- Articles sur la cybersécurité
- Tutoriels vidéo
- Quiz interactifs

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=votre_clé_secrète
DATABASE_URL=sqlite:./database.sqlite
UPLOAD_DIR=./uploads
```

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test
```

## 🚀 Déploiement

### Production

1. Construire l'application :
   ```bash
   npm run build
   ```

2. Démarrer le serveur de production :
   ```bash
   npm start
   ```

### Docker

```bash
docker build -t xybershield .
docker run -p 3000:3000 xybershield
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📬 Contact

Équipe XyberShield - [contact@xybershield.fr](mailto:contact@xybershield.fr)

---

> **Note** : Ce projet est en cours de développement actif. Consultez la section [Problèmes](https://github.com/yourusername/xybershield/issues) pour voir les fonctionnalités à venir et les problèmes connus.
