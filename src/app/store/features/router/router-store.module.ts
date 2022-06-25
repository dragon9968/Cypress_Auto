import { NgModule } from '@angular/core';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { AppStoreFeatures } from '../../app-store-features.enum';

@NgModule({
  imports: [StoreModule.forFeature(AppStoreFeatures.ROUTER, routerReducer)],
})
export class RouterStoreModule {}
