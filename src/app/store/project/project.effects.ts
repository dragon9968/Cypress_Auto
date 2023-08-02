import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import {
  loadProject,
  loadProjectsNotLinkYet,
  projectLoadedSuccess,
  projectsNotLinkYetLoadedSuccess
} from './project.actions';
import { ProjectService } from 'src/app/project/services/project.service';
import { pushNotification } from "../app/app.actions";

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

  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}
}
