import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';
import { LocalStorageService } from '../../storage/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../storage/local-storage/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.ROLES);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.ROLES + id);
  }

  getPermissions(): Observable<any> {
    return this.http.get<any>(ApiPaths.PERMISSIONS)
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ROLES, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.ROLES + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.ROLES + id)
  }

  associate(data: any) {
    return this.http.post<any>(ApiPaths.ASSOCIATE_ROLES, data);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.EXPORT_ROLES, data);
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.IMPORT_ROLES, data);
  }

  clone(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CLONE_ROLES, data);
  }

  getRolesUser(): Observable<any> {
    return this.http.get<any>(ApiPaths.ROLES_USER);
  }

  getRolesProtected(): Observable<any> {
    return this.http.get<any>(ApiPaths.ROLES_PROTECTED);
  }

  setUserPermissions(permissions: any[]) {
    this.localStorageService.setItem(LocalStorageKeys.PERMISSIONS, permissions);
  }

  getUserPermissions() {
    return this.localStorageService.getItem(LocalStorageKeys.PERMISSIONS);
  }

  setUserRoles(roles: any[]) {
    this.localStorageService.setItem(LocalStorageKeys.ROLES, roles);
  }

  getUserRoles() {
    return this.localStorageService.getItem(LocalStorageKeys.ROLES);
  }

}
