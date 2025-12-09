import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto, UserUpdateDto } from '../../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, data: UserUpdateDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/users/${id}`, data);
  }
}
