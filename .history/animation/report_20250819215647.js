console.log('Début du chargement de report.js...');

// Configuration par défaut
const config = {
  API_BASE_URL: 'http://localhost:3001',
  PRODUCTION_API_URL: 'https://xybershield-igk9hda77-josiasange37s-projects.vercel.app'
};

// Fonction pour obtenir l'URL de l'API
function getApiUrl(endpoint) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${config.PRODUCTION_API_URL}${endpoint}`;
  }
  return `${config.API_BASE_URL}${endpoint}`;
}

// Vérifier si le DOM est déjà chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeForm);
} else {
  initializeForm();
}

function initializeForm() {
  console.log('Initialisation du formulaire...');
  
  // Vérifier si le formulaire existe
  const form = document.getElementById('multiStepForm');
  if (!form) {
    console.error('Erreur: Le formulaire multi-étapes n\'a pas été trouvé dans le DOM');
    return;
  }
  
   console.log('Formulaire trouvé avec succès');
  
  // Initialiser les variables globales
  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const progress = document.getElementById('progress');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  if (!steps.length || !nextBtns.length || !prevBtns.length || !progress || !progressSteps.length) {
    console.error('Erreur: Éléments du formulaire manquants');
    return;
  }

  let currentStep = 0;
  
 // Afficher la première étape
  showStep(currentStep);

  // Ajouter les écouteurs d'événements
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
          showStep(currentStep + 1);
        } else {
          form.submit();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });
  
  // Fonction pour afficher une étape spécifique
  function showStep(stepIndex) {
    currentStep = stepIndex;
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
      step.style.display = idx === currentStep ? 'block' : 'none';
    });
    updateProgressBar();
    updateButtons();
  }
  
  // Fonction pour mettre à jour la barre de progression
 
  function updateProgressBar() {
    const progressPercentage = (currentStep / (steps.length - 1)) * 100;
    progress.style.width = `${progressPercentage}%`;
    progressSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx <= currentStep);
    });
  }
  // Fonction pour mettre à jour les boutons de navigation
    function updateButtons() {
    prevBtns.forEach(btn => {
      btn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    });
    nextBtns.forEach(btn => {
      btn.textContent = currentStep === steps.length - 1 ? 'Envoyer' : 'Suivant';
    });
  }
    
 
  // Fonction pour valider une étape
   function validateStep(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
      const errorElement = document.getElementById(`${input.name}-error`);
      if (errorElement) errorElement.style.display = 'none';
      input.classList.remove('is-invalid');
      if (!input.value.trim()) {
        showError(input, 'Ce champ est requis');
        isValid = false;
      }
  
      // Validation spécifique pour les emails
    if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          showError(input, 'Veuillez entrer une adresse email valide');
          isValid = false;
        }
      }
    });
    return isValid;
  }

  
  // Fonction pour afficher une erreur
  function showError(input, message) {
    console.log(`Affichage d'une erreur pour ${input.name}: ${message}`);
    
    input.classList.add('is-invalid');
    
    // Créer ou mettre à jour le message d'erreur
    let errorElement = document.getElementById(`${input.name}-error`);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${input.name}-error`;
      errorElement.className = 'error-message';
      
      // Insérer après le champ de formulaire
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.appendChild(errorElement);
      } else {
        input.parentNode.insertBefore(errorElement, input.nextSibling);
      }
    }
    
    // Mettre à jour le message d'erreur
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Fonction pour gérer le clic sur le bouton Suivant
  function handleNextClick(e) {
    e.preventDefault();
    console.log('Bouton Suivant cliqué');
    
    // Valider l'étape actuelle
    if (validateStep(currentStep)) {
      // Si c'est la dernière étape, soumettre le formulaire
      if (currentStep === steps.length - 1) {
        console.log('Soumission du formulaire...');
        // Ici, vous pouvez ajouter la logique de soumission du formulaire
        // form.submit();
      } else {
        // Sinon, passer à l'étape suivante
        showStep(currentStep + 1);
      }
    } else {
      console.log('Validation échouée, affichage des erreurs');
    }
  }
  
  // Fonction pour gérer le clic sur le bouton Précédent
  function handlePrevClick(e) {
    e.preventDefault();
    console.log('Bouton Précédent cliqué');
    showStep(currentStep - 1);
  }
  
  // Variables pour le téléchargement de fichiers
  let uploadedFiles = [];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const MAX_FILES = 5;

  // Récupérer les éléments du DOM pour le téléchargement de fichiers
  const fileInput = document.getElementById('evidence');
  const fileUploadContainer = document.querySelector('.file-upload-container');
  const filePreviewContainer = document.getElementById('file-preview');
  const progressBar = document.querySelector('.progress');
  const progressText = document.querySelector('.progress-percentage');
  const submitBtn = form?.querySelector('button[type="submit"]');

  // Initialiser le téléchargement de fichiers
  initFileUpload();

  // Fonction pour initialiser le téléchargement de fichiers
  function initFileUpload() {
    if (fileInput && fileUploadContainer) {
      fileInput.addEventListener('change', handleFileSelect);

      // Gestion du glisser-déposer
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadContainer.addEventListener(eventName, preventDefaults, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadContainer.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        fileUploadContainer.addEventListener(eventName, unhighlight, false);
      });

      function highlight() {
        fileUploadContainer.classList.add('highlight');
      }

      function unhighlight() {
        fileUploadContainer.classList.remove('highlight');
      }

      fileUploadContainer.addEventListener('drop', handleDrop, false);
    }
  }

  // Gestion de la sélection de fichiers
  function handleFileSelect(e) {
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    if (!files) return;

    handleFiles(files);
  }

  // Gestion du dépôt de fichiers
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
      fileInput.files = files;
      handleFiles(files);
    }
  }

  // Traitement des fichiers
  function handleFiles(files) {
    // Vérifier le nombre de fichiers
    if (uploadedFiles.length + files.length > MAX_FILES) {
      showError(fileInput, `Vous ne pouvez pas télécharger plus de ${MAX_FILES} fichiers`);
      return;
    }

    // Vérifier la taille totale des fichiers
    let totalSize = uploadedFiles.reduce((total, file) => total + file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Vérifier le type de fichier
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showError(fileInput, `Type de fichier non supporté: ${file.name}`);
        continue;
      }

      // Vérifier la taille du fichier
      if (file.size > MAX_FILE_SIZE) {
        showError(fileInput, `Le fichier ${file.name} dépasse la taille maximale de 5 Mo`);
        continue;
      }

      // Vérifier la taille totale
      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        showError(fileInput, 'La taille totale des fichiers dépasse 20 Mo');
        return;
      }

      totalSize += file.size;
      uploadedFiles.push(file);

      // Afficher l'aperçu du fichier
      displayFilePreview(file);
    }

    // Mettre à jour la barre de progression
    updateProgressBar();
  }

  // Afficher l'aperçu d'un fichier
  function displayFilePreview(file) {
    if (!filePreviewContainer) return;

    const preview = document.createElement('div');
    preview.className = 'file-preview';

    // Créer l'icône en fonction du type de fichier
    let icon = '';
    if (file.type.startsWith('image/')) {
      icon = '📷';
    } else if (file.type === 'application/pdf') {
      icon = '📄';
    } else if (file.type.includes('document') || file.type.includes('word')) {
      icon = '📝';
    } else {
      icon = '📎';
    }

    // Créer le contenu de l'aperçu
    preview.innerHTML = `
      <div class="file-info">
        <span class="file-icon">${icon}</span>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${formatFileSize(file.size)}</span>
      </div>
      <button type="button" class="remove-file" data-file-name="${file.name}">×</button>
    `;

    // Ajouter l'aperçu au conteneur
    filePreviewContainer.appendChild(preview);

    // Ajouter un écouteur d'événement pour le bouton de suppression
    const removeBtn = preview.querySelector('.remove-file');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => removeFile(file.name));
    }
  }

  // Supprimer un fichier
  function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);

    // Mettre à jour l'affichage
    if (filePreviewContainer) {
      const previews = filePreviewContainer.querySelectorAll('.file-preview');
      previews.forEach(preview => {
        const name = preview.querySelector('.file-name')?.textContent;
        if (name === fileName) {
          preview.remove();
        }
      });
    }

    // Mettre à jour la barre de progression
    updateProgressBar();
  }

  // Formater la taille du fichier
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Mettre à jour la barre de progression
  function updateProgressBar() {
    if (!progressBar || !progressText) return;

    const totalSize = uploadedFiles.reduce((total, file) => total + file.size, 0);
    const percentage = Math.min(100, (totalSize / MAX_TOTAL_SIZE) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;

    // Changer la couleur en fonction du pourcentage
    if (percentage > 80) {
      progressBar.style.backgroundColor = '#ff4444';
    } else if (percentage > 50) {
      progressBar.style.backgroundColor = '#ffbb33';
    } else {
      progressBar.style.backgroundColor = '#00C851';
    }
  }

  /**
   * Update the progress bar based on current step
   */
  function updateProgressbar() {
    console.log('Mise à jour de la barre de progression...');
    if (!progress || !progressSteps.length) {
      console.error('Éléments de progression non trouvés');
      return;
    }
    
    progressSteps.forEach((step, index) => {
      if (index <= currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    const actives = document.querySelectorAll(".progress-step.active");
    const progressPercentage = ((actives.length - 1) / (progressSteps.length - 1)) * 100;
    progress.style.width = `${progressPercentage}%`;
    
    // Add transition for smooth animation
    progress.style.transition = 'width 0.3s ease-in-out';
    console.log('Barre de progression mise à jour à', progressPercentage, '%');
  }

  /**
   * Show a specific step
   * @param {number} step - The step index to show (0-based)
   */
  function showStep(step) {
    console.group('=== showStep(' + step + ') ===');
    
    // Vérification des limites
    if (step < 0) {
      console.warn('Tentative d\'accès à une étape avant la première (', step, '), ajustement à 0');
      step = 0;
    } else if (step >= steps.length) {
      console.warn('Tentative d\'accès à une étape après la dernière (', step, '), ajustement à', steps.length - 1);
      step = steps.length - 1;
    }
    
    console.log('Passage à l\'étape', step, 'sur', steps.length - 1);
    
    // Mise à jour de l'étape courante
    const previousStep = currentStep;
    currentStep = step;
    console.log('Changement d\'étape:', previousStep, '->', currentStep);
    
    // Mise à jour de l'interface utilisateur
    console.log('Mise à jour de l\'affichage des étapes...');
    steps.forEach((stepElement, index) => {
      const isActive = index === step;
      console.log(`- Étape ${index}: ${isActive ? 'active' : 'inactive'}`);
      stepElement.classList.toggle('active', isActive);
      stepElement.style.display = isActive ? 'block' : 'none';
    });
    
    // Mise à jour de la barre de progression
    console.log('Mise à jour de la barre de progression...');
    updateProgressbar();
    
    // Défilement vers le haut du formulaire
    if (steps[step]) {
      console.log('Défilement vers l\'étape', step);
      steps[step].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else {
      console.error('Impossible de trouver l\'étape', step, 'dans le DOM');
    }
    
    // Mise à jour de la visibilité des boutons
    updateNavigationButtons();
    
    console.groupEnd();
  }
  
  /**
   * Met à jour la visibilité des boutons de navigation en fonction de l'étape actuelle
   */
  function updateNavigationButtons() {
    console.group('=== updateNavigationButtons() ===');
    console.log('Étape actuelle:', currentStep, 'sur', steps.length - 1);
    
    // Bouton Précédent
    const prevButtons = document.querySelectorAll('.prev-btn');
    const shouldShowPrev = currentStep > 0;
    console.log('Bouton Précédent:', shouldShowPrev ? 'visible' : 'caché');
    prevButtons.forEach(btn => {
      btn.style.display = shouldShowPrev ? 'inline-block' : 'none';
    });
    
    // Bouton Suivant/Envoyer
    const nextButtons = document.querySelectorAll('.next-btn');
    const submitButtons = document.querySelectorAll('.submit-btn');
    const isLastStep = currentStep === steps.length - 1;
    
    console.log('Dernière étape:', isLastStep ? 'oui' : 'non');
    
    nextButtons.forEach(btn => {
      btn.style.display = !isLastStep ? 'inline-block' : 'none';
    });
    
    submitButtons.forEach(btn => {
      btn.style.display = isLastStep ? 'inline-block' : 'none';
    });
    
    console.groupEnd();
  }

  // Initialize form buttons
  console.log('Initialisation des boutons de navigation...');
  
  // Next button click handler
  console.log('Initialisation des boutons Suivant...');
  nextBtns.forEach((btn, index) => {
    console.log(`Ajout d'un écouteur d'événement au bouton Suivant #${index + 1}`);
    
    btn.addEventListener("click", (e) => {
      console.log('Bouton Suivant cliqué !');
      console.log('Étape actuelle:', currentStep);
      
      // Empêcher le comportement par défaut du bouton
      e.preventDefault();
      e.stopPropagation();
      
      // Valider l'étape en cours
      const isValid = validateStep(currentStep);
      console.log('Résultat de la validation:', isValid);
      
      if (isValid) {
        console.log('Validation réussie, passage à l\'étape suivante...');
        showStep(currentStep + 1);
      } else {
        console.log('Étape non valide, affichage des erreurs');
        // Trouver le premier champ en erreur et y faire défiler
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, false);
  });

  // Previous button click handler
  console.log('Initialisation des boutons Précédent...');
  prevBtns.forEach((btn, index) => {
    console.log(`Ajout d'un écouteur d'événement au bouton Précédent #${index + 1}`);
    btn.addEventListener("click", () => {
      console.log('Bouton Précédent cliqué !');
      showStep(currentStep - 1);
    });
  });

  /**
   * Validate all required fields in the current step
   * @param {number} stepIndex - The index of the step to validate
   * @returns {boolean} - Whether the step is valid
   */
  function validateStep(stepIndex) {
    console.group('=== Validation de l\'étape', stepIndex, '===');
    console.log('Recherche de l\'étape avec l\'index:', stepIndex);
    
    const currentStep = steps[stepIndex];
    if (!currentStep) {
      console.error('❌ Étape non trouvée pour l\'index:', stepIndex);
      console.groupEnd();
      return true;
    }
    
    console.log('Étape trouvée:', currentStep);
    console.log('Recherche des champs requis dans l\'étape...');
    
    // Sélectionner tous les champs requis dans l'étape actuelle
    const inputs = Array.from(currentStep.querySelectorAll('input[required], select[required], textarea[required]'));
    console.log('Champs requis trouvés:', inputs.map(i => i.name || i.id || 'sans-nom'));
    
    if (inputs.length === 0) {
      console.log('Aucun champ requis trouvé, validation automatique réussie');
      console.groupEnd();
      return true;
    }
    
    let isValid = true;
    
    inputs.forEach((input, index) => {
      console.group(`Champ #${index + 1}:`, input.name || 'sans nom', `(type: ${input.type})`);
      
      // Skip hidden inputs
      if (input.offsetParent === null) {
        console.log('ℹ️ Champ caché ignoré');
        console.groupEnd();
        return;
      }
      
      console.log('Valeur actuelle:', input.value);
      console.log('Attribut required:', input.required);
      
      // Reset error state
      input.classList.remove('is-invalid');
      const errorId = `${input.name}-error`;
      const errorElement = document.getElementById(errorId);
      console.log('Élément d\'erreur:', errorId, errorElement ? 'trouvé' : 'non trouvé');
      
      if (errorElement) {
        errorElement.textContent = '';
      }
      
      // Required field validation
      if (input.required) {
        const isCheckbox = input.type === 'checkbox';
        const isRadio = input.type === 'radio';
        const isSelect = input.tagName === 'SELECT';
        let isEmpty = false;
        
        console.group(`Validation du champ: ${input.name || 'sans-nom'}`);
        
        if (isCheckbox) {
          isEmpty = !input.checked;
          console.log('Case à cocher:', input.checked ? 'cochée' : 'non cochée');
        } else if (isRadio) {
          const radioGroupName = input.name;
          const isAnyRadioChecked = document.querySelector(`input[type="radio"][name="${radioGroupName}"]:checked`);
          isEmpty = !isAnyRadioChecked;
          console.log('Bouton radio sélectionné:', isAnyRadioChecked ? 'oui' : 'non');
        } else if (isSelect) {
          isEmpty = !input.value || input.value === '';
          console.log('Valeur de la sélection:', input.value);
        } else {
          isEmpty = !input.value.trim();
          console.log('Valeur du champ:', input.value);
        }
        
        console.log('Champ vide:', isEmpty ? 'OUI' : 'non');
        
        if (isEmpty) {
          console.log('❌ Champ requis non rempli');
          showError(input, 'Ce champ est requis');
          isValid = false;
          console.groupEnd(); // Fin du groupe de validation du champ
          console.groupEnd(); // Fin du groupe de validation de l'étape
          return;
        } else {
          // Si le champ n'est pas vide, supprimer les erreurs précédentes
          input.classList.remove('is-invalid');
          const errorElement = document.getElementById(`${input.name}-error`);
          if (errorElement) {
            errorElement.style.display = 'none';
          }
        }
        
        console.groupEnd(); // Fin du groupe de validation du champ
      }
      
      // Email validation
      if (input.type === 'email' && input.value) {
        console.log('Validation du format email...');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          console.log('❌ Format email invalide');
          showError(input, 'Veuillez entrer une adresse email valide');
          isValid = false;
          console.groupEnd();
          return;
        }
        console.log('✅ Format email valide');
      }
      
      // Phone validation
      if (input.name === 'telephone' && input.value) {
        console.log('Validation du numéro de téléphone...');
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        const phoneValue = input.value.replace(/[\s-]/g, '');
        console.log('Numéro nettoyé:', phoneValue);
        
        if (!phoneRegex.test(phoneValue)) {
          console.log('❌ Format de téléphone invalide');
          showError(input, 'Numéro de téléphone invalide (ex: +33 6 12 34 56 78)');
          isValid = false;
          console.groupEnd();
          return;
        }
        console.log('✅ Numéro de téléphone valide');
      }
      
      console.log('✅ Champ valide');
      console.groupEnd();
    });
    
    console.log('Résultat de la validation de l\'étape', stepIndex, ':', isValid ? '✅ VALIDE' : '❌ INVALIDE');
    console.groupEnd();
    return isValid;
  }

  /**
   * Show an error message for a field
   * @param {HTMLElement} input - The input element
   * @param {string} message - The error message to display
   */
  function showError(input, message) {
    console.log('Affichage d\'erreur pour le champ', input.name, ':', message);
    
    if (!input) {
      console.error('Champ non défini pour l\'erreur');
      return;
    }
    
    // Ajouter la classe d'erreur au champ
    input.classList.add('is-invalid');
    
    // Trouver ou créer l'élément d'erreur
    let errorElement = document.getElementById(`${input.name}-error`);
    
    if (!errorElement) {
      // Créer un nouvel élément d'erreur s'il n'existe pas
      console.log('Création d\'un nouvel élément d\'erreur pour', input.name);
      errorElement = document.createElement('div');
      errorElement.id = `${input.name}-error`;
      errorElement.className = 'error-message';
      
      // Insérer après le champ de formulaire
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.appendChild(errorElement);
      } else {
        input.parentNode.insertBefore(errorElement, input.nextSibling);
      }
    }
    
    // Mettre à jour le message d'erreur
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.color = '#ff5252';
    errorElement.style.marginTop = '5px';
    errorElement.style.fontSize = '0.85rem';
    
    console.log('Message d\'erreur affiché pour', input.name);
    
    // Scroll to the first error
    if (document.querySelector('.is-invalid') === input) {
      console.log('Défilement vers le premier champ en erreur');
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Configuration de l'API
  const API_BASE_URL = getApiUrl('/api');
  console.log('URL de l\'API configurée:', API_BASE_URL);

// Form submission handler
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate all steps before submission
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        // If validation fails, go to that step
        showStep(i);
        return;
      }
    }
    
    // Check consent
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox?.checked) {
      showError(consentCheckbox, 'Vous devez accepter les conditions pour continuer');
      return;
    }
    
    try {
      // Set loading state
      isSubmitting = true;
      setSubmitButtonState(true);
      
      // Get authentication token
      const token = localStorage.getItem('token');
      const fileUrls = [];
      
      // Upload each file
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                updateUploadProgress(i, uploadedFiles.length, percentComplete);
              }
            };
            
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  resolve(JSON.parse(xhr.responseText));
                } catch (e) {
                  resolve(xhr.responseText);
                }
              } else {
                reject(new Error(`Erreur lors du téléversement du fichier: ${xhr.statusText}`));
              }
            };
            
            xhr.onerror = () => {
              reject(new Error('Erreur réseau lors du téléversement du fichier'));
            };
            
            xhr.open('POST', `${config.API_BASE_URL}/upload`, true);
            
            // Add authorization header if token exists
            if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            
            xhr.send(formData);
          });
          
          // Add the file URL to the list
          if (response && response.url) {
            fileUrls.push({
              url: response.url,
              name: file.name,
              type: file.type,
              size: file.size
            });
          }
          
          // Update progress to 100% for this file
          updateUploadProgress(i + 1, uploadedFiles.length, 100);
          
        } catch (error) {
          console.error(`Erreur lors du téléversement du fichier ${file.name}:`, error);
          throw error;
        }
      }
      
      return fileUrls;
    } catch (error) {
      console.error('Erreur lors du processus de téléversement:', error);
      showErrorAlert('Une erreur est survenue lors du téléversement des fichiers. Veuillez réessayer.');
      throw error;
    } finally {
      // Hide upload progress
      setTimeout(() => {
        showUploadProgress(false);
        isSubmitting = false;
        setSubmitButtonState(false);
      }, 1000);
    }
  }
