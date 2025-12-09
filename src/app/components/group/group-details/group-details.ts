import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../core/services/GroupService/group-service';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { GroupDto } from '../../../core/interfaces/group.interface';
import { CourseDto } from '../../../core/interfaces/course.interface';
import { UserDto } from '../../../core/interfaces/i-user';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-details.html',
  styleUrl: './group-details.scss',
})
export class GroupDetails implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _groupService = inject(GroupService);
  private readonly _courseService = inject(CourseService);

  groupId = signal<string | null>(null);
  group = signal<GroupDto | null>(null);
  students = signal<UserDto[]>([]);
  courses = signal<CourseDto[]>([]);
  availableCourses = signal<CourseDto[]>([]);
  selectedCourseId = signal<string | null>(null);
  newStudentEmail = signal<string>('');
  showAddCourse = signal<boolean>(false);
  showAddStudent = signal<boolean>(false);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  removing = signal<string | null>(null);
  adding = signal<boolean>(false);
  private readonly _tokenService = inject(TokenService);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.groupId.set(id);
      this.loadGroupDetails(id);
      this.loadStudents(id);
      this.loadCourses(id);
    }
  }

  loadGroupDetails(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._groupService.getGroupById(id).subscribe({
      next: (group) => {
        this.group.set(group);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading group:', err);
        this.error.set(err.message || 'Failed to load group');
        this.loading.set(false);
      },
    });
  }

  loadStudents(groupId: string): void {
    this._groupService.getGroupStudents(groupId).subscribe({
      next: (students) => {
        this.students.set(students);
        // Update group's studentsCount if group exists
        const g = this.group();
        if (g) {
          g.studentsCount = this.students().length;
          this.group.set(g);
        }
      },
      error: (err) => {
        console.error('Error loading students:', err);
      },
    });
  }

  loadCourses(groupId: string): void {
    this._groupService.getCoursesByGroupId(groupId).subscribe({
      next: (courses) => {
        this.courses.set(courses);
        // Update group's coursesCount if group exists
        const g = this.group();
        if (g) {
          g.coursesCount = this.courses().length;
          this.group.set(g);
        }
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      },
    });
  }

  loadAvailableCourses(): void {
    // Load instructor courses and filter out those already in the group
    const user = this._tokenService.getUser();
    if (!user || !user.userId) return;

    this._courseService.getCoursesByInstructor(user.userId).subscribe({
      next: (result: any) => {
        let items: CourseDto[] = [];
        if (Array.isArray(result)) items = result;
        else if (Array.isArray(result.items)) items = result.items;
        else if (Array.isArray(result.data)) items = result.data;

        // Exclude courses already in group
        const existingIds = new Set(this.courses().map((c) => c.courseId));
        const available = items.filter((c) => !existingIds.has(c.courseId));
        this.availableCourses.set(available);
      },
      error: (err) => {
        console.error('Error loading instructor courses:', err);
      },
    });
  }

  removeStudent(studentId: string): void {
    const groupId = this.groupId();
    if (!groupId) return;

    if (!confirm('Are you sure you want to remove this student from the group?')) {
      return;
    }

    this.removing.set(studentId);

    this._groupService.removeStudentFromGroup(groupId, studentId).subscribe({
      next: () => {
        this.students.set(this.students().filter((s) => s.userId !== studentId));
        this.removing.set(null);
      },
      error: (err) => {
        console.error('Error removing student:', err);
        this.error.set(err.message || 'Failed to remove student');
        this.removing.set(null);
      },
    });
  }

  removeCourse(courseId: string): void {
    const groupId = this.groupId();
    if (!groupId) return;

    if (!confirm('Are you sure you want to remove this course from the group?')) {
      return;
    }

    this.removing.set(courseId);

    this._groupService.removeCourseFromGroup(groupId, courseId).subscribe({
      next: () => {
        this.courses.set(this.courses().filter((c) => c.courseId !== courseId));
        this.removing.set(null);
      },
      error: (err) => {
        console.error('Error removing course:', err);
        this.error.set(err.message || 'Failed to remove course');
        this.removing.set(null);
      },
    });
  }

  addCourse(): void {
    const groupId = this.groupId();
    const courseId = this.selectedCourseId();
    if (!groupId || !courseId) return;

    this.adding.set(true);
    this._groupService.addCourseToGroup(groupId, courseId).subscribe({
      next: () => {
        // refresh courses and available list
        this.loadCourses(groupId);
        this.loadAvailableCourses();
        this.selectedCourseId.set(null);
        this.showAddCourse.set(false);
        this.adding.set(false);
      },
      error: (err) => {
        console.error('Error adding course to group:', err);
        this.error.set(err.message || 'Failed to add course');
        this.adding.set(false);
      },
    });
  }

  addStudent(): void {
    const groupId = this.groupId();
    const email = this.newStudentEmail().trim();
    if (!groupId || !email) return;

    this.adding.set(true);
    // The API requires studentId. Try to add using provided value (allow instructor to paste ID or email if backend accepts it).
    const maybeId = email;
    this._groupService.addStudentToGroup(groupId, maybeId).subscribe({
      next: () => {
        this.loadStudents(groupId);
        this.newStudentEmail.set('');
        this.showAddStudent.set(false);
        this.adding.set(false);
      },
      error: (err) => {
        console.error('Error adding student to group:', err);
        this.error.set(err.message || 'Failed to add student. Ensure the ID/email is correct.');
        this.adding.set(false);
      },
    });
  }

  toggleShowAddCourse(): void {
    const next = !this.showAddCourse();
    this.showAddCourse.set(next);
    if (next) this.loadAvailableCourses();
  }

  toggleShowAddStudent(): void {
    this.showAddStudent.set(!this.showAddStudent());
  }

  goBack(): void {
    const isAdminRoute = this._router.url.includes('/admin');
    const basePath = isAdminRoute ? '/admin/groups' : '/instructor/groups';
    this._router.navigate([basePath]);
  }
}
