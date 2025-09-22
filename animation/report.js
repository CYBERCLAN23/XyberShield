/*
===============================================================================
                    CYBERSECURITY REPORT FORM JAVASCRIPT
===============================================================================

Project: XyberShield Cyber Threat Report Form
Author: XyberShield Development Team
Version: 2.0
Description: Interactive multi-step form with validation, file upload, custom dropdown,
            loading animations, and matrix background effects.

Features:
- Multi-step form navigation with progress tracking
- Professional custom dropdown with FontAwesome icons
- File upload with drag & drop functionality
- Form validation with error handling
- Loading animations between steps
- Matrix background animation
- API integration for form submission
- Responsive design support

===============================================================================
*/

console.log('🚀 XyberShield Report Form - Initializing...');

/* ===========================================
   GLOBAL CONFIGURATION & VARIABLES
   =========================================== */

// API Configuration - Handles both development and production environments
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : 'https://xybershield-api.vercel.app';

// Global form state variables
let currentStep = 0;        // Current active form step
let isSubmitting = false;   // Prevents multiple form submissions
let totalSteps = 0;         // Total number of form steps

/**
 * Get API URL for different environments
 * @param {string} endpoint - API endpoint to call
 * @returns {string} Complete API URL
 */
function getApiUrl(endpoint) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${config.PRODUCTION_API_URL}${endpoint}`;
  }
  return `${config.API_BASE_URL}${endpoint}`;
}

/* ===========================================
   MAIN INITIALIZATION
   =========================================== */

// Initialize form when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeForm);

/**
 * Main form initialization function
 * Sets up all form components, event listeners, and UI elements
 */
function initializeForm() {
  console.log('📋 Initializing multi-step form...');
  
  // Check if main form exists in DOM
  const form = document.getElementById('multiStepForm');
  if (!form) {
    console.error('❌ Error: Multi-step form not found in DOM');
    return;
  }
  
  console.log('✅ Form found successfully');
  
  // Initialize DOM elements and global variables
  const steps = document.querySelectorAll('.form-step');
  const formSteps = document.querySelectorAll('.form-step');
  totalSteps = steps.length;
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const progress = document.getElementById('progress');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  // Validate required elements exist
  if (!steps.length || !nextBtns.length || !prevBtns.length || !progress || !progressSteps.length) {
    console.error('❌ Error: Required form elements missing');
    return;
  }
  
  console.log(`📊 Form initialized with ${totalSteps} steps`);

  /* ===========================================
     PROGRESS BAR MANAGEMENT
     =========================================== */
  
  /**
   * Updates the progress bar and step indicators
   * Shows current progress through the form steps
   */
  function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressActive = document.querySelectorAll('.progress-step-active');
    let progress = 0;
  
    if (progressSteps.length > 0 && progressActive.length > 0) {
      progress = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100;
      const progressBar = document.getElementById('progress');
      if (progressBar) {
        progressBar.style.width = progress + '%';
        // Force reflow to ensure the transition works
        progressBar.offsetHeight;
      }
    }
    
    console.log('Mise à jour de la barre de progression...');
    console.log('Barre de progression mise à jour à', Math.round(progress) + '%');
    return progress;
  }
  
  // Afficher la première étape
  showStep(currentStep);

  // Ajouter les écouteurs d'événements
  // NOTE: Ne pas ajouter ici un gestionnaire "Suivant" qui incrémente l'étape
  // Un gestionnaire complet est défini plus bas (section "Initialisation des boutons Suivant")

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });
  
  // Fonction pour afficher une étape spécifique
  function showStep(stepIndex) {
    // Show loading animation
    showLoadingOverlay();
    
    setTimeout(() => {
      currentStep = stepIndex;
      steps.forEach((step, idx) => {
        step.classList.toggle('active', idx === currentStep);
        step.style.display = idx === currentStep ? 'block' : 'none';
      });
      
      // Mettre à jour la barre de progression
      updateProgressBar();
      
      // Hide loading animation
      hideLoadingOverlay();
    }, 800); // 800ms loading delay
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
    
    // Clear all previous errors first
    steps[stepIndex].querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
    steps[stepIndex].querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });

    // Validate each input
    inputs.forEach(input => {
      const errorElement = document.getElementById(`${input.name}-error`);
      if (errorElement) {
        errorElement.style.display = 'none';
      }
      
      input.classList.remove('is-invalid');
      
      // Check for empty required fields
      if (!input.value.trim()) {
        showError(input, 'Ce champ est requis');
        isValid = false;
        return; // Skip further validation for this field
      }
      
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          showError(input, 'Veuillez entrer une adresse email valide');
          isValid = false;
        }
      }
      
      // Phone number validation (if needed)
      if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[0-9\s+\-()]*$/;
        if (!phoneRegex.test(input.value.trim())) {
          showError(input, 'Veuillez entrer un numéro de téléphone valide');
          isValid = false;
        }
      }
    });
    
    // Scroll to first error if any
    if (!isValid) {
      const firstError = steps[stepIndex].querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return isValid;
  }

  
  // Fonction pour afficher une erreur
  function showError(input, message) {
    // Add invalid class to input
    input.classList.add('is-invalid');
    
    // Create or get error element
    let errorElement = document.getElementById(`${input.name}-error`);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${input.name}-error`;
      errorElement.className = 'error-message';
      
      // Find the form group
      const formGroup = input.closest('.form-group');
      
      if (formGroup) {
        // Insert the error message after the input element
        input.insertAdjacentElement('afterend', errorElement);
      } else {
        // Fallback: append to parent
        input.parentNode.appendChild(errorElement);
      }
    }
    
    // Update error message and show it
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Ensure error message is visible
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Add focus to the first invalid field
    if (!document.querySelector('.is-invalid:focus')) {
      input.focus({ preventScroll: true });
    }
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
  const progressText = document.querySelector('.progress-text .progress-percentage');
  
  // Initialiser le téléchargement de fichiers
  initFileUpload();

  // Fonction pour initialiser le téléchargement de fichiers
  function initFileUpload() {
    if (fileInput && fileUploadContainer) {
      fileInput.addEventListener('change', handleFileSelect);
      
      // Add click handler to file upload container
      fileUploadContainer.addEventListener('click', () => {
        fileInput.click();
      });

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
    updateFileUploadProgressBar();
  }

  // Afficher l'aperçu d'un fichier
  function displayFilePreview(file) {
    if (!filePreviewContainer) return;

    const reader = new FileReader();
    const previewItem = document.createElement('div');
    previewItem.className = 'file-preview-item';
    previewItem.dataset.fileName = file.name;

    // Inner structure of the preview item
    let previewContent = '';

    reader.onload = function(e) {
      if (file.type.startsWith('image/')) {
        previewContent = `
          <img src="${e.target.result}" alt="${file.name}" class="file-preview-thumbnail">
          <div class="file-preview-details">
            <span class="file-name">${file.name}</span>
          </div>
        `;
      } else {
        let iconClass = 'fas fa-file-alt'; // Default icon
        if (file.type === 'application/pdf') iconClass = 'fas fa-file-pdf';
        if (file.type.includes('word')) iconClass = 'fas fa-file-word';

        previewContent = `
          <div class="file-icon-container">
            <i class="${iconClass}"></i>
          </div>
          <div class="file-preview-details">
            <span class="file-name">${file.name}</span>
          </div>
        `;
      }

      previewItem.innerHTML = `
        ${previewContent}
        <div class="file-upload-progress"><div class="progress"></div></div>
        <button type="button" class="file-preview-remove" aria-label="Remove file">×</button>
      `;

      filePreviewContainer.appendChild(previewItem);

      // Add event listener for the remove button
      previewItem.querySelector('.file-preview-remove').addEventListener('click', () => {
        removeFile(file.name);
      });
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      // For non-image files, trigger onload immediately to show icon
      reader.onload({ target: { result: null } });
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
    updateFileUploadProgressBar();
  }

  // Formater la taille du fichier
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Mettre à jour la barre de progression du téléversement
  function updateFileUploadProgressBar() {
    if (!progressBar || !progressText) return;

    const totalSize = uploadedFiles.reduce((total, file) => total + file.size, 0);
    const percentage = Math.min(100, (totalSize / MAX_TOTAL_SIZE) * 100);

    if (progressBar) progressBar.style.width = `${percentage}%`;
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
  function updateProgressBar() {
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
    const progressPercentage = progressSteps.length > 1 ? ((actives.length - 1) / (progressSteps.length - 1)) * 100 : 0;
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
      console.warn('Tentative d\'affichage d\'une étape négative:', step);
      console.groupEnd();
      return;
    }
    
    if (step >= totalSteps) {
      console.warn('Tentative d\'affichage d\'une étape inexistante:', step, '(total:', totalSteps, ')');
      console.groupEnd();
      return;
    }
    
    console.log('Étape actuelle:', currentStep, '-> Nouvelle étape:', step);
    
    // Show loading animation
    showLoadingOverlay();
    
    setTimeout(() => {
      // Masquer toutes les étapes
      formSteps.forEach((formStep, index) => {
        if (formStep) {
          formStep.classList.remove('active');
          formStep.style.display = 'none';
          console.log(`Étape ${index + 1} masquée`);
        }
      });
      
      // Afficher l'étape demandée
      if (formSteps[step]) {
        formSteps[step].classList.add('active');
        formSteps[step].style.display = 'block';
        console.log(`Étape ${step + 1} affichée`);
      }
      
      // Mettre à jour l'étape actuelle
      currentStep = step;
      
      // Mettre à jour la barre de progression
      updateProgressBar();
      
      // Mettre à jour les boutons
      updateNavigationButtons();
      
      console.log('Nouvelle étape actuelle:', currentStep);
      console.groupEnd();
      
      // Hide loading animation
      hideLoadingOverlay();
    }, 800); // 800ms loading delay
    
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
    console.log('Bouton Précédent visible:', shouldShowPrev ? 'oui' : 'non');
    
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
  const nextButtons = document.querySelectorAll('.next-btn');
  nextButtons.forEach((btn, index) => {
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
  const prevButtons = document.querySelectorAll('.prev-btn');
  prevButtons.forEach((btn, index) => {
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
   const API_REPORTS_URL = `${API_BASE_URL}/api/reports`;
  const API_UPLOAD_URL = `${API_BASE_URL}/api/upload`;

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Clear global validation message
    const globalValidation = document.getElementById('form-validation-message');
    if (globalValidation) {
      globalValidation.style.display = 'none';
      globalValidation.textContent = '';
    }

    // Validate all steps before submission
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        // If validation fails, go to that step
        showStep(i);
        if (globalValidation) {
          globalValidation.textContent = 'Veuillez corriger les erreurs dans les étapes précédentes avant de soumettre le formulaire.';
          globalValidation.style.display = 'block';
          globalValidation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }
    
    // Check consent
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox?.checked) {
      showError(consentCheckbox, 'Vous devez accepter les conditions pour continuer');
      consentCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (globalValidation) {
        globalValidation.textContent = 'Vous devez accepter la politique de confidentialité pour soumettre votre signalement.';
        globalValidation.style.display = 'block';
        globalValidation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Set loading state
      isSubmitting = true;
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Collect form data
      const formData = new FormData(form);
      const reportData = {};
      formData.forEach((value, key) => {
        if (key !== 'evidence' && key !== 'consent') { // Exclure les fichiers et le consentement
          reportData[key] = value;
        }
      });

      // Handle anonymous checkbox
      reportData.anonymous = document.getElementById('anonymous')?.checked || false;
      
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
            
            xhr.open('POST', API_UPLOAD_URL, true);
            
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

      reportData.evidence = fileUrls; // Ajouter les URLs des fichiers au rapport

      // Send report data to the backend
      const response = await fetch(API_REPORTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(reportData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Échec de l\'envoi du signalement.');
      }

      console.log('Signalement envoyé avec succès:', result);
      showSuccess(); // Afficher le message de succès

    } catch (error) {
      console.error('Erreur lors de l\'envoi du signalement:', error);
      showErrorAlert(error.message || 'Une erreur est survenue lors de l\'envoi du signalement. Veuillez réessayer.');
      
      // Scroll to top to show the alert
      window.scrollTo({ top: 0, behavior: 'smooth' });

      throw error;
    } finally {
      isSubmitting = false;
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Hide upload progress
      setTimeout(() => {
        showUploadProgress(false);
        isSubmitting = false;
        setSubmitButtonState(false);
      }, 1000);
    }
  });
}
/**
 * Show or hide the upload progress bar
 * @param {boolean} show - Whether to show or hide the progress bar
 */
function showUploadProgress(show) {
  try {
    // Récupérer les éléments DOM nécessaires
    const progressBarContainer = document.querySelector('.upload-progress-container');
    const progressBar = document.querySelector('.upload-progress-bar');
    
    if (!progressBar || !progressText) {
      console.error('Éléments de progression non trouvés');
      return;
    }
    
    if (show) {
      if (progressBarContainer) progressBarContainer.style.display = 'block';
      progressBar.style.width = '0%';
      if (progressText) {
        progressText.textContent = 'Préparation...';
      }
    } else {
      if (progressBarContainer) progressBarContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Erreur dans showUploadProgress:', error);
  }
}

/**
 * Update the upload progress bar
 */
function updateUploadProgress(currentFile, totalFiles, percentComplete) {
  const uploadProgressBar = document.querySelector('.upload-progress-bar');
  const uploadProgressText = document.querySelector('.progress-text .progress-percentage');
  if (!uploadProgressBar || !uploadProgressText) return;
  
  // Calculate overall progress
  const overallProgress = Math.min(100, Math.round(((currentFile + (percentComplete / 100)) / totalFiles) * 100));
  
  // Update progress bar
  uploadProgressBar.style.width = `${overallProgress}%`;
  
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
  const submitBtn = document.querySelector('button[type="submit"]');
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

/**
 * Show loading overlay
 */
function showLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('show');
  }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('show');
  }
}
/**
 * Initialize the matrix background animation
 */
function initMatrixBackground() {
  // Matrix Animation
  const canvas = document.getElementById('matrix-bg'); // Utiliser l'ID du canvas existant
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
  const letters = '01XyberShield'; // Utiliser les mêmes lettres que dans script.js
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  // Draw the matrix effect
  function drawMatrix() {
    // Set background with opacity for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Utiliser la même couleur que dans script.js
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style (couleur du texte)
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
  const animationInterval = setInterval(drawMatrix, 35); // Même intervalle que script.js
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(animationInterval);
  });
}
}

// Variables globales pour le téléchargement de fichiers (déclarées en dehors de initializeForm)


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

  // Initialize matrix background
  initMatrixBackground();
  
  // Initialize custom dropdown
  initCustomDropdown();
});

