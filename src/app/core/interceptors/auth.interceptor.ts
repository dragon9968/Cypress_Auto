import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      const headers: HttpHeaders = req.headers;
      
      headers.set('Content-Type', 'application/json');

      const access_token = this.authService.getToken();
      if (access_token) {
        headers.set('Authorization', 'Bearer ' + this.authService.getToken());
      }
      req = req.clone({
        url: environment.apiBaseUrl + req.url,
        headers: headers,
      });
    }
    return next.handle(req);
  }
}
