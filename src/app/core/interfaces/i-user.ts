// User Interfaces based on Backend DTOs

export interface UserDto {
  userId: string;
  fullName: string;
  email: string;
  role: number; // 0=Admin, 1=Instructor, 2=Student
  isEmailVerified: boolean;
  createdAt: string; // ISO date string
}

export interface UserUpdateDto {
  fullName?: string;
  email?: string;
}
