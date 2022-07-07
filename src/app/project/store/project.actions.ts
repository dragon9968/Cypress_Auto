import { createAction, props } from '@ngrx/store';
import { ProjectModel } from '../models/project.model';

export const retrievedProjects = createAction(
    '[Project Component] retrievedProjects',
    props<{ data: any }>()
);

export const retrievedProject = createAction(
    '[Project Component] retrievedProject',
    props<{ data: any }>()
);