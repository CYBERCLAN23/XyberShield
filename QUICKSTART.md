# 🚀 XyberBot - Quick Start Guide

**Get your secure chatbot running in 5 minutes!**

---

## ⚡ Quick Setup

### 1. Install Dependencies (2 min)

```bash
cd /path/to/XyberShield/FRONT
npm install
```

### 2. Configure API Key (1 min)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
echo "GEMINI_API_KEY=AIzaSyAeEXqa4J149w0GwUeKGxA3y4cQnpfQxXw" > .env
```

### 3. Test Locally (1 min)

```bash
npm run dev
```

Open `http://localhost:3000/Education.html` and test the chat!

### 4. Deploy to Vercel (1 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Add environment variable
vercel env add GEMINI_API_KEY
# Paste: AIzaSyAeEXqa4J149w0GwUeKGxA3y4cQnpfQxXw

# Redeploy
vercel --prod
```

### 5. Update Frontend URL

In `animation/xyber-chat.js`, change:

```javascript
const ChatConfig = {
    apiEndpoint: 'https://YOUR-PROJECT.vercel.app/api/chat',
    // ...
};
```

---

## ✅ Done!

Your secure XyberBot is now live! 🎉

**Test it:**
1. Open your website
2. Click chat button
3. Ask: "How do I create a strong password?"

---

## 🐛 Issues?

**Chat not working?**
- Check browser console (F12) for errors
- Verify API key in Vercel dashboard
- Check `apiEndpoint` URL is correct

**Rate limit error?**
- Wait 15 minutes
- Or increase limit in `api/chat.js`

**Need help?**
- Read full [README.md](./README.md)
- Contact: Almight @ XyberClan

---

**🛡️ Powered by XyberClan**
