import { NgModule } from '@angular/core';
import { CookieService } from './cookie/cookie.service';
import { LocalStorageService } from './local-storage/local-storage.service';

@NgModule({
  providers: [CookieService, LocalStorageService],
})
export class StorageModule {}
