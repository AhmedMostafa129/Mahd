// Course Interfaces based on Backend DTOs

export enum CourseVisibility {
  Public = 0,
  Private = 1
}

export interface CourseDto {
  courseId: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName?: string;
  price: number;
  popular: boolean;
  visibility: CourseVisibility;
  isPublished?: boolean; // Add isPublished property
  enrollmentCount: number;
  lessonsCount: number;
  averageRating: number;
  thumbnailUrl?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface CreateCourseDto {
  title: string;
  description: string;
  instructorId?: string; // Optional, will be set from current user if not provided
  price: number;
  thumbnailUrl?: string;
  popular?: boolean;
  visibility?: CourseVisibility;
}

export interface UpdateCourseDto {
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  popular?: boolean;
  visibility?: CourseVisibility;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

