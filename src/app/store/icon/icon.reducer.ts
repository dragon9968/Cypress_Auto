import { createReducer, on } from '@ngrx/store';
import { IconState } from 'src/app/store/icon/icon.state';
import { retrievedIcons } from './icon.actions';

const initialState = {} as IconState;

export const iconReducer = createReducer(
  initialState,
  on(retrievedIcons, (state, { data }) => ({
    ...state,
    icons: data,
  })),
);