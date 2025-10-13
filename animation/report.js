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
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

// Global form state variables
let currentStep = 0;        // Current active form step
let isSubmitting = false;   // Prevents multiple form submissions
let totalSteps = 0;         // Total number of form steps
let formSteps = [];         // Form step elements
let steps = [];             // Step elements
let progress = null;        // Progress bar element
let progressSteps = [];     // Progress step elements
let uploadedFiles = [];     // Uploaded files array

// File upload constants
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total

/* ===========================================
   CORE FORM FUNCTIONS
   =========================================== */

/**
 * Updates the progress bar and step indicators
 */
function updateProgressBar() {
  console.log('🔄 Updating progress bar...');
  if (!progress || !progressSteps.length) {
    console.error('❌ Progress elements not found');
    return;
  }
  
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
  progress.style.width = progressPercentage + '%';
  
  // Update progress steps
  progressSteps.forEach((step, index) => {
    if (index < currentStep) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (index === currentStep) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
  
  console.log(`✅ Progress updated: ${progressPercentage.toFixed(1)}%`);
}

/**
 * Show a specific form step
 */
function showStep(step) {
  console.group(`=== showStep(${step}) ===`);
  
  // Validation des limites
  if (step < 0 || step >= totalSteps) {
    console.warn(`❌ Invalid step: ${step} (total: ${totalSteps})`);
    console.groupEnd();
    return;
  }
  
  console.log(`📍 Changing from step ${currentStep} to step ${step}`);
  
  // Masquer toutes les étapes
  formSteps.forEach((formStep, index) => {
    if (formStep) {
      formStep.classList.remove('active');
      formStep.style.display = 'none';
    }
  });
  
  // Afficher l'étape demandée
  if (formSteps[step]) {
    formSteps[step].style.display = 'block';
    formSteps[step].offsetHeight; // Force reflow
    formSteps[step].classList.add('active');
    console.log(`✅ Step ${step + 1} is now active`);
  }
  
  // Mettre à jour l'étape actuelle
  currentStep = step;
  
  // Mettre à jour la barre de progression
  updateProgressBar();
  
  console.groupEnd();
}

/**
 * Update navigation buttons visibility
 */
function updateNavigationButtons() {
  console.log('🔄 Updating navigation buttons for step:', currentStep);
  
  // Get buttons from the current active step
  const currentStepElement = document.querySelector('.form-step.active');
  if (!currentStepElement) {
    console.error('❌ No active step found');
    return;
  }
  
  const prevBtn = currentStepElement.querySelector('.prev-btn');
  const nextBtn = currentStepElement.querySelector('.next-btn');
  const submitBtn = currentStepElement.querySelector('.submit-btn');
  
  // Show/hide previous button
  if (prevBtn) {
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-flex';
    console.log('🔘 Previous button:', currentStep === 0 ? 'hidden' : 'visible');
  }
  
  // Show/hide next button
  if (nextBtn) {
    if (currentStep === totalSteps - 1) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }
    console.log('🔘 Next button:', currentStep === totalSteps - 1 ? 'hidden' : 'visible');
  }
  
  // Show/hide submit button
  if (submitBtn) {
    submitBtn.style.display = currentStep === totalSteps - 1 ? 'inline-flex' : 'none';
    console.log('🔘 Submit button:', currentStep === totalSteps - 1 ? 'visible' : 'hidden');
  }
}

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
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Starting form initialization...');
  
  // Debug: Check if elements exist before initialization
  const form = document.getElementById('multiStepForm');
  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  
  console.log('🔍 Debug - Form element:', form);
  console.log('🔍 Debug - Steps found:', steps.length);
  console.log('🔍 Debug - Next buttons found:', nextBtns.length);
  
  if (form && steps.length > 0 && nextBtns.length > 0) {
    console.log('✅ All required elements found, initializing...');
    initializeForm();
  } else {
    console.error('❌ Missing required elements!');
    console.error('Form:', form);
    console.error('Steps:', steps.length);
    console.error('Next buttons:', nextBtns.length);
  }
});

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
  formSteps = document.querySelectorAll('.form-step');
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
  console.log('🚀 Affichage de la première étape...');
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
  
  // Note: showStep function is defined later in the file to avoid conflicts
  
  // Fonction pour mettre à jour les boutons de navigation
    function updateButtons() {
    prevBtns.forEach(btn => {
      btn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    });
    nextBtns.forEach(btn => {
      btn.textContent = currentStep === totalSteps - 1 ? 'Envoyer' : 'Suivant';
    });
  }
    
 
  // Fonction pour valider une étape
  function validateStep(stepIndex) {
    const inputs = formSteps[stepIndex].querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    // Clear all previous errors first
    formSteps[stepIndex].querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
    formSteps[stepIndex].querySelectorAll('.is-invalid').forEach(el => {
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

  
  // Variables pour le téléchargement de fichiers (utilise les constantes globales)
  const MAX_FILES = 5;

  // Récupérer les éléments du DOM pour le téléchargement de fichiers
  const fileInput = document.getElementById('evidence');
  const fileUploadContainer = document.querySelector('.file-upload-container');
  const filePreviewContainer = document.getElementById('file-preview');
  const progressBar = document.querySelector('.progress');
  const progressText = document.querySelector('.progress-text .progress-percentage');
  
  // Note: initFileUpload() is defined globally below

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
      // Masquer toutes les étapes avec animation
      formSteps.forEach((formStep, index) => {
        if (formStep) {
          formStep.classList.remove('active');
          formStep.style.display = 'none';
          console.log(`Étape ${index + 1} masquée`);
        }
      });
      
      // Afficher l'étape demandée avec animation
      if (formSteps[step]) {
        formSteps[step].style.display = 'block';
        // Force reflow pour s'assurer que l'animation fonctionne
        formSteps[step].offsetHeight;
        formSteps[step].classList.add('active');
        console.log(`Étape ${step + 1} affichée et marquée comme active`);
        
        // Animer les éléments de l'étape
        const formGroups = formSteps[step].querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
          group.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
      }
      
      // Mettre à jour l'étape actuelle
      currentStep = step;
      
      // Mettre à jour la barre de progression avec animation
      updateProgressBar();
      
      // Mettre à jour les boutons APRÈS avoir mis à jour currentStep
      console.log('🔄 Mise à jour des boutons pour l\'étape:', currentStep);
      updateNavigationButtons();
      
      console.log('Nouvelle étape actuelle:', currentStep);
      console.groupEnd();
      
      // Hide loading animation
      hideLoadingOverlay();
    }, 600); // Reduced delay for better UX
    
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
    
    console.groupEnd();
  }
  
  // Note: updateNavigationButtons function is defined globally above

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
  const API_REPORTS_URL = `${API_BASE_URL}/reports`;

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

      // Create FormData for the complete submission (data + files)
      const formData = new FormData();
      
      // Add form fields to FormData
      const formElements = form.elements;
      for (let element of formElements) {
        if (element.name && element.name !== 'evidence' && element.name !== 'consent') {
          if (element.type === 'checkbox') {
            formData.append(element.name, element.checked);
          } else if (element.type !== 'file') {
            formData.append(element.name, element.value);
          }
        }
      }

      // Add files to FormData
      uploadedFiles.forEach((file, index) => {
        formData.append('files', file.file || file);
      });

      // Get authentication token
      const token = localStorage.getItem('token');
      
      // Prepare headers
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Show upload progress
      const progressContainer = document.getElementById('upload-progress');
      if (progressContainer) {
        progressContainer.style.display = 'block';
      }

      // Simulate form submission for demo
      console.log('📤 Simulating form submission (legacy handler)...');
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        updateUploadProgress(1, 1, i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Simulate successful response
      const response = {
        success: true,
        message: 'Report submitted successfully',
        data: {
          referenceNumber: 'XS-' + Date.now().toString().slice(-8)
        }
      };

      console.log('✅ Signalement envoyé avec succès (simulé):', response);
      
      // Store reference number for success page
      if (response.data && response.data.referenceNumber) {
        sessionStorage.setItem('reportReference', response.data.referenceNumber);
      }
      
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
 * Show success message with reference number
 */
function showSuccess() {
  const referenceNumber = sessionStorage.getItem('reportReference');
  
  // Hide the form
  const formContainer = document.querySelector('.report-section');
  if (formContainer) {
    formContainer.style.display = 'none';
  }
  
  // Create success message
  const successHtml = `
    <div class="success-container" style="
      text-align: center; 
      padding: 60px 20px; 
      background: linear-gradient(135deg, rgba(0, 255, 102, 0.1), rgba(0, 204, 68, 0.1));
      border-radius: 15px;
      border: 2px solid #00ff66;
      margin: 40px auto;
      max-width: 600px;
    ">
      <div style="font-size: 4rem; color: #00ff66; margin-bottom: 20px;">
        <i class="fas fa-check-circle"></i>
      </div>
      
      <h2 style="color: #00ff66; margin-bottom: 20px; font-size: 2rem;">
        🎉 Signalement envoyé avec succès !
      </h2>
      
      ${referenceNumber ? `
        <div style="
          background: rgba(0, 0, 0, 0.3); 
          padding: 20px; 
          border-radius: 10px; 
          margin: 30px 0;
          border: 1px solid #00ff66;
        ">
          <h3 style="color: #fff; margin-bottom: 10px;">Numéro de référence :</h3>
          <div style="
            font-size: 1.5rem; 
            font-weight: bold; 
            color: #00ff66; 
            font-family: monospace;
            letter-spacing: 2px;
          ">${referenceNumber}</div>
          <p style="color: #ccc; margin-top: 15px; font-size: 0.9rem;">
            📋 Conservez ce numéro pour suivre votre signalement
          </p>
        </div>
      ` : ''}
      
      <div style="margin: 30px 0;">
        <p style="color: #fff; font-size: 1.1rem; line-height: 1.6;">
          Votre signalement a été reçu et sera traité par notre équipe de sécurité.<br>
          Vous recevrez une confirmation par email sous peu.
        </p>
      </div>
      
      <div style="margin-top: 40px;">
        <button onclick="window.location.href='index.html'" style="
          background: linear-gradient(135deg, #00ff66, #00cc44);
          color: #000;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          margin: 0 10px;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <i class="fas fa-home"></i> Retour à l'accueil
        </button>
        
        ${referenceNumber ? `
          <button onclick="trackReport('${referenceNumber}')" style="
            background: transparent;
            color: #00ff66;
            border: 2px solid #00ff66;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='rgba(0,255,102,0.1)'" onmouseout="this.style.background='transparent'">
            <i class="fas fa-search"></i> Suivre mon signalement
          </button>
        ` : ''}
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0,255,102,0.3);">
        <p style="color: #888; font-size: 0.9rem;">
          <i class="fas fa-shield-alt"></i> 
          Merci de contribuer à la sécurité de notre communauté
        </p>
      </div>
    </div>
  `;
  
  // Insert success message
  const container = document.querySelector('.container') || document.body;
  const successDiv = document.createElement('div');
  successDiv.innerHTML = successHtml;
  container.appendChild(successDiv);
  
  // Scroll to success message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Clear the reference number from session storage
  sessionStorage.removeItem('reportReference');
}

/**
 * Track report function
 */
function trackReport(referenceNumber) {
  // You can implement report tracking functionality here
  alert(`Fonctionnalité de suivi en développement.\nNuméro de référence: ${referenceNumber}`);
}

/**
 * Show error alert
 */
function showErrorAlert(message) {
  const alertHtml = `
    <div class="alert alert-danger" style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      border: 2px solid #ff4444;
      background: rgba(255, 68, 68, 0.1);
      color: #fff;
      padding: 15px;
      border-radius: 10px;
    ">
      <i class="fas fa-exclamation-triangle"></i> ${message}
      <button onclick="this.parentElement.remove()" style="
        float: right;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
      ">&times;</button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', alertHtml);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const alert = document.querySelector('.alert-danger');
    if (alert) alert.remove();
  }, 5000);
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

// Variables globales pour le téléchargement de fichiers (déjà déclarées en haut)
const MAX_FILES = 5;


// Set default date function with time
function setDefaultDate() {
  const dateInput = document.getElementById('incident-date');
  if (dateInput && !dateInput.value) {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    dateInput.value = localDateTime;
    console.log('📅 Auto-filled:', localDateTime);
  }
}

// Auto-detect location and fill region
async function initAutoLocation() {
  if (!navigator.geolocation) return;
  
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {timeout: 5000});
    });
    
    const regionSelect = document.getElementById('region');
    if (regionSelect && !regionSelect.value) {
      // Simple region detection for Cameroon
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      
      if (lat >= 3.5 && lat <= 4.5 && lng >= 11 && lng <= 12) {
        regionSelect.value = 'centre';
      } else if (lat >= 3.8 && lat <= 4.2 && lng >= 9.5 && lng <= 10.5) {
        regionSelect.value = 'littoral';
      }
      
      if (regionSelect.value) {
        console.log('🏠 Region auto-detected:', regionSelect.value);
      }
    }
  } catch (e) {
    console.log('Location detection failed');
  }
}

// Manual time setting
function setCurrentDateTime() {
  const dateInput = document.getElementById('incident-date');
  if (dateInput) {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    dateInput.value = localDateTime;
  }
}

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
  console.log('📁 Initializing file upload...');
  
  const fileInput = document.getElementById('evidence');
  const fileUploadContainer = document.querySelector('.file-upload-container');
  
  if (!fileInput || !fileUploadContainer) {
    console.error('❌ File upload elements not found');
    return;
  }
  
  console.log('✅ File upload elements found');
  
  // Handle file selection via input
  fileInput.addEventListener('change', handleFileSelect);
  
  // Handle click on upload container to trigger file selection
  fileUploadContainer.addEventListener('click', () => {
    console.log('📁 Upload container clicked');
    fileInput.click();
  });
  
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
  
  console.log('✅ File upload initialized successfully');
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
  const fileUploadContainer = document.querySelector('.file-upload-container');
  if (fileUploadContainer) {
    fileUploadContainer.classList.add('drag-over');
  }
}

/**
 * Remove highlight from drop zone
 */
function unhighlight() {
  const fileUploadContainer = document.querySelector('.file-upload-container');
  if (fileUploadContainer) {
    fileUploadContainer.classList.remove('drag-over');
  }
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
  console.log('📁 Files selected:', e.target.files.length);
  const files = e.target.files;
  if (files && files.length > 0) {
    handleFiles(files);
  }
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
 * Get file icon based on file type
 */
function getFileIcon(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const type = file.type.toLowerCase();
  
  // Images
  if (type.startsWith('image/')) {
    return '<i class="fas fa-image" style="color: #4cbe85;"></i>';
  }
  
  // PDFs
  if (extension === 'pdf' || type === 'application/pdf') {
    return '<i class="fas fa-file-pdf" style="color: #ff5252;"></i>';
  }
  
  // Word documents
  if (extension === 'doc' || extension === 'docx' || type.includes('word')) {
    return '<i class="fas fa-file-word" style="color: #2196f3;"></i>';
  }
  
  // Excel
  if (extension === 'xls' || extension === 'xlsx' || type.includes('excel')) {
    return '<i class="fas fa-file-excel" style="color: #4caf50;"></i>';
  }
  
  // Text files
  if (extension === 'txt' || type === 'text/plain') {
    return '<i class="fas fa-file-alt" style="color: #9e9e9e;"></i>';
  }
  
  // Default
  return '<i class="fas fa-file" style="color: #757575;"></i>';
}

/**
 * Update the file preview UI with modern card design
 */
function updateFilePreview() {
  const filePreviewContainer = document.getElementById('file-preview');
  if (!filePreviewContainer) return;
  
  if (uploadedFiles.length === 0) {
    filePreviewContainer.innerHTML = '';
    return;
  }
  
  let previewHTML = `
    <div class="file-preview-header">
      <h4><i class="fas fa-paperclip"></i> Fichiers sélectionnés (${uploadedFiles.length})</h4>
    </div>
    <div class="file-preview-grid">
  `;
  
  uploadedFiles.forEach((fileObj, index) => {
    const file = fileObj.file;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    const fileName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
    
    previewHTML += `
      <div class="file-preview-card" data-file-id="${fileObj.id}">
        <div class="file-card-icon">
          ${getFileIcon(file)}
        </div>
        <div class="file-card-name" title="${file.name}">${fileName}</div>
        <div class="file-card-size">${fileSize} MB</div>
        <button type="button" class="file-remove-btn" onclick="removeFile('${fileObj.id}')" title="Supprimer ${file.name}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
  
  previewHTML += '</div>';
  filePreviewContainer.innerHTML = previewHTML;
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

/* ===========================================
   FORM SUBMISSION WITH FIELD MAPPING
   =========================================== */

/**
 * Submit the form with proper field mapping
 */
async function submitForm() {
  console.log('🚀 Starting form submission...');
  
  if (isSubmitting) {
    console.log('⚠️ Form is already being submitted');
    return;
  }
  
  isSubmitting = true;
  showLoadingOverlay();
  
  try {
    // Collect form data with French field names
    const formData = new FormData();
    const form = document.getElementById('multiStepForm');
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    const frenchData = {};
    
    inputs.forEach(input => {
      if (input.name && input.value) {
        frenchData[input.name] = input.value;
      }
    });
    
    console.log('📋 French form data collected:', frenchData);
    
    // Map French field names to English (as expected by backend)
    const mappedData = {
      fullName: frenchData.nom || '',
      email: frenchData.email || '',
      phone: frenchData.telephone || '',
      organization: frenchData.organization || '',
      incidentType: frenchData.type || '',
      incidentDate: frenchData.date || '',
      incidentLocation: frenchData.region || '',
      description: frenchData.description || '',
      affectedSystems: frenchData.systeme || '',
      additionalComments: frenchData.evidence_links || '',
      anonymous: frenchData.anonyme === 'on' || false,
      consent: frenchData.consent === 'on' || false
    };
    
    // Auto-calculate impact level based on incident type
    const impactLevelMap = {
      'malware': 'high',
      'data-breach': 'high',
      'account-hijacking': 'high',
      'phishing': 'medium',
      'scam': 'medium',
      'other': 'low'
    };
    
    mappedData.impactLevel = impactLevelMap[mappedData.incidentType] || 'low';
    
    // Add required fields with default values
    mappedData.previousIncidents = false;
    mappedData.securityMeasures = '';
    
    console.log('🔄 Mapped data for backend:', mappedData);
    
    // Validate required fields
    const validationErrors = validateFormData(mappedData);
    if (validationErrors.length > 0) {
      throw new Error('Validation failed: ' + validationErrors.join(', '));
    }
    
    // Submit to real backend
    console.log('📤 Submitting to backend...');
    console.log('📋 Form data to be sent:', mappedData);
    console.log('📋 Form data keys:', Object.keys(mappedData));
    console.log('📋 Form data values:', Object.values(mappedData));
    
    let response;
    
    // Always try JSON first (most backends expect JSON)
    console.log('📄 Sending as JSON');
    response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mappedData)
    });
    
    // If there are files and JSON fails, we'll handle file upload separately
    if (uploadedFiles.length > 0) {
      console.log('📁 Note: Files will be handled separately if needed');
      // TODO: Implement separate file upload endpoint if backend requires it
    }
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Backend response:', result);
      console.error('❌ Response status:', response.status);
      console.error('❌ Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Log specific validation errors
      if (result.errors && Array.isArray(result.errors)) {
        console.error('❌ Validation errors from backend:');
        result.errors.forEach((error, index) => {
          console.error(`   ${index + 1}. ${error.field || 'Unknown field'}: ${error.message || error}`);
        });
      }
      
      throw new Error(result.message || `Backend error: ${response.status} - Validation failed`);
    }
    
    console.log('✅ Form submitted successfully:', result);
    
    // Show success message
    showSuccessMessage(result.data?.referenceNumber || result.referenceNumber || 'XS-' + Date.now().toString().slice(-8));
    
  } catch (error) {
    console.error('❌ Form submission error:', error);
    showErrorMessage(error.message);
  } finally {
    isSubmitting = false;
    hideLoadingOverlay();
  }
}

