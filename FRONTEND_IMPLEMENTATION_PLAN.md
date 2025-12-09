# خطة تنفيذ الفرونت اند - Learning Hub LMS

## نظرة عامة
هذه الخطة الكاملة لبناء الفرونت اند باستخدام Angular بناءً على الـ APIs الموجودة في الباك اند.

---

## 1. Authentication & Authorization APIs

### 1.1 Auth Service Methods

#### **POST** `/api/auth/register`
- **Method**: `register(registerData: RegisterRequestDto)`
- **Usage**: صفحة التسجيل
- **Request Body**:
  ```typescript
  {ؤي
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: number; // 0=Admin, 1=Instructor, 2=Student
  }
  ```
- **Response**: `AuthResponseDto` (contains token, refreshToken, user info)

#### **POST** `/api/auth/login`
- **Method**: `login(loginData: LoginRequestDto)`
- **Usage**: صفحة تسجيل الدخول
- **Headers**: `X-Device-Id` (auto-generated)
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**: `AuthResponseDto`

#### **POST** `/api/auth/refresh-token`
- **Method**: `refreshToken(refreshToken: string)`
- **Usage**: تلقائياً عند انتهاء الـ token
- **Headers**: `X-Device-Id`

#### **POST** `/api/auth/verify-email`
- **Method**: `verifyEmail(userId: string, code: string)`
- **Usage**: صفحة تأكيد البريد الإلكتروني

#### **POST** `/api/auth/resend-verification`
- **Method**: `resendVerification(email: string)`
- **Usage**: إعادة إرسال كود التحقق

#### **POST** `/api/auth/change-password`
- **Method**: `changePassword(data: ChangePasswordDto)`
- **Usage**: صفحة تغيير كلمة المرور (يحتاج Auth)
- **Auth**: Required

#### **POST** `/api/auth/forgot-password`
- **Method**: `forgotPassword(email: string)`
- **Usage**: صفحة نسيان كلمة المرور

#### **POST** `/api/auth/reset-password`
- **Method**: `resetPassword(data: ResetPasswordDto)`
- **Usage**: صفحة إعادة تعيين كلمة المرور

#### **GET** `/api/auth/devices`
- **Method**: `getActiveDevices()`
- **Usage**: صفحة إدارة الأجهزة (يحتاج Auth)
- **Auth**: Required

#### **DELETE** `/api/auth/devices/{deviceId}`
- **Method**: `revokeDeviceToken(deviceId: string)`
- **Usage**: إلغاء تفعيل جهاز معين
- **Auth**: Required

#### **POST** `/api/auth/logout`
- **Method**: `logout(refreshToken: string)`
- **Usage**: تسجيل الخروج
- **Auth**: Required

---

## 2. Dashboard APIs

### 2.1 Dashboard Service Methods

#### **GET** `/api/dashboard/student/{studentId}`
- **Method**: `getStudentDashboard(studentId: string)`
- **Usage**: Student Dashboard Component
- **Auth**: Required (Student or Admin)
- **Response**: `StudentDashboardDto`
  ```typescript
  {
    studentId: string;
    studentName: string;
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
    averageProgress: number;
    recentEnrollments: EnrollmentSummaryDto[];
    upcomingExams: UpcomingExamDto[];
  }
  ```

#### **GET** `/api/dashboard/instructor/{instructorId}`
- **Method**: `getInstructorDashboard(instructorId: string)`
- **Usage**: Instructor Dashboard Component
- **Auth**: Required (Instructor or Admin)
- **Response**: `InstructorDashboardDto`
  ```typescript
  {
    instructorId: string;
    instructorName: string;
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
    totalRevenue: number;
    averageCourseRating: number;
    topCourses: CourseSummaryDto[];
    revenueByMonth: RevenueByMonthDto[];
  }
  ```

#### **GET** `/api/dashboard/admin`
- **Method**: `getAdminDashboard()`
- **Usage**: Admin Dashboard Component
- **Auth**: Required (Admin only)
- **Response**: `AdminDashboardDto`
  ```typescript
  {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    activeSubscriptions: number;
    pendingSupportTickets: number;
    userGrowthByMonth: UserGrowthDto[];
    topInstructors: TopInstructorDto[];
    topCourses: TopCourseDto[];
  }
  ```

---

## 3. Users APIs

### 3.1 User Service Methods

#### **GET** `/api/users`
- **Method**: `getAllUsers(pageNumber?: number, pageSize?: number)`
- **Usage**: Admin - Users Management Page
- **Auth**: Required (Admin only)
- **Response**: `PagedResult<UserDto>`

#### **GET** `/api/users/{id}`
- **Method**: `getUserById(id: string)`
- **Usage**: Profile Page (Own profile or Admin)
- **Auth**: Required
- **Response**: `UserDto`

#### **GET** `/api/users/email/{email}`
- **Method**: `getUserByEmail(email: string)`
- **Usage**: Admin - Search user by email
- **Auth**: Required (Admin only)

#### **PUT** `/api/users/{id}`
- **Method**: `updateUser(id: string, data: UserUpdateDto)`
- **Usage**: Edit Profile Page
- **Auth**: Required (Own profile or Admin)

#### **DELETE** `/api/users/{id}`
- **Method**: `deleteUser(id: string)`
- **Usage**: Admin - Delete user
- **Auth**: Required (Admin only)

