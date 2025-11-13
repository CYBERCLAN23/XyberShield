// Quiz Themes - Questions par thème
const quizThemes = {
    phishing: [
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
            question: "Comment reconnaître un email de phishing ?",
            options: [
                "L'adresse de l'expéditeur semble suspecte",
                "Le message contient des fautes d'orthographe",
                "On vous demande des informations personnelles",
                "Toutes ces réponses"
            ],
            correct: 3,
            explanation: "Un email de phishing présente souvent plusieurs signes : adresse suspecte, fautes, demandes d'informations sensibles, urgence artificielle."
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
            question: "Qu'est-ce que le spear phishing ?",
            options: [
                "Une attaque de phishing ciblée sur une personne spécifique",
                "Un type de virus informatique",
                "Un logiciel de sécurité",
                "Une technique de cryptage"
            ],
            correct: 0,
            explanation: "Le spear phishing est une attaque de phishing hautement ciblée visant une personne ou organisation spécifique avec des informations personnalisées."
        },
        {
            question: "Quel est le meilleur moyen de vérifier l'authenticité d'un email ?",
            options: [
                "Cliquer sur les liens fournis",
                "Répondre à l'email",
                "Contacter l'entreprise directement par un canal officiel",
                "Faire confiance si le logo semble correct"
            ],
            correct: 2,
            explanation: "Toujours contacter l'entreprise directement via leurs canaux officiels (site web, numéro de téléphone connu) pour vérifier."
        }
    ],
    
    passwords: [
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
            question: "À quelle fréquence devriez-vous mettre à jour vos mots de passe ?",
            options: [
                "Jamais",
                "Tous les 10 ans",
                "Tous les 3-6 mois",
                "Tous les jours"
            ],
            correct: 2,
            explanation: "Il est recommandé de changer vos mots de passe tous les 3 à 6 mois, surtout pour les comptes importants."
        },
        {
            question: "Quel type de mot de passe est le plus sécurisé ?",
            options: [
                "Votre date de naissance",
                "Le nom de votre animal",
                "Une phrase de passe longue avec caractères spéciaux",
                "123456789"
            ],
            correct: 2,
            explanation: "Une phrase de passe longue combinant lettres majuscules/minuscules, chiffres et caractères spéciaux est la plus sécurisée."
        }
    ],
    
    malware: [
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
            question: "Qu'est-ce qu'un ransomware ?",
            options: [
                "Un logiciel qui crypte vos fichiers et demande une rançon",
                "Un antivirus gratuit",
                "Un type de mot de passe",
                "Un réseau social"
            ],
            correct: 0,
            explanation: "Un ransomware crypte vos fichiers et demande le paiement d'une rançon pour les débloquer."
        },
        {
            question: "Comment se protéger des malwares ?",
            options: [
                "Installer un antivirus à jour",
                "Ne pas télécharger de fichiers suspects",
                "Maintenir son système à jour",
                "Toutes ces réponses"
            ],
            correct: 3,
            explanation: "La protection contre les malwares nécessite une approche multiple : antivirus, prudence, mises à jour régulières."
        },
        {
            question: "Qu'est-ce qu'un trojan (cheval de Troie) ?",
            options: [
                "Un antivirus",
                "Un malware qui se déguise en logiciel légitime",
                "Un type de mot de passe",
                "Un navigateur web"
            ],
            correct: 1,
            explanation: "Un trojan est un malware qui se fait passer pour un logiciel légitime pour tromper l'utilisateur et infecter le système."
        },
        {
            question: "Que faire si vous pensez être infecté par un malware ?",
            options: [
                "Ignorer le problème",
                "Déconnecter d'internet et lancer un scan antivirus",
                "Supprimer tous vos fichiers",
                "Continuer à utiliser normalement"
            ],
            correct: 1,
            explanation: "Déconnectez-vous d'internet pour éviter la propagation, puis lancez un scan antivirus complet en mode sans échec si possible."
        }
    ],
    
    general: [
        {
            question: "Qu'est-ce que le phishing ?",
            options: [
                "Une technique pour attraper des poissons",
                "Une tentative de vol d'informations personnelles par email frauduleux",
                "Un logiciel antivirus",
                "Un type de mot de passe"
            ],
            correct: 1,
            explanation: "Le phishing est une technique d'escroquerie visant à obtenir des informations confidentielles."
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
            explanation: "Un mot de passe sécurisé devrait contenir au minimum 12 caractères."
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
            explanation: "Un VPN crée un tunnel sécurisé et crypté pour votre connexion internet."
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
            explanation: "HTTPS signifie Hyper Text Transfer Protocol Secure. Le 'S' indique que la connexion est sécurisée."
        },
        {
            question: "Qu'est-ce qu'un malware ?",
            options: [
                "Un logiciel de protection",
                "Un logiciel malveillant conçu pour endommager un système",
                "Un type de navigateur web",
                "Un réseau social"
            ],
            correct: 1,
            explanation: "Un malware est un programme conçu pour endommager ou infiltrer un système informatique."
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
            explanation: "Ne partagez jamais vos informations sensibles comme numéros de sécurité sociale ou cartes bancaires en ligne."
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
            explanation: "L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire."
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
            explanation: "Ne cliquez jamais sur les liens suspects. Signalez l'email comme spam/phishing."
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
            explanation: "Il est recommandé de changer vos mots de passe tous les 3 à 6 mois."
        },
        {
            question: "Quelle est la meilleure pratique pour gérer plusieurs mots de passe ?",
            options: [
                "Utiliser le même mot de passe partout",
                "Écrire tous les mots de passe sur papier",
                "Utiliser un gestionnaire de mots de passe",
                "Utiliser des mots de passe simples"
            ],
            correct: 2,
            explanation: "Un gestionnaire de mots de passe est la solution la plus sécurisée."
        }
    ]
};
