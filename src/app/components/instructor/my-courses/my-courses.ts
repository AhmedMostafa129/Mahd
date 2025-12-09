import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CourseDto, PagedResult } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-instructor-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class InstructorMyCourses implements OnInit {
  private readonly _courseService = inject(CourseService);
  private readonly _tokenService = inject(TokenService);
  private readonly _router = inject(Router);

  courses = signal<CourseDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  // Stats
  totalStudents = signal<number>(0);
  activeCourses = signal<number>(0);
  totalEarnings = signal<number>(0); // Placeholder for now

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(page: number = 1): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._courseService.getCoursesByInstructor(user.userId, page, this.pageSize()).subscribe({
      next: (result: PagedResult<CourseDto>) => {
        this.courses.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);

        // Calculate stats
        this.calculateStats(result.items);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      },
    });
  }

  calculateStats(courses: CourseDto[]): void {
    if (!courses || !Array.isArray(courses)) {
      console.warn('Invalid courses data for stats:', courses);
      this.totalStudents.set(0);
      this.activeCourses.set(0);
      return;
    }

    const currentStudents = courses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);
    this.totalStudents.set(currentStudents);

    const active = courses.filter(c => c.isPublished).length;
    this.activeCourses.set(active);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadCourses(page);
  }

  navigateToCreateCourse(): void {
    this._router.navigate(['/instructor/courses/create']);
  }

  navigateToEditCourse(courseId: string): void {
    this._router.navigate(['/instructor/courses', courseId, 'edit']);
  }

  navigateToCourse(courseId: string): void {
    this._router.navigate(['/instructor/courses', courseId]);
  }

  togglePublishStatus(course: CourseDto, event: Event): void {
    event.stopPropagation();
    const newState = !course.isPublished;
    const action = newState ? 'Publish' : 'Unpublish';
    
    if (!confirm(`Are you sure you want to ${action} "${course.title}"?`)) return;

    const observable = newState 
      ? this._courseService.publishCourse(course.courseId)
      : this._courseService.unpublishCourse(course.courseId);

    observable.subscribe({
      next: () => {
        this.courses.update(courses => 
          courses.map(c => 
            c.courseId === course.courseId 
              ? { ...c, isPublished: newState } 
              : c
          )
        );
        this.calculateStats(this.courses());
      },
      error: (err) => {
        console.error(`Error ${action}ing course:`, err);
        alert(`Failed to ${action} course`);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