/**
 * Validate form data before submission
 */
function validateFormData(data) {
  const errors = [];
  
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Le nom complet est requis (minimum 2 caractères)');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Une adresse email valide est requise');
  }
  
  if (!data.phone || data.phone.trim().length < 8) {
    errors.push('Un numéro de téléphone valide est requis');
  }
  
  if (!data.incidentType) {
    errors.push('Le type d\'incident est requis');
  }
  
  if (!data.incidentDate) {
    errors.push('La date de l\'incident est requise');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Une description détaillée est requise (minimum 10 caractères)');
  }
  
  if (!data.consent) {
    errors.push('Vous devez accepter les conditions pour soumettre le signalement');
  }
  
  return errors;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show success message after form submission
 */
function showSuccessMessage(referenceNumber) {
  // Hide form steps
  document.querySelectorAll('.form-step').forEach(step => {
    step.style.display = 'none';
  });
  
  // Hide progress bar
  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.style.display = 'none';
  }
  
  // Show success message
  const confirmation = document.getElementById('confirmation');
  if (confirmation) {
    confirmation.style.display = 'block';
    
    // Update reference number
    const refElement = document.getElementById('reference-number');
    if (refElement) {
      refElement.textContent = referenceNumber;
    }
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const errorContainer = document.getElementById('form-validation-message');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.style.color = '#ff5252';
    errorContainer.style.padding = '1rem';
    errorContainer.style.backgroundColor = 'rgba(255, 82, 82, 0.1)';
    errorContainer.style.border = '1px solid rgba(255, 82, 82, 0.3)';
    errorContainer.style.borderRadius = '0.5rem';
    errorContainer.style.marginTop = '1rem';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 10000);
  }
  
  // Also show in console
  console.error('Form submission error:', message);
}

