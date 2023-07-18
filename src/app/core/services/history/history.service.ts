import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";
import { HttpClient } from "@angular/common/http";
import { DeleteHistoryModel } from "../../models/history.model";
import { Store } from "@ngrx/store";
import { selectHistories } from "../../../store/history/history.selectors";
import { retrievedHistories } from "../../../store/history/history.actions";

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnDestroy{

  selectHistories$ = new Subscription();
  histories: any[] = []

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    this.selectHistories$ = this.store.select(selectHistories).subscribe(histories => this.histories = histories)
  }


  ngOnDestroy(): void {
    this.selectHistories$.unsubscribe()
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.HISTORIES);
  }

  delete(pks: DeleteHistoryModel): Observable<any> {
    return this.http.delete<any>(ApiPaths.HISTORIES_DELETE, { body: pks })
  }

  getByTask(task: string): Observable<any> {
    return this.http.get<any>(ApiPaths.HISTORIES, {
      params: {
        q: `(filters:!((col:task,opr:eq,value:'${task}')),keys:!(list_columns),page:0,page_size:1000)`
      }
    })
  }

  addNewHistoryIntoStorage(task: string) {
    const currentHistories = JSON.parse(JSON.stringify(this.histories))
    this.getByTask(task).subscribe(res => {
      const newHistory = res.result[0];
      currentHistories.unshift(newHistory)
      this.store.dispatch(retrievedHistories({data: currentHistories}))
    })
  }

  removeHistoryByIdsInStorage(pks: number[]) {
    const currentHistories = JSON.parse(JSON.stringify(this.histories))
    const newHistories = currentHistories.filter((history: any) => !pks.includes(history.id))
    this.store.dispatch(retrievedHistories({data: newHistories}))
  }
}
