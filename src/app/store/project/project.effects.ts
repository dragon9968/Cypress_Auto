import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import {
  loadProject,
  loadProjectsNotLinkYet,
  projectLoadedSuccess,
  projectsNotLinkYetLoadedSuccess,
  validateProject
} from './project.actions';
import { ProjectService } from 'src/app/project/services/project.service';
import { pushNotification } from "../app/app.actions";
import { ValidateProjectDialogComponent } from "../../project/validate-project-dialog/validate-project-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { loadGroups } from "../group/group.actions";
import { loadDomains } from "../domain/domain.actions";

@Injectable()
export class ProjectEffects {

  loadProject$ = createEffect(() => this.actions$.pipe(
    ofType(loadProject),
    exhaustMap((payload) => this.projectService.get(+payload.projectId)
      .pipe(
        map(res => (projectLoadedSuccess({ project: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  loadProjectsNotLinkYet$ = createEffect(() => this.actions$.pipe(
    ofType(loadProjectsNotLinkYet),
    exhaustMap((payload) => this.projectService.getProjectsNotLinkedYet(+payload.projectId)
      .pipe(
        map(res => (projectsNotLinkYetLoadedSuccess({ projectsNotLinkYet: res.result }))),
        catchError(e => (of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load projects not link to project failed!'
          }
        }))))
      ))
  ))

  validateProject$ = createEffect(() => this.actions$.pipe(
    ofType(validateProject),
    mergeMap(payload => this.projectService.validateProject({ pk: payload.projectId }).pipe(
      map(res => pushNotification({ notification: {
        type: 'success',
        message: res.message
      }})),
      catchError(e => {
        this.dialog.open(ValidateProjectDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: 'auto',
          data: e.error.result
        });
        return of(
          pushNotification({
          notification: {
            type: 'error',
            message: e.error.message
          }}),
          loadDomains({ projectId: payload.projectId.toString() }),
          loadGroups({ projectId: payload.projectId.toString() })
        )
      })
    ))
  ))

  constructor(
    private actions$: Actions,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}
}
