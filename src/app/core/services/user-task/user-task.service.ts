import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.httpClient.get<any>(ApiPaths.USER_TASK);
  }

  getById(userTaskId: any) {
    return this.httpClient.get<any>(ApiPaths.USER_TASK + userTaskId);
  }

  delete(userTaskId: number) {
    return this.httpClient.delete<any>(ApiPaths.USER_TASK + userTaskId);
  }

  rerunTask(pks: any) {
    return this.httpClient.post<any>(ApiPaths.USER_TASK_RERUN, pks);
  }

  revokeTask(pks: any) {
    return this.httpClient.post<any>(ApiPaths.USER_TASK_REVOKE, pks);
  }

  postTask(pks: any) {
    return this.httpClient.post<any>(ApiPaths.USER_TASK_POST_TASK, pks);
  }
}
