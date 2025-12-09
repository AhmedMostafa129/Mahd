// Support ticket interfaces based on backend DTOs

export interface SupportTicketDto {
  ticketId: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string; // ISO date string
  closedAt?: string | null;
}

export interface SupportTicketCreateDto {
  userId: string;
  subject: string;
  description: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}


