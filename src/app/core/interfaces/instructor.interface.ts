export interface InstructorDto {
  instructorId: string;
  userId: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  bio?: string | null;
  coursesCount: number;
  averageRating: number;
}
