# 🚀 Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account (free tier available)
- Node.js 18+ installed
- Git repository initialized

### Quick Deploy

#### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy to production
vercel --prod
```

#### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" → "Project"
4. Select your repository
5. Vercel auto-detects settings
6. Click "Deploy"

### Environment Variables Setup

After initial deployment, add environment variables:

```bash
# Via CLI
vercel env add GEMINI_API_KEY

# Then redeploy
vercel --prod
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `GEMINI_API_KEY` with your Google Gemini API key
3. Redeploy the project

### Post-Deployment

1. **Update Frontend URL**
   - Edit `animation/xyber-chat.js`
   - Update `apiEndpoint` to your Vercel URL:
   ```javascript
   const ChatConfig = {
       apiEndpoint: 'https://your-project.vercel.app/api/chat',
       // ...
   };
   ```

2. **Test the Deployment**
   - Open your Vercel URL in browser
   - Test the chatbot functionality
   - Check browser console for errors

3. **Monitor Performance**
   - Use Vercel Analytics dashboard
   - Monitor API usage
   - Check error logs

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` before deploying |
| "API key not found" | Verify env var in Vercel dashboard |
| "CORS error" | Update API endpoint in xyber-chat.js |
| "Function timeout" | Check API response time, increase maxDuration |

### Rollback

If deployment fails:
```bash
# View deployment history
vercel list

# Rollback to previous version
vercel rollback
```

---

**Need help?** Check the main [README.md](../README.md) or contact support.
