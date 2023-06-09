import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.IMAGE);
  }

  getByCategory(category: string): Observable<any> {
    return this.http.get<any>(ApiPaths.IMAGE, {
      params: {
        q: '(filters:!((col:category,opr:eq,value:' + category + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.IMAGE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.IMAGE_ADD, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.IMAGE_UPDATE + id, data)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.IMAGE + id);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.IMAGE_EXPORT, data)
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.IMAGE_IMPORT, data);
  }
}
