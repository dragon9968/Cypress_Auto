import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedMapPref } from 'src/app/store/map-style/map-style.actions';
import { AddEditMapprefDialogComponent } from '../add-edit-mappref-dialog/add-edit-mappref-dialog.component';

@Component({
  selector: 'app-actions-render-mappre',
  templateUrl: './actions-render-mappre.component.html',
  styleUrls: ['./actions-render-mappre.component.scss']
})
export class ActionsRenderMappreComponent implements ICellRendererAngularComp {
  id: any;

  constructor(
    private mapPrefService: MapPrefService,
    private dialog: MatDialog,
    private store: Store,
    private toastr: ToastrService,
  ) { }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  openMapPref() { 
    this.mapPrefService.get(this.id).subscribe(mapPrefData => {
      const dialogData = {
        autoFocus: false,
        mode: 'view',
        genData: mapPrefData.result
      }
      const dialogRef = this.dialog.open(AddEditMapprefDialogComponent, {
        width: '450px',
        data: dialogData
      });
    })
  }

  updateMapPref() {
    this.mapPrefService.get(this.id).subscribe(mapPrefData => {
      const dialogData = {
        mode: 'update',
        genData: mapPrefData.result,
      }
      const dialogRef = this.dialog.open(AddEditMapprefDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  deleteMappref() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.id === 1) {
          this.toastr.warning("Cannot not delete default preference")
        }else {
          this.mapPrefService.delete(this.id).subscribe({
            next: (rest) => {
              this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPref({data: data.result})));
              this.toastr.success(`Delete Preferences successfully`);
            },
            error: (error) => {
              this.toastr.error(`Error while delete Preferences`);
            }
          })
        }
      }
    });
  }

}
