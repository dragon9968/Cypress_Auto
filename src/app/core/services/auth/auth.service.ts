import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api/api-paths.enums';
import { LocalStorageKeys } from 'src/app/enums/storage/local-storage-keys.enum';
import { Token } from 'src/app/models/auth/token.model';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../storage/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login() {
    return this.httpClient.post<Token>(environment.apiBaseUrl + ApiPaths.LOGIN, {
      username: 'admin',
      password: '12345',
      provider: "db"
    });
  }

  updateToken(token: string) {
    this.localStorageService.setItem(LocalStorageKeys.TOKEN, token);
  }

  getToken() {
    return this.localStorageService.getItem(LocalStorageKeys.TOKEN);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null;
  }

  removeToken() {
    this.localStorageService.removeItem(LocalStorageKeys.TOKEN);
  }

  logout(): Observable<any> {
    return this.httpClient.post(environment.apiBaseUrl + ApiPaths.LOGOUT, this.getToken());
  }
}
