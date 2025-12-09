import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, PagedResult } from '../../../core/services/AdminService/admin-service';
import { UserDto } from '../../../core/interfaces/i-user';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.html',
  styleUrl: './users-management.scss',
})
export class UsersManagement implements OnInit {
  private readonly _adminService = inject(AdminService);

  users = signal<UserDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  searchEmail: string = '';
  searching = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this._adminService.getAllUsers(page, this.pageSize()).subscribe({
      next: (result: PagedResult<UserDto>) => {
        this.users.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error.set(err.message || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadUsers(page);
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim();
    if (!email) {
      this.loadUsers(1);
      return;
    }

    this.searching.set(true);
    this.error.set(null);

    this._adminService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.users.set([user]);
        this.totalCount.set(1);
        this.totalPages.set(1);
        this.pageNumber.set(1);
        this.searching.set(false);
      },
      error: (err) => {
        console.error('Error searching user:', err);
        this.error.set(err.message || 'User not found');
        this.searching.set(false);
      },
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this._adminService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers(this.pageNumber());
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.error.set(err.message || 'Failed to delete user');
      },
    });
  }
}
