import { createReducer, on } from '@ngrx/store';
import { retrievedMapCategory } from './map-category.actions';
const initialState = {} as any;
export const mapCategoryReducer = createReducer(
  initialState,
  on(retrievedMapCategory, (state, { mapCategory }) => ({
    ...state,
    mapCategory: mapCategory,
  })),
);