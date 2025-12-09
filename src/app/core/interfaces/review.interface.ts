// Review interfaces based on backend DTOs

export interface CourseReviewDto {
  reviewId: string;
  courseId: string;
  studentId: string;
  studentName?: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
}

export interface InstructorReviewDto {
  reviewId: string;
  instructorId: string;
  studentId: string;
  studentName?: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
}

export interface CourseReviewCreateDto {
  courseId: string;
  studentId: string;
  rating: number;
  comment: string;
}

export interface InstructorReviewCreateDto {
  instructorId: string;
  studentId: string;
  rating: number;
  comment: string;
}

export interface ReviewUpdateDto {
  rating?: number;
  comment?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

