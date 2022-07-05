import { createReducer, on } from '@ngrx/store';
import { retrievedMapData } from './map.actions';
import { MapDataModel } from '../models/map-data.model';

export const initialState = {} as MapDataModel;

export const mapReducer = createReducer(
  initialState,
  on(retrievedMapData, (_state, { data }) => data)
);