/**
 * Initialize form submission handler
 */
function initFormSubmission() {
  const form = document.getElementById('multiStepForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    });
  }
  
  // Also handle submit button click
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitForm();
    });
  }
}

/* ===========================================
   LOADING OVERLAY FUNCTIONS
   =========================================== */

/**
 * Show loading overlay
 */
function showLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/* ===========================================
   NAVIGATION BUTTON MANAGEMENT
   =========================================== */

// Note: updateNavigationButtons function is defined globally above

/* ===========================================
   ENHANCED INITIALIZATION
   =========================================== */

// Update the main initialization to include form submission
function initializeForm() {
  console.log('📋 Initializing multi-step form...');
  
  // Check if main form exists in DOM
  const form = document.getElementById('multiStepForm');
  if (!form) {
    console.error('❌ Error: Multi-step form not found in DOM');
    return;
  }
  
  console.log('✅ Form found successfully');
  
  // Initialize DOM elements and assign to global variables
  steps = document.querySelectorAll('.form-step');
  formSteps = document.querySelectorAll('.form-step');
  totalSteps = steps.length;
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  progress = document.getElementById('progress');
  progressSteps = document.querySelectorAll('.progress-step');
  
  // Validate required elements exist
  if (!steps.length || !nextBtns.length || !prevBtns.length || !progress || !progressSteps.length) {
    console.error('❌ Error: Required form elements missing');
    return;
  }
  
  console.log(`📊 Form initialized with ${totalSteps} steps`);
  console.log(`🔘 Found ${nextBtns.length} next buttons`);
  console.log(`🔘 Found ${prevBtns.length} prev buttons`);
  
  // Initialize all components
  initCustomDropdown();
  initFileUpload();
  initFormSubmission();
  setDefaultDate();
  initAutoLocation();
  initMatrixBackground();
  initRealTimeValidation();
  
  // Set up navigation event listeners
  nextBtns.forEach((btn, index) => {
    console.log(`🔗 Adding click listener to next button ${index + 1}`);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`🚀 Next button clicked! Current step: ${currentStep}, Total steps: ${totalSteps}`);
      console.log(`📋 Form steps available: ${formSteps.length}`);
      
      if (validateCurrentStep()) {
        console.log(`✅ Validation passed, moving to step ${currentStep + 1}`);
        showStep(currentStep + 1);
      } else {
        console.log(`❌ Validation failed, staying on step ${currentStep}`);
        // Scroll to first error
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
  
  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showStep(currentStep - 1);
    });
  });
  
  // Initialize progress bar
  updateProgressBar();
  updateNavigationButtons();
  
  console.log('🎉 Form initialization complete!');
  console.log('🔍 Current step after init:', currentStep);
  console.log('🔍 Total steps after init:', totalSteps);
  
  // Test direct des boutons
  setTimeout(() => {
    console.log('🧪 Testing button functionality...');
    const testNextBtns = document.querySelectorAll('.next-btn');
    console.log('🔍 Next buttons found in test:', testNextBtns.length);
    testNextBtns.forEach((btn, index) => {
      console.log(`🔍 Button ${index + 1}:`, btn);
      console.log(`🔍 Button ${index + 1} onclick:`, btn.onclick);
      console.log(`🔍 Button ${index + 1} listeners:`, 'Event listeners attached');
    });
  }, 1000);
}

