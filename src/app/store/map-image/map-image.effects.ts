import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { pushNotification } from '../app/app.actions';
import { loadMapImages, mapImagesLoadedSuccess } from './map-image.actions';
import { MapImageService } from 'src/app/core/services/map-image/map-image.service';
import { of } from 'rxjs';

@Injectable()
export class MapImagesEffects {

  loadMapImages$ = createEffect(() => this.actions$.pipe(
    ofType(loadMapImages),
    exhaustMap((payload) => this.mapImageService.getMapImageByProjectId(Number(payload.projectId))
      .pipe(
        map(res => (mapImagesLoadedSuccess({ mapImages: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load Map Images failed!'
          }
        })))
      ))
  )
  );

  constructor(
    private actions$: Actions,
    private mapImageService: MapImageService
  ) { }
}