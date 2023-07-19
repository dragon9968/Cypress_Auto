import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { groupsLoadedSuccess, loadGroups } from './group.actions';
import { GroupService } from 'src/app/core/services/group/group.service';

@Injectable()
export class GroupsEffects {

  loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(loadGroups),
    exhaustMap((data) => this.groupService.getGroupByProjectId(data.projectId)
      .pipe(
        map(res => (groupsLoadedSuccess({ groups: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private groupService: GroupService
  ) {}
}