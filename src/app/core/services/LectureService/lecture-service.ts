import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  LessonDto,
  LessonCreateDto,
  PagedResult
} from '../../interfaces/lesson.interface';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get all lessons for a course with pagination
   */
  getLessonsByCourse(courseId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<LessonDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(
      `${this.apiUrl}/courses/${courseId}/lessons`,
      { params }
    ).pipe(
      map(response => ({
        items: response.data || response.items || [],
        totalCount: response.totalRecords || response.totalCount || 0,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      }))
    );
  }

  /**
   * Get lesson by ID
   */
  getLessonById(courseId: string, lessonId: string): Observable<LessonDto> {
    return this.http.get<LessonDto>(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}`);
  }

  /**
   * Add lesson to course (Instructor or Admin)
   */
  addLesson(courseId: string, data: LessonCreateDto): Observable<LessonDto> {
    return this.http.post<LessonDto>(`${this.apiUrl}/courses/${courseId}/lessons`, data);
  }

  /**
   * Update lesson (Instructor or Admin)
   */
  updateLesson(courseId: string, lessonId: string, data: LessonCreateDto): Observable<LessonDto> {
    return this.http.put<LessonDto>(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}`, data);
  }

  /**
   * Delete lesson (Instructor or Admin)
   */
  deleteLesson(courseId: string, lessonId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}`);
  }

  /**
   * Mark lesson as complete for current student (Student or Admin)
   */
  markLessonAsComplete(courseId: string, lessonId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/lessons/${lessonId}/complete`, {});
  }
}
