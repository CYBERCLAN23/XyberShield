# 🔧 Local Setup Guide

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get one free](https://makersuite.google.com/app/apikey)

## Installation Steps

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd XyberShield/FRONT
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `genkit` - Firebase Genkit framework
- `@genkit-ai/googleai` - Google AI plugin
- `vercel` - Deployment CLI

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### 4. Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your API key
# GEMINI_API_KEY=AIzaSyAeEXqa4J149w0GwUeKGxA3y4cQnpfQxXw
```

⚠️ **Never commit `.env` to Git!** It's already in `.gitignore`.

## Local Development

### Start Development Server

```bash
npm start
```

Server runs at `http://localhost:3000`

### Test the Chatbot

1. Open `http://localhost:3000/Education.html`
2. Click the chat button (bottom right)
3. Send a test message
4. Check browser console (F12) for logs

### Debug Mode

Open browser DevTools (F12) to see:
- API request/response logs
- Error messages
- Rate limit status

## Project Structure

```
FRONT/
├── api/
│   └── chat.js                 # Genkit serverless function
├── animation/
│   ├── xyber-chat.js          # Frontend chat client
│   └── other animations...
├── style/
│   ├── chatbot.css            # Chat UI styles
│   └── other styles...
├── Education.html             # Main page
├── login.html                 # Login page
├── quiz.html                  # Quiz page
├── report.html                # Report page
├── package.json               # Dependencies
├── vercel.json                # Vercel config
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
└── docs/                      # Documentation
```

## Common Issues

### "Module not found: genkit"
```bash
npm install
```

### "Cannot find .env file"
```bash
cp .env.example .env
# Then add your API key
```

### "API key invalid"
1. Check `.env` has correct key
2. Verify key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Restart dev server

### Port 3000 already in use
```bash
# Use different port
npm start -- --port 3001
```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Vercel
- Check [API.md](./API.md) for backend configuration
- See [SECURITY.md](./SECURITY.md) for best practices

---

**Ready to deploy?** Follow the [Deployment Guide](./DEPLOYMENT.md).
