// Payment interfaces based on backend DTOs

export interface PaymentDto {
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  paymentIntentId?: string | null;
  createdAt: string; // ISO date string
}

export interface PaymentCreateDto {
  studentId: string;
  courseId: string;
  amount: number;
  currency?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaymentStatisticsDto {
  totalPayments: number;
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  revenueByMonth?: { month: string; revenue: number }[];
}


