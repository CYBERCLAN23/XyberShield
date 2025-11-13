# 📁 Structure des Médias - XyberShield

Ce dossier contient tous les fichiers multimédias utilisés dans la section Éducation.

## 📂 Organisation des Dossiers

```
media/
├── videos/              # Vidéos éducatives (.mp4, .webm)
├── pdfs/               # Guides et documents PDF
└── images/
    └── infographies/   # Infographies et images éducatives
```

---

## 🎬 Videos (`/media/videos/`)

### Convention de Nommage
Format: `theme_titre_descriptif.mp4`

**Exemples:**
- `phishing_comprendre_attaques.mp4`
- `passwords_creer_mots_passe_forts.mp4`
- `malware_protection_avancee.mp4`
- `general_cybersecurite_bases.mp4`

### Formats Recommandés
- **Format**: MP4 (H.264)
- **Résolution**: 1920x1080 (Full HD)
- **Bitrate**: 3-5 Mbps
- **Audio**: AAC, 128 kbps

### Optimisation
Pour réduire la taille sans perdre de qualité:
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

---

## 📄 PDFs (`/media/pdfs/`)

### Convention de Nommage
Format: `categorie_titre.pdf`

**Exemples:**
- `guide_cybersecurite_complet.pdf`
- `protection_donnees_personnelles.pdf`
- `securite_reseaux_avance.pdf`
- `bonnes_pratiques_mots_passe.pdf`

### Recommandations
- **Taille max**: 10 MB par fichier
- **Optimisation**: Compresser les images dans le PDF
- **Accessibilité**: Ajouter des signets/table des matières

---

## 🖼️ Images/Infographies (`/media/images/infographies/`)

### Convention de Nommage
Format: `theme_description.png` ou `.jpg`

**Exemples:**
- `regles_or_cybersecurite.png`
- `anatomie_attaque_phishing.png`
- `creation_mot_passe_fort.png`
- `checklist_securite_quotidienne.png`

### Formats Recommandés
- **PNG**: Pour infographies avec texte (meilleure qualité)
- **JPG**: Pour photos et images complexes (plus léger)
- **WebP**: Pour performance optimale (si supporté)

### Dimensions
- **Infographies**: 1200x1600px (portrait) ou 1600x900px (paysage)
- **Thumbnails**: 400x300px

### Optimisation
```bash
# PNG
pngquant --quality=65-80 input.png -o output.png

# JPG
jpegoptim --max=85 input.jpg
```

---

## 📊 Tailles Recommandées

| Type | Taille Max | Taille Idéale |
|------|-----------|---------------|
| Vidéo | 100 MB | 20-50 MB |
| PDF | 10 MB | 2-5 MB |
| Image | 2 MB | 200-500 KB |

---

## 🔗 Utilisation dans le Code

### Vidéos
```javascript
// Dans Education.html
const videoUrl = './media/videos/phishing_comprendre_attaques.mp4';
openVideoPlayer(title, description, videoUrl);
```

### PDFs
```html
<!-- Lien de téléchargement -->
<a href="./media/pdfs/guide_cybersecurite_complet.pdf" download>
    Télécharger le guide
</a>
```

### Images
```html
<!-- Affichage d'infographie -->
<img src="./media/images/infographies/regles_or_cybersecurite.png" 
     alt="10 Règles d'Or de la Cybersécurité">
```

---

## ⚠️ Important - Git LFS

Les fichiers volumineux (vidéos, PDFs) doivent utiliser **Git LFS** (Large File Storage).

### Installation
```bash
# Installer Git LFS
git lfs install

# Tracker les fichiers volumineux
git lfs track "media/videos/*.mp4"
git lfs track "media/videos/*.webm"
git lfs track "media/pdfs/*.pdf"
git lfs track "media/images/infographies/*.png"

# Ajouter .gitattributes
git add .gitattributes
git commit -m "Configure Git LFS"
```

### Vérification
```bash
# Voir les fichiers trackés par LFS
git lfs ls-files
```

---

## 📝 Checklist Avant Upload

### Vidéos
- [ ] Format MP4 (H.264)
- [ ] Résolution 1080p max
- [ ] Taille < 100 MB
- [ ] Audio clair et audible
- [ ] Nom de fichier descriptif

### PDFs
- [ ] Taille < 10 MB
- [ ] Compressé/optimisé
- [ ] Table des matières
- [ ] Nom de fichier descriptif

### Images
- [ ] Format PNG ou JPG
- [ ] Taille < 2 MB
- [ ] Dimensions appropriées
- [ ] Texte lisible
- [ ] Nom de fichier descriptif

---

## 🚀 Workflow de Production

1. **Créer le contenu** (vidéo, PDF, infographie)
2. **Optimiser** (compression, qualité)
3. **Nommer correctement** (convention)
4. **Placer dans le bon dossier**
5. **Tester localement**
6. **Commit avec Git LFS**
7. **Push vers le repo**

---

## 📞 Support

Pour toute question sur l'organisation des médias:
- Consulter ce README
- Vérifier les exemples de nommage
- Respecter les tailles maximales

**Dernière mise à jour**: 3 Novembre 2025
