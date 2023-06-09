import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(data: any, collectionId: string): Observable<any> {
    const params = new HttpParams().set('collection_id', collectionId);
    return this.http.post<any>(ApiPaths.SEARCH, data,{ params });
  }

  queryES(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ELASTICSEARCH_QUERY, data);
  }
}
