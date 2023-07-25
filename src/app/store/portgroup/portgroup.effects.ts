import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { PGsLoadedSuccess, loadPGs } from './portgroup.actions';

@Injectable()
export class PortGroupsEffects {

  loadPGs$ = createEffect(() => this.actions$.pipe(
    ofType(loadPGs),
    exhaustMap((payload) => this.portGroupService.getByProjectId(payload.projectId)
      .pipe(
        map(res => (PGsLoadedSuccess({ portgroups: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private portGroupService: PortGroupService
  ) {}
}