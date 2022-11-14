import { createReducer, on } from '@ngrx/store';
import { retrievedMapImages } from './map-image.actions';
import { MapImageState } from './map-image.state';

const initialState = {} as MapImageState;

export const mapImagesReducer = createReducer(
  initialState,
  on(retrievedMapImages, (state, { data }) => ({
    ...state,
    mapImages: data,
  })),
);