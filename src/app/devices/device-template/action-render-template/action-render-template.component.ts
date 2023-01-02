import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { retrievedTemplates } from "../../../store/template/template.actions";
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
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
        this.templateService.delete(this.id_template).pipe(
          catchError(response => {
            if (response.status == 400) {
              const message = response.error.message.split(':')[1];
              this.toastr.warning(message, 'Warning');
            } else {
              this.toastr.error('Delete template failed', 'Error');
            }
            return throwError(() => response.error)
          })
        ).subscribe(response => {
          this.templateService.getAll().subscribe((data: any)  => {
            const template = data.result.filter((ele: any) => ele.device_id === this.id)
            this.store.dispatch(retrievedTemplates({ data: template }))
          })
          this.toastr.success(`Delete template successfully`, 'Success');
        })
      }
    });
  }
}
