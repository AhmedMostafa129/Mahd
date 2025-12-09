import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InstructorDto } from '../../interfaces/instructor.interface';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPublicInstructor(id: string): Observable<InstructorDto> {
    return this.http.get<InstructorDto>(`${this.apiUrl}/instructors/${id}`);
  }
}
