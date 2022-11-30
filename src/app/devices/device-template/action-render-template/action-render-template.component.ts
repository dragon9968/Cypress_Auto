import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedTemplates } from 'src/app/store/template/template.actions';
import { AddEditTemplateDialogComponent } from '../add-edit-template-dialog/add-edit-template-dialog.component';

@Component({
  selector: 'app-action-render-template',
  templateUrl: './action-render-template.component.html',
  styleUrls: ['./action-render-template.component.scss']
})
export class ActionRenderTemplateComponent implements ICellRendererAngularComp {
  public id: any;
  id_template: any;
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store,
    private templateService: TemplateService,
  ) { }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.id_template = params.value;
    this.id = params.data.device_id;
  }

  updateTemplate() {
    this.templateService.get(this.id_template).subscribe(templateData => {
      const dialogData = {
        mode: 'update',
        genData: templateData.result,
        deviceId: this.id
      }
      const dialogRef = this.dialog.open(AddEditTemplateDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  deleteTemplate() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Are you sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templateService.delete(this.id_template).subscribe({
          next: (rest) => {
            this.toastr.success(`Delete Template successfully`);
          },
          error: (error) => {
            this.toastr.error(`Error while delete Template`);
          }
        })
      }
    });
  }
}
