import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/Support/support';
import { TokenService } from '../../../core/services/TokenService/token-service';
import {
  SupportTicketDto,
  SupportTicketCreateDto,
  PagedResult,
} from '../../../core/interfaces/support.interface';

@Component({
  selector: 'app-student-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class StudentSupport implements OnInit {
  private readonly _supportService = inject(SupportService);
  private readonly _tokenService = inject(TokenService);

  tickets = signal<SupportTicketDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  creating = signal<boolean>(false);
  createModel: SupportTicketCreateDto = {
    userId: '',
    subject: '',
    description: '',
  };

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(page: number = 1): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._supportService
      .getUserTickets(user.userId, page, this.pageSize())
      .subscribe({
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
          this.error.set(err.message || 'Failed to load support tickets');
          this.loading.set(false);
        },
      });
  }

  openCreate(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) return;

    this.createModel = {
      userId: user.userId,
      subject: '',
      description: '',
    };
    this.creating.set(true);
  }

  submitTicket(): void {
    if (!this.createModel.subject.trim() || !this.createModel.description.trim()) {
      return;
    }

    this.error.set(null);

    this._supportService.createTicket(this.createModel).subscribe({
      next: () => {
        this.creating.set(false);
        this.loadTickets(this.pageNumber());
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        this.error.set(err.message || 'Failed to create support ticket');
      },
    });
  }

  cancelCreate(): void {
    this.creating.set(false);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.loadTickets(page);
  }
}