/**
 * Validate current step before proceeding
 */
function validateCurrentStep() {
  console.log('🔍 Validating current step:', currentStep);
  
  const currentStepElement = document.querySelector('.form-step.active');
  if (!currentStepElement) {
    console.error('❌ No active step found for validation');
    return false;
  }
  
  // Get all required fields in the current step
  const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
  console.log('📋 Found', requiredFields.length, 'required fields in current step');
  
  let isValid = true;
  let firstErrorField = null;
  
  // Clear previous errors
  currentStepElement.querySelectorAll('.error-message').forEach(error => {
    error.style.display = 'none';
    error.textContent = '';
  });
  currentStepElement.querySelectorAll('.is-invalid').forEach(field => {
    field.classList.remove('is-invalid');
  });
  
  // Validate each required field
  requiredFields.forEach((field, index) => {
    console.log(`🔍 Validating field ${index + 1}:`, field.name || field.id, 'Value:', field.value);
    
    let fieldValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (field.type === 'checkbox') {
      if (!field.checked) {
        fieldValid = false;
        errorMessage = 'Ce champ est requis';
      }
    } else if (field.tagName === 'SELECT') {
      if (!field.value || field.value === '') {
        fieldValid = false;
        errorMessage = 'Veuillez sélectionner une option';
      }
    } else if (field.type === 'hidden' && field.name === 'type') {
      // Special handling for custom dropdown (incident type)
      if (!field.value || field.value === '') {
        fieldValid = false;
        errorMessage = 'Veuillez sélectionner un type d\'incident';
      }
    } else {
      if (!field.value || field.value.trim() === '') {
        fieldValid = false;
        errorMessage = 'Ce champ est requis';
      }
    }
    
    // Additional validation based on field type
    if (fieldValid && field.value) {
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          fieldValid = false;
          errorMessage = 'Veuillez entrer une adresse email valide';
        }
      } else if (field.type === 'tel' || field.name === 'telephone') {
        const phoneValue = field.value.replace(/[\s\-\(\)]/g, '');
        if (phoneValue.length < 8) {
          fieldValid = false;
          errorMessage = 'Numéro de téléphone trop court (minimum 8 chiffres)';
        }
      } else if (field.name === 'nom' && field.value.trim().length < 2) {
        fieldValid = false;
        errorMessage = 'Le nom doit contenir au moins 2 caractères';
      } else if (field.name === 'description' && field.value.trim().length < 10) {
        fieldValid = false;
        errorMessage = 'La description doit contenir au moins 10 caractères';
      }
    }
    
    // Show error if field is invalid
    if (!fieldValid) {
      console.log('❌ Field invalid:', field.name || field.id, 'Error:', errorMessage);
      showFieldError(field, errorMessage);
      isValid = false;
      if (!firstErrorField) {
        firstErrorField = field;
      }
    } else {
      console.log('✅ Field valid:', field.name || field.id);
    }
  });
  
  // Scroll to first error if validation failed
  if (!isValid && firstErrorField) {
    console.log('🔄 Scrolling to first error field');
    firstErrorField.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    firstErrorField.focus();
  }
  
  console.log('📊 Step validation result:', isValid ? '✅ VALID' : '❌ INVALID');
  return isValid;
}

