// Group Interfaces based on Backend DTOs

export interface GroupDto {
  groupId: string;
  name: string;
  description: string;
  instructorId: string;
  studentsCount: number;
  coursesCount: number;
  createdAt: string; // ISO date string
}

export interface CreateGroupDto {
  name: string;
  description: string;
  instructorId?: string; // Optional, will be set from current user if not provided
}

export interface UpdateGroupDto {
  name: string;
  description: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

