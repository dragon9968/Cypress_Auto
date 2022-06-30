import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/storage/local-storage/local-storage.service';
import { ApiPaths } from 'src/app/core/enums/api/api-paths.enums';
import { Token } from 'src/app/core/models/token.model';
import { environment } from 'src/environments/environment';
import { LocalStorageKeys } from 'src/app/core/enums/storage/local-storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(username: string, password: string) {
    return this.httpClient.post<Token>(ApiPaths.LOGIN, {
      username: username,
      password: password,
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
