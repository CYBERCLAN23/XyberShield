/**
 * Interactive Cybersecurity Quiz System - Static Edition
 * Professional quiz system with predefined questions for easy management
 * Features: Timer, Progress tracking, Certificate generation, Detailed results
 * 
 * HOW TO ADD/EDIT QUESTIONS:
 * 1. Scroll to the QUIZ_QUESTIONS constant below
 * 2. Add new questions following the existing format
 * 3. Each question needs: category, question, options (array), correct (index), explanation
 * 4. Save the file - changes are immediate!
 */

// ========================================
// QUIZ QUESTIONS DATABASE
// ========================================
// TO ADD NEW QUESTIONS: Simply add them to this array following the format below
// TO EDIT QUESTIONS: Modify any existing question in this array
// TO REMOVE QUESTIONS: Delete the question object from this array

const QUIZ_QUESTIONS = [
    {
        category: "Protection des mots de passe",
        question: "Quelle est la meilleure pratique pour créer un mot de passe sécurisé ?",
        options: [
            "Utiliser au moins 12 caractères avec majuscules, minuscules, chiffres et symboles",
            "Utiliser son nom et sa date de naissance",
            "Utiliser le même mot de passe partout",
            "Utiliser seulement des lettres minuscules"
        ],
        correct: 0,
        explanation: "Un mot de passe sécurisé doit être long et complexe, combinant différents types de caractères pour résister aux attaques par force brute."
    },
    {
        category: "Détection du phishing",
        question: "Comment identifier un email de phishing ?",
        options: [
            "Il vient toujours d'adresses inconnues",
            "Il demande des informations personnelles urgentes avec des liens suspects",
            "Il contient toujours des fautes d'orthographe",
            "Il arrive toujours dans les spams"
        ],
        correct: 1,
        explanation: "Les emails de phishing créent souvent un sentiment d'urgence et demandent des informations sensibles via des liens douteux."
    },
    {
        category: "Sécurité WiFi",
        question: "Quel type de chiffrement WiFi est le plus sécurisé ?",
        options: [
            "WEP",
            "WPA",
            "WPA3",
            "Aucun chiffrement"
        ],
        correct: 2,
        explanation: "WPA3 est le standard de sécurité WiFi le plus récent et le plus sécurisé, offrant une protection renforcée contre les attaques."
    },
    {
        category: "Authentification 2FA",
        question: "Qu'est-ce que l'authentification à deux facteurs (2FA) ?",
        options: [
            "Utiliser deux mots de passe différents",
            "Se connecter depuis deux appareils",
            "Ajouter une étape de vérification supplémentaire après le mot de passe",
            "Changer son mot de passe deux fois par mois"
        ],
        correct: 2,
        explanation: "La 2FA ajoute une couche de sécurité supplémentaire en demandant une seconde forme d'authentification (SMS, app, clé physique)."
    },
    {
        category: "Sécurité mobile",
        question: "Quelle est la meilleure pratique pour télécharger des applications ?",
        options: [
            "Télécharger depuis n'importe quel site web",
            "Utiliser uniquement les stores officiels (Google Play, App Store)",
            "Télécharger seulement les applications gratuites",
            "Éviter de lire les avis utilisateurs"
        ],
        correct: 1,
        explanation: "Les stores officiels vérifient les applications et réduisent considérablement les risques de malware et d'applications malveillantes."
    },
    {
        category: "Navigation sécurisée",
        question: "Que signifie le cadenas vert dans la barre d'adresse ?",
        options: [
            "Le site est gratuit",
            "Le site est rapide",
            "La connexion est chiffrée (HTTPS)",
            "Le site est populaire"
        ],
        correct: 2,
        explanation: "Le cadenas indique que la connexion est sécurisée par HTTPS et que les données échangées sont chiffrées."
    },
    {
        category: "Ingénierie sociale",
        question: "Qu'est-ce que l'ingénierie sociale en cybersécurité ?",
        options: [
            "L'utilisation des réseaux sociaux pour le travail",
            "La manipulation psychologique pour obtenir des informations confidentielles",
            "La création de profils sociaux professionnels",
            "L'analyse des tendances sur les réseaux sociaux"
        ],
        correct: 1,
        explanation: "L'ingénierie sociale exploite la psychologie humaine pour contourner les mesures de sécurité techniques et obtenir des informations sensibles."
    },
    {
        category: "Sauvegarde",
        question: "Quelle est la règle 3-2-1 pour les sauvegardes ?",
        options: [
            "3 copies, 2 supports différents, 1 hors site",
            "3 mots de passe, 2 comptes, 1 appareil",
            "3 antivirus, 2 firewalls, 1 VPN",
            "3 heures, 2 jours, 1 semaine"
        ],
        correct: 0,
        explanation: "La règle 3-2-1 assure une protection optimale : 3 copies de vos données, sur 2 supports différents, avec 1 copie stockée hors site."
    },
    {
        category: "Malware",
        question: "Quel est le meilleur moyen de se protéger des ransomwares ?",
        options: [
            "Payer immédiatement la rançon",
            "Sauvegardes régulières + antivirus à jour + prudence avec les emails",
            "Débrancher internet en permanence",
            "Utiliser seulement des ordinateurs anciens"
        ],
        correct: 1,
        explanation: "La prévention par des sauvegardes régulières et des mesures de sécurité proactives est la meilleure défense contre les ransomwares."
    },
    {
        category: "Confidentialité",
        question: "Pourquoi est-il important de vérifier les paramètres de confidentialité sur les réseaux sociaux ?",
        options: [
            "Pour avoir plus d'amis",
            "Pour contrôler qui peut voir vos informations personnelles",
            "Pour recevoir plus de publicités",
            "Pour améliorer la vitesse de connexion"
        ],
        correct: 1,
        explanation: "Les paramètres de confidentialité vous permettent de contrôler la visibilité de vos données personnelles et de protéger votre vie privée."
    },
    {
        category: "Mises à jour",
        question: "Pourquoi est-il crucial de maintenir ses logiciels à jour ?",
        options: [
            "Pour avoir de nouvelles fonctionnalités uniquement",
            "Pour corriger les failles de sécurité découvertes",
            "Pour consommer plus de ressources système",
            "Pour changer l'apparence de l'interface"
        ],
        correct: 1,
        explanation: "Les mises à jour corrigent les vulnérabilités de sécurité découvertes, fermant ainsi les portes d'entrée aux cybercriminels."
    },
    {
        category: "Réseaux sociaux",
        question: "Quelle information ne devriez-vous JAMAIS partager publiquement sur les réseaux sociaux ?",
        options: [
            "Vos photos de vacances",
            "Votre numéro de sécurité sociale ou carte d'identité",
            "Vos opinions sur l'actualité",
            "Vos recettes de cuisine préférées"
        ],
        correct: 1,
        explanation: "Les informations d'identité officielles peuvent être utilisées pour l'usurpation d'identité et diverses fraudes."
    },
    {
        category: "E-commerce",
        question: "Comment vérifier qu'un site de vente en ligne est sécurisé ?",
        options: [
            "Vérifier uniquement les prix attractifs",
            "S'assurer qu'il a HTTPS, lire les avis, vérifier les mentions légales",
            "Regarder seulement le design du site",
            "Compter le nombre de produits disponibles"
        ],
        correct: 1,
        explanation: "Un site e-commerce sécurisé doit avoir HTTPS, des avis clients vérifiables, des mentions légales claires et une réputation établie."
    },
    {
        category: "Emails suspects",
        question: "Que faire si vous recevez un email suspect demandant vos informations bancaires ?",
        options: [
            "Répondre immédiatement avec vos informations",
            "Ne pas cliquer sur les liens, vérifier auprès de votre banque directement",
            "Transférer l'email à tous vos contacts",
            "Cliquer sur tous les liens pour vérifier"
        ],
        correct: 1,
        explanation: "Ne jamais fournir d'informations sensibles par email. Contactez toujours votre banque directement par les canaux officiels."
    },
    {
        category: "VPN",
        question: "Quel est l'avantage principal d'utiliser un VPN sur un WiFi public ?",
        options: [
            "Accélérer la connexion internet",
            "Chiffrer vos données et masquer votre activité",
            "Obtenir plus de bande passante",
            "Améliorer la qualité vidéo"
        ],
        correct: 1,
        explanation: "Un VPN chiffre vos données et masque votre activité, protégeant ainsi vos informations sur les réseaux WiFi publics non sécurisés."
    }
];

