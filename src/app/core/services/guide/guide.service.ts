import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(
    private http: HttpClient
  ) { }

  getGuide(): Observable<any> {
    return this.http.get<any>(ApiPaths.USER_GUIDE);
  }

  uploadUserGuide(data: any): Observable<any>{
    return this.http.post<any>(ApiPaths.USER_GUIDE_UPLOAD, data);
  }

  dowloadFile(): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      })
    };

    return this.http.get<any>(ApiPaths.USER_GUIDE_DOWNLOAD, httpOptions)
  }
}
