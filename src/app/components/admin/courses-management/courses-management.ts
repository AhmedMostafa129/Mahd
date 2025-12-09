import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { CourseDto, PagedResult } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-courses-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-management.html',
  styleUrl: './courses-management.scss',
})
export class CoursesManagement implements OnInit {
  private readonly _adminService = inject(AdminService);

  courses = signal<CourseDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this._adminService.getAllCourses(page, this.pageSize()).subscribe({
      next: (result: PagedResult<CourseDto>) => {
        this.courses.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadCourses(page);
  }

  deleteCourse(courseId: string): void {
    if (!confirm('Are you sure you want to delete this course?')) return;

    this._adminService.deleteCourse(courseId).subscribe({
      next: () => {
        this.loadCourses(this.pageNumber());
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        this.error.set(err.message || 'Failed to delete course');
      },
    });
  }
}
