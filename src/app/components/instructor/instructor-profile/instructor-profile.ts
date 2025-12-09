import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDto } from '../../../core/interfaces/course.interface';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { InstructorService } from '../../../core/services/InstructorService/instructor-service';
import { ReviewService } from '../../../core/services/ReviewService/review-service';
import { InstructorDto } from '../../../core/interfaces/instructor.interface';
import { InstructorReviewDto } from '../../../core/interfaces/review.interface';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-instructor-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './instructor-profile.html',
    styleUrl: './instructor-profile.scss'
})
export class InstructorProfileComponent implements OnInit {
    private readonly _route = inject(ActivatedRoute);
    private readonly _courseService = inject(CourseService);
    private readonly _instructorService = inject(InstructorService);
    private readonly _reviewService = inject(ReviewService);

    publicInstructor = signal<InstructorDto | null>(null);
    courses = signal<CourseDto[]>([]);
    reviews = signal<InstructorReviewDto[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProfile(id);
        } else {
            this.error.set('Instructor ID not found');
            this.loading.set(false);
        }
    }

    loadProfile(instructorId: string): void {
        this.loading.set(true);
        // Load public instructor profile (bio/photo) - public endpoint
        this._instructorService.getPublicInstructor(instructorId).subscribe({
            next: (ins) => {
                this.publicInstructor.set(ins);

                // load courses and reviews
                this.loadCourses(instructorId);
                this.loadReviews(instructorId);
            },
            error: (err) => {
                console.error('Error loading public instructor:', err);
                this.error.set('Failed to load instructor profile');
                this.loading.set(false);
            }
        });
    }

    loadReviews(instructorId: string): void {
        // Request a larger page size so we show all reviews (backend is paged).
        // If there are many reviews consider adding pagination or lazy loading.
        this._reviewService.getInstructorReviews(instructorId, 1, 1000).subscribe({
            next: (paged) => {
                this.reviews.set(paged.items || []);
            },
            error: (err) => {
                console.error('Error loading instructor reviews:', err);
            }
        });
    }

    loadCourses(instructorId: string): void {
        this._courseService.getCoursesByInstructor(instructorId).subscribe({
            next: (result) => {
                // Handle PagedResult
                if (Array.isArray(result)) {
                    this.courses.set(result);
                } else {
                    this.courses.set(result.items || []);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading courses:', err);
                // Don't fail the whole profile if courses fail, just show empty or error in course section
                this.loading.set(false);
            }
        });
    }
}
