# Debugging Guide - دليل التصحيح 🔍

## المشكلة الحالية:
- Register لا يعمل - المستخدم لا يُضاف في الداتا بيز
- Login لا يعمل - حتى مع مستخدم موجود

## الحلول المطبقة:

### 1. ✅ تحديث Register Component
- تم ربط `register.ts` بـ `AuthService` الفعلي
- إزالة `timer()` fake implementation
- إضافة error handling صحيح

### 2. ✅ تحديث Login Component  
- تم ربط `login.ts` بـ `AuthService` الفعلي
- إزالة `timer()` fake implementation
- إضافة error handling صحيح

### 3. ✅ تحديث API URL
- تم تغيير من `localhost` إلى `127.0.0.1` ليتطابق مع Backend URL
- API URL الآن: `http://127.0.0.1:5280/api`

### 4. ✅ إضافة Console Logging
- إضافة console.log في AuthService لمساعدة في debugging
- إضافة تفاصيل أكثر في Error Interceptor

---

## خطوات التحقق:

### 1. فتح Browser Console (F12)
عند محاولة Register أو Login، يجب أن ترى:
```
Registering user: { apiUrl: 'http://127.0.0.1:5280/api', email: '...' }
Device ID: device-...
```

### 2. فحص Network Tab
- اذهب إلى Network tab في DevTools
- حاول Register أو Login
- ابحث عن request إلى `/api/auth/register` أو `/api/auth/login`
- تحقق من:
  - **Request URL**: يجب أن يكون `http://127.0.0.1:5280/api/auth/register`
  - **Request Headers**: يجب أن يحتوي على `X-Device-Id`
  - **Request Payload**: يجب أن يحتوي على البيانات الصحيحة
  - **Response**: تحقق من الـ response من الـ backend

### 3. فحص الأخطاء
إذا كان هناك خطأ، ستظهر في Console:
- **CORS Error**: يعني أن الـ backend لا يسمح بـ requests من frontend
- **404 Error**: يعني أن الـ endpoint غير موجود
- **401/403 Error**: يعني مشكلة في authentication
- **500 Error**: يعني خطأ في الـ backend

---

## المشاكل المحتملة وحلولها:

### المشكلة 1: CORS Error
**الخطأ**: `Access to XMLHttpRequest blocked by CORS policy`

**الحل**:
1. تأكد من أن الـ backend يسمح بـ `http://localhost:4200` في CORS
2. تحقق من `appsettings.json` أو `Program.cs` في الـ backend
3. يجب أن يكون CORS configuration مثل:
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

### المشكلة 2: 404 Not Found
**الخطأ**: `GET http://127.0.0.1:5280/api/auth/register 404`

**الحل**:
1. تحقق من أن الـ backend route موجود: `/api/auth/register`
2. تحقق من Swagger: `http://127.0.0.1:5280/swagger/index.html`
3. تأكد من أن الـ endpoint موجود في Swagger

### المشكلة 3: Network Error
**الخطأ**: `Failed to fetch` أو `Network Error`

**الحل**:
1. تأكد من أن الـ backend يعمل
2. جرب فتح `http://127.0.0.1:5280/swagger` في المتصفح
3. تحقق من أن الـ port صحيح (5280)

### المشكلة 4: 400 Bad Request
**الخطأ**: `400 Bad Request`

**الحل**:
1. تحقق من Request Payload في Network tab
2. تأكد من أن البيانات ترسل بشكل صحيح
3. تحقق من الـ validation في الـ backend

---

## اختبار سريع:

### Test 1: Register
1. افتح Browser Console (F12)
2. اذهب إلى `/register`
3. املأ النموذج
4. اضغط Register
5. تحقق من Console و Network tab

**ما يجب أن تراه**:
- Console: `Registering user: { apiUrl: '...', email: '...' }`
- Network: Request إلى `/api/auth/register`
- Response: يجب أن يحتوي على `accessToken` و `refreshToken`

### Test 2: Login
1. افتح Browser Console (F12)
2. اذهب إلى `/login`
3. املأ النموذج بمستخدم موجود
4. اضغط Login
5. تحقق من Console و Network tab

**ما يجب أن تراه**:
- Console: `Logging in user: { apiUrl: '...', email: '...' }`
- Network: Request إلى `/api/auth/login`
- Response: يجب أن يحتوي على `accessToken` و `refreshToken`

---

## Checklist:

- [ ] Backend يعمل على `http://127.0.0.1:5280`
- [ ] Frontend يعمل على `http://localhost:4200`
- [ ] API URL في `environment.ts` هو `http://127.0.0.1:5280/api`
- [ ] CORS configured في الـ backend
- [ ] Browser Console مفتوح (F12)
- [ ] Network tab مفتوح
- [ ] جرب Register - تحقق من Console و Network
- [ ] جرب Login - تحقق من Console و Network

---

## معلومات مفيدة للـ Debugging:

### في Browser Console:
```javascript
// Check API URL
console.log('API URL:', 'http://127.0.0.1:5280/api');

// Check Device ID
console.log('Device ID:', localStorage.getItem('deviceId'));

// Check Token (after login)
console.log('Token:', localStorage.getItem('auth_token'));

// Check User Data (after login)
console.log('User:', JSON.parse(localStorage.getItem('user_data') || 'null'));
```

### في Network Tab:
1. Filter: `auth` لرؤية requests للـ authentication فقط
2. انقر على request لرؤية:
   - **Headers**: Request & Response headers
   - **Payload**: البيانات المرسلة
   - **Response**: الـ response من الـ backend
   - **Preview**: Preview للـ response

---

## إذا استمرت المشكلة:

1. **تحقق من Backend Logs**: 
   - راجع console output للـ backend
   - ابحث عن أي أخطاء أو exceptions

2. **اختبر الـ API مباشرة**:
   - افتح Swagger: `http://127.0.0.1:5280/swagger/index.html`
   - جرب `/api/auth/register` مباشرة من Swagger
   - إذا عمل في Swagger لكن لا يعمل من Frontend = مشكلة CORS أو Headers

3. **تحقق من Request Headers**:
   - في Network tab، انقر على request
   - تحقق من Headers tab
   - يجب أن يحتوي على `X-Device-Id`
   - يجب أن يحتوي على `Content-Type: application/json`

4. **تحقق من Response**:
   - في Network tab، انقر على request
   - تحقق من Response tab
   - اقرأ الـ error message من الـ backend

---

**Status**: ✅ Code Updated - Ready for Testing!

جرب الآن Register و Login وتحقق من Console و Network tab! 🚀

