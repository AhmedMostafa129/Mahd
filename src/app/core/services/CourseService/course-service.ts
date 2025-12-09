import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  PagedResult
} from '../../interfaces/course.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get all courses with pagination (Public)
   */
  getAllCourses(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<CourseDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/courses`, { params }).pipe(
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
   * Get course by ID (Public)
   */
  getCourseById(id: string): Observable<CourseDto> {
    return this.http.get<CourseDto>(`${this.apiUrl}/courses/${id}`);
  }

  /**
   * Get courses by instructor with pagination
   */
  getCoursesByInstructor(instructorId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<CourseDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(
      `${this.apiUrl}/courses/instructor/${instructorId}`,
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
   * Get popular courses
   */
  getPopularCourses(count: number = 10): Observable<CourseDto[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<CourseDto[]>(`${this.apiUrl}/courses/popular`, { params });
  }

  /**
   * Search courses with pagination
   */
  searchCourses(query: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<CourseDto>> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/courses/search`, { params }).pipe(
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
   * Create course (Instructor or Admin)
   */
  createCourse(data: CreateCourseDto): Observable<CourseDto> {
    return this.http.post<CourseDto>(`${this.apiUrl}/courses`, data);
  }

  /**
   * Update course (Instructor own course or Admin)
   */
  updateCourse(id: string, data: UpdateCourseDto): Observable<CourseDto> {
    return this.http.put<CourseDto>(`${this.apiUrl}/courses/${id}`, data);
  }

  /**
   * Delete course (Instructor own course or Admin)
   */
  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  /**
   * Get course statistics (Instructor own course or Admin)
   */
  getCourseStatistics(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}/statistics`);
  }

  /**
   * Publish course (Instructor own course or Admin)
   */
  publishCourse(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${id}/publish`, {});
  }

  /**
   * Unpublish course (Instructor own course or Admin)
   */
  unpublishCourse(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${id}/unpublish`, {});
  }
}
