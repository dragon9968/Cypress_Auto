import { NgModule } from '@angular/core';
import { GuardsModule } from './guards/guards.module';
import { StorageModule } from './storage/storage.module';


@NgModule({
  declarations: [],
  imports: [
    GuardsModule,
    StorageModule
  ],
  exports: [
    GuardsModule,
    StorageModule
  ],
})
export class CoreModule {}
