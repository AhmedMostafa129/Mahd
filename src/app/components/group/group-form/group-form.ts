import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../core/services/GroupService/group-service';
import { TokenService } from '../../../core/services/TokenService/token-service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './group-form.html',
  styleUrl: './group-form.scss'
})
export class GroupForm implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _groupService = inject(GroupService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _tokenService = inject(TokenService);

  groupForm: FormGroup;
  isEditMode = signal<boolean>(false);
  submitting = signal<boolean>(false);
  groupId: string | null = null;

  constructor() {
    this.groupForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.groupId = id;
      this.loadGroupData(id);
    }
  }

  loadGroupData(id: string): void {
    // Optionally show loading state if needed
    this._groupService.getGroupById(id).subscribe({
      next: (group) => {
        this.groupForm.patchValue({
          name: group.name,
          description: group.description
        });
      },
      error: (err) => {
        console.error('Failed to load group', err);
        alert('Could not load group details.');
        this._router.navigate(['/instructor/groups']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onCancel(): void {
    this._router.navigate(['/instructor/groups']);
  }

  onSubmit(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.groupForm.value;
    const user = this._tokenService.getUser();

    if (this.isEditMode() && this.groupId) {
      this._groupService.updateGroup(this.groupId, formValue).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/groups']);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.submitting.set(false);
        }
      });
    } else {
      if (!user?.userId) {
        alert('User not authenticated');
        this.submitting.set(false);
        return;
      }

      this._groupService.createGroup({
        ...formValue,
        instructorId: user.userId
      }).subscribe({
        next: () => {
          this.submitting.set(false);
          this._router.navigate(['/instructor/groups']);
        },
        error: (err) => {
          console.error('Creation failed', err);
          this.submitting.set(false);
        }
      });
    }
  }
}
