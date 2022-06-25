import { RouterReducerState } from '@ngrx/router-store';
import { AppStoreFeatures } from './app-store-features.enum';

export interface AppStoreState {
  [AppStoreFeatures.ROUTER]: RouterReducerState;
}
