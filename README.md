# 🛡️ XyberBot - Secure AI Chatbot

**Part of XyberShield platform by XyberClan**  
**Developer:** Almight ([Portfolio](https://almightportfolio.vercel.app/))  
**Last Deployment:** 2025-03-13 12:15 PM UTC+1

Secure, production-ready AI chatbot for cybersecurity education using Firebase Genkit and Gemini 1.5-flash.

> **⚠️ Private Project** - This repository is not open source. All rights reserved by XyberClan.

---

## 📋 Quick Links

- **[🚀 Quick Start](#quick-start)** - Get running in 5 minutes
- **[📚 Full Documentation](#documentation)** - Detailed guides in `/docs`
- **[🔧 Setup Guide](./docs/SETUP.md)** - Local development setup
- **[🌐 Deployment](./docs/DEPLOYMENT.md)** - Deploy to Vercel
- **[🔌 API Reference](./docs/API.md)** - Backend API documentation
- **[🔒 Security](./docs/SECURITY.md)** - Security best practices
- **[🐛 Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues & solutions

---

## ✨ Features

✅ **Secure Backend** - API key hidden in serverless functions  
✅ **Rate Limiting** - 15 requests per 15 minutes per session  
✅ **Gemini 1.5-flash** - Latest, fastest AI model  
✅ **Auto Retry** - Handles network errors gracefully  
✅ **Session Management** - Unique session IDs per user  
✅ **Input Sanitization** - XSS protection built-in  
✅ **Markdown Support** - Formatted responses  
✅ **Mobile Responsive** - Works on all devices  
✅ **Production Ready** - Vercel serverless deployment  
✅ **Zero Downtime** - Automatic scaling  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel account (free)
- Google Gemini API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd XyberShield/FRONT
npm install
```

### 2. Get API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### 3. Configure

```bash
cp .env.example .env
# Edit .env and add your API key
```

### 4. Run Locally

```bash
npm start
# Open http://localhost:3000/Education.html
```

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
vercel env add GEMINI_API_KEY
vercel --prod
```

**Done!** Your chatbot is live. 🎉

---

## 📚 Documentation

All detailed documentation is in the `/docs` folder:

| Document | Purpose |
|----------|---------|
| **[SETUP.md](./docs/SETUP.md)** | Local development setup & installation |
| **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** | Deploy to Vercel (CLI & Dashboard) |
| **[API.md](./docs/API.md)** | API endpoints & configuration |
| **[SECURITY.md](./docs/SECURITY.md)** | Security best practices & compliance |
| **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** | Common issues & solutions |

---

## 🏗️ Architecture

```
Frontend (xyber-chat.js)
    ↓ POST /api/chat
Backend (api/chat.js - Genkit)
    ↓ Gemini 1.5-flash API
Google AI
```

**Security Features:**
- API key stored in environment variables (never exposed)
- Rate limiting per session (15 req/15 min)
- Input validation and sanitization
- CORS protection
- HTTPS enforced in production

---

## 📁 Project Structure

```
XyberShield/FRONT/
├── api/
│   └── chat.js                    # Genkit serverless function
├── animation/
│   ├── xyber-chat.js             # Frontend chat client
│   └── other animations...
├── style/
│   ├── chatbot.css               # Chat UI styles
│   └── other styles...
├── docs/
│   ├── SETUP.md                  # Setup guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── API.md                    # API reference
│   ├── SECURITY.md               # Security guide
│   └── TROUBLESHOOTING.md        # Troubleshooting
├── Education.html                # Main page
├── login.html                    # Login page
├── quiz.html                     # Quiz page
├── report.html                   # Report page
├── package.json                  # Dependencies
├── vercel.json                   # Vercel config
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env (never commit this!)
GEMINI_API_KEY=your_api_key_here
```

### Backend Settings (`api/chat.js`)

```javascript
// Rate limit: 15 requests per 15 minutes
// Model: Gemini 1.5-flash
// Temperature: 0.75 (balanced creativity)
// Max tokens: 800 (response length)
```

### Frontend Settings (`animation/xyber-chat.js`)

```javascript
const ChatConfig = {
    apiEndpoint: '/api/chat',
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000
};
```

See [API.md](./docs/API.md) for detailed configuration options.

---

## 🔒 Security

✅ **API Key Protection** - Environment variables only  
✅ **Rate Limiting** - 15 requests per 15 minutes  
✅ **Input Validation** - XSS protection  
✅ **HTTPS** - Enforced in production  
✅ **CORS** - Protected endpoints  
✅ **No Data Storage** - GDPR compliant  

**See [SECURITY.md](./docs/SECURITY.md) for detailed security practices.**

---

## 📊 API Limits

**Gemini 1.5-flash Free Tier:**
- 15 requests per minute
- 1500 requests per day
- 1 million tokens per minute

**XyberBot Rate Limit:**
- 15 requests per 15 minutes per session

See [API.md](./docs/API.md) for endpoint details.

---

## 🐛 Troubleshooting

**Common issues:**
- "Module not found" → Run `npm install`
- "API key invalid" → Check `.env` file
- "CORS error" → Update API endpoint URL
- "Rate limit exceeded" → Wait 15 minutes

**See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for complete guide.**

---

## 🚀 Deployment

### Quick Deploy (Vercel CLI)

```bash
npm install -g vercel
vercel login
vercel --prod
vercel env add GEMINI_API_KEY
vercel --prod
```

### GitHub Integration

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

**See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed steps.**

---

## 📞 Support & Contact

**Issues or questions?**
- 📖 Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- 🔗 Portfolio: [almightportfolio.vercel.app](https://almightportfolio.vercel.app/)
- 🏢 Organization: [xyberclan.com](https://xyberclan.com)

---

## 📜 License & Legal

**MIT License** - XyberClan

**⚠️ Private Project Notice:**
- This repository is **not open source**
- All rights reserved by XyberClan
- Unauthorized copying or distribution is prohibited
- For licensing inquiries, contact XyberClan

---

## 🙏 Credits

**Developed by:** Almight  
**Organization:** XyberClan  
**Platform:** XyberShield  
**Mission:** Cybersecurity education for everyone

**Powered by:**
- Firebase Genkit
- Google Gemini 1.5-flash
- Vercel Serverless Functions

---

**🛡️ Stay safe online with XyberShield!**
