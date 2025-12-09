// Exam Interfaces based on Backend DTOs

export interface ExamDto {
  examId: string;
  title: string;
  description: string;
  courseId: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  questionsCount: number;
  createdAt: string; // ISO date string
}

export interface CreateExamDto {
  title: string;
  description: string;
  courseId: string;
  durationMinutes: number;
  passingPercentage: number; // 0-100
}

export interface UpdateExamDto {
  title: string;
  description: string;
  durationMinutes: number;
  passingPercentage: number; // 0-100
}

export interface ExamQuestionDto {
  questionId: string;
  questionText: string;
  examId: string;
  mark: number;
  questionType: string; // "MCQ", "TrueFalse", "Text"
  options: ExamQuestionOptionDto[];
  correctAnswer?: string; // For text questions
}

export interface ExamQuestionOptionDto {
  optionId?: string;
  optionText: string;
  isCorrect: boolean;
}

export interface CreateExamQuestionDto {
  questionText: string;
  questionType: string; // "MCQ", "TrueFalse", "Text"
  mark: number;
  options: CreateExamQuestionOptionDto[];
  correctAnswer?: string; // For Text questions only
}

export interface CreateExamQuestionOptionDto {
  optionText: string;
  isCorrect: boolean;
}

export interface UpdateExamQuestionDto {
  questionText: string;
  questionType: string;
  mark: number;
  options: CreateExamQuestionOptionDto[];
  correctAnswer?: string;
}

export interface ExamAttemptSubmitDto {
  studentId: string;
  examId: string;
  answers: ExamAnswerDto[];
}

export interface ExamAnswerDto {
  questionId: string;
  selectedOptionIds?: string[]; // For MCQ
  answerText?: string; // For Text questions
  isTrue?: boolean; // For TrueFalse
}

export interface ExamAttemptDto {
  attemptId: string;
  examId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  submittedAt: string; // ISO date string
}

// Generic paged result used by exam endpoints
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

