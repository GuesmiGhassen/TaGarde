import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('access_token');
    }
    const excludedUrls = ['/api/v1/auth/register', '/api/v1/auth/login'];
    if (token && !excludedUrls.some(url => req.url.includes(url))) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
