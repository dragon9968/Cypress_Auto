import { createAction, props } from '@ngrx/store';

export const retrievedMapData = createAction(
    '[Map Component] retrievedMapData',
    props<{ mapCategory:string, collectionId: number, data: any }>()
);