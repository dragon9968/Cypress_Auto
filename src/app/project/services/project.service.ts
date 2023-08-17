import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { RouteSegments } from "../../core/enums/route-segments.enum";
import { LocalStorageKeys } from 'src/app/core/storage/local-storage/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/storage/local-storage/local-storage.service';
import { retrievedIsOpen } from "../../store/project/project.actions";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS);
  }

  getProjectByStatus(status: string) : Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS, {
      params: {
        q: '(filters:!((col:status,opr:eq,value:' + status + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  getProjectByStatusAndCategory(status: string, category: string) : Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS, {
      params: {
        q: '(filters:!((col:status,opr:eq,value:' + status + '),(col:category,opr:eq,value:' + category + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  getShareProject(status: string, category: string) : Observable<any>{
    return this.http.get<any>(ApiPaths.SHARE_PROJECT, {
      params: {
        q: '(filters:!((col:status,opr:eq,value:' + status + '),(col:category,opr:eq,value:' + category + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  getProjectsNotLinkedYet(projectId: number): Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS_NOT_LINKED_YET + projectId)
  }

  get(id: number): Observable<any>  {
    return this.http.get<any>(ApiPaths.PROJECTS + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ADD_PROJECT, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.PROJECTS + id, data);
  }

  deleteOrRecoverProject(data: any) {
    return this.http.post<any>(ApiPaths.DELETE_RESTORE_PROJECT, data);
  }

  permanentDeleteProject(data: any) {
    return this.http.post<any>(ApiPaths.PERMANENT_DELETE_PROJECT, data);
  }

  associate(data: any) {
    return this.http.post<any>(ApiPaths.ASSOCIATE_PROJECT, data);
  }

  openProject(projectId: number) {
    const currentProjectId = this.getProjectId();
    if (!currentProjectId || currentProjectId !== projectId) {
      this.store.dispatch(retrievedIsOpen({data: false}));
      this.setProjectId(projectId);
    }
    this.store.dispatch(retrievedIsOpen({data: true}));
    this.saveRecentProject({ project_id: projectId }).subscribe(() => {
      this.router.navigate([RouteSegments.MAP]);
    })
  }

  setProjectId(projectId: number) {
    this.localStorageService.setItem(LocalStorageKeys.PROJECT_ID, projectId);
  }

  getProjectId(): any {
    return this.localStorageService.getItem(LocalStorageKeys.PROJECT_ID);
  }

  closeProject(): any {
    if (this.getProjectId()) {
      this.localStorageService.removeItem(LocalStorageKeys.PROJECT_ID);
    }
  }

  exportProject(data: any): Observable<any>  {
    return this.http.post<any>(ApiPaths.EXPORT_PROJECT, data);
  }

  importProject(data: any) {
    return this.http.post<any>(ApiPaths.IMPORT_PROJECT, data);
  }

  cloneProject(data: any): Observable<any>  {
    return this.http.post<any>(ApiPaths.CLONE_PROJECT, data);
  }

  putProjectDashboard(pk: number, mode: string, card: string): Observable<any> {
    return this.http.put<any>(ApiPaths.PROJECT_DASHBOARD_UPDATE + '/' + pk + '/' + mode + '/' + card, null);
  }

  getDeviceCount(pk: any): Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS_DEVICE_COUNT + pk);
  }

  validateProject(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PROJECT_VALIDATE, data);
  }

  saveRecentProject(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PROJECT_RECENT, data);
  }

  getRecentProjects():Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECT_RECENT);
  }

}
