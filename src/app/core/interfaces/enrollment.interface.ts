// Enrollment Interfaces based on Backend DTOs

export interface EnrollmentDto {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  courseName?: string;
  progressPercentage: number;
  enrollmentDate: string; // ISO date string
  completedAt?: string; // ISO date string
  isCompleted: boolean;
}

export interface EnrollmentCreateDto {
  studentId: string;
  courseId: string;
}

// Generic paged result used by enrollment endpoints
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

