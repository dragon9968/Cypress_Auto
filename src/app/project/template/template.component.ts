import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedProjectsTemplate } from 'src/app/store/project/project.actions';
import { selectProjectTemplate } from 'src/app/store/project/project.selectors';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';
import { ExportProjectDialogComponent } from '../export-project-dialog/export-project-dialog.component';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  quickFilterValue = '';
  id: any;
  category = 'template';
  status = 'active';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  isSubmitBtnDisabled: boolean = true;
  private gridApi!: GridApi;
  selectProjectTemplate$ = new Subscription();
  rowData$!: Observable<any[]>;
  projectTemplate!: any[];
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
    {
      field: 'name',
      flex: 1,
    },
    {
      field: 'description',
      flex: 1,
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      flex: 1,
    },
    {
      headerName: 'Created On',
      field: 'created_on',
      flex: 1,
      cellRenderer: (param: any) => new Date(param.value).toLocaleString(),
    },
    {
      headerName: 'Changed By',
      field: 'changed_by',
      flex: 1,
    },
    {
      headerName: 'Changed On',
      field: 'changed_on',
      flex: 1,
      cellRenderer: (param: any) => new Date(param.value).toLocaleString(),
    }
  ];

  constructor(
    private projectService: ProjectService,
    iconRegistry: MatIconRegistry,
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService
  ) {
    this.selectProjectTemplate$ = this.store.select(selectProjectTemplate).subscribe(templateData => {
      if (templateData) {
        if (this.gridApi) {
          this.gridApi.setRowData(templateData);
        } else {
          this.rowData$ = of(templateData);
        }
        this.updateRow();
      }
    })
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
  }

  ngOnInit(): void {
    this.projectService.getProjectByStatusAndCategory(this.status, this.category).subscribe((data: any) => this.store.dispatch(retrievedProjectsTemplate({ template: data.result })));
  }

  ngOnDestroy(): void {
    this.selectProjectTemplate$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }


  onSelectionChanged() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length == 1) {
      this.isSubmitBtnDisabled = false;
    } else {
      this.isSubmitBtnDisabled = true;
    }
  }

  onRowDoubleClicked() {
    const collectionIdSelected = this.gridApi.getSelectedRows()[0]["id"];
    this.projectService.openProject(collectionIdSelected);
  }

  openProject() {
    const collectionIdSelected = this.gridApi.getSelectedRows()[0]["id"];
    this.projectService.openProject(collectionIdSelected);
  }

  editTemplate() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.projectService.getProjectByStatusAndCategory(this.status, this.category).subscribe(data => {
        this.store.dispatch(retrievedProjectsTemplate({ template: data.result }));
        this.projectService.get(this.rowsSelectedId[0]).subscribe(data => {
          const dialogData = {
            mode: 'update',
            category: 'template',
            genData: data.result
          }
          this.dialog.open(EditProjectDialogComponent, {
            autoFocus: false,
            width: '600px',
            data: dialogData
          });
        })
      });
    } else {
      this.toastr.info('Bulk edits do not apply to template.<br> Please select only one template',
          'Info', { enableHtml: true });
    }
  }

  deleteTemplate() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(this.rowsSelectedId.map(id => {
            const jsonData = {
              pk: id,
              status: 'delete'
            }
            return this.projectService.deleteOrRecoverProject(jsonData).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                return throwError(() => e);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted Template(s) successfully', 'Success');
            this.projectService.getProjectByStatusAndCategory(this.status, this.category).subscribe((data: any) => this.store.dispatch(retrievedProjectsTemplate({ template: data.result })));
            this.clearRow();
          })
        }
      })
    }
  }

  exportTemplate() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        pks: this.rowsSelectedId
      }
      this.dialog.open(ExportProjectDialogComponent, { autoFocus: false, width: '400px', data: dialogData });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }
}