,

/**
 * Show or hide the upload progress bar
 * @param {boolean} show - Whether to show or hide the progress bar
 */
function showUploadProgress(show) {
  try {
    // Récupérer les éléments DOM nécessaires
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressText = document.querySelector('.progress-text .progress-percentage');
    
    if (!progressBar || !progressText) {
      console.error('Éléments de progression non trouvés');
      return;
    }
    
    if (show) {
      progressBar.parentElement.parentElement.style.display = 'block';
      progressBar.style.width = '0%';
      if (progressText) {
        progressText.textContent = 'Préparation...';
      }
    } else {
      progressBar.parentElement.parentElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Erreur dans showUploadProgress:', error);
  }
}

/**
 * Update the upload progress bar
 */
function updateUploadProgress(currentFile, totalFiles, percentComplete) {
  if (!progressBar || !progressText) return;
  
  // Calculate overall progress
  const fileProgress = (currentFile / totalFiles) * 100;
  const currentFileProgress = (percentComplete / 100) * (1 / totalFiles) * 100;
  const overallProgress = Math.min(100, Math.round(((currentFile / totalFiles) * 100) + currentFileProgress));
  
  // Update progress bar
  progressBar.style.width = `${overallProgress}%`;
  
  // Update progress text
  if (currentFile < totalFiles) {
    progressText.textContent = `Téléversement du fichier ${currentFile + 1} sur ${totalFiles} (${percentComplete}%)`;
  } else {
    progressText.textContent = 'Téléversement terminé !';
  }
}

/**
 * Set the submit button loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
function setSubmitButtonState(isLoading) {
  if (!submitBtn) return;
  
  const submitText = submitBtn.querySelector('.submit-text');
  const spinner = submitBtn.querySelector('.spinner-border');
  
  if (isLoading) {
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Envoi en cours...';
    if (spinner) spinner.classList.remove('d-none');
  } else {
    submitBtn.disabled = false;
    if (submitText) submitText.textContent = 'Envoyer le signalement';
    if (spinner) spinner.classList.add('d-none');
  }
}

/**
 * Show success message after form submission
 */
function showSuccess() {
  const reportSection = document.querySelector(".report-section");
  const confirmationSection = document.getElementById("confirmation");
  
  if (reportSection) reportSection.style.display = "none";
  if (confirmationSection) {
    confirmationSection.classList.remove("hidden");
    confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Reset form
  if (form) form.reset();
  
  // Reset to first step
  showStep(0);
  
  // Show success message with animation
  const checkmark = document.querySelector('.checkmark');
  if (checkmark) {
    checkmark.style.animation = 'none';
    void checkmark.offsetWidth; // Trigger reflow
    checkmark.style.animation = 'checkmark 0.6s ease';
  }
}

/**
 * Show an error alert to the user
 * @param {string} message - The error message to display
 */
function showErrorAlert(message) {
  // You can replace this with a more sophisticated alert system
  alert(`Erreur: ${message}`);
}
// Matrix Animation
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  
  // Initial resize
  resizeCanvas();
  
  // Adjust on window resize
  window.addEventListener('resize', resizeCanvas);
  
  // Matrix characters
  const letters = '01XyberShield';
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  // Draw the matrix effect
  function drawMatrix() {
    // Set background with opacity for trail effect
    ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.fillStyle = '#39FF14';
    ctx.font = `${fontSize}px monospace`;
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      
      // Draw character
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      // Reset drop to top of screen when it reaches bottom
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      // Move drop down
      drops[i]++;
    }
  }
  
  // Start animation
  const animationInterval = setInterval(drawMatrix, 35);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(animationInterval);
  });
}

