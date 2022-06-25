import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppStoreFeatures } from './app-store-features.enum';
import { RouterStoreModule } from './features/router/router-store.module';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      stateKey: AppStoreFeatures.ROUTER,
    }),
    StoreDevtoolsModule.instrument(),
    RouterStoreModule,
  ],
})
export class AppStoreModule {}
