import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { CourseDto, UpdateCourseDto, CourseVisibility } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.scss',
})
export class EditCourse implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _courseService = inject(CourseService);

  // Form data
  courseData: UpdateCourseDto = {
    title: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    popular: false,
    visibility: CourseVisibility.Public
  };

  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);
  courseId = signal<string | null>(null);

  // Visibility options
  visibilityOptions = [
    { value: CourseVisibility.Public, label: 'Public' },
    { value: CourseVisibility.Private, label: 'Private' }
  ];

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.loadCourse(id);
    }
  }

  loadCourse(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseData = {
          title: course.title,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl || '',
          popular: course.popular,
          visibility: course.visibility
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error.set(err.message || 'Failed to load course');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm() || !this.courseId()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this._courseService.updateCourse(this.courseId()!, this.courseData).subscribe({
      next: (course) => {
        this.submitting.set(false);
        this._router.navigate(['/instructor/courses', course.courseId]);
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.error.set(err.message || 'Failed to update course');
        this.submitting.set(false);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.courseData.title.trim()) {
      this.error.set('Course title is required');
      return false;
    }
    if (!this.courseData.description.trim()) {
      this.error.set('Course description is required');
      return false;
    }
    if (this.courseData.price < 0) {
      this.error.set('Price must be greater than or equal to 0');
      return false;
    }
    return true;
  }

  cancel(): void {
    const id = this.courseId();
    if (id) {
      this._router.navigate(['/instructor/courses', id]);
    } else {
      this._router.navigate(['/instructor/courses']);
    }
  }
}

