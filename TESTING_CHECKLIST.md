# Testing Checklist - قائمة اختبار شامل ✅

## 1. Environment Configuration ✅

### ✅ Environment Files Checked:
- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

### Current Configuration:
```typescript
// Development
apiUrl: 'http://localhost:5000/api'
deviceId: Auto-generated and stored in localStorage

// Production  
apiUrl: 'https://your-production-api.com/api' (Update when deploying)
```

### ⚠️ Action Required:
1. **Update Production API URL** in `environment.prod.ts` before deployment
2. **Verify Backend Port**: Ensure backend is running on port 5000 (or update accordingly)
3. **CORS Configuration**: Ensure backend allows requests from frontend origin

---

## 2. Authentication & Authorization Testing

### Public Pages (No Auth Required):
- [ ] **Home Page** (`/`)
  - [ ] Page loads correctly
  - [ ] Popular courses section displays
  - [ ] Navigation works

- [ ] **Login** (`/login`)
  - [ ] Form validation works
  - [ ] Login with valid credentials → redirects to dashboard
  - [ ] Login with invalid credentials → shows error
  - [ ] Redirects to appropriate dashboard based on role

- [ ] **Register** (`/register`)
  - [ ] Form validation works
  - [ ] Role selection works (Admin/Instructor/Student)
  - [ ] Registration successful → redirects to verify email
  - [ ] Error handling works

- [ ] **Forgot Password** (`/forgot-password`)
  - [ ] Email validation works
  - [ ] Sends reset code successfully
  - [ ] Error handling works

- [ ] **Reset Password** (`/reset-password`)
  - [ ] Form validation works
  - [ ] Password match validation
  - [ ] Reset successful → redirects to login
  - [ ] Error handling works

- [ ] **Verify Email** (`/verify-email`)
  - [ ] Code input works
  - [ ] Verification successful → redirects to login
  - [ ] Resend code works
  - [ ] Error handling works

- [ ] **Courses List** (`/courses`)
  - [ ] Page loads without authentication
  - [ ] Courses display correctly
  - [ ] Search functionality works
  - [ ] Pagination works

- [ ] **Course Details** (`/courses/:id`)
  - [ ] Course information displays
  - [ ] Lessons list shows
  - [ ] Enroll button shows for authenticated users
  - [ ] Reviews section (if implemented)

---

## 3. Student Pages Testing

### Prerequisites:
- Login as Student user
- Verify student role access

### Pages to Test:
- [ ] **Student Dashboard** (`/student`)
  - [ ] Statistics cards display correctly
  - [ ] Recent enrollments show
  - [ ] Upcoming exams show
  - [ ] Navigation links work

- [ ] **My Courses** (`/student/my-courses`)
  - [ ] Enrollments list loads
  - [ ] Progress bars display correctly
  - [ ] Continue Course button works
  - [ ] View Progress button works
  - [ ] Certificate button shows for completed courses
  - [ ] Pagination works

- [ ] **My Certificates** (`/student/my-certificates`)
  - [ ] Completed courses list shows
  - [ ] Download certificate works (PDF)
  - [ ] Empty state shows when no certificates

- [ ] **Progress Tracking** (`/student/progress/:enrollmentId`)
  - [ ] Progress details load correctly
  - [ ] Progress percentage displays
  - [ ] Course information shows

- [ ] **Take Exam** (`/student/exams/:examId`)
  - [ ] Exam questions load
  - [ ] Answer selection works (MCQ, TrueFalse, Text)
  - [ ] Submit exam works
  - [ ] Redirects to results page

- [ ] **Exam Results** (`/student/exams/attempts/:attemptId`)
  - [ ] Results display correctly
  - [ ] Score shows
  - [ ] Correct/incorrect answers highlighted
  - [ ] Back to dashboard works

- [ ] **Payment History** (`/student/payments`)
  - [ ] Payments list loads
  - [ ] Payment details display correctly
  - [ ] Pagination works