/**
 * Show error message for a specific field
 */
function showFieldError(field, message) {
  console.log('🚨 Showing error for field:', field.name || field.id, 'Message:', message);
  
  // Add invalid class to field
  field.classList.add('is-invalid');
  
  // Find or create error element
  let errorElement = document.getElementById(`${field.name}-error`);
  
  if (!errorElement) {
    // Create new error element
    errorElement = document.createElement('div');
    errorElement.id = `${field.name}-error`;
    errorElement.className = 'error-message';
    
    // Insert after the field
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.appendChild(errorElement);
    } else {
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  }
  
  // Update error message and show it
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  errorElement.style.color = '#ff5252';
  errorElement.style.marginTop = '0.5rem';
  errorElement.style.fontSize = '0.875rem';
  errorElement.style.fontWeight = '500';
  
  // Special handling for custom dropdown (incident type)
  if (field.name === 'type' && field.type === 'hidden') {
    const customDropdown = document.getElementById('incident-type-dropdown');
    if (customDropdown) {
      customDropdown.classList.add('is-invalid');
      customDropdown.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        customDropdown.style.animation = '';
      }, 500);
    }
  } else {
    // Add shake animation to the field
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      field.style.animation = '';
    }, 500);
  }
}

/**
 * Test function - call this from console to test navigation
 */
