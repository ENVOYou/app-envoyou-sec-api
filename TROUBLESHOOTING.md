# Troubleshooting: Dashboard Shows 0 API Keys

## Issue Summary
Dashboard displays 0 API keys despite successful creation in backend. Backend logs show only OPTIONS requests, not actual GET requests.

## Root Cause
The issue is likely one of these:

1. **Supabase Token Not Set in Vercel Environment**
   - Production `.env.production` file is not used by Vercel
   - Environment variables must be set in Vercel dashboard

2. **Token Not Persisted After Login**
   - `apiClient.setToken()` may not be called correctly
   - LocalStorage may be blocked in production

3. **CORS Preflight Succeeds but Authenticated Request Fails**
   - Authorization header not sent in production
   - Token format incorrect

## Solution Steps

### 1. Verify Vercel Environment Variables

Go to Vercel Dashboard → Project Settings → Environment Variables and ensure:

```
NEXT_PUBLIC_SUPABASE_URL=https://mxxyzzvwrkafcldokehp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_real_supabase_anon_key>
NEXT_PUBLIC_API_BASE_URL=https://api.envoyou.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfL2tgrAAAAAM6cdYFNEMu6xlwVNBPeH9nLGujY
```

**Important**: Get the real Supabase anon key from Supabase Dashboard → Settings → API

### 2. Check Browser Console in Production

Open browser console on production site and check:

```javascript
// Check if token is set
localStorage.getItem('envoyou_internal_tokens')

// Check Supabase session
window.supabase.auth.getSession()

// Manually test API call
fetch('https://api.envoyou.com/v1/user/stats', {
  headers: {
    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('envoyou_internal_tokens')).access_token
  }
}).then(r => r.json()).then(console.log)
```

### 3. Verify Backend Receives Request

Check Railway logs for:
```
[DEBUG] Stats endpoint called for user <email>
[DEBUG] Found X API keys for user <email>
```

If you only see OPTIONS requests, the authenticated request is not reaching the backend.

### 4. Test Authentication Flow

1. Clear browser cache and localStorage
2. Login again
3. Check console for errors during `supabaseVerify` call
4. Verify token is stored in localStorage
5. Navigate to dashboard and check if stats are loaded

### 5. Quick Fix: Force Token Refresh

Add this to dashboard page to force token refresh:

```typescript
useEffect(() => {
  const refreshAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      await apiClient.auth.supabaseVerify(session.access_token)
    }
  }
  refreshAuth()
}, [])
```

## Expected Behavior

When working correctly:
1. User logs in via Supabase
2. Frontend calls `/v1/auth/supabase/verify` with Supabase token
3. Backend returns internal JWT token
4. Frontend stores token in localStorage
5. All subsequent API calls include `Authorization: Bearer <token>` header
6. Backend logs show actual GET/POST requests, not just OPTIONS

## Debug Checklist

- [ ] Vercel environment variables are set correctly
- [ ] Supabase anon key is valid (starts with `eyJ`)
- [ ] Browser console shows no CORS errors
- [ ] localStorage contains `envoyou_internal_tokens`
- [ ] Token is included in Authorization header
- [ ] Backend logs show actual requests, not just OPTIONS
- [ ] API key count in backend matches frontend display

## Contact

If issue persists after following these steps, check Railway logs for detailed error messages.
