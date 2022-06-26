import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api/api-paths.enums';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getMapData(category: string): Observable<any> {
    return this.http.get<any>(ApiPaths.GET_MAP_DATA + '/' + category);
  }

}
