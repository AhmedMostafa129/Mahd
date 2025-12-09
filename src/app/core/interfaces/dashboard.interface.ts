// Dashboard Interfaces based on Backend DTOs

export interface StudentDashboardDto {
  studentId: string;
  studentName: string;
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  recentEnrollments: EnrollmentSummaryDto[];
  upcomingExams: UpcomingExamDto[];
}

export interface InstructorDashboardDto {
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

export interface AdminDashboardDto {
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

// Supporting DTOs
export interface EnrollmentSummaryDto {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  progressPercentage: number;
  enrollmentDate: string; // ISO date string
}

export interface UpcomingExamDto {
  examId: string;
  examTitle: string;
  courseTitle: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  durationMinutes: number;
}

export interface CourseSummaryDto {
  courseId: string;
  title: string;
  enrollmentCount: number;
  revenue: number;
  averageRating: number;
}

export interface RevenueByMonthDto {
  year: number;
  month: number;
  revenue: number;
}

export interface UserGrowthDto {
  year: number;
  month: number;
  newUsers: number;
}

export interface TopInstructorDto {
  instructorId: string;
  instructorName: string;
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

export interface TopCourseDto {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrollmentCount: number;
  revenue: number;
  averageRating: number;
}

