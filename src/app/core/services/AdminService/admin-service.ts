import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from '../../interfaces/i-user';
import { CourseDto, PagedResult as CoursePagedResult } from '../../interfaces/course.interface';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Users
  getAllUsers(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<UserDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<UserDto>>(`${this.apiUrl}/users`, { params });
  }

  getUserByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/users/email/${email}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Courses (for admin courses management)
  getAllCourses(pageNumber: number = 1, pageSize: number = 10): Observable<CoursePagedResult<CourseDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<CoursePagedResult<CourseDto>>(`${this.apiUrl}/courses`, { params });
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }
}
