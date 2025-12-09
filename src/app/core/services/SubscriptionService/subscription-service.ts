import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SubscriptionPackageDto,
  InstructorSubscriptionDto,
  SubscribeDto,
  PagedResult,
} from '../../interfaces/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllPackages(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<SubscriptionPackageDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<SubscriptionPackageDto>>(`${this.apiUrl}/subscriptions/packages`, { params });
  }

  getPackageById(id: string): Observable<SubscriptionPackageDto> {
    return this.http.get<SubscriptionPackageDto>(`${this.apiUrl}/subscriptions/packages/${id}`);
  }

  createPackage(data: SubscriptionPackageDto): Observable<SubscriptionPackageDto> {
    return this.http.post<SubscriptionPackageDto>(`${this.apiUrl}/subscriptions/packages`, data);
  }

  updatePackage(id: string, data: SubscriptionPackageDto): Observable<SubscriptionPackageDto> {
    return this.http.put<SubscriptionPackageDto>(`${this.apiUrl}/subscriptions/packages/${id}`, data);
  }

  deletePackage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subscriptions/packages/${id}`);
  }

  subscribe(data: SubscribeDto): Observable<InstructorSubscriptionDto> {
    return this.http.post<InstructorSubscriptionDto>(`${this.apiUrl}/subscriptions/subscribe`, data);
  }

  getInstructorSubscription(instructorId: string): Observable<InstructorSubscriptionDto> {
    return this.http.get<InstructorSubscriptionDto>(`${this.apiUrl}/subscriptions/instructor/${instructorId}`);
  }

  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscriptions/cancel/${subscriptionId}`, {});
  }

  renewSubscription(subscriptionId: string): Observable<InstructorSubscriptionDto> {
    return this.http.post<InstructorSubscriptionDto>(`${this.apiUrl}/subscriptions/renew/${subscriptionId}`, {});
  }
}