#### **GET** `/api/users/{id}/phones`
- **Method**: `getUserPhoneNumbers(id: string)`
- **Usage**: Profile Page - Show phone numbers

#### **POST** `/api/users/{id}/phones`
- **Method**: `addPhoneNumber(id: string, data: AddPhoneNumberDto)`
- **Usage**: Profile Page - Add phone number

#### **PUT** `/api/users/{id}/phones`
- **Method**: `updatePhoneNumber(id: string, data: UpdatePhoneNumberDto)`
- **Usage**: Profile Page - Update phone number

#### **DELETE** `/api/users/{id}/phones/{phoneNumber}`
- **Method**: `removePhoneNumber(id: string, phoneNumber: string)`
- **Usage**: Profile Page - Remove phone number

#### **PUT** `/api/users/{id}/phones/{phoneNumber}/set-primary`
- **Method**: `setPrimaryPhoneNumber(id: string, phoneNumber: string)`
- **Usage**: Profile Page - Set primary phone

#### **POST** `/api/users/{id}/verify-phone`
- **Method**: `verifyPhoneNumber(id: string, code: string)`
- **Usage**: Profile Page - Verify phone

#### **PUT** `/api/users/{id}/role`
- **Method**: `assignRole(id: string, role: string)`
- **Usage**: Admin - Assign role to user
- **Auth**: Required (Admin only)

#### **DELETE** `/api/users/{id}/role`
- **Method**: `removeRole(id: string, role: string)`
- **Usage**: Admin - Remove role from user
- **Auth**: Required (Admin only)

---

## 4. Courses APIs

### 4.1 Course Service Methods

#### **GET** `/api/courses`
- **Method**: `getAllCourses(pageNumber?: number, pageSize?: number)`
- **Usage**: Courses List Page (Public)
- **Auth**: Not Required (AllowAnonymous)
- **Response**: `PagedResult<CourseDto>`

#### **GET** `/api/courses/{id}`
- **Method**: `getCourseById(id: string)`
- **Usage**: Course Details Page (Public)
- **Auth**: Not Required
- **Response**: `CourseDto`

