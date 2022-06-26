import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (!this.authService.getToken()) {
      return request;
    }
    return request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + this.authService.getToken()
      ),
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
      });
    }
    req = this.addAuthenticationToken(req);
    return next.handle(req);
  }
}
