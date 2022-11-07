import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { AddDomainMembershipDialogComponent } from '../add-domain-membership-dialog/add-domain-membership-dialog.component';
import { AddEditConfigTemplateComponent } from '../add-edit-config-template/add-edit-config-template.component';
import { AddEditRolesServicesDialogComponent } from '../add-edit-roles-services-dialog/add-edit-roles-services-dialog.component';
import { AddFirewallRuleDialogComponent } from '../add-firewall-rule-dialog/add-firewall-rule-dialog.component';
import { AddRouteDialogComponent } from '../add-route-dialog/add-route-dialog.component';
import { ShowConfigTemplateDialogComponent } from '../show-config-template-dialog/show-config-template-dialog.component';

@Component({
  selector: 'app-actions-renders-config-template',
  templateUrl: './actions-renders-config-template.component.html',
  styleUrls: ['./actions-renders-config-template.component.scss']
})
export class ActionsRendersConfigTemplateComponent implements ICellRendererAngularComp {
  id: any;
  constructor(
    private configTemplateService: ConfigTemplateService,
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
  
  updateConfigTemplate() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(AddEditConfigTemplateComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  deleteConfigTemplate() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.configTemplateService.delete(this.id).subscribe({
          next: (rest) => {
            this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
            this.toastr.success(`Delete Configuration Template successfully`);
          },
          error: (error) => {
            this.toastr.error(`Error while delete Configuration Template`);
          }
        })
      }
    });
  }

  addRouter() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(AddRouteDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  addFirewallRule() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(AddFirewallRuleDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  openDomainMembership() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(AddDomainMembershipDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  openRoleService() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(AddEditRolesServicesDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  openConfigTemplate() {
    this.configTemplateService.getById(this.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'update',
        genData: configTemplateData.result
      }
      const dialogRef = this.dialog.open(ShowConfigTemplateDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }
}
