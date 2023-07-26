import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { PGsLoadedSuccess, loadPGs, pgUpdatedSuccess, updatePG } from './portgroup.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { updatePGInInterfaces } from '../interface/interface.actions';
import { pushNotification } from '../app/app.actions';

@Injectable()
export class PortGroupsEffects {

  loadPGs$ = createEffect(() => this.actions$.pipe(
    ofType(loadPGs),
    exhaustMap((payload) => this.portGroupService.getByProjectId(payload.projectId)
      .pipe(
        map(res => (PGsLoadedSuccess({ portgroups: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load Portgroups failed!'
          }
        })))
      ))
  )
  );

  updatePG$ = createEffect(() => this.actions$.pipe(
    ofType(updatePG),
    exhaustMap((payload) => this.portGroupService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.portGroupService.get(payload.id)),
        map((res: any) => {
          if (res.result.category != 'management') {
            this.helpersService.updatePGOnMap(`pg-${payload.id}`, res.result);
            this.helpersService.reloadGroupBoxes();
          }
          return res.result;
        }),
        switchMap((portgroup: any) => [
          pgUpdatedSuccess({ portgroup }),
          updatePGInInterfaces({ portgroup }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Port group details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update Port group failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private portGroupService: PortGroupService,
    private helpersService: HelpersService,
  ) { }
}