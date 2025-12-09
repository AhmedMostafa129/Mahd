import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ForgetPassword } from './components/auth/forget-password/forget-password';
import { ResetPassword } from './components/auth/reset-password/reset-password';
import { VerifyEmail } from './components/auth/verify-email/verify-email';
import { Home } from './components/pages/home/home';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { UsersManagement } from './components/admin/users-management/users-management';
import { CoursesManagement } from './components/admin/courses-management/courses-management';
import { PaymentsManagement } from './components/admin/payments-management/payments-management';
import { SupportManagement } from './components/admin/support-management/support-management';
import { SubscriptionsManagement } from './components/admin/subscriptions-management/subscriptions-management';
import { AffiliatesManagement } from './components/admin/affiliates-management/affiliates-management';
import { Reports } from './components/admin/reports/reports';
import { StudentDashboard } from './components/student/student-dashboard/student-dashboard';
import { MyCourses } from './components/student/my-courses/my-courses';
import { MyCertificates } from './components/student/my-certificates/my-certificates';
import { ProgressTracking } from './components/student/progress-tracking/progress-tracking';
import { QuizStart } from './components/quizzes/quiz-start/quiz-start';
import { QuizResult } from './components/quizzes/quiz-result/quiz-result';
import { StudentPayments } from './components/student/payments/payments';
import { StudentProfile } from './components/student/profile/profile';
import { StudentSupport } from './components/student/support/support';
import { InstructorDashboard } from './components/instructor/instructor-dashboard/instructor-dashboard';
import { InstructorMyCourses } from './components/instructor/my-courses/my-courses';
import { CreateCourse } from './components/instructor/create-course/create-course';
import { EditCourse } from './components/instructor/edit-course/edit-course';
import { ManageContent } from './components/instructor/manage-content/manage-content';
import { UploadLecture } from './components/instructor/upload-lecture/upload-lecture';
import { ManageAssignments } from './components/instructor/manage-assignments/manage-assignments';
import { CreateExam } from './components/instructor/create-exam/create-exam';
import { MyExams } from './components/instructor/my-exams/my-exams';
import { EditExam } from './components/instructor/edit-exam/edit-exam';
import { QuizQuestions } from './components/quizzes/quiz-questions/quiz-questions';
import { ManageGroups } from './components/instructor/manage-groups/manage-groups';
import { GroupDetails } from './components/group/group-details/group-details';
import { GroupForm } from './components/group/group-form/group-form';
import { Earnings } from './components/instructor/earnings/earnings';
import { InstructorSubscription } from './components/instructor/subscription/subscription';
import { InstructorProfile } from './components/instructor/profile/profile';
import { CoursesList } from './components/courses/courses-list/courses-list';
import { CourseDetails } from './components/courses/course-details/course-details';
import { CourseContent } from './components/courses/course-content/course-content';
import { InstructorProfileComponent } from './components/instructor/instructor-profile/instructor-profile';
import { studentGuardGuard } from './core/guards/student-guard-guard';
import { instructorGuardGuard } from './core/guards/instructor-guard-guard';
import { adminGuardGuard } from './core/guards/admin-guard-guard';
import { authGuardGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  // Public Routes
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgetPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'courses', component: CoursesList },
  { path: 'courses/:id', component: CourseDetails },
  { path: 'courses/:id/content', component: CourseContent, canActivate: [authGuardGuard] },
  { path: 'profile/:id', component: InstructorProfileComponent },

  // Admin Routes
  { path: 'admin/courses', component: CoursesManagement, canActivate: [adminGuardGuard] },
  { path: 'admin/payments', component: PaymentsManagement, canActivate: [adminGuardGuard] },
  { path: 'admin/support', component: SupportManagement, canActivate: [adminGuardGuard] },
  { path: 'admin/subscriptions', component: SubscriptionsManagement, canActivate: [adminGuardGuard] },
  { path: 'admin/affiliates', component: AffiliatesManagement, canActivate: [adminGuardGuard] },
  { path: 'admin/reports', component: Reports, canActivate: [adminGuardGuard] },
  //{ path: 'admin/groups', component: GroupList, canActivate: [adminGuardGuard] }, 
  { path: 'admin/groups/:id', component: GroupDetails, canActivate: [adminGuardGuard] },

  // Student Routes
  { path: 'student', component: StudentDashboard, canActivate: [studentGuardGuard] },
  { path: 'student/my-courses', component: MyCourses, canActivate: [studentGuardGuard] },
  { path: 'student/my-certificates', component: MyCertificates, canActivate: [studentGuardGuard] },
  { path: 'student/progress/:enrollmentId', component: ProgressTracking, canActivate: [studentGuardGuard] },
  { path: 'student/exams/:examId', component: QuizStart, canActivate: [studentGuardGuard] },
  { path: 'student/exams/attempts/:attemptId', component: QuizResult, canActivate: [studentGuardGuard] },
  { path: 'student/payments', component: StudentPayments, canActivate: [studentGuardGuard] },
  { path: 'student/profile', component: StudentProfile, canActivate: [studentGuardGuard] },
  { path: 'student/support', component: StudentSupport, canActivate: [studentGuardGuard] },

  // Instructor Routes
  { path: 'instructor', component: InstructorDashboard, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses', component: InstructorMyCourses, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses/create', component: CreateCourse, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses/:id', redirectTo: 'instructor/courses/:id/content', pathMatch: 'full' },
  { path: 'instructor/courses/:id/edit', component: EditCourse, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses/:id/content', component: ManageContent, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses/:courseId/lessons/create', component: UploadLecture, canActivate: [instructorGuardGuard] },
  { path: 'instructor/courses/:courseId/lessons/:lessonId/edit', component: UploadLecture, canActivate: [instructorGuardGuard] },
  { path: 'instructor/exams', component: MyExams, canActivate: [instructorGuardGuard] },
  { path: 'instructor/exams/create', component: CreateExam, canActivate: [instructorGuardGuard] },
  { path: 'instructor/exams/:id/edit', component: EditExam, canActivate: [instructorGuardGuard] },
  { path: 'instructor/exams/:id/questions', component: QuizQuestions, canActivate: [instructorGuardGuard] },
  { path: 'instructor/groups', component: ManageGroups, canActivate: [instructorGuardGuard] },
  { path: 'instructor/groups/create', component: GroupForm, canActivate: [instructorGuardGuard] },
  { path: 'instructor/groups/:id', component: GroupDetails, canActivate: [instructorGuardGuard] },
  { path: 'instructor/groups/:id/edit', component: GroupForm, canActivate: [instructorGuardGuard] },
  { path: 'instructor/earnings', component: Earnings, canActivate: [instructorGuardGuard] },
  { path: 'instructor/subscription', component: InstructorSubscription, canActivate: [instructorGuardGuard] },
  { path: 'instructor/profile', component: InstructorProfile, canActivate: [instructorGuardGuard] },
];
