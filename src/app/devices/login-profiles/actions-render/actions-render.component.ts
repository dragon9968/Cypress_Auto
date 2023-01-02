import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';
import { EditLoginProfilesDialogComponent } from '../edit-login-profiles-dialog/edit-login-profiles-dialog.component';

@Component({
  selector: 'app-actions-render',
  templateUrl: './actions-render.component.html',
  styleUrls: ['./actions-render.component.scss']
})
export class ActionsRenderComponent implements ICellRendererAngularComp {
  id: any;
  constructor (
    private loginProfileService: LoginProfileService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store,
  ) { }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  openLoginProfile() {
    this.loginProfileService.getById(this.id).subscribe(loginData => {
      const dialogData = {
        mode: 'view',
        genData: loginData.result
      }
      const dialogRef = this.dialog.open(EditLoginProfilesDialogComponent, {
        width: '450px',
        data: dialogData
      });
    })
  }

  updateLoginProfiles() {
    this.loginProfileService.getById(this.id).subscribe(loginData => {
      const dialogData = {
        mode: 'update',
        genData: loginData.result
      }
      const dialogRef = this.dialog.open(EditLoginProfilesDialogComponent, {
        width: '450px',
        data: dialogData
      });
    })
      
  }

  deleteLoginProfiles() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loginProfileService.delete(this.id).subscribe({
          next: (rest) => {
            this.toastr.success('Deleted Row successfully');
            this.loginProfileService.getAll().subscribe((data: any) => this.store.dispatch(retrievedLoginProfiles({data: data.result})));
          },
          error: (error) => {
            if (error.status == 422) {
              this.toastr.warning('Associated data exists, please delete them first');
            }
          }
        })
      }
    })
  }

}