- [ ] **Profile** (`/student/profile`)
  - [ ] User information loads
  - [ ] Update profile works
  - [ ] Change password works
  - [ ] Phone numbers management works (if implemented)

- [ ] **Support Tickets** (`/student/support`)
  - [ ] Tickets list loads
  - [ ] Create ticket works
  - [ ] Ticket details display

---

## 4. Instructor Pages Testing

### Prerequisites:
- Login as Instructor user
- Verify instructor role access

### Pages to Test:
- [ ] **Instructor Dashboard** (`/instructor`)
  - [ ] Statistics display correctly
  - [ ] Revenue chart shows
  - [ ] Top courses list shows
  - [ ] Navigation works

- [ ] **My Courses** (`/instructor/courses`)
  - [ ] Courses list loads
  - [ ] Create course button works
  - [ ] Edit course works
  - [ ] View course works
  - [ ] Published/Draft status shows

- [ ] **Create Course** (`/instructor/courses/create`)
  - [ ] Form validation works
  - [ ] Course creation successful
  - [ ] Redirects to course page
  - [ ] Error handling works

- [ ] **Edit Course** (`/instructor/courses/:id/edit`)
  - [ ] Form pre-filled with course data
  - [ ] Update successful
  - [ ] Error handling works

- [ ] **Manage Content** (`/instructor/courses/:id/content`)
  - [ ] Lessons list shows
  - [ ] Add lesson button works
  - [ ] Edit lesson works
  - [ ] Delete lesson works

- [ ] **Add/Edit Lesson** (`/instructor/courses/:courseId/lessons/create`)
  - [ ] Form validation works
  - [ ] File upload works (if implemented)
  - [ ] Lesson creation successful
  - [ ] Content types work (Video, PDF, Quiz, etc.)

- [ ] **Create Exam** (`/instructor/exams/create`)
  - [ ] Form validation works
  - [ ] Exam creation successful
  - [ ] Redirects to questions page

- [ ] **Manage Exam Questions** (`/instructor/exams/:id/questions`)
  - [ ] Questions list shows
  - [ ] Add question works
  - [ ] Question types work (MCQ, TrueFalse, Text)
  - [ ] Delete question works
  - [ ] Options management works for MCQ

- [ ] **My Groups** (`/instructor/groups`)
  - [ ] Groups list loads
  - [ ] Create group works
  - [ ] View group details works

- [ ] **Group Details** (`/instructor/groups/:id`)
  - [ ] Group information shows
  - [ ] Students list shows
  - [ ] Courses list shows
  - [ ] Add/remove student works
  - [ ] Add/remove course works

- [ ] **Earnings** (`/instructor/earnings`)
  - [ ] Total revenue displays
  - [ ] Courses earnings list shows
  - [ ] Payments list shows when course selected

- [ ] **Subscription** (`/instructor/subscription`)
  - [ ] Current subscription shows (if exists)
  - [ ] Available packages show
  - [ ] Subscribe works
  - [ ] Cancel subscription works
  - [ ] Renew subscription works

- [ ] **Profile** (`/instructor/profile`)
  - [ ] User information loads
  - [ ] Update profile works
  - [ ] Change password works

---

## 5. Admin Pages Testing

### Prerequisites:
- Login as Admin user
- Verify admin role access

### Pages to Test:
- [ ] **Admin Dashboard** (`/admin`)
  - [ ] All statistics display correctly
  - [ ] User growth chart shows
  - [ ] Top instructors list shows
  - [ ] Top courses list shows
  - [ ] Navigation works

- [ ] **Users Management** (`/admin/users`)
  - [ ] Users list loads
  - [ ] Search by email works
  - [ ] Delete user works
  - [ ] Pagination works

- [ ] **Courses Management** (`/admin/courses`)
  - [ ] All courses list loads
  - [ ] Delete course works
  - [ ] Pagination works

