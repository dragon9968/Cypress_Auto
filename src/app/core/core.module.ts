import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { GuardsModule } from './guards/guards.module';
import { StorageModule } from './storage/storage.module';
import { VersionService } from './version/version.service';

@NgModule({
  imports: [SharedModule, GuardsModule, StorageModule],
  providers: [
    VersionService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        panelClass: ['e-dialog'],
        disableClose: true,
        width: 500,
        data: {},
      },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
      },
    },
  ],
})
export class CoreModule {}
