import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { NodeService } from 'src/app/core/services/node/node.service';
import { loadNodes, nodesLoadedSuccess } from './node.actions';

@Injectable()
export class NodesEffects {

  loadNodes$ = createEffect(() => this.actions$.pipe(
    ofType(loadNodes),
    exhaustMap((data) => this.nodeService.getNodesByProjectId(data.projectId)
      .pipe(
        map(res => (nodesLoadedSuccess({ nodes: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private nodeService: NodeService
  ) {}
}