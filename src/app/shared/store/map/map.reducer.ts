import { createReducer, on } from '@ngrx/store';
import { MapModel } from '../../models/map.model';
import { retrievedMap } from './map.actions';

const initialState = {} as MapModel;

export const mapReducer = createReducer(
  initialState,
  on(retrievedMap, (state, { data }) => ({
    ...state,
    mapItems: data.map_items,
    mapProperties: data.map_properties,
    defaultPreferences: data.map_properties.default_preferences,
    nodes: data.map_items.nodes,
    interfaces: data.map_items.interfaces,
    groupBoxes: data.map_items.group_boxes,
    mapBackgrounds: data.map_items.map_backgrounds
  })),
);