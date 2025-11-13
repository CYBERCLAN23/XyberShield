// Quiz Application - Complete Interactive Quiz
let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];
let timer;
let timeLeft = 30;
let selectedTheme = 'general';
let quizQuestions = [];

// Function to select theme
function selectTheme(theme) {
    selectedTheme = theme;
    quizQuestions = quizThemes[theme] || quizThemes.general;
    
    // Shuffle questions for variety
    quizQuestions = shuffleArray([...quizQuestions]);
    
    // Take only 10 questions
    quizQuestions = quizQuestions.slice(0, 10);
    
    startQuiz();
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Default questions (will be replaced by theme selection)
const defaultQuestions = [
    {
        question: "Qu'est-ce que le phishing ?",
        options: [
            "Une technique pour attraper des poissons",
            "Une tentative de vol d'informations personnelles par email frauduleux",
            "Un logiciel antivirus",
            "Un type de mot de passe"
        ],
        correct: 1,
        explanation: "Le phishing est une technique d'escroquerie visant à obtenir des informations confidentielles en se faisant passer pour un tiers de confiance."
    },
    {
        question: "Quelle est la longueur minimale recommandée pour un mot de passe sécurisé ?",
        options: [
            "6 caractères",
            "8 caractères",
            "12 caractères",
            "20 caractères"
        ],
        correct: 2,
        explanation: "Un mot de passe sécurisé devrait contenir au minimum 12 caractères avec une combinaison de lettres, chiffres et symboles."
    },
    {
        question: "Qu'est-ce qu'un VPN ?",
        options: [
            "Un virus informatique",
            "Un réseau privé virtuel qui crypte votre connexion",
            "Un type de mot de passe",
            "Un logiciel malveillant"
        ],
        correct: 1,
        explanation: "Un VPN (Virtual Private Network) crée un tunnel sécurisé et crypté pour votre connexion internet, protégeant votre vie privée en ligne."
    },
    {
        question: "Que signifie HTTPS dans une URL ?",
        options: [
            "Hyper Text Transfer Protocol Secure",
            "High Tech Protection System",
            "Hacker Tracking Protocol System",
            "Home Transfer Protection Service"
        ],
        correct: 0,
        explanation: "HTTPS signifie Hyper Text Transfer Protocol Secure. Le 'S' indique que la connexion est sécurisée et cryptée."
    },
    {
        question: "Quelle est la meilleure pratique pour gérer plusieurs mots de passe ?",
        options: [
            "Utiliser le même mot de passe partout",
            "Écrire tous les mots de passe sur papier",
            "Utiliser un gestionnaire de mots de passe",
            "Utiliser des mots de passe simples faciles à retenir"
        ],
        correct: 2,
        explanation: "Un gestionnaire de mots de passe est la solution la plus sécurisée pour stocker et gérer tous vos mots de passe de manière cryptée."
    },
    {
        question: "Qu'est-ce que l'authentification à deux facteurs (2FA) ?",
        options: [
            "Utiliser deux mots de passe différents",
            "Une couche de sécurité supplémentaire nécessitant deux formes de vérification",
            "Se connecter deux fois",
            "Avoir deux comptes"
        ],
        correct: 1,
        explanation: "L'authentification à deux facteurs ajoute une couche de sécurité en demandant une deuxième forme de vérification (code SMS, application, etc.)."
    },
    {
        question: "Que devez-vous faire si vous recevez un email suspect ?",
        options: [
            "Cliquer sur tous les liens pour vérifier",
            "Répondre immédiatement",
            "Ne pas cliquer sur les liens et signaler l'email",
            "Transférer à tous vos contacts"
        ],
        correct: 2,
        explanation: "Ne cliquez jamais sur les liens suspects. Signalez l'email comme spam/phishing et supprimez-le."
    },
    {
        question: "Qu'est-ce qu'un malware ?",
        options: [
            "Un logiciel de protection",
            "Un logiciel malveillant conçu pour endommager ou infiltrer un système",
            "Un type de navigateur web",
            "Un réseau social"
        ],
        correct: 1,
        explanation: "Un malware (logiciel malveillant) est un programme conçu pour endommager, infiltrer ou prendre le contrôle d'un système informatique."
    },
    {
        question: "Quelle information ne devriez-vous JAMAIS partager en ligne ?",
        options: [
            "Votre nom",
            "Votre ville",
            "Votre numéro de sécurité sociale ou carte bancaire",
            "Vos hobbies"
        ],
        correct: 2,
        explanation: "Ne partagez jamais vos informations sensibles comme numéros de sécurité sociale, cartes bancaires ou mots de passe en ligne."
    },
    {
        question: "À quelle fréquence devriez-vous mettre à jour vos mots de passe ?",
        options: [
            "Jamais",
            "Tous les 10 ans",
            "Tous les 3-6 mois",
            "Tous les jours"
        ],
        correct: 2,
        explanation: "Il est recommandé de changer vos mots de passe tous les 3 à 6 mois, surtout pour les comptes importants."
    }
];

function startQuiz() {
    document.querySelector('.welcome-screen').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizContent').classList.add('quiz-content-active');
    
    // Show floating timer
    if (typeof showFloatingTimer === 'function') {
        showFloatingTimer();
    }
    
    // Get theme name
    const themeNames = {
        phishing: 'Phishing',
        passwords: 'Mots de Passe',
        malware: 'Malware',
        general: 'Quiz Général'
    };
    const themeName = themeNames[selectedTheme] || 'Quiz Général';
    
    // Create quiz HTML structure
    document.getElementById('quizContent').innerHTML = `
        <div class="quiz-theme-badge" style="text-align: center; margin-bottom: 1rem;">
            <span style="display: inline-block; padding: 0.5rem 1.5rem; background: linear-gradient(135deg, var(--primary-blue), var(--accent-green)); border-radius: 25px; color: white; font-weight: 600; font-size: 0.9rem;">
                <i class="fas fa-shield-alt"></i> ${themeName}
            </span>
        </div>
    `+`
        <!-- Timer -->
        <div class="quiz-timer">
            <div class="timer-circle" id="timerCircle">
                <div class="timer-number" id="timerNumber">30</div>
            </div>
            <div class="timer-label">secondes restantes</div>
        </div>

        <!-- Progress Bar -->
        <div class="quiz-progress-container">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" id="quizProgress" style="width: 0%"></div>
            </div>
            <div class="quiz-progress-text" id="quizProgressText">Question 1 sur 10</div>
        </div>

        <!-- Question Card -->
        <div class="quiz-question-card" id="questionCard">
            <span class="question-number" id="questionNumber">Question 1</span>
            <div class="question-text" id="questionText"></div>
            
            <div class="quiz-options" id="quizOptions"></div>

            <div class="quiz-feedback" id="quizFeedback"></div>

            <div class="quiz-actions">
                <button class="quiz-btn quiz-btn-skip" onclick="skipQuestion()">
                    Passer
                </button>
                <button class="quiz-btn quiz-btn-next" id="nextBtn" onclick="nextQuestion()" disabled>
                    Continuer
                </button>
            </div>
        </div>
    `;
    
    currentQuestion = 0;
    score = 0;
    answered = false;
    userAnswers = [];
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    const question = quizQuestions[currentQuestion];
    
    // Reset and start timer
    timeLeft = 30;
    clearInterval(timer);
    startTimer();
    
    // Update progress
    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
    document.getElementById('quizProgressText').textContent = `Question ${currentQuestion + 1} sur ${quizQuestions.length}`;
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1}`;
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Create options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Reset feedback and button
    document.getElementById('quizFeedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').disabled = true;
    
    // Animate card
    const card = document.getElementById('questionCard');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
}

function startTimer() {
    const timerNumber = document.getElementById('timerNumber');
    const timerCircle = document.getElementById('timerCircle');
    
    timer = setInterval(() => {
        timeLeft--;
        timerNumber.textContent = timeLeft;
        
        // Update floating timer
        if (typeof updateFloatingTimer === 'function') {
            updateFloatingTimer(timeLeft, currentQuestion + 1, score);
        }
        
        // Warning when less than 10 seconds
        if (timeLeft <= 10) {
            timerCircle.classList.add('warning');
        } else {
            timerCircle.classList.remove('warning');
        }
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!answered) {
                handleTimeout();
            }
        }
    }, 1000);
}

function handleTimeout() {
    answered = true;
    const feedback = document.getElementById('quizFeedback');
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    // Mark as incorrect
    userAnswers.push({
        question: currentQuestion,
        selected: null,
        correct: question.correct,
        isCorrect: false
    });
    
    // Show correct answer
    options[question.correct].classList.add('correct');
    options[question.correct].innerHTML = '<i class="fas fa-check-circle"></i> ' + options[question.correct].textContent;
    
    feedback.innerHTML = '<i class="fas fa-clock"></i> Temps écoulé ! ' + question.explanation;
    feedback.classList.add('show', 'incorrect');
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    clearInterval(timer);
    
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');
    
    options.forEach(opt => opt.classList.remove('selected'));
    options[selectedIndex].classList.add('selected');
    
    const isCorrect = selectedIndex === question.correct;
    userAnswers.push({
        question: currentQuestion,
        selected: selectedIndex,
        correct: question.correct,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        score++;
        options[selectedIndex].classList.add('correct');
        options[selectedIndex].innerHTML = '<i class="fas fa-check-circle"></i> ' + options[selectedIndex].textContent;
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> Excellent ! ' + question.explanation;
        feedback.classList.add('show', 'correct');
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[selectedIndex].innerHTML = '<i class="fas fa-times-circle"></i> ' + options[selectedIndex].textContent;
        options[question.correct].classList.add('correct');
        options[question.correct].innerHTML = '<i class="fas fa-check-circle"></i> ' + options[question.correct].textContent;
        feedback.innerHTML = '<i class="fas fa-times-circle"></i> Pas tout à fait. ' + question.explanation;
        feedback.classList.add('show', 'incorrect');
    }
    
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function skipQuestion() {
    userAnswers.push({
        question: currentQuestion,
        selected: null,
        correct: quizQuestions[currentQuestion].correct,
        isCorrect: false
    });
    nextQuestion();
}

function showResults() {
    clearInterval(timer);
    
    // Hide floating timer
    if (typeof hideFloatingTimer === 'function') {
        hideFloatingTimer();
    }
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const incorrect = quizQuestions.length - score;
    
    // Create results HTML
    document.getElementById('quizContent').innerHTML = `
        <div class="quiz-results">
            <div class="quiz-score-circle">
                <div class="quiz-score-number" id="finalScore">0%</div>
            </div>
            <h2 class="quiz-results-title" id="resultsTitle">Félicitations !</h2>
            <p class="quiz-results-message" id="resultsMessage"></p>

            <div class="quiz-stats">
                <div class="quiz-stat">
                    <div class="quiz-stat-number">${quizQuestions.length}</div>
                    <div class="quiz-stat-label">Questions</div>
                </div>
                <div class="quiz-stat correct">
                    <div class="quiz-stat-number">${score}</div>
                    <div class="quiz-stat-label">Correctes</div>
                </div>
                <div class="quiz-stat incorrect">
                    <div class="quiz-stat-number">${incorrect}</div>
                    <div class="quiz-stat-label">Incorrectes</div>
                </div>
            </div>

            ${percentage >= 70 ? `
            <div id="certificateSection">
                <div class="certificate-container">
                    <div class="certificate-badge">
                        <i class="fas fa-award"></i>
                    </div>
                    <h3 class="certificate-title">🎓 Certification XyberShield</h3>
                    <p class="certificate-text">
                        Félicitations ! Vous avez réussi le quiz de cybersécurité
                    </p>
                    <div class="certificate-name">${document.getElementById('userName').textContent}</div>
                    <div class="certificate-date">Délivré le ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div class="certificate-actions">
                        <button class="certificate-btn" onclick="downloadCertificate()">
                            <i class="fas fa-download"></i>
                            Télécharger
                        </button>
                        <button class="certificate-btn" onclick="shareCertificate()">
                            <i class="fas fa-share-alt"></i>
                            Partager
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

            <button class="quiz-start-btn" onclick="restartQuiz()">
                <i class="fas fa-redo me-2"></i>
                Recommencer
            </button>
        </div>
    `;
    
    // Animate score
    animateScore(percentage);
    
    // Update message based on score
    let title, message;
    if (percentage >= 90) {
        title = "🏆 Parfait !";
        message = "Vous êtes un expert en cybersécurité ! Continuez comme ça !";
        createConfetti();
    } else if (percentage >= 70) {
        title = "🎉 Très bien !";
        message = "Excellentes connaissances ! Vous avez obtenu votre certification !";
    } else if (percentage >= 50) {
        title = "👍 Bien joué !";
        message = "Vous avez de bonnes bases. Obtenez 70% pour la certification !";
    } else {
        title = "💪 Continuez !";
        message = "Ne vous découragez pas ! Obtenez 70% pour la certification !";
    }
    
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;
}

function animateScore(targetPercentage) {
    const scoreElement = document.getElementById('finalScore');
    let current = 0;
    const increment = targetPercentage / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
            current = targetPercentage;
            clearInterval(timer);
        }
        scoreElement.textContent = Math.round(current) + '%';
    }, 20);
}

