# ✅ Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

- [ ] All dependencies installed: `npm install`
- [ ] No console errors: `npm start` and check browser console
- [ ] `.env` file created with valid API key
- [ ] `.env` is in `.gitignore` (never commit secrets)
- [ ] All tests pass (if applicable)
- [ ] Code reviewed and tested locally

## Code Quality

- [ ] No hardcoded API keys in source code
- [ ] No console.log statements left in production code
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] Rate limiting configured

## Configuration

- [ ] `vercel.json` is valid JSON (no merge conflicts)
- [ ] `package.json` has correct dependencies
- [ ] `package-lock.json` committed to Git
- [ ] Environment variables documented in `.env.example`
- [ ] API endpoint URLs are correct

## Security

- [ ] API key stored in environment variables only
- [ ] No sensitive data in frontend code
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS properly configured
- [ ] Input sanitization implemented

## Git & Repository

- [ ] All changes committed: `git status` shows clean
- [ ] Meaningful commit messages
- [ ] No sensitive files tracked
- [ ] `.gitignore` includes: `.env`, `node_modules/`, `.DS_Store`
- [ ] Remote repository is up to date

## Vercel Setup

- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged in to Vercel: `vercel login`
- [ ] Project initialized (first deploy)

## Deployment Steps

### Step 1: Deploy Application

```bash
vercel --prod
```

- [ ] Deployment successful
- [ ] No build errors
- [ ] Vercel URL provided

### Step 2: Add Environment Variables

```bash
vercel env add GEMINI_API_KEY
```

- [ ] Paste your API key when prompted
- [ ] Confirm variable added

### Step 3: Redeploy with Environment Variables

```bash
vercel --prod
```

- [ ] Deployment successful
- [ ] Environment variables loaded

### Step 4: Test Production

- [ ] Open Vercel URL in browser
- [ ] Test chatbot functionality
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Verify API responses

## Post-Deployment

- [ ] Update `animation/xyber-chat.js` with Vercel URL:
  ```javascript
  const ChatConfig = {
      apiEndpoint: 'https://your-project.vercel.app/api/chat',
  };
  ```

- [ ] Commit and push changes
- [ ] Redeploy if URL was changed
- [ ] Monitor Vercel dashboard for errors
- [ ] Set up monitoring/alerts (optional)

## Monitoring

- [ ] Check Vercel dashboard daily for first week
- [ ] Monitor API usage in Google Cloud Console
- [ ] Set up email alerts for deployment failures
- [ ] Review error logs weekly
- [ ] Monitor response times

## Documentation

- [ ] README.md is up to date
- [ ] All docs in `/docs` folder are current
- [ ] Deployment instructions are clear
- [ ] Troubleshooting guide covers common issues
- [ ] API documentation is accurate

## Rollback Plan

If issues occur:

```bash
# View deployment history
vercel list

# Rollback to previous version
vercel rollback
```

- [ ] Know how to rollback
- [ ] Have previous deployment URL saved
- [ ] Know how to contact support

---

## Common Issues During Deployment

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm install` locally first |
| API key not found | Verify env var in Vercel dashboard |
| CORS error | Update API endpoint URL |
| Timeout | Check API response time, increase maxDuration |
| Module not found | Ensure package-lock.json is committed |

---

## After Successful Deployment

1. ✅ Test all features thoroughly
2. ✅ Share Vercel URL with team
3. ✅ Update any documentation with new URL
4. ✅ Monitor for issues first 24 hours
5. ✅ Set up automated monitoring

---

**Ready to deploy?** Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
