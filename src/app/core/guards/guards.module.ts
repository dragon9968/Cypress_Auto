import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { AuthGuardAdmin } from "./auth-admin.guard";

@NgModule({
  providers: [AuthGuard, AuthGuardAdmin],
})
export class GuardsModule {}
