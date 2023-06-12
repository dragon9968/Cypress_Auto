import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { catchError } from "rxjs/operators";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { selectConfigTemplates } from 'src/app/store/config-template/config-template.selectors';
import { AddEditConfigTemplateComponent } from './add-edit-config-template/add-edit-config-template.component';
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddRouteDialogComponent } from "./add-route-dialog/add-route-dialog.component";
import { AddFirewallRuleDialogComponent } from "./add-firewall-rule-dialog/add-firewall-rule-dialog.component";
import { AddDomainMembershipDialogComponent } from "./add-domain-membership-dialog/add-domain-membership-dialog.component";
import { AddEditRolesServicesDialogComponent } from "./add-edit-roles-services-dialog/add-edit-roles-services-dialog.component";
import { PageName } from "../../shared/enums/page-name.enum";
import { ImportDialogComponent } from "../../shared/components/import-dialog/import-dialog.component";

@Component({
  selector: 'app-config-templates',
  templateUrl: './config-templates.component.html',
  styleUrls: ['./config-templates.component.scss']
})
export class ConfigTemplatesComponent implements OnInit, OnDestroy {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  id: any;
  quickFilterValue = '';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  rowData$! : Observable<any[]>;
  private gridApi!: GridApi;
  selectConfigTemplates$ = new Subscription();
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    { field: 'name',
    },
    { field: 'description'},
    {
      headerName: 'Join Domain',
      field: 'configuration.join_domain',
      cellRenderer: (param: any) => param.value
    },
    {
      headerName: 'Firewall',
      field: 'configuration.firewall_rule',
      autoHeight: true,
      cellRenderer: function(param: any) {
        if (param.value){
          let html_str = "<div>"
          for(let i in param.value) {
            let item_html = `<div style='text-align:left'>Category: <b>${param.value[i]['category']}</b></div>`;
            html_str += item_html;
          }
          html_str += "</div>"

          return html_str;
        }else {
          return
        }
      },
    },
    {
      headerName: 'Roles & Services',
      suppressSizeToFit: true,
      autoHeight: true,
      field: 'configuration.role_services',
      cellRenderer: function(param: any) {
        if (param.value){
          let html_str = ""
          for(let i in param.value) {
            let item_html = `<div>${param.value[i]}</div>`;
            html_str += item_html;
          }
          return html_str;
        }else {
          return
        }
      }
    },
    {
      headerName: 'Static Routes',
      field: 'configuration.static_routes',
      suppressSizeToFit: true,
      minWidth: 300,
      autoHeight: true,
      cellRenderer: function(param: any) {
        if (param.value){
          let html_str = "<div>"
          for(let i in param.value) {
            let item_html = `<div style='text-align:left'>interface: <b>${param.value[i]['interface']}</b>, route: <b>${param.value[i]['route']}</b>, next_hop: <b>${param.value[i]['next_hop']}</b></div>`;
            html_str += item_html;
          }
          html_str += "</div>"

          return html_str;
        }else {
          return
        }
      },
    },
    {
      headerName: 'OSPF',
      field: 'configuration.ospf',
      suppressSizeToFit: true,
      minWidth: 300,
      autoHeight: true,
      cellRenderer: function(param: any) {
        if (param.value){
          let html_str = "<div>"
          for(let i in param.value) {
            let item_html = `<div style='text-align:left'>Networks: <b>${param.value[i]['networks']}</b></div>`;
            html_str += item_html;
          }
          html_str += "</div>"

          return html_str;
        }else {
          return
        }
      },
    },
    {
      headerName: 'BGP',
      field: 'configuration.bgp',
      suppressSizeToFit: true,
      minWidth: 60,
      autoHeight: true,
      cellRenderer: function(param: any) {
        if (param.value){
          let html_str = "<div>"
          for(let i in param.value) {
            let item_html = `<div style='text-align:left'>IP: <b>${param.value[i]['ip_address']}</b></div>`;
            html_str += item_html;
          }
          html_str += "</div>"

          return html_str;
        }else {
          return
        }
      },
    },
  ];
  constructor(
    private store: Store,
    private configTemplateService: ConfigTemplateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    iconRegistry: MatIconRegistry,

  ) {
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
   }

  ngOnInit(): void {
    this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectConfigTemplates$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
    this.id = this.rowsSelectedId[0];
  }

  updateRow() {
    if (this.gridApi && this.rowsSelectedId.length > 0) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  addConfigTemplate() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        description: '',
      }
    }
    this.dialog.open(AddEditConfigTemplateComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  exportJson() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.configTemplateService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Config-Export.json', file);
        this.toastr.success(`Exported Config as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  onRowDoubleClick(row: RowDoubleClickedEvent) {
    this.configTemplateService.get(row.data.id).subscribe(configTemplateData => {
      const dialogData = {
        mode: 'view',
        genData: configTemplateData.result
      }
      this.dialog.open(AddEditConfigTemplateComponent, {
        disableClose: true,
        autoFocus: false,
        width: '1000px',
        data: dialogData,
        panelClass: 'custom-node-form-modal'
      });
    })
  }

  updateConfigTemplate() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.configTemplateService.get(this.id).subscribe(configTemplateData => {
        const dialogData = {
          mode: 'update',
          genData: configTemplateData.result
        }
        this.dialog.open(AddEditConfigTemplateComponent, {
          disableClose: true,
          autoFocus: false,
          width: '1000px',
          data: dialogData,
          panelClass: 'custom-node-form-modal'
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to config template.<br>Please select only one config template',
        'Info', { enableHtml: true });
    }
  }

  deleteConfigTemplate() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `You sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowsSelectedId.map(id => {
            this.configTemplateService.delete(id).pipe(
              catchError(error => {
                this.toastr.error('Delete configuration template failed!', 'Error');
                return throwError(() => error);
              })
            ).subscribe(() =>{
              this.configTemplateService.getAll().subscribe(
                (data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result}))
              );
              this.clearRow();
              this.toastr.success(`Delete configuration template successfully`, 'Success');
            })
          })
        }
      });
    }
  }

  addRouter() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.configTemplateService.get(this.id).subscribe(configTemplateData => {
        const dialogData = {
          mode: 'update',
          genData: configTemplateData.result
        }
        this.dialog.open(AddRouteDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Add router do not apply to multiple config template.<br>Please select only one config template.',
        'Info', { enableHtml: true });
    }
  }

  addFirewallRule() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.configTemplateService.get(this.id).subscribe(configTemplateData => {
        const dialogData = {
          mode: 'update',
          genData: configTemplateData.result
        }
        this.dialog.open(AddFirewallRuleDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Add firewall rule do not apply to multiple config template.<br>Please select only one config template.',
        'Info', { enableHtml: true });
    }
  }

  openDomainMembership() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.configTemplateService.get(this.id).subscribe(configTemplateData => {
        const dialogData = {
          mode: 'update',
          genData: configTemplateData.result
        }
        this.dialog.open(AddDomainMembershipDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Add domain membership do not apply to multiple config template.<br>Please select only one config template.',
        'Info', { enableHtml: true });
    }
  }

  openRoleService() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.configTemplateService.get(this.id).subscribe(configTemplateData => {
        const dialogData = {
          mode: 'update',
          genData: configTemplateData.result
        }
        this.dialog.open(AddEditRolesServicesDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Add role and service do not apply to multiple config template.<br>Please select only one config template.',
        'Info', { enableHtml: true });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelectedId = [];
    this.rowsSelected = [];
  }

  import() {
    const dialogData = {
      pageName: PageName.CONFIGURATION_TEMPLATE
    }
    this.dialog.open(ImportDialogComponent, { data: dialogData, width: '450px' })
  }
}
