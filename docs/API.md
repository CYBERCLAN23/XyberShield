# 🔌 API Documentation

## Backend Architecture

```
Frontend (xyber-chat.js)
    ↓ POST /api/chat
Backend (api/chat.js - Genkit)
    ↓ Gemini 1.5-flash API
Google AI
```

## API Endpoint

### POST /api/chat

Sends a message to the chatbot and receives a response.

**URL:** `https://your-project.vercel.app/api/chat`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How do I create a strong password?",
  "sessionId": "unique-session-id-123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "response": "A strong password should...",
  "sessionId": "unique-session-id-123",
  "timestamp": 1699876543210
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please wait before sending another message.",
  "retryAfter": 900
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "API Error: Invalid API key",
  "sessionId": "unique-session-id-123"
}
```

## Rate Limiting

- **Limit:** 15 requests per 15 minutes per session
- **Session ID:** Unique identifier for each user
- **Reset:** Automatic after 15 minutes

## Configuration

### Backend (`api/chat.js`)

```javascript
// Rate limit settings
const fifteenMinutes = 15 * 60 * 1000;
const maxRequests = 15;

// Model configuration
config: {
  temperature: 0.75,        // Creativity (0-1)
  maxOutputTokens: 800,     // Response length
  topP: 0.9,               // Diversity
  stopSequences: ['User:', 'Human:']
}

// System prompt (customize bot personality)
const SYSTEM_PROMPT = `You are XyberBot...`;
```

### Frontend (`animation/xyber-chat.js`)

```javascript
const ChatConfig = {
  apiEndpoint: '/api/chat',      // API URL
  maxRetries: 3,                 // Retry attempts
  retryDelay: 1000,              // 1 second between retries
  timeout: 30000                 // 30 second timeout
};
```

## Usage Example

### JavaScript/Fetch

```javascript
async function sendMessage(message) {
  const sessionId = localStorage.getItem('sessionId') || 'new-session-' + Date.now();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Response:', data.response);
      localStorage.setItem('sessionId', data.sessionId);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### cURL

```bash
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is cybersecurity?",
    "sessionId": "user-123"
  }'
```

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid request | Check request format |
| 403 | Invalid API key | Verify GEMINI_API_KEY env var |
| 429 | Rate limit exceeded | Wait 15 minutes |
| 500 | Server error | Check logs, retry later |
| 503 | Service unavailable | Gemini API down, retry later |

## API Limits

**Gemini 1.5-flash Free Tier:**
- 15 requests per minute
- 1500 requests per day
- 1 million tokens per minute

**XyberBot Rate Limit:**
- 15 requests per 15 minutes per session

## Security

✅ API key stored in environment variables  
✅ Input validation and sanitization  
✅ Rate limiting per session  
✅ CORS protection  
✅ No sensitive data in responses  

## Monitoring

Monitor your API usage:
1. Check Vercel dashboard for function logs
2. Monitor Google Cloud Console for API quota
3. Set up alerts for rate limit warnings

---

**Questions?** See [SETUP.md](./SETUP.md) or [DEPLOYMENT.md](./DEPLOYMENT.md).
