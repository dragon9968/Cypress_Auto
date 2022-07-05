import { createAction, props } from '@ngrx/store';
import { MapDataModel } from '../models/map-data.model';

export const retrievedMapData = createAction(
    '[Map Component] retrievedMapData',
    props<{ data: MapDataModel }>()
);