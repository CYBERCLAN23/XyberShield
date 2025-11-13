/**
 * XyberBot Chat API - Secure Backend
 * 
 * Part of XyberShield platform by XyberClan
 * Developer: Almight (https://almightportfolio.vercel.app/)
 * 
 * Provides secure AI-powered cybersecurity education assistance
 * using Firebase Genkit and Gemini 1.5-flash.
 * 
 * @version 2.0.0
 */

import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// Initialize Genkit with Google AI
const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
    model: gemini15Flash,
});

// Rate limiting storage (in-memory for serverless)
const rateLimitStore = new Map();

// XyberBot System Prompt
const SYSTEM_PROMPT = `You are XyberBot, the AI assistant for XyberShield - a cybersecurity education platform by XyberClan. Your creator is Almight, a cybersecurity expert passionate about digital safety education.

Your Mission:
Help everyday people learn good digital practices and protect themselves against hackers. You're an educator first, not just a security bot.

Core Topics:
- Safe browsing and email habits
- Password security and 2FA
- Recognizing phishing and scams
- Malware prevention
- Privacy protection
- Safe online shopping
- Mobile and WiFi security
- Social media safety

Teaching Style:
- Use simple language (avoid technical jargon)
- Explain WHY something is dangerous, not just WHAT to do
- Use real-world examples and analogies
- Be encouraging, not scary or preachy
- Give actionable, step-by-step advice
- Relate to daily digital life (emails, social media, shopping)

Response Format:
- Keep answers practical and concise (2-4 paragraphs max)
- Use bullet points for steps or lists
- Include a relevant emoji occasionally (🔒 🛡️ ⚠️ ✅)
- End with encouragement or a follow-up question when appropriate

Language:
- Auto-detect user's language (French or English)
- Match the user's language in your response
- If mixed, use the dominant language

Limitations:
- Don't provide hacking techniques
- Don't recommend specific antivirus brands (stay neutral)
- Don't diagnose specific malware (suggest professional help)
- Admit uncertainty and recommend expert consultation when needed

Brand Voice:
- 'We at XyberClan believe...'
- 'Here at XyberShield, we teach...'
- 'Our team recommends...'
- Reference Almight's expertise when relevant`;

/**
 * Check rate limit for a session
 * @param {string} sessionId - Unique session identifier
 * @returns {boolean} - True if request is allowed
 */
function checkRateLimit(sessionId) {
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (!rateLimitStore.has(sessionId)) {
        rateLimitStore.set(sessionId, []);
    }
    
    const requests = rateLimitStore.get(sessionId);
    
    // Clean old requests
    const recentRequests = requests.filter(time => now - time < fifteenMinutes);
    rateLimitStore.set(sessionId, recentRequests);
    
    // Check limit (15 requests per 15 minutes)
    if (recentRequests.length >= 15) {
        return false;
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(sessionId, recentRequests);
    
    return true;
}

/**
 * Sanitize user input
 * @param {string} input - User message
 * @returns {string} - Sanitized message
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Remove HTML tags and scripts
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 500); // Max 500 characters
}

/**
 * Main serverless function handler
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            response: null,
            error: 'Method not allowed. Use POST.',
            timestamp: Date.now()
        });
    }
    
    try {
        const { message, sessionId } = req.body;
        
        // Validate input
        if (!message || !sessionId) {
            return res.status(400).json({
                response: null,
                error: 'Missing required fields: message and sessionId',
                timestamp: Date.now()
            });
        }
        
        // Sanitize input
        const sanitizedMessage = sanitizeInput(message);
        
        if (!sanitizedMessage) {
            return res.status(400).json({
                response: null,
                error: 'Invalid message content',
                timestamp: Date.now()
            });
        }
        
        // Check rate limit
        if (!checkRateLimit(sessionId)) {
            return res.status(429).json({
                response: null,
                error: 'Rate limit exceeded. Please wait a few minutes before trying again.',
                timestamp: Date.now()
            });
        }
        
        // Call Genkit AI
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${sanitizedMessage}\n\nXyberBot:`;
        
        const { text } = await ai.generate({
            model: gemini15Flash,
            prompt: prompt,
            config: {
                temperature: 0.75,
                maxOutputTokens: 800,
                topP: 0.9,
                stopSequences: ['User:', 'Human:']
            }
        });
        
        // Success response
        return res.status(200).json({
            response: text,
            error: null,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('XyberBot Error:', error);
        
        // Handle specific errors
        if (error.message?.includes('quota')) {
            return res.status(503).json({
                response: null,
                error: 'Service temporarily unavailable. Please try again later.',
                timestamp: Date.now()
            });
        }
        
        // Generic error
        return res.status(500).json({
            response: null,
            error: 'An error occurred. Please try again.',
            timestamp: Date.now()
        });
    }
}
