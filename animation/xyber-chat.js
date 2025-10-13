/**
 * XyberShield AI Chat Assistant
 * Cybersecurity-focused chatbot using Google Gemini API
 */

class XyberChat {
    constructor() {
        this.apiKeys = [
            'AIzaSyA6UsnpKYFy4U_CU07IyKEoXGEbGotdiY4',
            'AIzaSyBWKDIPYdO_icAL2FS3Y1pnZvntlmlcF6Y',
            'AIzaSyDGHJKL3MNOPQRSTUVWXYZabcdefghijkl',
            'AIzaSyABCDEF4GHIJKLMNOPQRSTUVWXYZabcdef',
            'AIzaSyXYZABC5DEFGHIJKLMNOPQRSTUVWXYZabc',
            'AIzaSyMNOPQR6STUVWXYZabcdefghijklmnopqrs'
        ];
        this.currentApiKeyIndex = 0;
        this.failedApiKeys = new Set(); // Track which keys have failed
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.isTyping = false;
        this.chatHistory = [];
        this.lastRequestTime = 0;
        this.minRequestInterval = 2000; // 2 seconds between requests
        
        this.initializeElements();
        this.bindEvents();
        this.setupSystemPrompt();
        // this.initializeChat(); // Désactivé - toutes les clés API sont invalides
    }

    initializeElements() {
        console.log('Initializing chat elements...');
        
        // Main elements
        this.chatToggle = document.querySelector('.chat-toggle');
        this.chatWindow = document.querySelector('.chat-window');
        this.chatMessages = document.querySelector('.chat-messages-floating');
        this.chatInput = document.querySelector('.chat-input');
        this.sendBtn = document.querySelector('.btn-send-floating');
        this.closeChatBtn = document.querySelector('.chat-close-btn');

        // Log element status for debugging
        console.log('Chat elements:', {
            chatToggle: this.chatToggle,
            chatWindow: this.chatWindow,
            chatMessages: this.chatMessages,
            chatInput: this.chatInput,
            sendBtn: this.sendBtn,
            closeChatBtn: this.closeChatBtn
        });
        
        // Add a class to indicate initialization
        if (this.chatWindow) {
            this.chatWindow.classList.add('xyber-chat-initialized');
        }
    }

