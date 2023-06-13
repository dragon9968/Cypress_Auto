import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  genData(projectId: string, deviceId: string, templateId: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_NODE_DATA, {
      project_id: projectId,
      device_id: deviceId,
      template_id: templateId
    });
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.NODE);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.NODE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.NODE + id, data);
  }

  clone(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.CLONE_NODE + id);
  }

  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.VALIDATE_NODE, data);
  }

  getNodesByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.NODE, {
      params: {
        q: '(filters:!((col:project_id,opr:eq,value:' + projectId +')),keys:!(list_columns),page:0,page_size:1000)'
      }
    })
  }

  editBulk(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.NODE + 'bulk_edit', data);
  }

  cloneBulk(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE_CLONE, data)
  }

  export(format: string, data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE_EXPORT + format, data);
  }

  associate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ASSOCIATE, data);
  }

  getSnapshots(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE_SNAPSHOTS, data);
  }
}
