import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { LocalStorageKeys } from 'src/app/core/storage/local-storage/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/storage/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
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

  get(id: number): Observable<any> {
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

  permanentDeteleProject(data: any) {
    return this.http.post<any>(ApiPaths.PERMANENT_DELETE_PROJECT, data);
  }

  associate(data: any) {
    return this.http.post<any>(ApiPaths.ASSOCIATE_PROJECT, data);
  }

  openProject(collection_id: string) {
    this.localStorageService.setItem(LocalStorageKeys.COLLECTION_ID, collection_id);
  }

  getCollectionId(): any {
    return JSON.parse(<any>this.localStorageService.getItem(LocalStorageKeys.COLLECTION_ID));
  }

  closeProject(): any {
    if (this.getCollectionId()) {
      this.localStorageService.removeItem(LocalStorageKeys.COLLECTION_ID);
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
}
