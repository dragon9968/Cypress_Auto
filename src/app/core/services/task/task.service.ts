import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { Store } from "@ngrx/store";
import { selectUserTasks } from "../../../store/user-task/user-task.selectors";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {

  selectUserTask$ = new Subscription()
  userTasks: any[] = []

  constructor(
    private store: Store,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.selectUserTask$ = this.store.select(selectUserTasks).subscribe(userTasks => this.userTasks = userTasks)
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TASK, data);
  }

  ngOnDestroy(): void {
    this.selectUserTask$.unsubscribe()
  }

  isTaskInQueue(taskData: any) {
    if (taskData.job_category == 'node' || taskData.job_category == 'port_group') {
      const tasksByCategory = this.userTasks.filter(task => taskData.job_category == task.task_metadata.job_category)
      const tasksIncludeItem = tasksByCategory.filter(task =>
        task.task_metadata[`${taskData.job_category}s`].some(
          (item: any) => taskData.job_category === 'port_group'
                        ? taskData.pks.includes(item.id)
                        : taskData.pks.includes(item.config.id)
        )
      )
      const isTaskInQueue = tasksIncludeItem.some(task => task.task_state == 'PENDING' && task.task_metadata.job_name == taskData.job_name)
      if (isTaskInQueue) {
        this.toastr.warning('Existing task already in queue', 'Warning')
        return true;
      }
    }
    return false;
  }
}
