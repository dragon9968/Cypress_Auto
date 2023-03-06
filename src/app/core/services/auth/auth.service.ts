import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Tokens } from 'src/app/core/models/token.model';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { LocalStorageService } from '../../storage/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../storage/local-storage/local-storage-keys.enum';
import { RouteSegments } from '../../enums/route-segments.enum';
import { ProjectService } from "../../../project/services/project.service";
import { ServerConnectService } from "../server-connect/server-connect.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { retrievedIsConnect } from "../../../store/server-connect/server-connect.actions";
import { retrievedVMStatus } from "../../../store/project/project.actions";
import { Store } from "@ngrx/store";
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private serverConnectionService: ServerConnectService,
    private ngxRolesService: NgxRolesService,
    private ngxPermissionsService: NgxPermissionsService,
  ) {}

  login(username: string, password: string, option: any) {
    return this.http.post<Tokens>(ApiPaths.LOGIN, {
      username: username,
      password: password,
      provider: option,
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

  isAdminRole() {
    let roles = this.ngxRolesService.getRoles();
    return Boolean(roles['Admin']);
  }

  logout() {
    const connection = this.serverConnectionService.getConnection();
    if (connection) {
      const jsonData = {
        pk: connection.id,
      }
      this.serverConnectionService.disconnect(jsonData).pipe(
        catchError(err => {
          this.toastr.error('Could not to disconnect from Server', 'Error');
          return throwError(() => err.error.message);
        })).subscribe(() => {
        this.store.dispatch(retrievedIsConnect({ data: false }));
        this.store.dispatch(retrievedVMStatus({ vmStatus: undefined }));
        this.toastr.info(`Disconnected from ${connection.name} server!`);
      })
    }
    this.ngxRolesService.flushRolesAndPermissions();
    this.ngxPermissionsService.flushPermissions();
    this.localStorageService.removeItem(LocalStorageKeys.ACCESS_TOKEN);
    this.localStorageService.removeItem(LocalStorageKeys.REFRESH_TOKEN);
    this.localStorageService.removeItem(LocalStorageKeys.CONNECTION);
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
  }

}
