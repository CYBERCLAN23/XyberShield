# ⚡ Quick Reference Guide

Fast lookup for common commands and configurations.

## Essential Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm start

# Deploy to Vercel
vercel --prod

# Add environment variable
vercel env add GEMINI_API_KEY

# View deployment history
vercel list

# Rollback to previous version
vercel rollback

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

## File Locations

| File | Purpose |
|------|---------|
| `api/chat.js` | Backend API (Genkit) |
| `animation/xyber-chat.js` | Frontend chat client |
| `style/chatbot.css` | Chat UI styles |
| `vercel.json` | Vercel configuration |
| `.env` | Environment variables (local) |
| `.env.example` | Environment template |
| `package.json` | Dependencies |

## Environment Variables

```bash
# Local (.env)
GEMINI_API_KEY=your_api_key_here

# Production (Vercel Dashboard)
Settings → Environment Variables → Add GEMINI_API_KEY
```

## Configuration Quick Reference

### Backend Rate Limit
**File:** `api/chat.js`  
**Default:** 15 requests per 15 minutes  
**Change:** Edit `maxRequests` variable

### Response Length
**File:** `api/chat.js`  
**Default:** 800 tokens  
**Change:** Edit `maxOutputTokens` in config

### API Endpoint
**File:** `animation/xyber-chat.js`  
**Default:** `/api/chat`  
**Production:** `https://your-project.vercel.app/api/chat`

## API Endpoint

```
POST /api/chat

Request:
{
  "message": "Your question",
  "sessionId": "unique-id"
}

Response:
{
  "success": true,
  "response": "Bot response",
  "sessionId": "unique-id"
}
```

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Module not found | `npm install` |
| API key invalid | Check `.env` file |
| CORS error | Update API endpoint URL |
| Port in use | `npm start -- --port 3001` |
| Rate limited | Wait 15 minutes |
| Build fails | Check `npm install` locally |

## Deployment Checklist

- [ ] `npm install` successful
- [ ] No console errors locally
- [ ] `.env` created with API key
- [ ] `.env` in `.gitignore`
- [ ] `vercel.json` valid JSON
- [ ] `package-lock.json` committed
- [ ] `vercel --prod` successful
- [ ] `vercel env add GEMINI_API_KEY`
- [ ] `vercel --prod` again
- [ ] Test on Vercel URL

## Useful Links

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get API key
- [Vercel Dashboard](https://vercel.com) - Manage deployments
- [Google Cloud Console](https://console.cloud.google.com) - Monitor API usage
- [Firebase Genkit Docs](https://firebase.google.com/docs/genkit) - Framework docs
- [Gemini API Docs](https://ai.google.dev/) - Model documentation

## Project URLs

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3000` |
| Production | `https://your-project.vercel.app` |
| Main Page | `/Education.html` |
| Chat API | `/api/chat` |

## Security Reminders

✅ Never commit `.env`  
✅ Never hardcode API keys  
✅ Always use HTTPS in production  
✅ Keep dependencies updated  
✅ Monitor API usage  

## Git Workflow

```bash
# Clone repository
git clone <url>
cd XyberShield/FRONT

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Performance Tips

- Keep API responses under 800 tokens
- Use rate limiting to prevent quota overuse
- Monitor Vercel dashboard for slow functions
- Check Google Cloud Console for API quota
- Cache responses when possible

## Monitoring

**Vercel Dashboard:**
- Deployments → View logs
- Settings → Monitor usage
- Analytics → View metrics

**Google Cloud Console:**
- APIs & Services → Quotas
- Billing → Usage reports

## Support Resources

- 📖 [SETUP.md](./SETUP.md) - Local setup
- 🌐 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Vercel
- 🔌 [API.md](./API.md) - API reference
- 🔒 [SECURITY.md](./SECURITY.md) - Security guide
- 🐛 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

---

**Need more details?** Check the full documentation in `/docs` folder.
