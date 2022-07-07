import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api/api-paths.enums';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    return this.http.get<any>(ApiPaths.GET_PROJECTS);
  }

  getProject(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.GET_PROJECTS + '/' + id);
  }

}
