# Quick Start Guide - دليل البدء السريع 🚀

## الخطوة 1: التحقق من إعدادات البيئة ✅

### ✅ تم التحقق من:

- **Backend Port**: `5280` (HTTP) أو `5273/7287` (HTTPS)
- **Frontend Port**: `4200` (Angular default)
- **API URL**: `http://localhost:5280/api` ✅

### 📝 ملاحظة مهمة:

إذا كان الـ backend يعمل على port مختلف، قم بتحديث `environment.ts`:

```typescript
apiUrl: 'http://localhost:YOUR_PORT/api';
```

---

## الخطوة 2: تشغيل المشروع

### 1. تشغيل Backend:

```bash
# Navigate to backend directory
cd src

# Run backend (ASP.NET Core)
dotnet run

# Backend will run on:
# HTTP: http://localhost:5280
# HTTPS: https://localhost:7287
```

### 2. تشغيل Frontend:

```bash
# Navigate to frontend directory
cd learingHub

# Install dependencies (if not already installed)
npm install

# Run development server
ng serve
# or
npm start

# Frontend will run on:
# http://localhost:4200
```

---

## الخطوة 3: اختبار الاتصال

### اختبار Backend:

افتح المتصفح واذهب إلى:

- Swagger UI: `http://localhost:5280/swagger`
- Health Check: `http://localhost:5280/api/health` (if available)

### اختبار Frontend:

افتح المتصفح واذهب إلى:

- Frontend: `http://localhost:4200`

---

## الخطوة 4: اختبار الصفحات الأساسية

### 1. الصفحات العامة (لا تحتاج تسجيل دخول):

- [ ] Home Page: `http://localhost:4200/`
- [ ] Login: `http://localhost:4200/login`
- [ ] Register: `http://localhost:4200/register`
- [ ] Courses List: `http://localhost:4200/courses`

### 2. بعد تسجيل الدخول كـ Student:

- [ ] Student Dashboard: `http://localhost:4200/student`
- [ ] My Courses: `http://localhost:4200/student/my-courses`

### 3. بعد تسجيل الدخول كـ Instructor:

- [ ] Instructor Dashboard: `http://localhost:4200/instructor`
- [ ] My Courses: `http://localhost:4200/instructor/courses`

### 4. بعد تسجيل الدخول كـ Admin:

- [ ] Admin Dashboard: `http://localhost:4200/admin`
- [ ] Users Management: `http://localhost:4200/admin/users`

---

## الخطوة 5: التحقق من الأخطاء الشائعة

### 1. CORS Errors:

**المشكلة**: `Access to XMLHttpRequest blocked by CORS policy`

**الحل**:

- تأكد من أن الـ backend يسمح بـ `http://localhost:4200`
- تحقق من إعدادات CORS في الـ backend

### 2. 404 Not Found:

**المشكلة**: `GET http://localhost:5280/api/... 404`

**الحل**:

- تأكد من أن الـ backend يعمل
- تحقق من أن الـ API URL صحيح في `environment.ts`
- تأكد من أن الـ route موجود في الـ backend

### 3. 401 Unauthorized:

**المشكلة**: `401 Unauthorized`

**الحل**:

- تأكد من تسجيل الدخول
- تحقق من أن الـ token موجود وصالح
- تحقق من أن `AuthInterceptor` يعمل

### 4. Connection Refused:

**المشكلة**: `Failed to connect to http://localhost:5280`

**الحل**:

- تأكد من أن الـ backend يعمل
- تحقق من الـ port في `launchSettings.json`
- تأكد من أن الـ port غير مستخدم من تطبيق آخر

---

## الخطوة 6: اختبار سريع

### اختبار تسجيل الدخول:

1. اذهب إلى `/register`
2. سجل مستخدم جديد
3. اذهب إلى `/verify-email` (إذا مطلوب)
4. اذهب إلى `/login`
5. سجل الدخول
6. يجب أن يتم توجيهك إلى Dashboard المناسب

### اختبار API Call:

افتح Browser DevTools (F12):

1. اذهب إلى Network tab
2. قم بعمل أي action (مثل تسجيل الدخول)
3. تحقق من أن الطلبات تذهب إلى `http://localhost:5280/api/...`
4. تحقق من وجود header `X-Device-Id`
5. تحقق من وجود header `Authorization: Bearer ...` (بعد تسجيل الدخول)

---

## الخطوة 7: ملفات التوثيق

### الملفات المتوفرة:

1. **TESTING_CHECKLIST.md** - قائمة اختبار شاملة
2. **ENVIRONMENT_SETUP.md** - دليل إعداد البيئة
3. **FINAL_COMPLETION.md** - ملخص الإكمال النهائي
4. **QUICK_START_GUIDE.md** - هذا الملف

---

## نصائح مهمة:

1. **افتح Browser Console** دائماً للتحقق من الأخطاء
2. **افحص Network Tab** لمراقبة API calls
3. **تحقق من localStorage** للـ token و deviceId
4. **استخدم Swagger** لاختبار الـ backend مباشرة
5. **راجع Logs** في الـ backend console

---

## حالة الإعداد الحالية:

### ✅ جاهز:

- Environment configuration
- API URL configured
- Device ID generation
- All routes configured
- All guards configured
- All interceptors configured

### ⚠️ يحتاج تحقق:

- Backend running on correct port
- CORS configuration
- Database connection
- Email service configuration (SendGrid)
- SMS service configuration (Twilio)
- Payment service configuration (Stripe)

---

## الدعم:

إذا واجهت أي مشاكل:

1. راجع `TESTING_CHECKLIST.md` للتحقق من الخطوات
2. راجع `ENVIRONMENT_SETUP.md` للتحقق من الإعدادات
3. تحقق من Browser Console للأخطاء
4. تحقق من Backend Logs

---

**جاهز للبدء!** 🚀

ابدأ بتشغيل الـ backend ثم الـ frontend وابدأ الاختبار!
