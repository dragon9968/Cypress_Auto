import { createReducer, on } from '@ngrx/store';
import { retrievedMapData } from './map.action';
import { MapDataModel } from '../models/map-data.model';

export const initialState: MapDataModel = {
  map_items: {},
  map_properties: {}
};

export const mapReducer = createReducer(
  initialState,
  on(retrievedMapData, (state, { mapData }) => mapData)
);