// Custom Dropdown Functionality
function initCustomDropdown() {
  const customSelect = document.getElementById('incident-type-dropdown');
  if (!customSelect) return;
  
  const selectTrigger = customSelect.querySelector('.select-trigger');
  const selectOptions = customSelect.querySelector('.select-options');
  const selectText = customSelect.querySelector('.select-text');
  const hiddenInput = document.getElementById('type');
  const options = customSelect.querySelectorAll('.select-option');

  // Toggle dropdown
  selectTrigger.addEventListener('click', () => {
    customSelect.classList.toggle('active');
    selectTrigger.classList.toggle('active');
  });

  // Handle option selection
  options.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-value');
      const text = option.querySelector('span').textContent;
      const icon = option.querySelector('.option-icon').outerHTML;

      // Update display
      selectText.innerHTML = icon + ' ' + text;
      selectText.classList.remove('placeholder');

      // Update hidden input
      hiddenInput.value = value;

      // Update selected state
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Close dropdown
      customSelect.classList.remove('active');
      selectTrigger.classList.remove('active');

      // Clear any validation errors
      const errorElement = document.getElementById('type-error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('active');
      selectTrigger.classList.remove('active');
    }
  });

  // Keyboard navigation
  selectTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      customSelect.classList.toggle('active');
      selectTrigger.classList.toggle('active');
    }
  });

  // Option keyboard navigation
  options.forEach((option, index) => {
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextOption = options[index + 1];
        if (nextOption) nextOption.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevOption = options[index - 1];
        if (prevOption) prevOption.focus();
      }
    });
  });
}

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
  const fileInput = document.getElementById('evidence');
  const fileUploadContainer = document.querySelector('.file-upload-container');
  // Handle file selection
  if (!fileInput || !fileUploadContainer) return; // S'assurer que les éléments existent
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
  const fileInput = document.getElementById('evidence');

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
  updateProgressBar(); // Mettre à jour la barre de progression des fichiers
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
  const filePreviewContainer = document.getElementById('file-preview');
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
  updateProgressBar(); // Mettre à jour la barre de progression des fichiers
}

/**
 * Show file upload error
 */
function showFileError(message) {
  const errorContainer = document.getElementById('file-upload-errors');
  if (errorContainer) {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = '#ff5252'; // Style d'erreur
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