window.testNextStep = function() {
  console.log('🧪 Manual test: Moving to next step');
  console.log('Current step before:', currentStep);
  console.log('Total steps:', totalSteps);
  console.log('Form steps available:', formSteps.length);
  console.log('Form steps elements:', formSteps);
  
  // Check if elements exist
  if (formSteps.length === 0) {
    console.error('❌ No form steps found! Reinitializing...');
    initializeFormElements();
    return;
  }
  
  if (validateCurrentStep()) {
    console.log('✅ Validation passed, moving to next step');
    showStep(currentStep + 1);
    console.log('Current step after:', currentStep);
  } else {
    console.log('❌ Validation failed, staying on current step');
    const errors = document.querySelectorAll('.is-invalid');
    console.log('Found errors:', errors.length);
    errors.forEach((error, index) => {
      console.log(`Error ${index + 1}:`, error.id || error.name, error.validationMessage);
    });
  }
};

// Test function to check if validation is working
window.testValidation = function() {
  console.log('🧪 Testing current step validation');
  const isValid = validateCurrentStep();
  console.log('Validation result:', isValid);
  return isValid;
};

// Complete debug function
window.debugFormState = function() {
  console.log('🔍 === FORM DEBUG STATE ===');
  console.log('Current step:', currentStep);
  console.log('Total steps:', totalSteps);
  console.log('Form steps length:', formSteps.length);
  console.log('Next buttons:', nextBtns.length);
  console.log('Previous buttons:', prevBtns.length);
  
  // Check current step element
  const currentStepElement = formSteps[currentStep - 1];
  console.log('Current step element:', currentStepElement);
  console.log('Current step visible:', currentStepElement ? !currentStepElement.classList.contains('d-none') : 'N/A');
  
  // Check form inputs in current step
  if (currentStepElement) {
    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    console.log('Inputs in current step:', inputs.length);
    inputs.forEach((input, index) => {
      console.log(`Input ${index + 1}:`, {
        id: input.id,
        name: input.name,
        type: input.type,
        value: input.value,
        required: input.required,
        valid: input.checkValidity()
      });
    });
  }
  
  console.log('=========================');
};

