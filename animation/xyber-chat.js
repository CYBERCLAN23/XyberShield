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