- [ ] **Payments Management** (`/admin/payments`)
  - [ ] Payment statistics display
  - [ ] Payments list loads (if endpoint available)
  - [ ] Refund payment works
  - [ ] Statistics cards show correct data

- [ ] **Support Tickets** (`/admin/support`)
  - [ ] All tickets list loads
  - [ ] Assign ticket works
  - [ ] Resolve ticket works
  - [ ] Delete ticket works
  - [ ] Pagination works

- [ ] **Subscriptions Management** (`/admin/subscriptions`)
  - [ ] Packages list loads
  - [ ] Create package works
  - [ ] Edit package works
  - [ ] Delete package works
  - [ ] Pagination works

- [ ] **Affiliates Management** (`/admin/affiliates`)
  - [ ] Affiliates list loads
  - [ ] Commission displays correctly
  - [ ] Process payout works
  - [ ] Pagination works

- [ ] **Reports** (`/admin/reports`)
  - [ ] Overview statistics display
  - [ ] User growth chart shows
  - [ ] Payment statistics display
  - [ ] Top instructors list shows
  - [ ] Top courses list shows

---

## 6. Guards & Interceptors Testing

### Guards:
- [ ] **AuthGuard**
  - [ ] Redirects to login when not authenticated
  - [ ] Allows access when authenticated

- [ ] **StudentGuard**
  - [ ] Allows Student and Admin access
  - [ ] Blocks Instructor access
  - [ ] Redirects appropriately

- [ ] **InstructorGuard**
  - [ ] Allows Instructor and Admin access
  - [ ] Blocks Student access
  - [ ] Redirects appropriately

- [ ] **AdminGuard**
  - [ ] Allows only Admin access
  - [ ] Blocks Student and Instructor access
  - [ ] Redirects appropriately

### Interceptors:
- [ ] **AuthInterceptor**
  - [ ] Adds Authorization header with token
  - [ ] Adds X-Device-Id header
  - [ ] Works on all HTTP requests

- [ ] **ErrorInterceptor**
  - [ ] Handles 401 errors → redirects to login
  - [ ] Handles 403 errors → shows error message
  - [ ] Handles 404 errors → shows error message
  - [ ] Handles 500 errors → shows error message
  - [ ] Extracts error messages from response

---

## 7. Services Testing

### Core Services:
- [ ] **AuthService**
  - [ ] Login works
  - [ ] Register works
  - [ ] Logout works
  - [ ] Token refresh works
  - [ ] Email verification works
  - [ ] Password reset works

- [ ] **TokenService**
  - [ ] Token storage works
  - [ ] Token retrieval works
  - [ ] User data storage works
  - [ ] Clear token works

- [ ] **DashboardService**
  - [ ] Student dashboard data loads
  - [ ] Instructor dashboard data loads
  - [ ] Admin dashboard data loads

- [ ] **CourseService**
  - [ ] Get all courses works
  - [ ] Get course by ID works
  - [ ] Create course works
  - [ ] Update course works
  - [ ] Delete course works
  - [ ] Search courses works

- [ ] **EnrollmentService**
  - [ ] Enroll in course works
  - [ ] Get enrollments works
  - [ ] Get progress works
  - [ ] Download certificate works

- [ ] **ExamService**
  - [ ] Get exam works
  - [ ] Get questions works
  - [ ] Submit exam works
  - [ ] Get results works

- [ ] **PaymentService**
  - [ ] Get payments works
  - [ ] Process payment works
  - [ ] Get statistics works
  - [ ] Refund payment works

- [ ] **SupportService**
  - [ ] Get tickets works
  - [ ] Create ticket works
  - [ ] Assign ticket works
  - [ ] Resolve ticket works

- [ ] **SubscriptionService**
  - [ ] Get packages works
  - [ ] Subscribe works
  - [ ] Cancel subscription works
  - [ ] Renew subscription works

- [ ] **FileService**
  - [ ] Upload file works
  - [ ] Get file works
  - [ ] Download file works
  - [ ] Delete file works

