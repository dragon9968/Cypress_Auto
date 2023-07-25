import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AppPrefService } from 'src/app/core/services/app-pref/app-pref.service';
import { appPrefLoadedSuccess, loadAppPref } from './app-pref.actions';

@Injectable()
export class AppPrefEffects {

  loadAppPref$ = createEffect(() => this.actions$.pipe(
    ofType(loadAppPref),
    exhaustMap(() => this.appPrefService.getByCategory('app')
      .pipe(
        map(res => (appPrefLoadedSuccess({ appPref: res.result[0] }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private appPrefService: AppPrefService,
  ) {}
}