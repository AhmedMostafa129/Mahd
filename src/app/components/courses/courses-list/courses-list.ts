import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { CourseDto, PagedResult } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
})
export class CoursesList implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _courseService = inject(CourseService);

  // Data
  courses = signal<CourseDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Pagination
  pageNumber = signal<number>(1);
  pageSize = signal<number>(12);
  totalCount = signal<number>(0);
  totalPages = signal<number>(0);

  // Search & Filter
  searchQuery = signal<string>('');
  searchTerm = '';

  ngOnInit(): void {
    // Check if there's a search query in route params
    this._route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
        this.searchQuery.set(params['q']);
        this.searchCourses();
      } else {
        this.loadCourses();
      }
    });
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);

    this._courseService.getAllCourses(this.pageNumber(), this.pageSize()).subscribe({
      next: (result: PagedResult<CourseDto>) => {
        this.courses.set(result.items);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      }
    });
  }

  searchCourses(): void {
    if (!this.searchTerm.trim()) {
      this.loadCourses();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.searchQuery.set(this.searchTerm);

    this._courseService.searchCourses(this.searchTerm, this.pageNumber(), this.pageSize()).subscribe({
      next: (result: PagedResult<CourseDto>) => {
        this.courses.set(result.items);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);

        // Update URL with search query
        this._router.navigate([], {
          relativeTo: this._route,
          queryParams: { q: this.searchTerm },
          queryParamsHandling: 'merge'
        });
      },
      error: (err) => {
        console.error('Error searching courses:', err);
        this.error.set(err.message || 'Failed to search courses');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.pageNumber.set(1);
    this.searchCourses();
  }

  onPageChange(page: number): void {
    this.pageNumber.set(page);
    if (this.searchQuery()) {
      this.searchCourses();
    } else {
      this.loadCourses();
    }
    window.scrollTo(0, 0);
  }

  navigateToCourse(courseId: string): void {
    this._router.navigate(['/courses', courseId]);
  }

  navigateToProfile(instructorId: string | undefined | null, event?: Event): void {
    if (!instructorId) return;
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this._router.navigate(['/profile', instructorId]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  }
}