---

## 8. UI/UX Testing

### Responsive Design:
- [ ] **Mobile View** (< 768px)
  - [ ] All pages responsive
  - [ ] Navigation works
  - [ ] Forms usable
  - [ ] Tables scrollable

- [ ] **Tablet View** (768px - 1024px)
  - [ ] Layout adapts correctly
  - [ ] All features accessible

- [ ] **Desktop View** (> 1024px)
  - [ ] Full layout displays
  - [ ] All features accessible

### Loading States:
- [ ] Loading indicators show during API calls
- [ ] Loading states don't block UI unnecessarily
- [ ] Error states display correctly

### Form Validation:
- [ ] Required fields validated
- [ ] Email format validated
- [ ] Password strength validated
- [ ] Error messages clear and helpful

---

## 9. Error Handling Testing

- [ ] **Network Errors**
  - [ ] Offline state handled
  - [ ] Timeout errors handled
  - [ ] Connection errors handled

- [ ] **API Errors**
  - [ ] 400 Bad Request handled
  - [ ] 401 Unauthorized handled
  - [ ] 403 Forbidden handled
  - [ ] 404 Not Found handled
  - [ ] 500 Server Error handled

- [ ] **Validation Errors**
  - [ ] Form validation errors show
  - [ ] Server validation errors show
  - [ ] Error messages are user-friendly

---

## 10. Security Testing

- [ ] **Token Management**
  - [ ] Tokens stored securely
  - [ ] Tokens cleared on logout
  - [ ] Token refresh works

- [ ] **Route Protection**
  - [ ] Protected routes require authentication
  - [ ] Role-based access enforced
  - [ ] Unauthorized access blocked

- [ ] **XSS Protection**
  - [ ] User input sanitized
  - [ ] No script injection possible

- [ ] **CSRF Protection**
  - [ ] API requests include proper headers
  - [ ] Device ID included in requests

---

## 11. Performance Testing

- [ ] **Page Load Times**
  - [ ] Initial page load < 3 seconds
  - [ ] Navigation between pages smooth
  - [ ] API calls optimized

- [ ] **Large Data Sets**
  - [ ] Pagination works with large lists
  - [ ] Tables handle many rows
  - [ ] No memory leaks

---

## 12. Browser Compatibility

- [ ] **Chrome** (Latest)
- [ ] **Firefox** (Latest)
- [ ] **Safari** (Latest)
- [ ] **Edge** (Latest)

---

## Testing Notes:

### How to Test:
1. **Start Backend Server**: Ensure backend is running on `http://localhost:5000`
2. **Start Frontend**: Run `ng serve` or `npm start`
3. **Test Each Page**: Navigate through all pages and verify functionality
4. **Test Different Roles**: Login as Student, Instructor, and Admin
5. **Test Error Cases**: Try invalid inputs, network errors, etc.

### Common Issues to Check:
- [ ] CORS errors in browser console
- [ ] 404 errors for missing routes
- [ ] 401 errors for unauthorized access
- [ ] Form validation not working
- [ ] API calls failing
- [ ] Token expiration issues

---

## Quick Test Commands:

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Test API endpoint
curl http://localhost:5000/api/courses

# Check environment configuration
# Open browser console and check:
# - localStorage.getItem('deviceId')
# - Check network requests for correct API URL
```

---

## ✅ Testing Status:

- [ ] Environment Configuration Verified
- [ ] All Public Pages Tested
- [ ] All Student Pages Tested
- [ ] All Instructor Pages Tested
- [ ] All Admin Pages Tested
- [ ] Guards & Interceptors Tested
- [ ] Services Tested
- [ ] UI/UX Tested
- [ ] Error Handling Tested
- [ ] Security Tested
- [ ] Performance Tested
- [ ] Browser Compatibility Tested

---

**Last Updated**: [Current Date]
**Tested By**: [Your Name]
**Status**: Ready for Testing 🚀