/**
 * Initialize real-time validation to clear errors when user starts typing
 */
function initRealTimeValidation() {
  console.log('🔄 Initializing real-time validation...');
  
  // Get all form inputs
  const allInputs = document.querySelectorAll('input, select, textarea');
  
  allInputs.forEach(input => {
    // Clear errors on input/change
    const events = ['input', 'change', 'blur'];
    
    events.forEach(eventType => {
      input.addEventListener(eventType, function() {
        // Clear error state if field has value
        if (this.value && this.value.trim() !== '') {
          this.classList.remove('is-invalid');
          
          // Hide error message
          const errorElement = document.getElementById(`${this.name}-error`);
          if (errorElement) {
            errorElement.style.display = 'none';
          }
          
          // Clear custom dropdown error state
          if (this.name === 'type') {
            const customDropdown = document.getElementById('incident-type-dropdown');
            if (customDropdown) {
              customDropdown.classList.remove('is-invalid');
            }
          }
        }
      });
    });
  });
  
  console.log('✅ Real-time validation initialized for', allInputs.length, 'fields');
}

/**
 * Debug function - call this from console to see current state
 */
window.debugFormState = function() {
  console.log('=== FORM DEBUG STATE ===');
  console.log('Current step:', currentStep);
  console.log('Total steps:', totalSteps);
  console.log('Form steps:', formSteps);
  console.log('Progress element:', progress);
  console.log('Progress steps:', progressSteps);
  console.log('Next buttons:', document.querySelectorAll('.next-btn'));
  console.log('========================');
};

