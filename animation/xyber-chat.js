<<<<<<< HEAD
// Basic chat functionality for XyberShield

// WARNING: Do not expose your API key in client-side code. This is for demonstration purposes only.
const GEMINI_API_KEY = 'AIzaSyDG-fyJBaoBiyA4BYjRaMNsuGOymH3qaCM';

document.addEventListener('DOMContentLoaded', () => {
    console.log('xyber-chat.js: DOMContentLoaded event fired.');
    try {
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const closeChatBtn = document.getElementById('closeChatBtn');
        const chatInput = document.getElementById('chatInput');
        const sendMessage = document.getElementById('sendMessage');
        const chatMessages = document.getElementById('chatMessages');

        console.log('chatToggle:', chatToggle);
        console.log('chatWindow:', chatWindow);
        console.log('closeChatBtn:', closeChatBtn);
        console.log('chatInput:', chatInput);
        console.log('sendMessage:', sendMessage);
        console.log('chatMessages:', chatMessages);

        if (chatToggle && chatWindow && closeChatBtn && chatInput && sendMessage && chatMessages) {
            console.log('All chat elements found.');
            chatToggle.addEventListener('click', () => {
                console.log('Chat toggle button clicked.');
                toggleChatWindow();
            });

            closeChatBtn.addEventListener('click', () => {
                console.log('Close chat button clicked.');
                toggleChatWindow();
            });

            sendMessage.addEventListener('click', () => {
                console.log('Send message button clicked.');
                handleSendMessage();
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed in chat input.');
                    handleSendMessage();
                }
            });

            function toggleChatWindow() {
                chatWindow.classList.toggle('visible');
            }

            function handleSendMessage() {
                const messageText = chatInput.value.trim();
                if (messageText !== '') {
                    console.log(`Sending message: ${messageText}`);
                    addMessage('user', messageText);
                    chatInput.value = '';
                    callGeminiAPI(messageText);
                }
            }

            function addMessage(sender, text) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', `${sender}-message`);

                const avatarElement = document.createElement('div');
                avatarElement.classList.add('message-avatar-small');
                avatarElement.innerHTML = `<i class="fas fa-${sender === 'user' ? 'user' : 'shield-alt'}"></i>`;

                const contentElement = document.createElement('div');
                contentElement.classList.add('message-content-small');
                contentElement.innerHTML = `<p>${text}</p>`;

                messageElement.appendChild(avatarElement);
                messageElement.appendChild(contentElement);

                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            async function callGeminiAPI(message) {
                addMessage('ai', '...'); // Loading indicator

                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

                try {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: message
                                }]
                            }]
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                        const aiResponse = data.candidates[0].content.parts[0].text;
                        const loadingIndicator = chatMessages.lastChild;
                        loadingIndicator.remove();
                        addMessage('ai', aiResponse);
                    } else {
                        throw new Error('Invalid response structure from Gemini API');
                    }

                } catch (error) {
                    console.error('Error calling Gemini API:', error);
                    const loadingIndicator = chatMessages.lastChild;
                    if(loadingIndicator) loadingIndicator.remove();
                    addMessage('ai', 'Sorry, I am having trouble connecting to the AI. Please try again later.');
                }
            }
        } else {
            console.error('One or more chat elements are missing.');
        }
    } catch (error) {
        console.error('An error occurred in xyber-chat.js:', error);
    }
});
=======
/**
 * XyberBot Frontend Client
 * 
 * Part of XyberShield platform by XyberClan
 * Developer: Almight (https://almightportfolio.vercel.app/)
 * 
 * Secure frontend client that communicates with backend API
 * 
 * @version 2.0.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const ChatConfig = {
    apiEndpoint: '/api/chat', // Change to your Vercel URL in production
    sessionId: generateSessionId(),
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Generate unique session ID
 * @returns {string} - Unique session identifier
 */
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

