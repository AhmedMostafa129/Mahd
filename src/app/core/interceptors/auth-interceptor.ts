import { HttpInterceptorFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  // Clone the request and add headers
  const clonedReq = req.clone({
    setHeaders: {
      // Add Authorization header if token exists
      ...(tokenService.getToken() && {
        Authorization: `Bearer ${tokenService.getToken()}`,
      }),
      // Always add Device ID header
      'X-Device-Id': environment.deviceId,
    },
  });

  // Debug logging of outgoing request
  if (!environment.production) {
    try {
      const headersList = clonedReq.headers.keys();
      const bodyPreview: any =
        clonedReq.method !== 'GET' && clonedReq.body ? clonedReq.body : undefined;

      // If body is FormData, log its keys only (don't serialize file blobs)
      if (bodyPreview instanceof FormData) {
        const keys: string[] = [];
        bodyPreview.forEach((v, k) => keys.push(k));
        console.log('🔐 Auth Interceptor - Outgoing Request (FormData):', {
          method: clonedReq.method,
          url: clonedReq.urlWithParams || clonedReq.url,
          hasToken: !!tokenService.getToken(),
          deviceId: environment.deviceId,
          headers: headersList,
          formKeys: keys,
        });
      } else {
        console.log('🔐 Auth Interceptor - Outgoing Request:', {
          method: clonedReq.method,
          url: clonedReq.urlWithParams || clonedReq.url,
          hasToken: !!tokenService.getToken(),
          deviceId: environment.deviceId,
          headers: headersList,
          body: bodyPreview,
        });
      }
    } catch (e) {
      console.log('🔐 Auth Interceptor - Outgoing Request (partial)', {
        url: clonedReq.urlWithParams,
      });
    }
  }

  // Log responses and errors
  return next(clonedReq).pipe(
    tap({
      next: (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!environment.production) {
            console.log('🔐 Auth Interceptor - Response:', {
              url: event.url,
              status: event.status,
              body: event.body,
            });
          }
        }
      },
      error: (err) => {
        if (!environment.production) {
          console.error('🔐 Auth Interceptor - Response Error:', err);
        }
      },
    })
  );
};
