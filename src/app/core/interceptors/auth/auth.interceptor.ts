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
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) { }

  private addTokenHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken)
    });
  }

  private handle401Error(request: HttpRequest<any>, refreshToken: string, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.authService.updateAccessToken(token.access_token);
            this.refreshTokenSubject.next(token.access_token);
            return next.handle(this.addTokenHeader(request, token.access_token));
          }));
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(accessToken => accessToken !== null),
      take(1),
      switchMap((accessToken) => next.handle(this.addTokenHeader(request, accessToken)))
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq: any;
    const url = !req.url.includes(ApiPaths.ASSETS) ? environment.apiBaseUrl + req.url : req.url
    const access_token = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();
    if (
      req.url.includes(ApiPaths.IMAGE_ADD) ||
      req.url.includes(ApiPaths.IMAGE_UPDATE) ||
      req.url.includes(ApiPaths.IMPORT_PROJECT) ||
      req.url.includes(ApiPaths.ADD_UPDATE_SERVER_CONNECT_FILE) ||
      req.url.includes(ApiPaths.USER_GUIDE_UPLOAD) ||
      req.url.includes(ApiPaths.SAVE_MAP_OVERVIEW) ||
      req.url.includes(ApiPaths.IMPORT_ROLES) ||
      req.url.includes(ApiPaths.LOOKUP_FEATURES_IMPORT) ||
      req.url.includes(ApiPaths.UPDATE_FEATURE) ||
      req.url.includes(ApiPaths.LOOKUP_NAMES_IMPORT)||
      req.url.includes(ApiPaths.CONNECTION_IMPORT) ||
      req.url.includes(ApiPaths.CONFIG_TEMPLATE_IMPORT) ||
      req.url.includes(ApiPaths.DEVICE_IMPORT) ||
      req.url.includes(ApiPaths.TEMPLATE_IMPORT) ||
      req.url.includes(ApiPaths.HARDWARE_IMPORT) ||
      req.url.includes(ApiPaths.LOOKUP_NAMES_IMPORT) ||
      req.url.includes(ApiPaths.IMPORT_LOGIN_PROFILES) ||
      req.url.includes(ApiPaths.IMAGE_IMPORT)
    ) {
      authReq = req.clone({ url });
    } else {
      authReq = req.clone({ url, headers: req.headers.set('Content-Type', 'application/json') });
    }
    if (refreshToken != null && authReq.url.includes(ApiPaths.REFRESH_TOKEN)) {
      authReq = this.addTokenHeader(authReq, refreshToken);
    } else if (access_token != null) {
      authReq = this.addTokenHeader(authReq, access_token);
    }
    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (authReq.url.includes(ApiPaths.REFRESH_TOKEN)) {
            this.isRefreshing = false;
            this.authService.logout();
          } else if (!authReq.url.includes(ApiPaths.LOGIN)) {
            return this.handle401Error(authReq, refreshToken, next);
          }
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      }));
  }
}
