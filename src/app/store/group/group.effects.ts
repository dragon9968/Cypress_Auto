import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { addGroup, groupAddedSuccess, groupUpdatedSuccess, groupsLoadedSuccess, loadGroups, updateGroup } from './group.actions';
import { GroupService } from 'src/app/core/services/group/group.service';
import { pushNotification } from '../app/app.actions';
import { reloadGroupBoxes } from '../map/map.actions';

@Injectable()
export class GroupsEffects {

  loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(loadGroups),
    exhaustMap((data) => this.groupService.getGroupByProjectId(data.projectId)
      .pipe(
        map(res => (groupsLoadedSuccess({ groups: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load Groups failed!'
          }
        })))
      ))
    )
  );

  addGroup$ = createEffect(() => this.actions$.pipe(
    ofType(addGroup),
    exhaustMap((payload) => this.groupService.add(payload.data)
      .pipe(
        mergeMap(res => this.groupService.get(res.result.id)),
        switchMap((res: any) => [
          groupAddedSuccess({ group: res.result }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Group details added!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Add group failed!'
          }
        })))
      )),
  ));

  updateGroup$ = createEffect(() => this.actions$.pipe(
    ofType(updateGroup),
    exhaustMap((payload) => this.groupService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.groupService.get(payload.id)),
        switchMap((res: any) => [
          groupUpdatedSuccess({ group: res.result }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Group details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update group failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private groupService: GroupService,
  ) {}
}