let chatToggle, chatWindow, closeChatBtn, chatInput, sendMessage, chatMessages;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    chatToggle = document.getElementById('chatToggle');
    chatWindow = document.getElementById('chatWindow');
    closeChatBtn = document.getElementById('closeChatBtn');
    chatInput = document.getElementById('chatInput');
    sendMessage = document.getElementById('sendMessage');
    chatMessages = document.getElementById('chatMessages');

    if (!chatToggle || !chatWindow || !closeChatBtn || !chatInput || !sendMessage || !chatMessages) {
        console.error('❌ XyberBot: Required DOM elements not found');
        return;
    }

    console.log('✅ XyberBot initialized - Powered by XyberClan');

    // Event listeners
    chatToggle.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);
    sendMessage.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
});

// ============================================================================
// UI FUNCTIONS
// ============================================================================

/**
 * Toggle chat window visibility
 */
function toggleChat() {
    chatWindow.classList.toggle('visible');
    if (chatWindow.classList.contains('visible')) {
        chatInput.focus();
    }
}

/**
 * Add message to chat UI
 * @param {string} role - 'user' or 'ai'
 * @param {string} content - Message content
 */
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);

    // Add avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    if (role === 'user') {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    }
    // AI avatar uses CSS background image

    // Add content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content-small');
    
    // Support markdown-style formatting
    const formattedContent = formatMessage(content);
    contentDiv.innerHTML = formattedContent;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

/**
 * Format message with basic markdown support
 * @param {string} text - Raw text
 * @returns {string} - Formatted HTML
 */
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/`(.*?)`/g, '<code>$1</code>'); // Code
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai-message');
    typingDiv.id = 'typing-indicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');

    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = '<span></span><span></span><span></span>';

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(indicator);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Handle send message button click
 */
async function handleSendMessage() {
    const messageText = chatInput.value.trim();
    
    if (!messageText) return;
    
    // Validate length
    if (messageText.length > 500) {
        addMessage('ai', '⚠️ Message trop long. Maximum 500 caractères.');
        return;
    }

    // Add user message to UI
    addMessage('user', messageText);
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Send to backend
    try {
        const response = await sendMessageToBackend(messageText);
        removeTypingIndicator();
        
        if (response.error) {
            addMessage('ai', `❌ ${response.error}`);
        } else {
            addMessage('ai', response.response);
        }
    } catch (error) {
        removeTypingIndicator();
        console.error('XyberBot Error:', error);
        addMessage('ai', '❌ Erreur de connexion. Veuillez réessayer.');
    }
}

/**
 * Send message to backend API with retry logic
 * @param {string} message - User message
 * @param {number} attempt - Current attempt number
 * @returns {Promise<Object>} - API response
 */
async function sendMessageToBackend(message, attempt = 1) {
    try {
        console.log(`📤 Sending to XyberBot API (attempt ${attempt})...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), ChatConfig.timeout);

        const response = await fetch(ChatConfig.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sessionId: ChatConfig.sessionId
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        console.log('📥 Response:', data);

        // Handle rate limit with retry
        if (response.status === 429 && attempt < ChatConfig.maxRetries) {
            console.log(`⏳ Rate limited, retrying in ${ChatConfig.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, ChatConfig.retryDelay));
            return sendMessageToBackend(message, attempt + 1);
        }

        return data;

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }

        // Retry on network error
        if (attempt < ChatConfig.maxRetries) {
            console.log(`🔄 Retrying (${attempt}/${ChatConfig.maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, ChatConfig.retryDelay));
            return sendMessageToBackend(message, attempt + 1);
        }

        throw error;
    }
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Log XyberBot info
 */
console.log('%c🛡️ XyberBot by XyberClan', 'font-size: 16px; font-weight: bold; color: #3ddc84;');
console.log('%cDeveloped by Almight', 'font-size: 12px; color: #666;');
console.log('%chttps://almightportfolio.vercel.app/', 'font-size: 12px; color: #3ddc84;');
>>>>>>> e0d86ad (Update vercel.json and clean up project files)