function createConfetti() {
    const colors = ['#4c94be', '#3ddc84', '#ffd700', '#ff5252'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function downloadCertificate() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const date = new Date().toLocaleDateString('fr-FR');
    const userName = document.getElementById('userName').textContent;
    
    const certificateText = `
═══════════════════════════════════════════════════
        🎓 CERTIFICATION XYBERSHIELD 🎓
═══════════════════════════════════════════════════

Ceci certifie que

    ${userName.toUpperCase()}

a réussi le Quiz de Cybersécurité avec un score de

    ${percentage}% (${score}/${quizQuestions.length} questions correctes)

Délivré le ${date}

═══════════════════════════════════════════════════
        XyberShield - Protection Numérique
═══════════════════════════════════════════════════
    `;
    
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certification_XyberShield_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function shareCertificate() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const text = `🎓 J'ai obtenu ma Certification XyberShield en Cybersécurité avec un score de ${percentage}% ! 🔐 #XyberShield #Cybersécurité`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Certification XyberShield',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Erreur de partage:', err));
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Texte copié dans le presse-papiers ! Vous pouvez le partager sur vos réseaux sociaux.');
        });
    }
}

function restartQuiz() {
    clearInterval(timer);
    document.querySelector('.welcome-screen').style.display = 'block';
    document.getElementById('quizContent').style.display = 'none';
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    timeLeft = 30;
}