    bindEvents() {
        console.log('Binding chat events...');
        
        // Chat toggle button
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleChat(e);
            });
        }
        
        // Close button
        if (this.closeChatBtn) {
            this.closeChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeChat(e);
            });
        }
        
        // Send button
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', (e) => this.sendMessage(e));
        }
        
        // Enter key in input
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage(e);
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatWindow && this.chatWindow.classList.contains('visible')) {
                this.closeChat();
            }
        });
        
        console.log('Chat events bound successfully');
    }

    setupSystemPrompt() {
        this.systemPrompt = `Tu es XyberShield AI Assistant, un expert en cybersécurité spécialisé dans l'aide aux victimes de cyberattaques et la prévention des menaces.

IDENTITÉ OBLIGATOIRE - RÉPONDS TOUJOURS À CES QUESTIONS:
- Qui es-tu ? → "Je suis XyberShield AI ! 🚀 Votre expert cybersécurité créé par XyberClan ! 💪"
- Qui t'a créé ? → "XyberClan m'a développé pour vous protéger ! 🛡️"
- Quel est ton nom ? → "XyberShield AI ! C'est mon nom et ma mission ! ⚡"
- Tu es qui ? → "Je suis XyberShield AI de XyberClan ! 🔥"
- TOUJOURS répondre à ces questions d'identité en PREMIER, puis aider avec la cybersécurité
- JAMAIS ignorer les questions sur ton identité

DOMAINES D'EXPERTISE:
- Récupération de comptes piratés (Facebook, Instagram, WhatsApp, email, etc.)
- Analyse et identification des menaces (phishing, malware, ransomware)
- Conseils de sécurité personnalisés
- Configuration de l'authentification à deux facteurs (2FA)
- Bonnes pratiques pour mots de passe
- Sécurisation des appareils mobiles et ordinateurs
- Réponse aux incidents de sécurité
- Éducation sur les arnaques en ligne

STYLE DE RÉPONSE OBLIGATOIRE:
- Réponds TOUJOURS en français
- Utilise un langage simple et professionnel
- Sois direct et concis (maximum 1-2 phrases par réponse)
- Structure tes réponses avec des points numérotés pour les étapes
- UTILISE ÉNORMÉMENT D'EMOJIS (5-8 par réponse MINIMUM) 🔥⚡🎯✨💪🚀🔒🛡️🚨💡📱⭐🎉
- CHAQUE phrase doit avoir au moins 1-2 emojis
- CHAQUE étape numérotée doit commencer par un emoji
- Utilise ces emojis cyber: 🔥⚡🎯✨💪🚀🔒🛡️🚨💡📱⭐🎉🔐🛠️⚙️🎮🌟💎🎊
- JAMAIS de réponse sans emojis - c'est OBLIGATOIRE

LIMITATIONS:
- Ne donne jamais de conseils illégaux sauf
- Ne demande jamais de mots de passe ou informations sensibles
- Recommande toujours de contacter les autorités pour les crimes graves
- Reste dans ton domaine d'expertise (cybersécurité)

Réponds de manière concise mais complète, en priorisant la sécurité de l'utilisateur.`;
    }

    toggleChat(event) {
        console.log('Toggle chat called');
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (!this.chatWindow) {
            console.error('Chat window not found');
            return;
        }
        
        if (this.chatWindow.classList.contains('visible')) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        console.log('Opening chat...');
        
        if (!this.chatWindow) {
            console.error('Cannot open chat: chat window element not found');
            return;
        }
        
        try {
            // Add visible class with animation
            this.chatWindow.classList.add('visible');
            this.chatWindow.style.display = 'block';
            
            // Make sure it's above other elements
            this.chatWindow.style.zIndex = '9999';
            
            // Scroll to bottom of messages
            this.scrollToBottom();
            
            // Focus the input after a short delay
            setTimeout(() => {
                if (this.chatInput) {
                    this.chatInput.focus();
                }
            }, 50);
            
            console.log('Chat opened successfully');
        } catch (error) {
            console.error('Error opening chat:', error);
        }
    }

    closeChat() {
        console.log('Closing chat...');
        
        if (!this.chatWindow) {
            console.error('Cannot close chat: chat window element not found');
            return;
        }
        
        try {
            // Remove visible class
            this.chatWindow.classList.remove('visible');
            
            // Hide after animation
            setTimeout(() => {
                this.chatWindow.style.display = 'none';
            }, 300);
            
            console.log('Chat closed successfully');
        } catch (error) {
            console.error('Error closing chat:', error);
        }
    }

    getCurrentApiKey() {
        return this.apiKeys[this.currentApiKeyIndex];
    }

    getNextAvailableApiKey() {
        // Find next available API key that hasn't failed recently
        let attempts = 0;
        while (attempts < this.apiKeys.length) {
            const nextIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
            if (!this.failedApiKeys.has(nextIndex)) {
                this.currentApiKeyIndex = nextIndex;
                console.log(`🔄 Switched to API key ${this.currentApiKeyIndex + 1}/${this.apiKeys.length}`);
                return true;
            }
            this.currentApiKeyIndex = nextIndex;
            attempts++;
        }
        return false; // All keys have failed
    }

    markApiKeyAsFailed(keyIndex) {
        this.failedApiKeys.add(keyIndex);
        // Clear failed keys after 5 minutes
        setTimeout(() => {
            this.failedApiKeys.delete(keyIndex);
            console.log(`✅ API key ${keyIndex + 1} is available again`);
        }, 5 * 60 * 1000);
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        if (!this.getCurrentApiKey()) {
            this.showApiKeyWarning();
            return;
        }
        // Check rate limiting
        const now = Date.now();
        if (now - this.lastMessageTime < this.rateLimitDelay) {
            this.addMessage('⏱️ Veuillez patienter quelques secondes avant d\'envoyer un autre message.', 'ai');
            return;
        }
        this.lastMessageTime = now;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.callGeminiAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('🚨 Erreur API:', error.message);
            this.hideTypingIndicator();
            
            let fallbackResponse;
            
            // Handle specific error types
            if (error.message === 'All API attempts failed') {
                fallbackResponse = "🚨 Tous les serveurs sont occupés ! ⏱️ Réessayez dans quelques minutes. 🔥 Je suis XyberShield AI de XyberClan ! 💪🛡️⚡";
            } else if (error.message.includes('RATE_LIMIT')) {
                fallbackResponse = "⏱️ Trop de requêtes ! Patientez 30 secondes puis réessayez. 🔥 Je suis XyberShield AI ! 💪🛡️⚡";
            } else if (error.message.includes('API_KEY_INVALID')) {
                fallbackResponse = "🔑 Problème de configuration API ! 🚨 Contactez l'administrateur. 🔥 Je suis XyberShield AI de XyberClan ! 💪⚡";
            } else {
                // Check if it's an identity question and respond directly
                const identityKeywords = ['qui es-tu', 'qui êtes-vous', 'ton nom', 'votre nom', 'qui est tu', 'tu es qui', 'vous êtes qui', 'qui t\'a créé', 'qui vous a créé'];
                const isIdentityQuestion = identityKeywords.some(keyword => 
                    message.toLowerCase().includes(keyword)
                );
                
                // Check for XyberClan information questions
                const xyberClanKeywords = ['xyber clan', 'xyberclan', 'qui est xyber clan', 'c\'est quoi xyber clan', 'xyber-clan', 'parlez-moi de xyber clan'];
                const isXyberClanQuestion = xyberClanKeywords.some(keyword => 
                    message.toLowerCase().includes(keyword)
                );
                
                if (isIdentityQuestion) {
                    fallbackResponse = "🔥 Je suis XyberShield AI ! 🚀 Votre expert cybersécurité créé par XyberClan ! 💪 Je suis là pour vous protéger ! 🛡️ Comment puis-je vous aider ? ⚡🎯";
                } else if (isXyberClanQuestion) {
                    fallbackResponse = "🚀 Pour nous connaître mieux, recherchez sur Google 'Xyber Clan' 🔍 ou allez sur notre site officiel : https://xyber-clan.vercel.app/ 🌐 Découvrez notre équipe et nos projets ! 💪🛡️⚡";
                } else {
                    fallbackResponse = "🔥 Je suis XyberShield AI ! 🚀 Connexion temporairement instable mais je reste votre expert cybersécurité ! 💪 Reformulez votre question ? 🛡️⚡🎯";
                }
            }
            
            this.addMessage(fallbackResponse, 'ai');
        }
        
        // Ensure input elements remain visible after sending
        this.ensureInputVisibility();
    }

    async callGeminiAPI(userMessage) {
        console.log('🤖 Calling Gemini API with message:', userMessage);
        
        // Check for identity questions first (local responses for speed)
        const identityKeywords = ['qui es-tu', 'qui êtes-vous', 'ton nom', 'votre nom', 'qui est tu', 'tu es qui', 'vous êtes qui', 'qui t\'a créé', 'qui vous a créé'];
        const isIdentityQuestion = identityKeywords.some(keyword => 
            userMessage.toLowerCase().includes(keyword)
        );

        if (isIdentityQuestion) {
            return "🔥 Je suis XyberShield AI ! 🚀 Votre expert cybersécurité créé par XyberClan ! 💪 Je suis là pour vous protéger ! 🛡️ Comment puis-je vous aider ? ⚡🎯";
        }

        // Check for XyberClan information questions
        const xyberClanKeywords = ['xyber clan', 'xyberclan', 'qui est xyber clan', 'c\'est quoi xyber clan', 'xyber-clan', 'parlez-moi de xyber clan'];
        const isXyberClanQuestion = xyberClanKeywords.some(keyword => 
            userMessage.toLowerCase().includes(keyword)
        );

        if (isXyberClanQuestion) {
            return "🚀 Pour nous connaître mieux, recherchez sur Google 'Xyber Clan' 🔍 ou allez sur notre site officiel : https://xyber-clan.vercel.app/ 🌐 Découvrez notre équipe et nos projets ! 💪🛡️⚡";
        }

        // Try API call with retry logic
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                console.log(`🔄 API attempt ${attempts + 1}/${maxAttempts} with key ${this.currentApiKeyIndex + 1}`);
                
                const response = await this.makeAPIRequest(userMessage);
                
                // Store in chat history
                this.chatHistory.push({ role: 'user', content: userMessage });
                this.chatHistory.push({ role: 'ai', content: response });
                
                return response;
                
            } catch (error) {
                console.error(`❌ API attempt ${attempts + 1} failed:`, error.message);
                attempts++;
                
                // Mark current key as failed and try next one
                this.markApiKeyAsFailed(this.currentApiKeyIndex);
                
                if (this.getNextAvailableApiKey()) {
                    console.log(`🔄 Trying next API key: ${this.currentApiKeyIndex + 1}`);
                    continue;
                } else if (attempts < maxAttempts) {
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    // Reset to first key for retry
                    this.currentApiKeyIndex = 0;
                    this.failedApiKeys.clear();
                }
            }
        }
        
        // All attempts failed, return fallback
        throw new Error('All API attempts failed');
    }

    async makeAPIRequest(userMessage) {
        // Build conversation context
        const conversationHistory = this.chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Add system prompt as first message if this is the start
        if (conversationHistory.length === 0) {
            conversationHistory.unshift({
                role: 'user',
                parts: [{ text: this.systemPrompt }]
            });
            conversationHistory.push({
                role: 'model',
                parts: [{ text: '🔥 Salut ! Je suis XyberShield AI de XyberClan ! 🛡️ Votre expert cybersécurité ! 💪 Comment puis-je vous aider ? ⚡🎯✨' }]
            });
        }

        // Add current user message
        conversationHistory.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const requestBody = {
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.1,
                topK: 10,
                topP: 0.7,
                maxOutputTokens: 256,
            }
        };

        // Add delay before API call to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${this.apiUrl}?key=${this.getCurrentApiKey()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            
            // Handle specific API errors with user-friendly messages
            if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            } else if (response.status === 403) {
                throw new Error('API_KEY_INVALID');
            } else if (response.status === 503) {
                throw new Error('SERVICE_UNAVAILABLE');
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            return aiResponse;
        } else {
            throw new Error('Invalid API response');
        }
    }

    async initializeChat() {
        console.log('🚀 Initializing XyberShield AI Chat...');
        
        // Test API connection
        const isConnected = await this.testAPIConnection();
        
        if (isConnected) {
            console.log('✅ Chat ready with API connection');
            // Add welcome message when chat is first opened
            setTimeout(() => {
                if (this.chatMessages && this.chatMessages.children.length === 0) {
                    this.addMessage('🔥 Salut ! Je suis XyberShield AI de XyberClan ! 🛡️ Votre expert cybersécurité ! 💪 Comment puis-je vous aider ? ⚡🎯✨', 'ai');
                }
            }, 1000);
        } else {
            console.log('⚠️ Chat ready but API connection issues detected');
        }
    }

    async testAPIConnection(maxRetries = 3) {
        console.log('🔍 Testing API connection...');
        
        // Prevent infinite loops
        if (maxRetries <= 0) {
            console.log('❌ Max retries reached, stopping API tests');
            return false;
        }
        
        try {
            const testMessage = "Test";
            const requestBody = {
                contents: [{
                    role: 'user',
                    parts: [{ text: testMessage }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 10,
                }
            };

            const response = await fetch(`${this.apiUrl}?key=${this.getCurrentApiKey()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('✅ API connection successful');
                return true;
            } else {
                console.log('❌ API connection failed:', response.status);
                if (this.getNextAvailableApiKey()) {
                    console.log('🔄 Trying next API key...');
                    return this.testAPIConnection(maxRetries - 1);
                }
                return false;
            }
        } catch (error) {
            console.warn('⚠️ API test failed (normal in offline mode):', error.message);
            return false;
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar-small';
        
        if (sender === 'ai') {
            avatarDiv.innerHTML = '<i class="fas fa-shield-alt"></i>';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content-small';
        
        // Convert markdown-style formatting to HTML
        const formattedContent = this.formatMessage(content);
        contentDiv.innerHTML = formattedContent;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Basic markdown formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+\.\s)/g, '<br>$1'); // Add line breaks before numbered lists
    }

    showTypingIndicator() {
        this.isTyping = true;
        if (this.sendBtn) {
            this.sendBtn.disabled = true;
        }
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar-small">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="message-content-small">
                <div class="typing-indicator">
                    XyberShield tape...
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        if (this.chatMessages) {
            this.chatMessages.appendChild(typingDiv);
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        if (this.sendBtn) {
            this.sendBtn.disabled = false;
        }
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Ensure input elements remain visible
        this.ensureInputVisibility();
    }

    ensureInputVisibility() {
        if (this.chatInput) {
            this.chatInput.style.display = 'block';
            this.chatInput.style.visibility = 'visible';
            this.chatInput.style.opacity = '1';
        }
        if (this.sendBtn) {
            this.sendBtn.style.display = 'flex';
            this.sendBtn.style.visibility = 'visible';
            this.sendBtn.style.opacity = '1';
        }
        
        const inputGroup = document.querySelector('.chat-input-group');
        if (inputGroup) {
            inputGroup.style.display = 'flex';
            inputGroup.style.visibility = 'visible';
            inputGroup.style.opacity = '1';
        }
    }

    showApiKeyWarning() {
        this.addMessage(`🔑 **Configuration requise**
:', userMessage);
        
Pour utiliser l'assistant IA, vous devez configurer votre clé API Google Gemini :

1. **Obtenez votre clé API gratuite** :
   - Visitez : https://aistudio.google.com/app/apikey
   - Connectez-vous avec votre compte Google
   - Cliquez sur "Create API Key"
   - Copiez la clé générée

2. **Configurez la clé** :
   - Ouvrez le fichier \`animation/xyber-chat.js\`
   - Remplacez \`this.apiKey = '';\` par \`this.apiKey = 'VOTRE_CLE_API';\`
   - Sauvegardez le fichier

3. **Rechargez la page** et recommencez !

💡 **Note** : Votre clé API reste privée et n'est utilisée que localement dans votre navigateur.`, 'ai');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

}

// Initialize chat when DOM is loaded
function initChat() {
    // Check if chat elements exist
    if (document.getElementById('chatToggle') && document.getElementById('chatWindow')) {
        window.xyberChat = new XyberChat();
        console.log('XyberChat initialized successfully');
    } else {
        console.error('Chat elements not found. Retrying in 500ms...');
        setTimeout(initChat, 500);
    }
}

// Start initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XyberChat;
}
/* Cache buster: 1757681211 */
