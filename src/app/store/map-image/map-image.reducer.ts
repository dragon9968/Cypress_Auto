import { createReducer, on } from '@ngrx/store';
import { retrievedImages, retrievedMapImages } from './map-image.actions';
import { MapImageState } from './map-image.state';

const initialState = {} as MapImageState;

export const mapImagesReducer = createReducer(
  initialState,
  on(retrievedMapImages, (state, { mapImage }) => ({
    ...state,
    mapImages: mapImage,
  })),
  on(retrievedImages, (state, { data }) => ({
    ...state,
    images: data,
  })),
);