#### **GET** `/api/courses/instructor/{instructorId}`
- **Method**: `getCoursesByInstructor(instructorId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Instructor Courses Page / Public Instructor Profile
- **Auth**: Not Required

#### **GET** `/api/courses/popular`
- **Method**: `getPopularCourses(count?: number)`
- **Usage**: Home Page - Popular Courses Section
- **Auth**: Not Required
- **Response**: `CourseDto[]`

#### **GET** `/api/courses/search`
- **Method**: `searchCourses(query: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Courses Search Page
- **Auth**: Not Required
- **Response**: `PagedResult<CourseDto>`

#### **POST** `/api/courses`
- **Method**: `createCourse(data: CreateCourseDto)`
- **Usage**: Instructor - Create Course Page
- **Auth**: Required (Instructor or Admin)

#### **PUT** `/api/courses/{id}`
- **Method**: `updateCourse(id: string, data: UpdateCourseDto)`
- **Usage**: Instructor - Edit Course Page
- **Auth**: Required (Instructor own course or Admin)

#### **DELETE** `/api/courses/{id}`
- **Method**: `deleteCourse(id: string)`
- **Usage**: Instructor - Delete Course
- **Auth**: Required (Instructor own course or Admin)

#### **GET** `/api/courses/{id}/statistics`
- **Method**: `getCourseStatistics(id: string)`
- **Usage**: Instructor - Course Statistics Page
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/courses/{id}/publish`
- **Method**: `publishCourse(id: string)`
- **Usage**: Instructor - Publish Course
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/courses/{id}/unpublish`
- **Method**: `unpublishCourse(id: string)`
- **Usage**: Instructor - Unpublish Course
- **Auth**: Required (Instructor or Admin)

---

## 5. Lessons APIs

### 5.1 Lesson Service Methods

#### **GET** `/api/courses/{courseId}/lessons`
- **Method**: `getLessonsByCourse(courseId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Course Content Page - Lessons List
- **Auth**: Not Required (AllowAnonymous)
- **Response**: `PagedResult<LessonDto>`

#### **GET** `/api/courses/{courseId}/lessons/{id}`
- **Method**: `getLessonById(courseId: string, lessonId: string)`
- **Usage**: Lesson Player Page
- **Auth**: Not Required

#### **POST** `/api/courses/{courseId}/lessons`
- **Method**: `addLesson(courseId: string, data: LessonCreateDto)`
- **Usage**: Instructor - Add Lesson Page
- **Auth**: Required (Instructor or Admin)

#### **PUT** `/api/courses/{courseId}/lessons/{id}`
- **Method**: `updateLesson(courseId: string, lessonId: string, data: LessonCreateDto)`
- **Usage**: Instructor - Edit Lesson Page
- **Auth**: Required (Instructor or Admin)

#### **DELETE** `/api/courses/{courseId}/lessons/{id}`
- **Method**: `deleteLesson(courseId: string, lessonId: string)`
- **Usage**: Instructor - Delete Lesson
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/courses/{courseId}/lessons/{id}/complete`
- **Method**: `markLessonAsComplete(courseId: string, lessonId: string)`
- **Usage**: Student - Mark lesson as complete
- **Auth**: Required (Student or Admin)

---

## 6. Enrollments APIs

### 6.1 Enrollment Service Methods

#### **GET** `/api/enrollments/student/{studentId}`
- **Method**: `getEnrollmentsByStudent(studentId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Student - My Courses Page
- **Auth**: Required (Own enrollments or Admin)
- **Response**: `PagedResult<EnrollmentDto>`

#### **GET** `/api/enrollments/course/{courseId}`
- **Method**: `getEnrollmentsByCourse(courseId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Instructor - Course Enrollments Page
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/enrollments`
- **Method**: `enrollInCourse(data: EnrollmentCreateDto)`
- **Usage**: Course Details Page - Enroll Button
- **Auth**: Required (Student or Admin)

#### **DELETE** `/api/enrollments/{id}`
- **Method**: `cancelEnrollment(id: string)`
- **Usage**: Student - Cancel Enrollment
- **Auth**: Required (Own enrollment or Admin)

#### **GET** `/api/enrollments/{id}/progress`
- **Method**: `getEnrollmentProgress(id: string)`
- **Usage**: Student - Course Progress Page
- **Auth**: Required (Student own, Instructor, or Admin)

#### **GET** `/api/enrollments/{id}/certificate`
- **Method**: `getCertificate(id: string)`
- **Usage**: Student - Download Certificate (PDF)
- **Auth**: Required (Student own, Instructor, or Admin)
- **Response**: File (PDF)

#### **PUT** `/api/enrollments/{id}/progress`
- **Method**: `updateProgress(id: string, progressPercentage: number)`
- **Usage**: Student - Update Progress (usually auto)
- **Auth**: Required (Student own or Admin)

---

## 7. Exams APIs

### 7.1 Exam Service Methods

#### **GET** `/api/exams/course/{courseId}`
- **Method**: `getExamsByCourse(courseId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Course Exams Page
- **Auth**: Required
- **Response**: `PagedResult<ExamDto>`

#### **GET** `/api/exams/{id}`
- **Method**: `getExamById(id: string)`
- **Usage**: Exam Details Page
- **Auth**: Required

#### **POST** `/api/exams`
- **Method**: `createExam(data: CreateExamDto)`
- **Usage**: Instructor - Create Exam Page
- **Auth**: Required (Instructor or Admin)

#### **PUT** `/api/exams/{id}`
- **Method**: `updateExam(id: string, data: UpdateExamDto)`
- **Usage**: Instructor - Edit Exam Page
- **Auth**: Required (Instructor or Admin)

#### **DELETE** `/api/exams/{id}`
- **Method**: `deleteExam(id: string)`
- **Usage**: Instructor - Delete Exam
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/exams/{id}/submit`
- **Method**: `submitExamAttempt(examId: string, data: ExamAttemptSubmitDto)`
- **Usage**: Student - Submit Exam Page
- **Auth**: Required (Student or Admin)
- **Response**: `ExamAttemptDto`

#### **GET** `/api/exams/{id}/attempts`
- **Method**: `getExamAttempts(examId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Student - My Exam Attempts Page
- **Auth**: Required
- **Response**: `PagedResult<ExamAttemptDto>`

#### **GET** `/api/exams/attempts/{attemptId}`
- **Method**: `getAttemptDetail(attemptId: string)`
- **Usage**: Exam Result Page - View Detailed Results
- **Auth**: Required (Student own, Instructor, or Admin)

---

## 8. Exam Questions APIs

### 8.1 Exam Question Service Methods

#### **GET** `/api/exam-questions/exam/{examId}`
- **Method**: `getQuestionsByExamId(examId: string)`
- **Usage**: Exam Questions List / Exam Take Page
- **Auth**: Required
- **Response**: `ExamQuestionDto[]`

#### **POST** `/api/exam-questions/exam/{examId}`
- **Method**: `createQuestion(examId: string, data: CreateExamQuestionDto)`
- **Usage**: Instructor - Add Question Page
- **Auth**: Required (Instructor or Admin)

#### **PUT** `/api/exam-questions/{questionId}`
- **Method**: `updateQuestion(questionId: string, data: UpdateExamQuestionDto)`
- **Usage**: Instructor - Edit Question Page
- **Auth**: Required (Instructor or Admin)

#### **DELETE** `/api/exam-questions/{questionId}`
- **Method**: `deleteQuestion(questionId: string)`
- **Usage**: Instructor - Delete Question
- **Auth**: Required (Instructor or Admin)

---

## 9. Groups APIs

### 9.1 Group Service Methods

#### **GET** `/api/groups`
- **Method**: `getAllGroups(pageNumber?: number, pageSize?: number)`
- **Usage**: Groups List Page (Instructor or Admin)
- **Auth**: Required (Instructor or Admin)
- **Response**: `PagedResult<GroupDto>`

#### **GET** `/api/groups/{id}`
- **Method**: `getGroupById(id: string)`
- **Usage**: Group Details Page
- **Auth**: Required

#### **GET** `/api/groups/instructor/{instructorId}`
- **Method**: `getGroupsByInstructor(instructorId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Instructor - My Groups Page
- **Auth**: Required

#### **POST** `/api/groups`
- **Method**: `createGroup(data: CreateGroupDto)`
- **Usage**: Instructor - Create Group Page
- **Auth**: Required (Instructor or Admin)

#### **PUT** `/api/groups/{id}`
- **Method**: `updateGroup(id: string, data: UpdateGroupDto)`
- **Usage**: Instructor - Edit Group Page
- **Auth**: Required (Instructor or Admin)

#### **DELETE** `/api/groups/{id}`
- **Method**: `deleteGroup(id: string)`
- **Usage**: Instructor - Delete Group
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/groups/{id}/students/{studentId}`
- **Method**: `addStudentToGroup(groupId: string, studentId: string)`
- **Usage**: Instructor - Add Student to Group
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/groups/{id}/courses/{courseId}`
- **Method**: `addCourseToGroup(groupId: string, courseId: string)`
- **Usage**: Instructor - Add Course to Group
- **Auth**: Required (Instructor or Admin)

#### **GET** `/api/groups/{id}/courses`
- **Method**: `getCoursesByGroupId(groupId: string)`
- **Usage**: Group Details - Courses List
- **Auth**: Required

#### **GET** `/api/groups/{id}/students`
- **Method**: `getGroupStudents(groupId: string)`
- **Usage**: Group Details - Students List
- **Auth**: Required
- **Response**: `UserDto[]`

#### **DELETE** `/api/groups/{id}/courses/{courseId}`
- **Method**: `removeCourseFromGroup(groupId: string, courseId: string)`
- **Usage**: Instructor - Remove Course from Group
- **Auth**: Required (Instructor or Admin)

#### **DELETE** `/api/groups/{id}/students/{studentId}`
- **Method**: `removeStudentFromGroup(groupId: string, studentId: string)`
- **Usage**: Instructor - Remove Student from Group
- **Auth**: Required (Instructor or Admin)

---

## 10. Payments APIs

### 10.1 Payment Service Methods

#### **GET** `/api/payments/student/{studentId}`
- **Method**: `getPaymentsByStudent(studentId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Student - Payment History Page
- **Auth**: Required (Own payments or Admin)
- **Response**: `PagedResult<PaymentDto>`

#### **GET** `/api/payments/course/{courseId}`
- **Method**: `getPaymentsByCourse(courseId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Instructor - Course Payments Page
- **Auth**: Required (Instructor or Admin)

#### **GET** `/api/payments/{id}`
- **Method**: `getPaymentById(id: string)`
- **Usage**: Payment Details Page
- **Auth**: Required

#### **POST** `/api/payments`
- **Method**: `processPayment(data: PaymentCreateDto)`
- **Usage**: Checkout Page - Process Payment
- **Auth**: Required (Student or Admin)
- **Response**: `PaymentDto`

#### **POST** `/api/payments/{id}/refund`
- **Method**: `refundPayment(id: string, refundAmount?: number)`
- **Usage**: Admin - Refund Payment
- **Auth**: Required (Admin only)

#### **GET** `/api/payments/statistics`
- **Method**: `getPaymentStatistics()`
- **Usage**: Admin - Payment Statistics Page
- **Auth**: Required (Admin only)

---

## 11. Reviews APIs

### 11.1 Review Service Methods

#### **GET** `/api/reviews/course/{courseId}`
- **Method**: `getCourseReviews(courseId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Course Details - Reviews Section (Public)
- **Auth**: Not Required
- **Response**: `PagedResult<CourseReviewDto>`

#### **GET** `/api/reviews/instructor/{instructorId}`
- **Method**: `getInstructorReviews(instructorId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Instructor Profile - Reviews Section (Public)
- **Auth**: Not Required
- **Response**: `PagedResult<InstructorReviewDto>`

#### **POST** `/api/reviews/course`
- **Method**: `createCourseReview(data: CourseReviewCreateDto)`
- **Usage**: Course Details - Add Review Form
- **Auth**: Required (Student or Admin)

#### **POST** `/api/reviews/instructor`
- **Method**: `createInstructorReview(data: InstructorReviewCreateDto)`
- **Usage**: Instructor Profile - Add Review Form
- **Auth**: Required (Student or Admin)

#### **PUT** `/api/reviews/{id}`
- **Method**: `updateReview(id: string, data: ReviewUpdateDto)`
- **Usage**: Edit Review (Own review only)
- **Auth**: Required

#### **DELETE** `/api/reviews/{id}`
- **Method**: `deleteReview(id: string)`
- **Usage**: Delete Review (Own review or Admin)
- **Auth**: Required

---

## 12. Subscriptions APIs

### 12.1 Subscription Service Methods

#### **GET** `/api/subscriptions/packages`
- **Method**: `getAllPackages(pageNumber?: number, pageSize?: number)`
- **Usage**: Subscription Packages Page
- **Auth**: Required
- **Response**: `PagedResult<SubscriptionPackageDto>`

#### **GET** `/api/subscriptions/packages/{id}`
- **Method**: `getPackageById(id: string)`
- **Usage**: Package Details Page
- **Auth**: Required

#### **POST** `/api/subscriptions/packages`
- **Method**: `createPackage(data: SubscriptionPackageDto)`
- **Usage**: Admin - Create Package Page
- **Auth**: Required (Admin only)

#### **PUT** `/api/subscriptions/packages/{id}`
- **Method**: `updatePackage(id: string, data: SubscriptionPackageDto)`
- **Usage**: Admin - Edit Package Page
- **Auth**: Required (Admin only)

#### **DELETE** `/api/subscriptions/packages/{id}`
- **Method**: `deletePackage(id: string)`
- **Usage**: Admin - Delete Package
- **Auth**: Required (Admin only)

#### **POST** `/api/subscriptions/subscribe`
- **Method**: `subscribe(data: SubscribeDto)`
- **Usage**: Instructor - Subscribe to Package Page
- **Auth**: Required (Instructor or Admin)
- **Response**: `InstructorSubscriptionDto`

#### **GET** `/api/subscriptions/instructor/{instructorId}`
- **Method**: `getInstructorSubscription(instructorId: string)`
- **Usage**: Instructor - My Subscription Page
- **Auth**: Required

#### **POST** `/api/subscriptions/cancel/{id}`
- **Method**: `cancelSubscription(id: string)`
- **Usage**: Instructor - Cancel Subscription
- **Auth**: Required (Instructor or Admin)

#### **POST** `/api/subscriptions/renew/{id}`
- **Method**: `renewSubscription(id: string)`
- **Usage**: Instructor - Renew Subscription
- **Auth**: Required (Instructor or Admin)

---

## 13. Support APIs

### 13.1 Support Service Methods

#### **GET** `/api/support/tickets`
- **Method**: `getAllTickets(pageNumber?: number, pageSize?: number)`
- **Usage**: Admin - Support Tickets List Page
- **Auth**: Required (Admin only)
- **Response**: `PagedResult<SupportTicketDto>`

#### **GET** `/api/support/tickets/{id}`
- **Method**: `getTicketById(id: string)`
- **Usage**: Ticket Details Page (Own ticket or Admin)
- **Auth**: Required

#### **GET** `/api/support/tickets/user/{userId}`
- **Method**: `getUserTickets(userId: string, pageNumber?: number, pageSize?: number)`
- **Usage**: User - My Support Tickets Page
- **Auth**: Required (Own tickets or Admin)

#### **POST** `/api/support/tickets`
- **Method**: `createTicket(data: SupportTicketCreateDto)`
- **Usage**: Create Support Ticket Page
- **Auth**: Required

#### **PUT** `/api/support/tickets/{id}/assign/{adminId}`
- **Method**: `assignTicket(id: string, adminId: string)`
- **Usage**: Admin - Assign Ticket
- **Auth**: Required (Admin only)

#### **PUT** `/api/support/tickets/{id}/resolve`
- **Method**: `resolveTicket(id: string)`
- **Usage**: Admin - Resolve Ticket
- **Auth**: Required (Admin only)

#### **DELETE** `/api/support/tickets/{id}`
- **Method**: `deleteTicket(id: string)`
- **Usage**: Admin - Delete Ticket
- **Auth**: Required (Admin only)

---

## 14. Affiliates APIs

### 14.1 Affiliate Service Methods

#### **GET** `/api/affiliates`
- **Method**: `getAllAffiliates(pageNumber?: number, pageSize?: number)`
- **Usage**: Admin - Affiliates List Page
- **Auth**: Required (Admin only)
- **Response**: `PagedResult<AffiliateDto>`

#### **GET** `/api/affiliates/{id}`
- **Method**: `getAffiliateById(id: string)`
- **Usage**: Affiliate Details Page
- **Auth**: Required

#### **GET** `/api/affiliates/user/{userId}`
- **Method**: `getAffiliateByUserId(userId: string)`
- **Usage**: User - My Affiliate Account Page
- **Auth**: Required (Own affiliate or Admin)

#### **POST** `/api/affiliates`
- **Method**: `createAffiliate(data: AffiliateCreateDto)`
- **Usage**: Become Affiliate Page
- **Auth**: Required

#### **GET** `/api/affiliates/{id}/referrals`
- **Method**: `getReferrals(id: string, pageNumber?: number, pageSize?: number)`
- **Usage**: Affiliate - My Referrals Page
- **Auth**: Required
- **Response**: `PagedResult<UserDto>`

#### **GET** `/api/affiliates/{id}/commission`
- **Method**: `getTotalCommission(id: string)`
- **Usage**: Affiliate - Commission Summary
- **Auth**: Required
- **Response**: `{ affiliateId: string, totalCommission: number }`

#### **POST** `/api/affiliates/{id}/payout`
- **Method**: `processPayout(id: string, amount: number)`
- **Usage**: Admin - Process Commission Payout
- **Auth**: Required (Admin only)

---

## 15. Files APIs

### 15.1 File Service Methods

#### **POST** `/api/files/upload`
- **Method**: `uploadFile(formData: FormData, entityType: string, entityId?: string)`
- **Usage**: Upload files (videos, images, documents)
- **Auth**: Required
- **Request**: `FormData` with file
- **Response**: `FileDto`

#### **GET** `/api/files/{id}`
- **Method**: `getFile(id: string)`
- **Usage**: Get/Download file
- **Auth**: Not Required (AllowAnonymous)
- **Response**: `FileDto` or File Stream

#### **DELETE** `/api/files/{id}`
- **Method**: `deleteFile(id: string)`
- **Usage**: Delete file (Owner or Admin)
- **Auth**: Required

---

## 16. Dashboard Components - محتويات كل Dashboard

### 16.1 Student Dashboard (`/student`)

#### Components:
1. **Statistics Cards**
   - Total Enrollments
   - Completed Courses
   - In Progress Courses
   - Average Progress (%)

2. **Recent Enrollments List**
   - Course Title
   - Instructor Name
   - Progress Percentage
   - Enrollment Date
   - Link to Course

3. **Upcoming Exams List**
   - Exam Title
   - Course Title
   - Start Date
   - End Date
   - Duration
   - Link to Exam

4. **Quick Actions**
   - Browse Courses
   - My Courses
   - My Certificates
   - Progress Tracking

#### APIs Used:
- `GET /api/dashboard/student/{studentId}` - Main dashboard data

---

### 16.2 Instructor Dashboard (`/instructor`)

#### Components:
1. **Statistics Cards**
   - Total Courses
   - Published Courses
   - Total Students
   - Total Revenue
   - Average Course Rating

2. **Revenue Chart**
   - Revenue by Month (Line/Bar Chart)
   - Data from `revenueByMonth` array

3. **Top Courses List**
   - Course Title
   - Enrollment Count
   - Revenue
   - Average Rating
   - Link to Course

4. **Quick Actions**
   - Create Course
   - Manage Courses
   - View Earnings
   - Manage Groups

#### APIs Used:
- `GET /api/dashboard/instructor/{instructorId}` - Main dashboard data

---

### 16.3 Admin Dashboard (`/admin`)

#### Components:
1. **Statistics Cards**
   - Total Users
   - Total Students
   - Total Instructors
   - Total Courses
   - Total Enrollments
   - Total Revenue
   - Active Subscriptions
   - Pending Support Tickets

2. **User Growth Chart**
   - User Growth by Month (Line Chart)
   - Data from `userGrowthByMonth` array

3. **Top Instructors List**
   - Instructor Name
   - Total Students
   - Total Revenue
   - Link to Instructor

4. **Top Courses List**
   - Course Title
   - Enrollment Count
   - Revenue
   - Link to Course

5. **Quick Actions**
   - Users Management
   - Courses Management
   - Payments Management
   - Support Tickets
   - Reports & Analytics

#### APIs Used:
- `GET /api/dashboard/admin` - Main dashboard data

---

## 17. Pages Structure - هيكل الصفحات

### 17.1 Public Pages (No Auth Required)

1. **Home Page** (`/`)
   - Hero Section
   - Popular Courses (`GET /api/courses/popular`)
   - Featured Instructors
   - Statistics
   - Call to Action

2. **Courses List** (`/courses`)
   - Search Bar (`GET /api/courses/search`)
   - Filters (Category, Price, Rating)
   - Course Cards Grid
   - Pagination
   - API: `GET /api/courses`

3. **Course Details** (`/courses/:id`)
   - Course Info
   - Instructor Info
   - Course Reviews (`GET /api/reviews/course/:id`)
   - Lessons List (`GET /api/courses/:id/lessons`)
   - Enroll Button (if authenticated)
   - API: `GET /api/courses/:id`

4. **Login** (`/login`)
   - Login Form
   - API: `POST /api/auth/login`
   - Redirect to appropriate dashboard

5. **Register** (`/register`)
   - Registration Form
   - Role Selection
   - API: `POST /api/auth/register`

6. **Forgot Password** (`/forgot-password`)
   - Email Input
   - API: `POST /api/auth/forgot-password`

7. **Reset Password** (`/reset-password`)
   - Reset Code + New Password
   - API: `POST /api/auth/reset-password`

8. **Verify Email** (`/verify-email`)
   - Verification Code Input
   - API: `POST /api/auth/verify-email`

---

### 17.2 Student Pages (Auth Required - Student Role)

1. **Student Dashboard** (`/student`)
   - See Section 16.1

2. **My Courses** (`/student/my-courses`)
   - Enrollments List
   - Progress Tracking
   - API: `GET /api/enrollments/student/:studentId`

3. **Course Content** (`/student/courses/:courseId`)
   - Lessons List
   - Lesson Player
   - Progress Indicator
   - API: `GET /api/courses/:courseId/lessons`
   - API: `POST /api/courses/:courseId/lessons/:lessonId/complete`

4. **My Certificates** (`/student/my-certificates`)
   - Completed Courses List
   - Download Certificate Button
   - API: `GET /api/enrollments/:id/certificate` (PDF download)

5. **Progress Tracking** (`/student/progress/:enrollmentId`)
   - Course Progress Details
   - API: `GET /api/enrollments/:id/progress`

6. **Exams** (`/student/exams/:examId`)
   - Exam Questions
   - Submit Exam
   - API: `GET /api/exam-questions/exam/:examId`
   - API: `POST /api/exams/:id/submit`

7. **Exam Results** (`/student/exams/attempts/:attemptId`)
   - Exam Results Details
   - Correct/Incorrect Answers
   - Score
   - API: `GET /api/exams/attempts/:attemptId`

8. **Payment History** (`/student/payments`)
   - Payments List
   - API: `GET /api/payments/student/:studentId`

9. **Profile** (`/student/profile`)
   - User Info
   - Phone Numbers Management
   - Change Password
   - API: `GET /api/users/:id`
   - API: `PUT /api/users/:id`
   - API: `POST /api/users/:id/phones`

10. **Support Tickets** (`/student/support`)
    - My Tickets List
    - Create Ticket
    - API: `GET /api/support/tickets/user/:userId`
    - API: `POST /api/support/tickets`

---

### 17.3 Instructor Pages (Auth Required - Instructor Role)

1. **Instructor Dashboard** (`/instructor`)
   - See Section 16.2

2. **My Courses** (`/instructor/courses`)
   - Courses List
   - Create Course Button
   - API: `GET /api/courses/instructor/:instructorId`

3. **Create Course** (`/instructor/courses/create`)
   - Course Form
   - API: `POST /api/courses`

4. **Edit Course** (`/instructor/courses/:id/edit`)
   - Course Form (Pre-filled)
   - API: `PUT /api/courses/:id`

5. **Course Management** (`/instructor/courses/:id`)
   - Course Info
   - Publish/Unpublish
   - Course Statistics
   - Enrollments List
   - Lessons Management
   - API: `GET /api/courses/:id`
   - API: `POST /api/courses/:id/publish`
   - API: `GET /api/courses/:id/statistics`
   - API: `GET /api/enrollments/course/:courseId`

6. **Add Lesson** (`/instructor/courses/:courseId/lessons/create`)
   - Lesson Form
   - File Upload (Video)
   - API: `POST /api/courses/:courseId/lessons`
   - API: `POST /api/files/upload`

7. **Edit Lesson** (`/instructor/courses/:courseId/lessons/:id/edit`)
   - Lesson Form (Pre-filled)
   - API: `PUT /api/courses/:courseId/lessons/:id`

8. **Manage Exams** (`/instructor/exams`)
   - Exams List (by course)
   - Create Exam Button
   - API: `GET /api/exams/course/:courseId`

9. **Create Exam** (`/instructor/exams/create`)
   - Exam Form
   - API: `POST /api/exams`

10. **Exam Questions** (`/instructor/exams/:id/questions`)
    - Questions List
    - Add Question Button
    - API: `GET /api/exam-questions/exam/:examId`
    - API: `POST /api/exam-questions/exam/:examId`

11. **Add Question** (`/instructor/exams/:examId/questions/create`)
    - Question Form
    - API: `POST /api/exam-questions/exam/:examId`

12. **My Groups** (`/instructor/groups`)
    - Groups List
    - Create Group Button
    - API: `GET /api/groups/instructor/:instructorId`

13. **Group Details** (`/instructor/groups/:id`)
    - Group Info
    - Students List
    - Courses List
    - Add Student/Course
    - API: `GET /api/groups/:id`
    - API: `GET /api/groups/:id/students`
    - API: `GET /api/groups/:id/courses`

14. **Earnings** (`/instructor/earnings`)
    - Revenue Chart
    - Payments List
    - API: `GET /api/payments/course/:courseId`

15. **My Subscription** (`/instructor/subscription`)
    - Current Subscription Info
    - Available Packages
    - Subscribe/Renew/Cancel
    - API: `GET /api/subscriptions/instructor/:instructorId`
    - API: `GET /api/subscriptions/packages`
    - API: `POST /api/subscriptions/subscribe`

16. **Profile** (`/instructor/profile`)
    - User Info
    - API: `GET /api/users/:id`
    - API: `PUT /api/users/:id`

---

### 17.4 Admin Pages (Auth Required - Admin Role)

1. **Admin Dashboard** (`/admin`)
   - See Section 16.3

2. **Users Management** (`/admin/users`)
   - Users List (with filters)
   - Search by email
   - Assign/Remove Roles
   - Delete User
   - API: `GET /api/users`
   - API: `GET /api/users/email/:email`
   - API: `PUT /api/users/:id/role`
   - API: `DELETE /api/users/:id`

3. **Courses Management** (`/admin/courses`)
   - All Courses List
   - Search/Filter
   - Edit/Delete
   - API: `GET /api/courses`
   - API: `DELETE /api/courses/:id`

4. **Categories Management** (`/admin/categories`)
   - Categories CRUD (if applicable)
   - Note: No API found in backend, might need to add

5. **Payments Management** (`/admin/payments`)
   - All Payments List
   - Payment Statistics
   - Refund Payment
   - API: `GET /api/payments/statistics`
   - API: `POST /api/payments/:id/refund`

6. **Support Tickets** (`/admin/support`)
   - All Tickets List
   - Assign Ticket
   - Resolve Ticket
   - API: `GET /api/support/tickets`
   - API: `PUT /api/support/tickets/:id/assign/:adminId`
   - API: `PUT /api/support/tickets/:id/resolve`

7. **Subscriptions Management** (`/admin/subscriptions`)
   - Packages List
   - Create/Edit/Delete Package
   - API: `GET /api/subscriptions/packages`
   - API: `POST /api/subscriptions/packages`
   - API: `PUT /api/subscriptions/packages/:id`

8. **Affiliates Management** (`/admin/affiliates`)
   - Affiliates List
   - Process Payout
   - API: `GET /api/affiliates`
   - API: `POST /api/affiliates/:id/payout`

9. **Reports** (`/admin/reports`)
   - Analytics Dashboard
   - Charts and Graphs
   - Export Data

10. **Settings** (`/admin/settings`)
    - System Settings
    - Configuration

---

## 18. Services Structure - هيكل الخدمات

### Services to Create:

1. **AuthService** (`core/services/auth/auth.service.ts`)
   - All authentication methods
   - Token management
   - Device ID management

2. **DashboardService** (`core/services/DashboardService/`)
   - Student, Instructor, Admin dashboard data

3. **UserService** (`core/services/UserService/`)
   - User CRUD operations
   - Phone numbers management
   - Role management

4. **CourseService** (`core/services/CourseService/`)
   - Course CRUD
   - Search, Popular courses
   - Course statistics

5. **LessonService** (`core/services/LectureService/`)
   - Lesson CRUD
   - Mark lesson complete

6. **EnrollmentService** (`core/services/Enrollment/`)
   - Enrollment operations
   - Progress tracking
   - Certificate download

7. **ExamService** (`core/services/QuizService/`)
   - Exam CRUD
   - Submit exam attempt
   - Get exam results

8. **ExamQuestionService** (add to QuizService)
   - Question CRUD

9. **GroupService** (`core/services/GroupService/`)
   - Group CRUD
   - Add/Remove students/courses

10. **PaymentService** (`core/services/Payment/`)
    - Payment processing
    - Payment history
    - Refunds

11. **ReviewService** (create new)
    - Course/Instructor reviews CRUD

12. **SubscriptionService** (create new)
    - Packages CRUD
    - Subscribe/Renew/Cancel

13. **SupportService** (`core/services/Support/`)
    - Ticket CRUD
    - Assign/Resolve tickets

14. **AffiliateService** (`core/services/Affiliates/`)
    - Affiliate operations
    - Commission tracking

15. **FileService** (create new)
    - File upload/download
    - File management

16. **TokenService** (`core/services/TokenService/`)
    - Token storage/retrieval
    - Token refresh

---

## 19. Guards - الحماية

### Existing Guards (verify and update):

1. **AuthGuard** (`core/guards/auth-guard-guard.ts`)
   - Check if user is authenticated
   - Redirect to login if not

2. **AdminGuard** (`core/guards/admin-guard-guard.ts`)
   - Check if user is Admin
   - Redirect if not Admin

3. **InstructorGuard** (`core/guards/instructor-guard-guard.ts`)
   - Check if user is Instructor
   - Redirect if not Instructor

4. **StudentGuard** (`core/guards/student-guard-guard.ts`)
   - Check if user is Student
   - Redirect if not Student

---

## 20. Interceptors - المعالجات

### Existing Interceptors (verify and update):

1. **AuthInterceptor** (`core/interceptors/auth-interceptor.ts`)
   - Add `Authorization: Bearer {token}` header
   - Add `X-Device-Id` header
   - Handle token refresh

2. **ErrorInterceptor** (`core/interceptors/error-interceptor-interceptor.ts`)
   - Handle API errors
   - Redirect to login on 401
   - Show error messages

---

## 21. Environment Configuration

### Create `environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // Adjust based on your backend URL
  deviceId: localStorage.getItem('deviceId') || generateDeviceId()
};
```

---

## 22. Implementation Priority - أولويات التنفيذ

### Phase 1: Core Setup
1. ✅ Environment configuration
2. ✅ Auth Service & Login/Register pages
3. ✅ Guards & Interceptors setup
4. ✅ Token management

### Phase 2: Dashboards
1. ✅ Student Dashboard
2. ✅ Instructor Dashboard
3. ✅ Admin Dashboard

### Phase 3: Course Management
1. ✅ Courses List (Public)
2. ✅ Course Details
3. ✅ Enrollment
4. ✅ Course Content (Lessons)

### Phase 4: Instructor Features
1. ✅ Create/Edit Course
2. ✅ Manage Lessons
3. ✅ Create/Manage Exams
4. ✅ Groups Management

### Phase 5: Student Features
1. ✅ My Courses
2. ✅ Take Exams
3. ✅ View Progress
4. ✅ Certificates

### Phase 6: Admin Features
1. ✅ Users Management
2. ✅ Payments Management
3. ✅ Support Tickets
4. ✅ Reports

### Phase 7: Additional Features
1. ✅ Reviews
2. ✅ Subscriptions
3. ✅ Affiliates
4. ✅ File Upload

---

## 23. Notes & Best Practices

1. **Pagination**: All list APIs support pagination - implement pagination in UI
2. **Error Handling**: Use ErrorInterceptor to handle all API errors consistently
3. **Loading States**: Show loading indicators for async operations
4. **Toast Notifications**: Use Angular Material Snackbar for success/error messages
5. **File Upload**: Use FormData for file uploads
6. **PDF Download**: Use blob response type for certificate download
7. **Device ID**: Store device ID in localStorage and reuse it
8. **Token Refresh**: Implement automatic token refresh before expiration
9. **Role-Based Routing**: Use guards to protect routes based on user roles
10. **Responsive Design**: Make all pages responsive (mobile-friendly)

---

## 24. API Base URL

Set the base URL in `environment.ts`:
```typescript
apiUrl: 'http://localhost:5000/api' // Change to your backend URL
```

---

## تم!

هذه هي الخطة الشاملة لبناء الفرونت اند. كل endpoint وكل dashboard وكل صفحة موضحة بالتفصيل.

ابدأ بالتنفيذ حسب الأولويات المذكورة في Phase 1, 2, 3... إلخ.

Good Luck! 🚀

