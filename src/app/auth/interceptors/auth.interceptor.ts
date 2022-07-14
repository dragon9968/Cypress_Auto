import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ApiPaths } from 'src/app/shared/enums/api/api-paths.enums';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req.clone({
      url: !req.url.includes(ApiPaths.ASSETS) ? environment.apiBaseUrl + req.url : req.url,
      headers: req.headers.set('Content-Type', 'application/json')
    });
    const access_token = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();
    if (authReq.url.includes(ApiPaths.REFRESH_TOKEN) ) {
      authReq = this.addTokenHeader(authReq, refreshToken);
    } else if (access_token != null) {
      authReq = this.addTokenHeader(authReq, access_token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes(ApiPaths.LOGIN) && error.status === 401) {
        return this.handle401Error(authReq, refreshToken, next);
      }
      return throwError(() => error);
    }));
  }
  private handle401Error(request: HttpRequest<any>, refreshToken: string, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      if (refreshToken)
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.authService.updateAccessToken(token.access_token);
            this.refreshTokenSubject.next(token.access_token);
            
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => error);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(accessToken => accessToken !== null),
      take(1),
      switchMap((accessToken) => next.handle(this.addTokenHeader(request, accessToken)))
    );
  }
  private addTokenHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken) 
    });
  }
}
