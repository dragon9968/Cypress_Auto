import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes =
  [
    { path: 'notfound', component: NotfoundComponent },
    { path: '', component: LandingComponent },
    { path: '**', redirectTo: 'notfound', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