// ========================================
// QUIZ CLASS IMPLEMENTATION
// ========================================

class CybersecurityQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.isActive = false;
        
        // Timer configuration (5 minutes = 300 seconds)
        this.totalTime = 300;
        this.remainingTime = 300;
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        // Bind global functions for HTML onclick handlers
        window.startQuiz = () => this.startQuiz();
        window.nextQuestion = () => this.nextQuestion();
        window.restartQuiz = () => this.restartQuiz();
        window.generateCertificate = () => this.generateCertificate();
        
        console.log('Static Quiz System initialized successfully');
        console.log(`Question bank contains ${QUIZ_QUESTIONS.length} questions`);
    }
    
    startQuiz() {
        this.showScreen('quizLoading');
        this.resetQuiz();
        
        // Select random questions from the question bank
        this.selectRandomQuestions();
        
        console.log(`Quiz started with ${this.questions.length} questions`);
        
        // Short delay for loading screen effect, then start quiz
        setTimeout(() => {
            this.showScreen('quizProgress');
            this.startTimer();
            setTimeout(() => {
                this.showQuestion();
            }, 300);
        }, 1000);
    }
    
    /**
     * Selects random questions from the question bank
     * Ensures variety and no duplicates
     */
    selectRandomQuestions() {
        // Create a copy of the question bank to avoid modifying the original
        const availableQuestions = [...QUIZ_QUESTIONS];
        
        // Shuffle the questions array
        for (let i = availableQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]];
        }
        
        // Select the first 'totalQuestions' from the shuffled array
        this.questions = availableQuestions.slice(0, this.totalQuestions);
        
        console.log('Selected questions:', this.questions.map(q => q.category));
    }
    
    
    /**
     * Reset quiz state for a new game
     */
    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.isActive = true;
        this.remainingTime = this.totalTime;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        console.log('Quiz reset completed');
    }
    
    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        
        // Hide all screens
        document.querySelectorAll('.quiz-screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            console.log('Target screen found:', targetScreen);
            targetScreen.style.display = 'block';
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 100);
        } else {
            console.error('Screen not found:', screenId);
        }
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        this.updateProgress();
        
        // Update question content
        document.getElementById('questionCategory').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;
        
        // Generate options
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.onclick = () => this.selectOption(index);
            optionsContainer.appendChild(optionElement);
        });
        
        // Reset next button
        document.getElementById('nextButton').disabled = true;
        
        // Show question screen
        this.showScreen('quizQuestion');
    }
    
    selectOption(selectedIndex) {
        // Remove previous selections
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark selected option
        document.querySelectorAll('.quiz-option')[selectedIndex].classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestion] = selectedIndex;
        
        // Enable next button
        document.getElementById('nextButton').disabled = false;
    }
    
    nextQuestion() {
        const question = this.questions[this.currentQuestion];
        const userAnswer = this.userAnswers[this.currentQuestion];
        
        // Show correct/incorrect feedback
        document.querySelectorAll('.quiz-option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === userAnswer && index !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score
        if (userAnswer === question.correct) {
            this.score++;
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 2000);
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();
            
            // Check for time warnings on both progress and question screens
            const timerElements = document.querySelectorAll('.quiz-timer');
            timerElements.forEach(timerElement => {
                if (this.remainingTime <= 30) {
                    timerElement.classList.add('danger');
                    timerElement.classList.remove('warning');
                } else if (this.remainingTime <= 60) {
                    timerElement.classList.add('warning');
                    timerElement.classList.remove('danger');
                } else {
                    timerElement.classList.remove('warning', 'danger');
                }
            });
            
            // Time's up!
            if (this.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer on progress screen
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = timeString;
        }
        
        // Update timer on question screen
        const questionTimerDisplay = document.getElementById('questionTimerDisplay');
        if (questionTimerDisplay) {
            questionTimerDisplay.textContent = timeString;
        }
    }
    
    timeUp() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isActive = false;
        
        // Show time up message and finish quiz
        this.showTimeUpResults();
    }
    
    showTimeUpResults() {
        // Calculate score based on answered questions only
        let answeredQuestions = 0;
        let correctAnswers = 0;
        
        for (let i = 0; i < this.userAnswers.length; i++) {
            if (this.userAnswers[i] !== undefined) {
                answeredQuestions++;
                if (this.userAnswers[i] === this.questions[i].correct) {
                    correctAnswers++;
                }
            }
        }
        
        this.score = correctAnswers;
        
        // Update result elements for time up scenario
        document.getElementById('finalScore').textContent = `${this.score}/${answeredQuestions}`;
        document.getElementById('resultTitle').textContent = 'Temps écoulé !';
        document.getElementById('resultMessage').textContent = `Vous avez répondu à ${answeredQuestions} questions sur 10. Votre score: ${this.score}/${answeredQuestions} bonnes réponses.`;
        document.getElementById('resultIcon').innerHTML = '<i class="fas fa-hourglass-end"></i>';
        
        // Hide certificate button for incomplete quiz
        document.getElementById('certificateButton').style.display = 'none';
        
        this.generateResultBreakdown();
        this.showScreen('quizResults');
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const currentQuestionNum = document.getElementById('currentQuestionNum');
        const questionCounter = document.getElementById('questionCounter');
        
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        currentQuestionSpan.textContent = this.currentQuestion + 1;
        
        if (currentQuestionNum) {
            currentQuestionNum.textContent = this.currentQuestion + 1;
        }
        
        // Update question counter on question screen
        if (questionCounter) {
            questionCounter.textContent = this.currentQuestion + 1;
        }
    }
    
    showResults() {
        // Stop timer when quiz completes normally
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        
        // Update result elements
        document.getElementById('finalScore').textContent = this.score;
        
        // Determine result message and icon
        let resultTitle, resultMessage, iconClass;
        
        if (percentage >= 80) {
            resultTitle = 'Excellent !';
            resultMessage = 'Vous maîtrisez très bien les concepts de cybersécurité. Vous êtes bien préparé pour naviguer en sécurité !';
            iconClass = 'fas fa-trophy';
        } else if (percentage >= 60) {
            resultTitle = 'Bien joué !';
            resultMessage = 'Vous avez de bonnes bases en cybersécurité. Continuez à vous informer pour améliorer votre protection.';
            iconClass = 'fas fa-medal';
        } else {
            resultTitle = 'À améliorer';
            resultMessage = 'Il est important de renforcer vos connaissances en cybersécurité. Consultez nos ressources éducatives !';
            iconClass = 'fas fa-book';
        }
        
        document.getElementById('resultTitle').textContent = resultTitle;
        document.getElementById('resultMessage').textContent = resultMessage;
        document.getElementById('resultIcon').innerHTML = `<i class="${iconClass}"></i>`;
        
        // Show/hide certificate button based on score
        const certificateButton = document.getElementById('certificateButton');
        if (percentage >= 70) {
            certificateButton.style.display = 'inline-block';
        } else {
            certificateButton.style.display = 'none';
        }
        
        // Generate result breakdown
        this.generateResultBreakdown();
        
        this.showScreen('quizResults');
        this.isActive = false;
    }
    
    generateResultBreakdown() {
        const breakdown = document.getElementById('resultBreakdown');
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        
        breakdown.innerHTML = `
            <h5 style="color: #e6f1ff; margin-bottom: 1rem;">Résultats détaillés</h5>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: #b8c5d1;">Questions correctes:</span>
                <span style="color: #3ddc84; font-weight: 600;">${this.score}/${this.totalQuestions}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: #b8c5d1;">Pourcentage:</span>
                <span style="color: #4c94be; font-weight: 600;">${percentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #b8c5d1;">Niveau:</span>
                <span style="color: ${percentage >= 80 ? '#3ddc84' : percentage >= 60 ? '#ffd700' : '#dc3545'}; font-weight: 600;">
                    ${percentage >= 80 ? 'Expert' : percentage >= 60 ? 'Intermédiaire' : 'Débutant'}
                </span>
            </div>
        `;
    }
    
    async generateCertificate() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        const userName = prompt('Entrez votre nom pour le certificat:') || 'Utilisateur XyberShield';
        const currentDate = new Date().toLocaleDateString('fr-FR');
        
        // Import jsPDF library dynamically
        if (!window.jsPDF) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            
            await new Promise(resolve => {
                script.onload = resolve;
            });
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        
        // Certificate background
        doc.setFillColor(2, 12, 27);
        doc.rect(0, 0, 297, 210, 'F');
        
        // Border
        doc.setDrawColor(76, 148, 190);
        doc.setLineWidth(3);
        doc.rect(10, 10, 277, 190);
        
        // Inner border
        doc.setDrawColor(61, 220, 132);
        doc.setLineWidth(1);
        doc.rect(15, 15, 267, 180);
        
        // Title
        doc.setTextColor(230, 241, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICAT DE CYBERSÉCURITÉ', 148.5, 50, { align: 'center' });
        
        // XyberShield logo text
        doc.setTextColor(61, 220, 132);
        doc.setFontSize(16);
        doc.text('XyberShield • XyberClan', 148.5, 65, { align: 'center' });
        
        // Certificate text
        doc.setTextColor(184, 197, 209);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Ceci certifie que', 148.5, 85, { align: 'center' });
        
        // User name
        doc.setTextColor(76, 148, 190);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(userName, 148.5, 105, { align: 'center' });
        
        // Achievement text
        doc.setTextColor(184, 197, 209);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('a réussi le Quiz Interactif de Cybersécurité', 148.5, 125, { align: 'center' });
        doc.text(`avec un score de ${this.score}/${this.totalQuestions} (${percentage}%)`, 148.5, 140, { align: 'center' });
        
        // Date and signature area
        doc.setFontSize(12);
        doc.text(`Délivré le ${currentDate}`, 50, 170);
        doc.text('XyberClan Security Team', 200, 170);
        
        // Footer
        doc.setTextColor(76, 148, 190);
        doc.setFontSize(10);
        doc.text('Ce certificat atteste de la compréhension des principes fondamentaux de la cybersécurité', 148.5, 185, { align: 'center' });
        
        // Save the PDF
        doc.save(`Certificat_Cybersecurite_${userName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`);
        
        // Show success message
        this.showCertificateSuccess();
    }
    
    showCertificateSuccess() {
        const notification = document.createElement('div');
        notification.className = 'certificate-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Certificat téléchargé avec succès !</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 237, 78, 0.95));
            color: #020c1b;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }
    
    restartQuiz() {
        this.showScreen('quizStart');
        this.resetQuiz();
    }
}

