import { Injectable } from "@angular/core";
import { UserTaskService } from "../../core/services/user-task/user-task.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  addTask,
  deleteTasks,
  loadUserTasks,
  postTasks,
  refreshTasks,
  rerunTasks,
  revokeTasks,
  userTasksLoadedSuccess
} from "./user-task.actions";
import { forkJoin, of } from "rxjs";
import { catchError, map, switchMap, exhaustMap } from "rxjs/operators";
import { pushNotification } from "../app/app.actions";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { ToastrService } from "ngx-toastr";
import { SuccessMessages } from "../../shared/enums/success-messages.enum";
import { TaskService } from "../../core/services/task/task.service";
import { NotificationTypes } from "../../shared/enums/notifications-types.enum";

@Injectable()
export class UserTaskEffect {
  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private taskService: TaskService,
    private userTasksService: UserTaskService,
  ) {
  }

  loadUserTasks$ = createEffect(() => this.actions$.pipe(
    ofType(loadUserTasks),
    exhaustMap(() => this.userTasksService.getAll().pipe(
      map(res => userTasksLoadedSuccess({ userTasks: res.result })),
      catchError(e => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_LOAD_FAILED
        }
      })))
    ))
  ))

  rerunTasks$ = createEffect(() => this.actions$.pipe(
    ofType(rerunTasks),
    exhaustMap(payload => this.userTasksService.rerunTask({ pks: payload.pks }).pipe(
      map(res => {
        res.result.map((message: string) => {
          this.toastr.success(`Rerun task - ${message} `, 'Success');
        })
        return res.result
      }),
      switchMap(() => [
        loadUserTasks(),
        pushNotification({
          notification: {
            type: NotificationTypes.SUCCESS,
            message: SuccessMessages.USER_TASK_RERUN_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_RERUN_FAILED
        }
      })))
    ))
  ))

  revokeTasks$ = createEffect(() => this.actions$.pipe(
    ofType(revokeTasks),
    exhaustMap(payload => this.userTasksService.revokeTask({ pks: payload.pks }).pipe(
      map(res => {
        res.result.map((message: string) => {
          this.toastr.success(`Revoke task - ${message} `, 'Success');
        })
        return res.result
      }),
      switchMap(() => [
        loadUserTasks(),
        pushNotification({
          notification: {
            type: NotificationTypes.SUCCESS,
            message: SuccessMessages.USER_TASK_REVOKE_SUCCESS
          }
        })
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_REVOKE_FAILED
        }
      })))
    ))
  ))

  postTasks$ = createEffect(() => this.actions$.pipe(
    ofType(postTasks),
    exhaustMap(payload => this.userTasksService.postTask({ pks: payload.pks }).pipe(
      map(res => {
        res.result.map((message: string) => {
          this.toastr.success(`Post task - ${message} `, 'Success');
        })
        return res.result
      }),
      switchMap(() => [
        loadUserTasks(),
        pushNotification({
          notification: {
            type: NotificationTypes.SUCCESS,
            message: SuccessMessages.USER_TASK_POST_SUCCESS
          }
        })
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_POST_FAILED
        }
      })))
    ))
  ))

  refreshTasks$ = createEffect(() => this.actions$.pipe(
    ofType(refreshTasks),
    exhaustMap(() => this.userTasksService.refreshTask().pipe(
      switchMap(() => [
        loadUserTasks(),
        pushNotification({
          notification: {
            type: NotificationTypes.SUCCESS,
            message: SuccessMessages.USER_TASK_REFRESH_SUCCESS
          }
        })
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_REFRESH_FAILED
        }
      })))
    ))
  ))

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(addTask),
    exhaustMap(payload => this.taskService.add(payload.task).pipe(
      switchMap(() => [
        loadUserTasks(),
        pushNotification({
          notification: {
            type: NotificationTypes.SUCCESS,
            message: payload.task.category === 'port_group'
                    ? SuccessMessages.USER_TASK_ADDED_PG_TASK_SUCCESS
                    : SuccessMessages.USER_TASK_ADDED_TASK_SUCCESS
          }
        })
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: NotificationTypes.FAILED,
          message: ErrorMessages.USER_TASK_ADD_TASK_FAILED
        }
      })))
    ))
  ))

  deleteTasks$ = createEffect(() => this.actions$.pipe(
    ofType(deleteTasks),
    exhaustMap(payload => forkJoin(payload.pks.map(pk => this.userTasksService.delete(pk)))
      .pipe(
        switchMap(() => [
          loadUserTasks(),
          pushNotification({
            notification: {
              type: NotificationTypes.SUCCESS,
              message: SuccessMessages.USER_TASK_DELETED_TASK_SUCCESS
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: NotificationTypes.FAILED,
            message: ErrorMessages.USER_TASK_DELETE_TASK_FAILED
          }
        })))
      )
    )
  ))
}
