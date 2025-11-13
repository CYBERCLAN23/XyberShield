# 🐛 Troubleshooting Guide

## Common Issues

### Installation & Setup

#### "npm: command not found"
**Cause:** Node.js not installed  
**Solution:**
1. Download [Node.js 18+](https://nodejs.org/)
2. Install and restart terminal
3. Verify: `node --version`

#### "Module not found: genkit"
**Cause:** Dependencies not installed  
**Solution:**
```bash
npm install
```

#### "Cannot find .env file"
**Cause:** Environment file not created  
**Solution:**
```bash
cp .env.example .env
# Edit .env and add your API key
```

---

### API & Authentication

#### "Erreur API (403)" or "Invalid API key"
**Cause:** Wrong or missing API key  
**Solution:**
1. Check `.env` file has correct key
2. Verify key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Restart dev server
4. If deployed: Update Vercel environment variables and redeploy

#### "API key not found in production"
**Cause:** Environment variable not set in Vercel  
**Solution:**
```bash
# Via CLI
vercel env add GEMINI_API_KEY

# Then redeploy
vercel --prod
```

#### "Rate limit exceeded"
**Cause:** Too many requests in 15 minutes  
**Solution:**
- Wait 15 minutes before sending more messages
- Or increase limit in `api/chat.js`:
```javascript
if (recentRequests.length >= 20) { // Change from 15
  return false;
}
```

---

### Network & Deployment

#### "CORS error" or "Failed to fetch"
**Cause:** Wrong API endpoint URL  
**Solution:**
1. Check `animation/xyber-chat.js`
2. Update `apiEndpoint` to your Vercel URL:
```javascript
const ChatConfig = {
    apiEndpoint: 'https://your-project.vercel.app/api/chat',
};
```
3. Redeploy or restart dev server

#### "Request timeout"
**Cause:** Slow network or API response  
**Solution:**
1. Check internet connection
2. Increase timeout in `xyber-chat.js`:
```javascript
const ChatConfig = {
    timeout: 60000  // 60 seconds
};
```
3. Try again

#### "Port 3000 already in use"
**Cause:** Another process using port 3000  
**Solution:**
```bash
# Use different port
npm start -- --port 3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

### Deployment Issues

#### "Deployment failed"
**Cause:** Build errors or missing files  
**Solution:**
1. Check build logs in Vercel dashboard
2. Run locally: `npm install && npm start`
3. Fix any errors shown
4. Redeploy: `vercel --prod`

#### "Function timeout"
**Cause:** API response too slow  
**Solution:**
1. Check Vercel function logs
2. Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60
    }
  }
}
```
3. Redeploy

#### "Module not found after deployment"
**Cause:** Dependencies not installed during build  
**Solution:**
```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push

# Then redeploy
vercel --prod
```

---

### Frontend Issues

#### "Chat button not appearing"
**Cause:** JavaScript not loaded or CSS issue  
**Solution:**
1. Check browser console (F12) for errors
2. Verify `animation/xyber-chat.js` is loaded
3. Check `style/chatbot.css` exists
4. Clear browser cache: Ctrl+Shift+Delete

#### "Messages not sending"
**Cause:** API endpoint wrong or network issue  
**Solution:**
1. Open browser console (F12)
2. Check Network tab for failed requests
3. Verify API endpoint in `xyber-chat.js`
4. Check if API key is set

#### "Styling looks broken"
**Cause:** CSS files not loading  
**Solution:**
1. Check browser console for 404 errors
2. Verify `/style/` folder exists
3. Clear browser cache
4. Restart dev server

---

### Performance Issues

#### "Chatbot is slow"
**Cause:** Network latency or API delay  
**Solution:**
1. Check internet connection
2. Monitor API response time in browser DevTools
3. Check Google Cloud Console for quota issues
4. Try again later (API might be overloaded)

#### "High memory usage"
**Cause:** Memory leak in frontend  
**Solution:**
1. Close other browser tabs
2. Restart browser
3. Check for infinite loops in `xyber-chat.js`

---

### Git & Version Control

#### "Git merge conflict in vercel.json"
**Cause:** Multiple branches modified same file  
**Solution:**
```bash
# Accept current version
git checkout --ours vercel.json
git add vercel.json
git commit -m "Resolve merge conflict"
```

#### "Cannot push to repository"
**Cause:** Authentication issue  
**Solution:**
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub settings
# Then retry push
git push origin main
```

---

## Debug Mode

### Enable Detailed Logging

Edit `animation/xyber-chat.js`:
```javascript
const DEBUG = true;  // Enable debug logs
```

Then check browser console (F12) for:
- `📤 Sending to XyberBot API...`
- `📥 Response: {...}`
- Error messages

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message
4. Click on `/api/chat` request
5. Check Request/Response tabs

### View Server Logs

```bash
# Local development
npm start
# Logs appear in terminal

# Production (Vercel)
# View in Vercel dashboard → Deployments → Logs
```

---

## Getting Help

1. **Check this guide** - Most issues are covered
2. **Review logs** - Browser console and server logs
3. **Search issues** - GitHub issues or Stack Overflow
4. **Contact support** - See main README.md

---

**Still stuck?** Create a detailed bug report with:
- Error message (exact text)
- Steps to reproduce
- Browser/OS version
- Console logs
- Network requests (from DevTools)
