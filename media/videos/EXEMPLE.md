# 🎬 Comment Ajouter des Vidéos

## 📝 Étapes Rapides

1. **Placer votre vidéo** dans ce dossier (`media/videos/`)
2. **Nommer correctement** selon la convention
3. **Ajouter l'attribut** `data-video-url` sur la carte HTML

---

## 📋 Convention de Nommage

Format: `theme_description.mp4`

**Exemples:**
```
comprendre_le_phishing.mp4
creer_mots_passe_forts.mp4
protection_contre_malware.mp4
bases_cybersecurite.mp4
```

---

## 🔗 Lier une Vidéo à une Carte

### Méthode 1: Attribut data-video-url (Recommandé)

Dans `Education.html`, ajoutez `data-video-url` à votre carte:

```html
<div class="course-card" data-type="video" data-video-url="./media/videos/comprendre_le_phishing.mp4">
    <div class="course-thumbnail">
        <img src="https://img.youtube.com/vi/PRSyNoUUXKk/maxresdefault.jpg" alt="Phishing">
        <div class="play-overlay">
            <i class="fas fa-play"></i>
        </div>
        <span class="course-badge">Débutant</span>
        <span class="course-duration">8:45</span>
    </div>
    <div class="course-content">
        <h3 class="course-title">Comprendre le Phishing</h3>
        <p class="course-description">
            Apprenez à identifier et éviter les attaques de phishing par email
        </p>
        <!-- ... reste du contenu ... -->
    </div>
</div>
```

### Méthode 2: Génération Automatique

Si vous ne spécifiez pas `data-video-url`, le système génère automatiquement le chemin depuis le titre:

**Titre:** "Comprendre le Phishing"  
**Chemin généré:** `./media/videos/comprendre_le_phishing.mp4`

---

## ✨ Bannière Automatique

Le système génère automatiquement une bannière pour chaque vidéo avec:
- ✅ Gradient XyberShield
- ✅ Logo 🛡️
- ✅ Titre de la vidéo
- ✅ Branding "XyberShield"

**Aucune configuration nécessaire!**

---

## 🎯 Exemple Complet

### 1. Fichier Vidéo
```
media/videos/securite_mots_passe.mp4
```

### 2. Carte HTML
```html
<div class="course-card" data-type="video" data-video-url="./media/videos/securite_mots_passe.mp4">
    <div class="course-thumbnail">
        <div class="play-overlay">
            <i class="fas fa-play"></i>
        </div>
        <span class="course-badge">Intermédiaire</span>
        <span class="course-duration">12:30</span>
    </div>
    <div class="course-content">
        <h3 class="course-title">Sécurité des Mots de Passe</h3>
        <p class="course-description">
            Créez des mots de passe forts et sécurisés
        </p>
        <div class="course-tags">
            <span class="tag">#passwords</span>
            <span class="tag">#sécurité</span>
        </div>
        <div class="course-meta">
            <div class="course-stats">
                <span><i class="fas fa-eye"></i> 1.5k</span>
                <span><i class="fas fa-clock"></i> 12 min</span>
            </div>
        </div>
        <div class="course-actions">
            <button class="action-btn like-btn" data-video-id="pwd1">
                <i class="far fa-heart"></i>
                <span class="like-count">89</span>
            </button>
            <button class="action-btn comment-btn" data-video-id="pwd1">
                <i class="far fa-comment"></i>
                <span class="comment-count">12</span>
            </button>
        </div>
        <div class="comments-section" data-video-id="pwd1">
            <!-- Comments here -->
        </div>
    </div>
</div>
```

---

## 🚀 Fonctionnalités Incluses

### Animation de Chargement
- ✅ Spinner automatique pendant le chargement
- ✅ Disparaît quand la vidéo est prête

### Optimisation
- ✅ Preload metadata (chargement rapide)
- ✅ Poster (bannière) généré automatiquement
- ✅ Player personnalisé avec contrôles

### Mobile
- ✅ Message de rotation automatique
- ✅ Plein écran en mode paysage
- ✅ Contrôles tactiles

---

## 📊 Formats Supportés

| Format | Support | Recommandé |
|--------|---------|------------|
| MP4 (H.264) | ✅ | ✅ OUI |
| WebM | ✅ | ⚠️ Fallback |
| OGG | ✅ | ❌ Non |

**Utilisez toujours MP4 (H.264) pour la meilleure compatibilité!**

---

## 💡 Conseils

1. **Compression**: Utilisez FFmpeg pour optimiser
   ```bash
   ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
   ```

2. **Résolution**: 1920x1080 (Full HD) max

3. **Durée**: 5-15 minutes idéal pour contenu éducatif

4. **Taille**: < 100 MB par vidéo

5. **Audio**: Clair et audible, 128 kbps AAC

---

## 🔍 Dépannage

**Vidéo ne se charge pas?**
- Vérifiez le chemin dans `data-video-url`
- Vérifiez que le fichier existe dans `media/videos/`
- Vérifiez le format (MP4 recommandé)

**Bannière ne s'affiche pas?**
- C'est normal, elle se génère automatiquement au clic
- Vérifiez la console pour les erreurs

**Player ne s'ouvre pas?**
- Vérifiez que la carte a `data-type="video"`
- Vérifiez que le play overlay a la classe `play-overlay`

---

**Dernière mise à jour**: 3 Novembre 2025
