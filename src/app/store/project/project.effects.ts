import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import {
  loadProjects,
  loadProjectsNotLinkYet,
  openProject,
  projectUpdatedSuccess,
  projectsLoadedSuccess,
  projectsNotLinkYetLoadedSuccess,
  updateProject,
  validateProject
} from './project.actions';
import { ProjectService } from 'src/app/project/services/project.service';
import { pushNotification } from "../app/app.actions";
import { ValidateProjectDialogComponent } from "../../project/validate-project-dialog/validate-project-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { loadGroups } from "../group/group.actions";
import { loadDomains } from "../domain/domain.actions";
import { HistoryService } from 'src/app/core/services/history/history.service';

@Injectable()
export class ProjectEffects {

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
      map(res => pushNotification({
        notification: {
          type: 'success',
          message: res.message
        }
      })),
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
            }
          }),
          loadDomains({ projectId: payload.projectId }),
          loadGroups({ projectId: payload.projectId })
        )
      })
    ))
  ));

  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(loadProjects),
    exhaustMap((payload) => this.projectService.getAll()
      .pipe(
        switchMap((res: any) => [
          projectsLoadedSuccess({ projects: res.result }),
          openProject({ id: this.projectService.getProjectId()}),
        ]),
        catchError(e => (of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load projects failed!'
          }
        }))))
      ))
  ));

  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(updateProject),
    exhaustMap((payload) => this.projectService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.projectService.associate(payload.configData)),
        map((res: any) => {
          const message = `Updated ${payload.data.category} ${payload.data.name} successfully`;
          this.historyService.addNewHistoryIntoStorage(message);
        }),
        mergeMap(res => this.projectService.get(payload.id)),
        switchMap((res: any) => [
          projectUpdatedSuccess({ project: res.result }),
          loadProjects(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Project details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update Project failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private historyService: HistoryService,
  ) { }
}