// Initialize form on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set default date to today
  const dateInput = document.getElementById('incident-date');
  if (dateInput && !dateInput.value) {
    const now = new Date();
    // Format: YYYY-MM-DDThh:mm
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    dateInput.value = localDateTime;
  }
  
  // Initialize file upload if elements exist
  if (fileInput && fileUploadContainer) {
    initFileUpload();
  }
  
  // Initialize first step
  showStep(0);
});

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
  // Handle file selection
  fileInput.addEventListener('change', handleFileSelect);
  
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileUploadContainer.addEventListener(eventName, preventDefaults, false);
  });
  
  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    fileUploadContainer.addEventListener(eventName, highlight, false);
  });
  
  // Remove highlight when item leaves drop zone
  ['dragleave', 'drop'].forEach(eventName => {
    fileUploadContainer.addEventListener(eventName, unhighlight, false);
  });
  
  // Handle dropped files
  fileUploadContainer.addEventListener('drop', handleDrop, false);
  
  // Initialize file preview container
  updateFilePreview();
}

/**
 * Prevent default drag and drop behavior
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Highlight drop zone
 */
function highlight() {
  fileUploadContainer.classList.add('drag-over');
}

/**
 * Remove highlight from drop zone
 */
function unhighlight() {
  fileUploadContainer.classList.remove('drag-over');
}

