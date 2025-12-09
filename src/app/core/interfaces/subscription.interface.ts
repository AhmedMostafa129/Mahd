// Subscription interfaces based on backend DTOs

export interface SubscriptionPackageDto {
  packageId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  createdAt: string; // ISO date string
}

export interface InstructorSubscriptionDto {
  subscriptionId: string;
  instructorId: string;
  packageId: string;
  packageName?: string | null;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
}

export interface SubscribeDto {
  instructorId: string;
  packageId: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}