window.debugFileUpload = function() {
  console.log('=== FILE UPLOAD DEBUG ===');
  console.log('File input:', document.getElementById('evidence'));
  console.log('Upload container:', document.querySelector('.file-upload-container'));
  console.log('Preview container:', document.getElementById('file-preview'));
  console.log('Uploaded files:', uploadedFiles);
  console.log('Preview HTML:', document.getElementById('file-preview')?.innerHTML);
  console.log('========================');
};

// Test function to add a fake file for testing
window.testFileUpload = function() {
  const fakeFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
  const fileObj = {
    id: Date.now().toString(),
    file: fakeFile
  };
  uploadedFiles.push(fileObj);
  updateFilePreview();
  console.log('✅ Test file added');
};

/**
 * Initialize demo notice with auto-hide functionality
 */
function initDemoNotice() {
  const demoNotice = document.querySelector('.demo-notice');
  if (demoNotice) {
    // Add click to dismiss
    demoNotice.style.cursor = 'pointer';
    demoNotice.title = 'Cliquez pour masquer';
    
    demoNotice.addEventListener('click', () => {
      demoNotice.style.transition = 'all 0.5s ease';
      demoNotice.style.opacity = '0';
      demoNotice.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        demoNotice.style.display = 'none';
      }, 500);
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (demoNotice.style.display !== 'none') {
        demoNotice.click();
      }
    }, 10000);
  }
}
