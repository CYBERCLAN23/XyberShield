# 📚 Documentation Index

Complete documentation for XyberBot project.

## 📖 Documentation Files

### Getting Started
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⚡
  - Fast lookup for commands and configurations
  - Essential commands cheat sheet
  - Common troubleshooting quick fixes

- **[SETUP.md](./SETUP.md)** 🔧
  - Local development setup
  - Installation steps
  - Prerequisites and dependencies
  - Project structure overview

### Deployment & Operations
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** 🌐
  - Deploy to Vercel (CLI & Dashboard)
  - Environment variables setup
  - Post-deployment configuration
  - Troubleshooting deployment issues

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✅
  - Pre-deployment checklist
  - Code quality checks
  - Security verification
  - Post-deployment testing

### Technical Reference
- **[API.md](./API.md)** 🔌
  - API endpoint documentation
  - Request/response formats
  - Configuration options
  - Usage examples (JavaScript, cURL)
  - Error codes and solutions

- **[SECURITY.md](./SECURITY.md)** 🔒
  - API key management best practices
  - Environment variable setup
  - Input validation
  - Rate limiting
  - Incident response procedures
  - Compliance information

### Troubleshooting
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** 🐛
  - Common issues and solutions
  - Installation problems
  - API & authentication errors
  - Network & deployment issues
  - Frontend issues
  - Performance optimization
  - Debug mode instructions

---

## 🚀 Quick Navigation

**I want to...**

- **Get started quickly** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Set up locally** → [SETUP.md](./SETUP.md)
- **Deploy to Vercel** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Check before deploying** → [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Understand the API** → [API.md](./API.md)
- **Secure my project** → [SECURITY.md](./SECURITY.md)
- **Fix an issue** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📋 Common Tasks

### Local Development
```bash
npm install
npm start
# Open http://localhost:3000/Education.html
```

### Deploy to Production
```bash
vercel --prod
vercel env add GEMINI_API_KEY
vercel --prod
```

### Check for Issues
1. Run `npm audit` for security issues
2. Check browser console (F12) for errors
3. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Update API Endpoint
Edit `animation/xyber-chat.js`:
```javascript
const ChatConfig = {
    apiEndpoint: 'https://your-project.vercel.app/api/chat',
};
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `api/chat.js` | Backend API (Genkit) |
| `animation/xyber-chat.js` | Frontend chat client |
| `vercel.json` | Vercel configuration |
| `.env` | Local environment variables |
| `package.json` | Dependencies |

---

## 📞 Need Help?

1. **Check the relevant guide** above
2. **Search [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for your issue
3. **Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for commands
4. **Check browser console** (F12) for error messages

---

**Return to main [README.md](../README.md)**
