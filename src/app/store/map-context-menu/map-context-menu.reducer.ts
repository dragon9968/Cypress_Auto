import { createReducer, on } from '@ngrx/store';
import { retrievedMapContextMenu } from './map-context-menu.actions';

const initialState = {} as any;

export const mapContextMenuReducer = createReducer(
  initialState,
  on(retrievedMapContextMenu, (state, { data }) => ({
    ...state,
    mapContextMenu: data,
  })),
);