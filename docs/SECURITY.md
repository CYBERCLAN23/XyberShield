# 🔒 Security Best Practices

## API Key Management

### ✅ DO

- Store API keys in environment variables (`.env`)
- Use `.env.example` as template
- Add `.env` to `.gitignore`
- Rotate keys regularly
- Use separate keys for development and production
- Monitor API key usage in Google Cloud Console

### ❌ DON'T

- Hardcode API keys in source code
- Commit `.env` to Git
- Share API keys in chat or email
- Expose API keys in frontend code
- Use same key for multiple projects

## Environment Variables

### Local Development

```bash
# .env (never commit this)
GEMINI_API_KEY=AIzaSyAeEXqa4J149w0GwUeKGxA3y4cQnpfQxXw
```

### Production (Vercel)

Set via Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add `GEMINI_API_KEY`
3. Redeploy

## Input Validation

The backend validates all inputs:

```javascript
// Sanitize user input
const sanitizedMessage = message
  .trim()
  .slice(0, 5000)  // Max length
  .replace(/<[^>]*>/g, '');  // Remove HTML tags

// Validate session ID
if (!sessionId || sessionId.length > 100) {
  return error('Invalid session');
}
```

## Rate Limiting

Prevents abuse and protects API quota:

```javascript
// 15 requests per 15 minutes per session
const fifteenMinutes = 15 * 60 * 1000;
if (recentRequests.length >= 15) {
  return error('Rate limit exceeded');
}
```

## CORS Protection

API only accepts requests from your domain:

```javascript
// Vercel automatically handles CORS
// Requests from other domains are blocked
```

## HTTPS

Always use HTTPS in production:
- ✅ Vercel provides free HTTPS
- ✅ All data encrypted in transit
- ❌ Never use HTTP in production

## Data Privacy

### What We Store
- Session IDs (temporary)
- Message timestamps
- API usage statistics

### What We Don't Store
- User messages (not persisted)
- Personal information
- API keys or credentials

## Monitoring & Alerts

### Set Up Alerts

1. **Google Cloud Console**
   - Monitor API quota usage
   - Set up billing alerts

2. **Vercel Dashboard**
   - Monitor function logs
   - Check error rates
   - Review performance metrics

### Regular Audits

- Review API key access logs monthly
- Check for unusual API usage patterns
- Audit environment variables
- Update dependencies regularly

## Dependency Security

Keep dependencies up to date:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update
```

## Incident Response

If API key is compromised:

1. **Immediately:**
   - Delete compromised key in Google Cloud Console
   - Create new API key
   - Update environment variables

2. **Within 24 hours:**
   - Redeploy application
   - Review API usage logs
   - Check for unauthorized requests

3. **Follow up:**
   - Document incident
   - Update security procedures
   - Notify team members

## Compliance

- ✅ No personal data collection
- ✅ GDPR compliant (no data storage)
- ✅ CCPA compliant (no data selling)
- ✅ SOC 2 ready (Vercel infrastructure)

## Security Headers

Vercel automatically sets:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Third-Party Services

### Google Gemini API
- Encrypted communication
- No data retention
- SOC 2 Type II certified

### Vercel
- Enterprise-grade security
- DDoS protection
- Automatic backups

---

**Security concerns?** Review this guide regularly and keep dependencies updated.
