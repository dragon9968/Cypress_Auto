import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.PROJECTS + id);
  }

}
