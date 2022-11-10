import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.TEMPLATES)
    }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TEMPLATES, data)
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.TEMPLATES + id)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.TEMPLATES + id)
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.TEMPLATES + id, data)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TEMPLATES_EXPORT, data)
  }
}