// Initialize quiz system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.cybersecurityQuiz = new CybersecurityQuiz();
    }, 500);
});

// ========================================
// QUIZ MANAGEMENT UTILITIES
// ========================================

/**
 * Utility function to add a new question to the quiz bank
 * Usage: addQuizQuestion(category, question, options, correctIndex, explanation)
 */
window.addQuizQuestion = (category, question, options, correct, explanation) => {
    const newQuestion = {
        category: category,
        question: question,
        options: options,
        correct: correct,
        explanation: explanation
    };
    
    QUIZ_QUESTIONS.push(newQuestion);
    console.log('New question added:', newQuestion);
    console.log(`Total questions in bank: ${QUIZ_QUESTIONS.length}`);
};

/**
 * Utility function to get all questions by category
 */
window.getQuestionsByCategory = (category) => {
    return QUIZ_QUESTIONS.filter(q => q.category === category);
};

/**
 * Utility function to get all available categories
 */
window.getQuizCategories = () => {
    return [...new Set(QUIZ_QUESTIONS.map(q => q.category))];
};

/**
 * Display quiz statistics
 */
window.showQuizStats = () => {
    const categories = getQuizCategories();
    console.log('=== QUIZ STATISTICS ===');
    console.log(`Total questions: ${QUIZ_QUESTIONS.length}`);
    console.log('Questions by category:');
    categories.forEach(cat => {
        const count = getQuestionsByCategory(cat).length;
        console.log(`  ${cat}: ${count} questions`);
    });
};
