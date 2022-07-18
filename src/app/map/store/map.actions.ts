import { createAction, props } from '@ngrx/store';

export const retrievedMapData = createAction(
    '[Map Component] retrievedMapData',
    props<{ data: any }>()
);