/**
 * Handle dropped files
 */
function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

/**
 * Handle file selection via input
 */
function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

/**
 * Process selected files
 */
async function handleFiles(files) {
  // Reset file input to allow selecting the same file again
  fileInput.value = '';
  
  // Check if adding these files would exceed the maximum
  if (uploadedFiles.length + files.length > MAX_FILES) {
    showFileError(`Vous ne pouvez téléverser que ${MAX_FILES} fichiers maximum.`);
    return;
  }
  
  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showFileError(`Type de fichier non supporté: ${file.name}. Types acceptés: JPG, PNG, PDF, DOC, DOCX, TXT`);
      continue;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      showFileError(`Le fichier ${file.name} dépasse la taille maximale de 5 Mo.`);
      continue;
    }
    
    // Generate preview
    const preview = await generatePreview(file);
    
    // Add to uploaded files
    uploadedFiles.push({
      file,
      id: Date.now() + i,
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
      status: 'pending'
    });
  }
  
  // Update the preview
  updateFilePreview();
}

/**
 * Generate a preview for a file
 */
async function generatePreview(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    } else {
      // For non-image files, use an icon based on file type
      let iconClass = 'fa-file';
      if (file.type.includes('pdf')) iconClass = 'fa-file-pdf';
      else if (file.type.includes('word')) iconClass = 'fa-file-word';
      else if (file.type.includes('text')) iconClass = 'fa-file-alt';
      
      resolve(`<i class="fas ${iconClass} fa-3x"></i>`);
    }
  });
}

