import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiPaths } from 'src/app/shared/enums/api/api-paths.enums';
import { RouteSegments } from 'src/app/shared/enums/routes/route-segments.enum';
import { LocalStorageService } from 'src/app/storage/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../storage/local-storage/local-storage-keys.enum';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    return this.http.post<Token>(ApiPaths.LOGIN, {
      username: username,
      password: password,
      provider: "db",
      refresh: true
    });
  }

  refreshToken() {
    return this.http.post(ApiPaths.REFRESH_TOKEN, null);
  }

  updateAccessToken(accessToken: string) {
    this.localStorageService.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
  }

  updateRefreshToken(refreshToken: string) {
    this.localStorageService.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): any {
    return this.localStorageService.getItem(LocalStorageKeys.ACCESS_TOKEN);
  }

  getRefreshToken(): any {
    return this.localStorageService.getItem(LocalStorageKeys.REFRESH_TOKEN);
  }

  isLoggedIn(): boolean {
    const accessToken = this.getAccessToken();
    return accessToken != null;
  }

  logout() {
    this.localStorageService.removeItem(LocalStorageKeys.ACCESS_TOKEN);
    this.localStorageService.removeItem(LocalStorageKeys.REFRESH_TOKEN);
    this.router.navigate([RouteSegments.ROOT]);
  }

}
