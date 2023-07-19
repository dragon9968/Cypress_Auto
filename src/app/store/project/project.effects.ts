import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { GroupService } from 'src/app/core/services/group/group.service';
import { loadProject, projectLoadedSuccess } from './project.actions';
import { ProjectService } from 'src/app/project/services/project.service';

@Injectable()
export class ProjectEffects {

  loadProject$ = createEffect(() => this.actions$.pipe(
    ofType(loadProject),
    exhaustMap((data) => this.projectService.get(+data.projectId)
      .pipe(
        map(res => (projectLoadedSuccess({ project: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}
}