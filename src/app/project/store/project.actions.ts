import { createAction, props } from '@ngrx/store';

export const retrievedProjects = createAction(
    '[Project Component] retrievedProjects',
    props<{ data: any }>()
);