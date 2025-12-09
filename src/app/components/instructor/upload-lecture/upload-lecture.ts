import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../core/services/LectureService/lecture-service';
import { FileService } from '../../../core/services/FileService/file-service';
import { LessonCreateDto, LessonContentType } from '../../../core/interfaces/lesson.interface';

@Component({
  selector: 'app-upload-lecture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-lecture.html',
  styleUrl: './upload-lecture.scss',
})
export class UploadLecture implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _lessonService = inject(LessonService);
  private readonly _fileService = inject(FileService);

  courseId = signal<string | null>(null);
  lessonId = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);

  // File upload state
  selectedFile = signal<File | null>(null);
  uploadInProgress = signal<boolean>(false);
  uploadError = signal<string | null>(null);
  previewUrl = signal<string | null>(null);

  // Form data
  lessonData: LessonCreateDto = {
    title: '',
    contentType: LessonContentType.Video,
    durationMinutes: 0,
    contentUrl: '',
  };

  // Content type options
  contentTypeOptions = [
    { value: LessonContentType.Video, label: 'Video' },
    { value: LessonContentType.LiveSession, label: 'Live Session' },
    { value: LessonContentType.PdfSummary, label: 'PDF Summary' },
    { value: LessonContentType.EBook, label: 'E-Book' },
    { value: LessonContentType.Quiz, label: 'Quiz' },
  ];

  ngOnInit(): void {
    const courseId = this._route.snapshot.paramMap.get('courseId');
    const lessonId = this._route.snapshot.paramMap.get('lessonId');

    if (courseId) {
      this.courseId.set(courseId);
    }

    if (lessonId) {
      this.lessonId.set(lessonId);
      this.isEditMode.set(true);
      this.loadLesson(courseId!, lessonId);
    }
  }

  loadLesson(courseId: string, lessonId: string): void {
    this.loading.set(true);
    this._lessonService.getLessonById(courseId, lessonId).subscribe({
      next: (lesson) => {
        this.lessonData = {
          title: lesson.title,
          contentType: lesson.contentType,
          durationMinutes: lesson.durationMinutes,
          contentUrl: lesson.contentUrl || '',
        };
        // If the stored contentUrl is a file id, build a preview URL for the video/pdf
        if (lesson.contentUrl) {
          // Try to use FileService to build a preview URL, fallback to stored value
          try {
            this.previewUrl.set(this._fileService.getFileUrl(lesson.contentUrl));
          } catch {
            this.previewUrl.set(lesson.contentUrl);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading lesson:', err);
        this.error.set(err.message || 'Failed to load lesson');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (!this.validateForm() || !this.courseId()) {
      return;
    }

    // If a file is selected but not yet uploaded, upload first.
    if (this.selectedFile() && !this.previewUrl()) {
      this.uploadSelectedFile().then((ok) => {
        if (!ok) {
          this.submitting.set(false);
          return;
        }
        this.submitLessonPayload();
      });
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const courseId = this.courseId()!;

    // Strict typing for payload
    this.lessonData.durationMinutes = Number(this.lessonData.durationMinutes);
    this.lessonData.contentType = Number(this.lessonData.contentType);

    if (this.isEditMode() && this.lessonId()) {
      // Update existing lesson
      this._lessonService.updateLesson(courseId, this.lessonId()!, this.lessonData).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/courses', courseId, 'content']);
        },
        error: (err) => {
          console.error('Error updating lesson:', err);
          this.error.set(err.message || 'Failed to update lesson');
          this.submitting.set(false);
        },
      });
    } else {
      // Create new lesson
      this._lessonService.addLesson(courseId, this.lessonData).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/courses', courseId, 'content']);
        },
        error: (err) => {
          console.error('Error creating lesson:', err);
          this.error.set(err.message || 'Failed to create lesson');
          this.submitting.set(false);
        },
      });
    }
  }

  private submitLessonPayload(): void {
    const courseId = this.courseId()!;
    // Strict typing for payload
    this.lessonData.durationMinutes = Number(this.lessonData.durationMinutes);
    this.lessonData.contentType = Number(this.lessonData.contentType);

    if (this.isEditMode() && this.lessonId()) {
      this._lessonService.updateLesson(courseId, this.lessonId()!, this.lessonData).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/courses', courseId, 'content']);
        },
        error: (err) => {
          console.error('Error updating lesson:', err);
          this.error.set(err.message || 'Failed to update lesson');
          this.submitting.set(false);
        },
      });
    } else {
      this._lessonService.addLesson(courseId, this.lessonData).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/courses', courseId, 'content']);
        },
        error: (err) => {
          console.error('Error creating lesson:', err);
          this.error.set(err.message || 'Failed to create lesson');
          this.submitting.set(false);
        },
      });
    }
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile.set(null);
      return;
    }
    const f = input.files[0];
    this.selectedFile.set(f);
    // Clear previous errors/preview
    this.uploadError.set(null);
    this.previewUrl.set(null);
  }

  async uploadSelectedFile(): Promise<boolean> {
    const file = this.selectedFile();
    if (!file || !this.courseId()) {
      this.uploadError.set('No file selected or missing course context');
      return false;
    }

    this.uploadInProgress.set(true);
    this.uploadError.set(null);

    return new Promise<boolean>((resolve) => {
      this._fileService.uploadFile(file, 'lesson', this.courseId()!).subscribe({
        next: (res) => {
          // Use returned fileId for saving, and build preview URL for display
          if (res?.file) {
            const fileId = res.file.fileId;
            this.lessonData.contentUrl = fileId;
            try {
              this.previewUrl.set(this._fileService.getFileUrl(fileId));
            } catch {
              this.previewUrl.set(res.file.fileUrl || '');
            }
          }
          this.uploadInProgress.set(false);
          resolve(true);
        },
        error: (err) => {
          console.error('File upload error:', err);
          this.uploadError.set(err?.message || 'Upload failed');
          this.uploadInProgress.set(false);
          resolve(false);
        },
      });
    });
  }

  private validateForm(): boolean {
    if (!this.lessonData.title.trim()) {
      this.error.set('Lesson title is required');
      return false;
    }
    if (this.lessonData.durationMinutes < 0) {
      this.error.set('Duration must be greater than or equal to 0');
      return false;
    }
    return true;
  }

  cancel(): void {
    const courseId = this.courseId();
    if (courseId) {
      this._router.navigate(['/instructor/courses', courseId, 'content']);
    } else {
      this._router.navigate(['/instructor/courses']);
    }
  }
}