/**
 * Update the file preview UI
 */
function updateFilePreview() {
  if (!filePreviewContainer) return;
  
  if (uploadedFiles.length === 0) {
    filePreviewContainer.innerHTML = '<div class="no-files">Aucun fichier sélectionné</div>';
    return;
  }
  
  filePreviewContainer.innerHTML = '';
  
  uploadedFiles.forEach((file, index) => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file-preview-item';
    fileElement.dataset.id = file.id;
    
    let previewContent = '';
    
    if (file.type.startsWith('image/')) {
      previewContent = `<img src="${file.preview}" alt="${file.name}" class="file-preview-thumbnail">`;
    } else {
      previewContent = `
        <div class="file-preview-thumbnail" style="display: flex; align-items: center; justify-content: center; background: rgba(30, 144, 255, 0.1);">
          ${file.preview}
        </div>`;
    }
    
    fileElement.innerHTML = `
      ${previewContent}
      <div class="file-preview-details">
        <div class="file-name" title="${file.name}">${truncateFileName(file.name, 15)}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
      </div>
      <button class="file-preview-remove" data-id="${file.id}" title="Supprimer">&times;</button>
    `;
    
    filePreviewContainer.appendChild(fileElement);
  });
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.file-preview-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const fileId = parseInt(e.target.dataset.id);
      removeFile(fileId);
    });
  });
}

/**
 * Remove a file from the upload queue
 */
function removeFile(fileId) {
  uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
  updateFilePreview();
}

/**
 * Show file upload error
 */
function showFileError(message) {
  const errorContainer = document.getElementById('file-upload-errors');
  if (errorContainer) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'file-upload-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorContainer.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

/**
 * Format file size in a human-readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate file name if it's too long
 */
function truncateFileName(name, maxLength) {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
}
