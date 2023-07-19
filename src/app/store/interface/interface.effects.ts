import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { interfacesLoadedSuccess, loadInterfaces } from './interface.actions';

@Injectable()
export class InterfacesEffects {

  loadInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(loadInterfaces),
    exhaustMap((data) => this.interfaceService.getByProjectIdAndCategory(data.projectId, data.mapCategory,  'all')
      .pipe(
        map(res => (interfacesLoadedSuccess({ interfaces: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private interfaceService: InterfaceService
  ) {}
}