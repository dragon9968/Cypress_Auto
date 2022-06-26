import { createReducer, on } from '@ngrx/store';
import { getMapData, updateMapData } from '../actions/map.action';

export const initialState = {};

export const mapReducer = createReducer(
  initialState,
  on(getMapData, (state) => state),
  on(updateMapData, (state) => state),
);