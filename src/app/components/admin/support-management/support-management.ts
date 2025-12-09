import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/Support/support';
import { SupportTicketDto, PagedResult } from '../../../core/interfaces/support.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { AdminService } from '../../../core/services/AdminService/admin-service';
import { UserDto } from '../../../core/interfaces/i-user';

@Component({
  selector: 'app-support-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-management.html',
  styleUrl: './support-management.scss',
})
export class SupportManagement implements OnInit {
  private readonly _supportService = inject(SupportService);
  private readonly _tokenService = inject(TokenService);
  private readonly _adminService = inject(AdminService);

  tickets = signal<SupportTicketDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  selectedTicket = signal<SupportTicketDto | null>(null);
  admins = signal<UserDto[]>([]);
  selectedAdminId = signal<string>('');
  showAssignModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadTickets();
    this.loadAdmins();
  }

  loadTickets(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this._supportService.getAllTickets(page, this.pageSize()).subscribe({
      next: (result: PagedResult<SupportTicketDto>) => {
        this.tickets.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
        this.error.set(err.message || 'Failed to load tickets');
        this.loading.set(false);
      },
    });
  }

  loadAdmins(): void {
    // Load admins for assignment dropdown
    this._adminService.getAllUsers(1, 100).subscribe({
      next: (result) => {
        // Filter admins (assuming role is in UserDto)
        const adminUsers = result.items.filter((user) => {
          // Adjust based on your UserDto structure
          return (user as any).role === 'Admin' || (user as any).role === 0;
        });
        this.admins.set(adminUsers);
      },
      error: (err) => {
        console.error('Error loading admins:', err);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadTickets(page);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'assigned':
        return 'status-assigned';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-default';
    }
  }

  openAssignModal(ticket: SupportTicketDto): void {
    this.selectedTicket.set(ticket);
    this.selectedAdminId.set('');
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.selectedTicket.set(null);
    this.selectedAdminId.set('');
  }

  assignTicket(): void {
    const ticket = this.selectedTicket();
    const adminId = this.selectedAdminId();

    if (!ticket || !adminId) return;

    this._supportService.assignTicket(ticket.ticketId, adminId).subscribe({
      next: () => {
        alert('Ticket assigned successfully');
        this.closeAssignModal();
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error assigning ticket:', err);
        this.error.set(err.message || 'Failed to assign ticket');
      },
    });
  }

  resolveTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to resolve this ticket?')) return;

    this._supportService.resolveTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket resolved successfully');
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error resolving ticket:', err);
        this.error.set(err.message || 'Failed to resolve ticket');
      },
    });
  }

  deleteTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;

    this._supportService.deleteTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket deleted successfully');
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error deleting ticket:', err);
        this.error.set(err.message || 'Failed to delete ticket');
      },
    });
  }
}

