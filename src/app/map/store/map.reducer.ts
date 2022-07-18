import { createReducer, on } from '@ngrx/store';
import { retrievedMapData } from './map.actions';
import { MapDataModel } from '../models/map-data.model';

const initialState = {} as MapDataModel;

export const mapReducer = createReducer(
    initialState,
    on(retrievedMapData, (state, { data }) => ({
        ...state,
        mapItems: data.map_items,
        mapProperties: data.map_properties,
        defaultPreferences: data.map_properties.default_preferences,
        nodes: data.map_items.nodes,
        interfaces: data.map_items.interfaces,
        groupBoxes: data.map_items.group_boxes,
        mapBackgrounds: data.map_items.map_backgrounds
    }))
);