// File interfaces based on backend DTOs

export interface FileDto {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  entityType: string;
  entityId?: string | null;
  uploadedBy: string;
  createdAt: string; // ISO date string
}

export interface FileUploadResponse {
  file: FileDto;
  message?: string;
}

