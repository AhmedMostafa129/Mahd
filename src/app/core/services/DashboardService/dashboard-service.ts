import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StudentDashboardDto,
  InstructorDashboardDto,
  AdminDashboardDto
} from '../../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get student dashboard data
   */
  getStudentDashboard(studentId: string): Observable<StudentDashboardDto> {
    return this.http.get<StudentDashboardDto>(
      `${this.apiUrl}/dashboard/student/${studentId}`
    );
  }

  /**
   * Get instructor dashboard data
   */
  getInstructorDashboard(instructorId: string): Observable<InstructorDashboardDto> {
    const url = `${this.apiUrl}/dashboard/instructor/${instructorId}`;
    console.log('📊 Dashboard Service:', {
      apiUrl: this.apiUrl,
      fullUrl: url,
      instructorId
    });
    return this.http.get<InstructorDashboardDto>(url);
  }

  /**
   * Get admin dashboard data
   */
  getAdminDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(
      `${this.apiUrl}/dashboard/admin`
    );
  }
}

