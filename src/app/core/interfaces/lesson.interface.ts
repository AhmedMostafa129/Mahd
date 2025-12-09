// Lesson Interfaces based on Backend DTOs

export enum LessonContentType {
  Video = 0,
  LiveSession = 1,
  PdfSummary = 2,
  EBook = 3,
  Quiz = 4
}

export interface LessonDto {
  lessonId: string;
  title: string;
  contentType: LessonContentType;
  courseId: string;
  durationMinutes: number;
  contentUrl?: string;
  createdAt: string; // ISO date string
}

export interface LessonCreateDto {
  title: string;
  contentType: LessonContentType;
  durationMinutes: number;
  contentUrl?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

