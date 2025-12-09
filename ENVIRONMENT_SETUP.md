# Environment Setup Guide - دليل إعداد البيئة

## 1. Environment Files Overview

### Development Environment (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  deviceId: generateDeviceId()
};
```

### Production Environment (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // ⚠️ UPDATE THIS
  deviceId: generateDeviceId()
};
```

---

## 2. Current Configuration Status ✅

### ✅ Development Environment:
- **API URL**: `http://localhost:5000/api`
- **Status**: ✅ Configured correctly
- **Device ID**: Auto-generated and stored in localStorage

### ⚠️ Production Environment:
- **API URL**: `https://your-production-api.com/api`
- **Status**: ⚠️ **NEEDS UPDATE** - Replace with actual production API URL
- **Device ID**: Auto-generated and stored in localStorage

---

## 3. How to Update API URL

### For Development:
1. Open `learingHub/src/app/core/environments/environment.ts`
2. Update the `apiUrl` if your backend runs on a different port:
   ```typescript
   apiUrl: 'http://localhost:YOUR_PORT/api'
   ```

### For Production:
1. Open `learingHub/src/app/core/environments/environment.prod.ts`
2. Replace `https://your-production-api.com/api` with your actual production API URL:
   ```typescript
   apiUrl: 'https://api.yourdomain.com/api'
   ```

---

## 4. Backend Configuration Check

### Verify Backend is Running:
```bash
# Check if backend is accessible
curl http://localhost:5000/api/health

# Or open in browser:
# http://localhost:5000/api/health
```

### Common Backend Ports:
- **ASP.NET Core**: Usually `5000` or `5001` (HTTPS)
- **Node.js/Express**: Usually `3000` or `5000`
- **Django**: Usually `8000`
- **Spring Boot**: Usually `8080`

### Update if Different:
If your backend runs on a different port, update `environment.ts`:
```typescript
apiUrl: 'http://localhost:YOUR_PORT/api'
```

---

## 5. CORS Configuration

### Backend Must Allow:
- **Origin**: `http://localhost:4200` (Angular dev server)
- **Methods**: GET, POST, PUT, DELETE, PATCH
- **Headers**: Authorization, Content-Type, X-Device-Id

### Example CORS Configuration (ASP.NET Core):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

---

## 6. Device ID Configuration

### Current Implementation:
- Device ID is auto-generated on first visit
- Stored in `localStorage` as `deviceId`
- Reused across sessions
- Format: `device-{timestamp}-{random}`

### How It Works:
1. On first visit, generates unique device ID
2. Stores in `localStorage.setItem('deviceId', deviceId)`
3. Reuses same ID for subsequent visits
4. Sent in `X-Device-Id` header with all requests

### To Reset Device ID:
```javascript
// In browser console:
localStorage.removeItem('deviceId');
// Refresh page to generate new ID
```

---

## 7. Environment Variables (Optional)

### For Different Environments:
You can use Angular's environment files:
- `environment.ts` - Development
- `environment.prod.ts` - Production
- Create additional files for staging, testing, etc.

### Build Commands:
```bash
# Development build (uses environment.ts)
ng build

# Production build (uses environment.prod.ts)
ng build --configuration production
```

---

## 8. Testing Environment Configuration

### Quick Test:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for API calls:
   ```javascript
   // Should see requests to:
   // http://localhost:5000/api/...
   ```

4. Check Network tab:
   - All API requests should go to configured `apiUrl`
   - Headers should include `X-Device-Id`

### Verify Device ID:
```javascript
// In browser console:
localStorage.getItem('deviceId')
// Should return: "device-{timestamp}-{random}"
```

---

## 9. Common Issues & Solutions

### Issue 1: CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Ensure backend CORS is configured correctly
- Check that frontend origin is allowed
- Verify headers are allowed

### Issue 2: 404 Not Found
**Error**: `GET http://localhost:5000/api/... 404`

**Solution**:
- Verify backend is running
- Check API URL is correct
- Ensure backend routes match frontend calls

### Issue 3: 401 Unauthorized
**Error**: `401 Unauthorized`

**Solution**:
- Check if token is being sent in Authorization header
- Verify token is valid and not expired
- Check AuthInterceptor is working

### Issue 4: Wrong API URL
**Error**: Requests going to wrong URL

**Solution**:
- Check `environment.ts` file
- Verify correct environment file is being used
- Clear browser cache and rebuild

---

## 10. Checklist Before Testing

- [ ] Backend server is running
- [ ] Backend port matches `environment.ts` configuration
- [ ] CORS is configured on backend
- [ ] API URL is correct in `environment.ts`
- [ ] Device ID is being generated
- [ ] No CORS errors in browser console
- [ ] API requests are reaching backend
- [ ] Authentication is working

---

## 11. Production Deployment Checklist

Before deploying to production:

- [ ] Update `environment.prod.ts` with production API URL
- [ ] Verify production API is accessible
- [ ] Test CORS configuration for production domain
- [ ] Ensure HTTPS is used in production
- [ ] Verify all API endpoints work in production
- [ ] Test authentication flow in production
- [ ] Check error handling in production
- [ ] Verify device ID generation works

---

## 12. Current Status Summary

### ✅ Configured:
- Development environment (`environment.ts`)
- Device ID generation
- Auto-storage in localStorage

### ⚠️ Needs Attention:
- Production API URL (`environment.prod.ts`)
- Backend CORS configuration (verify)
- Backend port verification (if not 5000)

### 📝 Notes:
- Default backend port: `5000`
- Default frontend port: `4200`
- Device ID persists across sessions
- Environment files are TypeScript files

---

## Quick Reference

### File Locations:
- Development: `learingHub/src/app/core/environments/environment.ts`
- Production: `learingHub/src/app/core/environments/environment.prod.ts`

### Current API URLs:
- Development: `http://localhost:5000/api` ✅
- Production: `https://your-production-api.com/api` ⚠️

### Device ID:
- Storage: `localStorage.getItem('deviceId')`
- Header: `X-Device-Id`
- Format: `device-{timestamp}-{random}`

---

**Last Updated**: [Current Date]
**Status**: ✅ Development Ready | ⚠️ Production Needs Update

