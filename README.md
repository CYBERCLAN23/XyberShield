# 🛡️ XyberShield - Plateforme de Signalement d'Incidents Cybersécurité

**Slogan** : _Signalez. Protégez. Prévenez._

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/CYBERCLAN23/XyberShield)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.14.0-brightgreen)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D8.5.0-blue)](https://www.npmjs.com/)

## 🌐 Présentation

**XyberShield** est une plateforme web innovante conçue pour faciliter la déclaration d'incidents de cybersécurité tout en éduquant les utilisateurs sur les bonnes pratiques de sécurité en ligne.

### Fonctionnalités clés

- 🚨 **Signalement d'incidents** (phishing, piratage, arnaques en ligne, etc.)
- 📱 **Interface responsive** adaptée à tous les appareils
- 🔒 **Sécurisation des données** avec chiffrement
- 📊 **Tableau de bord** de suivi des signalements
- 📚 **Centre d'éducation** sur la cybersécurité

## 🏗️ Structure du Projet

```
XyberShield/
├── FRONT/                    # Dossier frontend
│   ├── assets/              # Ressources statiques
│   │   ├── css/             # Feuilles de style
│   │   ├── js/              # Fichiers JavaScript
│   │   ├── images/          # Images
│   │   └── fonts/           # Polices de caractères
│   ├── src/                 # Code source du frontend
│   │   ├── components/      # Composants réutilisables
│   │   ├── views/           # Vues/Pages
│   │   └── utils/           # Utilitaires
│   ├── index.html           # Point d'entrée HTML
│   └── home.html            # Page d'accueil
├── BACKEND/                 # Dossier backend
│   ├── config/              # Configuration
│   ├── controllers/         # Contrôleurs
│   ├── models/              # Modèles de données
│   ├── routes/              # Routes API
│   └── middleware/          # Middleware Express
├── public/                  # Fichiers publics servis statiquement
├── .env.example             # Exemple de variables d'environnement
├── .eslintrc.json           # Configuration ESLint
├── .prettierrc              # Configuration Prettier
├── babel.config.json        # Configuration Babel
├── webpack.config.js        # Configuration Webpack
├── package.json             # Dépendances et scripts
└── README.md                # Ce fichier
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v16.14.0 ou supérieur)
- npm (v8.5.0 ou supérieur)
- MongoDB (pour la base de données)
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/CYBERCLAN23/XyberShield.git
   cd XyberShield
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Modifier les variables d'environnement selon votre configuration
   ```

4. **Démarrer le serveur de développement**
   ```bash
   # Développement frontend
   npm run dev:frontend
   
   # Développement backend
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000 (Frontend)
   http://localhost:3001 (API, si différente)
   ```

## 🛠 Scripts disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en mode développement
- `npm run dev:frontend` - Démarrer le serveur de développement frontend
- `npm run build:frontend` - Construire les assets pour la production
- `npm test` - Exécuter les tests
- `npm run lint` - Vérifier le code avec ESLint
- `npm run format` - Formater le code avec Prettier

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- [Cedrik Yepmo](https://github.com/cedrikyepmo)
- [Onana Gregoire](https://github.com/onanagregoire)
- [Lembou Pharel](https://github.com/lemboupharel)
- [Akanna Signing Josias](https://github.com/akannasigning)
- [Akoumou Darren](https://github.com/akoumoudarren)

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

> **Note** : Ce projet est en cours de développement actif. et nest pas open source
