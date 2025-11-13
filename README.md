# 🛡️ XyberBot - Secure AI Chatbot

**Part of XyberShield platform by XyberClan**  
**Developer:** Almight ([Portfolio](https://almightportfolio.vercel.app/))

Secure, production-ready AI chatbot for cybersecurity education using Firebase Genkit and Gemini 1.5-flash.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup Guide](#setup-guide)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

✅ **Secure Backend** - API key hidden in serverless function  
✅ **Rate Limiting** - 15 requests per 15 minutes per session  
✅ **Gemini 1.5-flash** - Latest, fastest model  
✅ **Auto Retry** - Handles network errors gracefully  
✅ **Session Management** - Unique session IDs  
✅ **Input Sanitization** - XSS protection  
✅ **Markdown Support** - Formatted responses  
✅ **Mobile Responsive** - Works on all devices  
✅ **Production Ready** - Vercel serverless deployment  

---

## 🏗️ Architecture

```
Frontend (xyber-chat.js)
    ↓ POST /api/chat
Backend (api/chat.js - Genkit)
    ↓ Gemini 1.5-flash API
Google AI
```

**Security:**
- API key stored in environment variables
- Rate limiting per session
- Input validation and sanitization
- CORS protection
- No sensitive data in frontend

---

## 🚀 Setup Guide

### Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- Google Gemini API key

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key (starts with `AIza...`)

### Step 2: Install Dependencies

```bash
cd /path/to/XyberShield/FRONT
npm install
```

This installs:
- `genkit` - Firebase Genkit framework
- `@genkit-ai/googleai` - Google AI plugin
- `vercel` - Deployment CLI

### Step 3: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
GEMINI_API_KEY=AIzaSyAeEXqa4J149w0GwUeKGxA3y4cQnpfQxXw
```

⚠️ **Important:** Never commit `.env` to Git!

---

## 💻 Local Development

### Start Development Server

```bash
npm run dev
```

This starts Vercel dev server at `http://localhost:3000`

### Test the Chatbot

1. Open `Education.html` in browser
2. Click chat button (bottom right)
3. Send a test message: "How do I create a strong password?"
4. Check browser console for logs

### Debug Mode

Open browser console (F12) to see:
- `📤 Sending to XyberBot API...`
- `📥 Response: {...}`
- Error messages if any

---

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variable:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Paste your API key when prompted.

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Go to "Settings" → "Environment Variables"
5. Add `GEMINI_API_KEY` with your API key
6. Redeploy

### Update Frontend URL

After deployment, update `xyber-chat.js`:

```javascript
const ChatConfig = {
    apiEndpoint: 'https://your-project.vercel.app/api/chat', // Your Vercel URL
    // ...
};
```

---

## ⚙️ Configuration

### Backend (`api/chat.js`)

```javascript
// Rate limit: 15 requests per 15 minutes
const fifteenMinutes = 15 * 60 * 1000;
if (recentRequests.length >= 15) {
    return false;
}

// Model configuration
config: {
    temperature: 0.75,      // Creativity (0-1)
    maxOutputTokens: 800,   // Response length
    topP: 0.9,             // Diversity
    stopSequences: ['User:', 'Human:']
}
```

### Frontend (`xyber-chat.js`)

```javascript
const ChatConfig = {
    apiEndpoint: '/api/chat',
    maxRetries: 3,          // Retry attempts
    retryDelay: 1000,       // 1 second between retries
    timeout: 30000          // 30 second timeout
};
```

---

## 🐛 Troubleshooting

### Issue: "Rate limit exceeded"

**Cause:** Too many requests in 15 minutes  
**Solution:** Wait a few minutes, or increase limit in `api/chat.js`

### Issue: "Erreur API (403)"

**Cause:** Invalid API key  
**Solution:** 
1. Check `.env` file has correct key
2. Verify key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Redeploy: `vercel --prod`

### Issue: "Request timeout"

**Cause:** Slow network or API  
**Solution:**
1. Check internet connection
2. Increase timeout in `xyber-chat.js`
3. Try again

### Issue: "CORS error"

**Cause:** Wrong API endpoint  
**Solution:** Update `apiEndpoint` in `xyber-chat.js` to your Vercel URL

### Issue: "Module not found: genkit"

**Cause:** Dependencies not installed  
**Solution:**
```bash
npm install
```

---

## 📊 API Usage Limits

**Gemini 1.5-flash Free Tier:**
- 15 requests per minute
- 1500 requests per day
- 1 million tokens per minute

**XyberBot Rate Limit:**
- 15 requests per 15 minutes per session
- Protects your quota

---

## 🔒 Security Best Practices

✅ **Never expose API key in frontend**  
✅ **Always use environment variables**  
✅ **Enable rate limiting**  
✅ **Sanitize user input**  
✅ **Use HTTPS in production**  
✅ **Monitor API usage**  

---

## 📝 File Structure

```
XyberShield/FRONT/
├── api/
│   └── chat.js              # Genkit serverless function
├── animation/
│   └── xyber-chat.js        # Frontend client
├── style/
│   └── chatbot.css          # Chat UI styles
├── Education.html           # Main page
├── package.json             # Dependencies
├── vercel.json              # Vercel config
├── .env.example             # Environment template
└── README.md                # This file
```

---

## 🎨 Customization

### Change Bot Personality

Edit `SYSTEM_PROMPT` in `api/chat.js`:

```javascript
const SYSTEM_PROMPT = `You are XyberBot...`;
```

### Change Rate Limit

Edit `checkRateLimit()` in `api/chat.js`:

```javascript
if (recentRequests.length >= 20) { // Change from 15 to 20
    return false;
}
```

### Change Response Length

Edit model config in `api/chat.js`:

```javascript
config: {
    maxOutputTokens: 1200, // Change from 800
}
```

---

## 📞 Support

**Issues?** Contact Almight:
- Portfolio: [almightportfolio.vercel.app](https://almightportfolio.vercel.app/)
- XyberClan: [xyberclan.com](https://xyberclan.com)

---

## 📜 License

MIT License - XyberClan

**Powered by:**
- Firebase Genkit
- Google Gemini 1.5-flash
- Vercel Serverless Functions

---

## 🙏 Credits

**Developed by:** Almight  
**Organization:** XyberClan  
**Platform:** XyberShield  
**Mission:** Cybersecurity education for everyone

---

**🛡️ Stay safe online with XyberShield!**
