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
import { forkJoin, of, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { retrievedIsOpen, retrievedVMStatus } from "../../../store/project/project.actions";
import { Store } from "@ngrx/store";
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";
import { HelpersService } from "../helpers/helpers.service";

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
    private helperServices: HelpersService,
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

  updateUserId(userId: string) {
    return this.localStorageService.setItem(LocalStorageKeys.USER_ID, userId);
  }

  getUserId(): any {
    return this.localStorageService.getItem(LocalStorageKeys.USER_ID);
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
    const connections = this.serverConnectionService.getAllConnection();
    if (connections) {
      forkJoin(
        Object.values(connections).map((connection: any) => {
          const jsonData = {
            pk: connection.id,
          }
          this.serverConnectionService.disconnect(connection.category, jsonData).pipe(
            catchError(err => {
              this.toastr.error(`Could not to disconnect from ${connection.name} server`, 'Error');
              return throwError(() => err.error.message);
            }))
          return of(connection);
        })
      ).subscribe(connectionsResponse => {
        connectionsResponse.map(connection => {
              this.helperServices.changeConnectionStatus(connection.category, false)
              this.store.dispatch(retrievedVMStatus({ vmStatus: undefined }));
              this.toastr.info(`Disconnected from ${connection.name} server!`, 'Info');
        })
        this._removeDataInLocalStorageAndPermission();
        this.store.dispatch(retrievedIsOpen({data: false}));
        this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
      })
    } else {
      this._removeDataInLocalStorageAndPermission();
      this.store.dispatch(retrievedIsOpen({data: false}));
      this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
    }
  }

  private _removeDataInLocalStorageAndPermission() {
    this.localStorageService.removeItem(LocalStorageKeys.ACCESS_TOKEN);
    this.localStorageService.removeItem(LocalStorageKeys.REFRESH_TOKEN);
    this.localStorageService.removeItem(LocalStorageKeys.CONNECTIONS);
    this.localStorageService.removeItem(LocalStorageKeys.USER_ID);
    this.localStorageService.removeItem(LocalStorageKeys.PROJECT_ID);
    this.localStorageService.removeItem(LocalStorageKeys.PERMISSIONS);
    this.localStorageService.removeItem(LocalStorageKeys.ROLES);
    this.localStorageService.removeItem(LocalStorageKeys.PROJECT_ID);
    this.ngxRolesService.flushRolesAndPermissions();
    this.ngxPermissionsService.flushPermissions();
  }

}
