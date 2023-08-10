import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { pushNotification } from '../app/app.actions';
import { addNewMapImage, addNewMapImageToMap, loadMapImages, mapImageAddedSuccess, mapImagesLoadedSuccess } from './map-image.actions';
import { MapImageService } from 'src/app/core/services/map-image/map-image.service';
import { of } from 'rxjs';
import { reloadGroupBoxes } from '../map/map.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';

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
  addNewMapImage$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapImage),
    exhaustMap(payload => this.mapImageService.add(payload.mapImage)
      .pipe(
        mergeMap((res: any) => this.mapImageService.get(Number(res.id))),
        switchMap((res: any) => [
          mapImageAddedSuccess({ mapImage: res.result }),
          addNewMapImageToMap({ id: res.id }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Add map image successfully!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Add map image failed'
          }
        })))
    ))
  ));

  addNewMapImageToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapImageToMap),
    tap(payload => this.helpersService.addMapImageToMap(payload.id))
  ), { dispatch: false })

  constructor(
    private actions$: Actions,
    private mapImageService: MapImageService,
    private helpersService: HelpersService
  ) { }
}