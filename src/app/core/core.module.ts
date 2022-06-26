import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GuardsModule } from './guards/guards.module';
import { StorageModule } from './storage/storage.module';
import { VersionService } from './version/version.service';

@NgModule({
  imports: [SharedModule, GuardsModule, StorageModule],
  providers: [
    VersionService,
  ],
})
export class CoreModule {}
