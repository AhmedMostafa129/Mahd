// Affiliate interfaces based on backend DTOs

export interface AffiliateDto {
  affiliateId: string;
  userId: string;
  affiliateCode: string;
  totalCommission: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AffiliateCreateDto {
  userId: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}


