import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { selectConfigTemplates } from 'src/app/store/config-template/config-template.selectors';
import { ActionsRendersConfigTemplateComponent } from './actions-renders-config-template/actions-renders-config-template.component';
import { AddEditConfigTemplateComponent } from './add-edit-config-template/add-edit-config-template.component';

@Component({
  selector: 'app-config-templates',
  templateUrl: './config-templates.component.html',
  styleUrls: ['./config-templates.component.scss']
})
export class ConfigTemplatesComponent implements OnInit, OnDestroy {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
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
      headerName: '',
      field: 'id',
      suppressSizeToFit: true,
      width: 200,
      cellRenderer: ActionsRendersConfigTemplateComponent,
      cellClass: 'config-template-actions',
      sortable: false,
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
  ];
  constructor(
    private store: Store,
    private configTemplateService: ConfigTemplateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,

  ) {
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe((data: any) => {
      this.rowData$ = of(data);
    });
    iconRegistry.addSvgIcon('export-csv', this._setPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this._setPath('/assets/icons/export-json.svg'));
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
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  private _setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addConfigTemplate() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        description: '',
      }
    }
    const dialogRef = this.dialog.open(AddEditConfigTemplateComponent, {
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  exportJson() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.configTemplateService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Config-Export.json', file);
        this.toastr.success(`Exported Config as ${'json'.toUpperCase()} file successfully`);
      })
      this.gridApi.deselectAll();
    }
  }
}
