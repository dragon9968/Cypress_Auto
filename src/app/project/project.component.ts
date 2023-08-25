import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, Subscription } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProjectService } from './services/project.service';
import { selectActiveProjects, selectActiveProjectsTemplates, selectActiveTemplates, selectSharedProjects } from '../store/project/project.selectors';
import { AuthService } from '../core/services/auth/auth.service';
import { HelpersService } from '../core/services/helpers/helpers.service';
import { Router } from '@angular/router';
import { RouteSegments } from '../core/enums/route-segments.enum';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ExportProjectDialogComponent } from './export-project-dialog/export-project-dialog.component';
import { removeProjects } from '../store/project/project.actions';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  quickFilterValue = '';
  routeSegments = RouteSegments;
  id: any;
  category: any;
  categoryPage: any;
  status = 'active';
  rowsSelected: any[] = [];
  rowsSelectedIds: any[] = [];
  isSubmitBtnDisabled: boolean = true;
  private gridApi!: GridApi;
  selectActiveProjects$ = new Subscription();
  selectActiveTemplates$ = new Subscription();
  selectActiveProjectsTemplates$ = new Subscription();
  selectSharedProjects$ = new Subscription();
  rowData$!: Observable<any[]>;
  projects: any[] = [];
  sharedProjects: any[] = [];
  isAdmin = true;
  isDisableEdit = true;
  isDisableDelete = true;
  isDisableExport = true;
  projectAdminUrl = `${this.routeSegments.ROOT + this.routeSegments.PROJECTS_ADMINISTRATION}`
  templatePageUrl = `${this.routeSegments.ROOT + this.routeSegments.PROJECTS_TEMPLATES}`
  projectPageUrl = `${this.routeSegments.ROOT + this.routeSegments.PROJECTS}`

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52,
      hide: this.router.url !== this.projectAdminUrl
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
      field: 'category',
      flex: 1,
      hide: this.router.url !== this.projectAdminUrl
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
    private dialog: MatDialog,
    private router: Router,
    iconRegistry: MatIconRegistry,
    private store: Store,
    private authService: AuthService,
    private helpersService: HelpersService,
  ) {
    const userId = this.authService.getUserId();
    this.isAdmin = this.router.url === this.projectAdminUrl;
    if (this.router.url === this.templatePageUrl) {
      this.selectActiveTemplates$ = this.store.select(selectActiveTemplates).subscribe(activeTemplates => {
        if (activeTemplates) {
          this.projects = activeTemplates;
          this.setRowData(this.projects);
        }
      });
    } else if (this.router.url === this.projectPageUrl) {
      this.selectSharedProjects$ = this.store.select(selectSharedProjects).subscribe(sharedProjects => {
        if (sharedProjects) {
          this.sharedProjects = sharedProjects;
        }
      });
      this.selectActiveProjects$ = this.store.select(selectActiveProjects).subscribe((activeProjects) => {
        if (activeProjects) {
          const filteredProjectsByUserId = activeProjects.filter((val: any) => val.created_by_fk === userId);
          this.projects = filteredProjectsByUserId.concat(this.sharedProjects);
          this.setRowData(this.projects);
        }
      });
    } else {
      this.selectActiveProjectsTemplates$ = this.store.select(selectActiveProjectsTemplates).subscribe(activeProjectsTemplates => {
        if (activeProjectsTemplates) {
          this.projects = activeProjectsTemplates;
          this.setRowData(this.projects);
        }
      })
    }
    iconRegistry.addSvgIcon('export-json', this.helpersService.setIconPath('/assets/icons/export-json.svg'));
  }

  ngOnInit(): void {
    if (!this.isAdmin && this.router.url === this.projectPageUrl) {
      this.categoryPage = 'project';
    } else if (!this.isAdmin && this.router.url === this.templatePageUrl) {
      this.categoryPage = 'template'
    }
  }

  ngOnDestroy(): void {
    this.selectActiveProjects$.unsubscribe();
    this.selectActiveTemplates$.unsubscribe();
    this.selectActiveProjectsTemplates$.unsubscribe();
    this.selectSharedProjects$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.setRowData(this.projects);
  }

  setRowData(rowData: any[]) {
    this.gridApi?.setRowData(rowData);
  }

  setRowActive() {
    if (this.gridApi && this.rowsSelectedIds.length > 0) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedIds.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
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
    if (!this.isAdmin) {
      this.openProject();
    }
  }

  selectedRows() {
    if (this.isAdmin) {
      this.rowsSelected = this.gridApi.getSelectedRows();
      this.rowsSelectedIds = this.rowsSelected.map(ele => ele.id);
      if (this.rowsSelectedIds.length == 0) {
        this.isDisableEdit = true;
        this.isDisableDelete = true;
        this.isDisableExport = true;
      } else if (this.rowsSelectedIds.length == 1) {
        this.isDisableEdit = false;
        this.isDisableDelete = false;
        this.isDisableExport = false;
      } else if (this.rowsSelectedIds.length > 1) {
        this.isDisableEdit = true;
        this.isDisableDelete = false;
        this.isDisableExport = false;
      }
    }
  }

  openProject() {
    const project = this.gridApi.getSelectedRows()[0];
    this.projectService.openProject(project["id"], project["map_state"]);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedIds = [];
  }

  editProject() {
    const selectedProject = this.projects.filter(p => p.id == this.rowsSelectedIds[0])[0];
    const dialogData = {
      mode: 'update',
      category: selectedProject.category,
      genData: selectedProject
    }
    this.dialog.open(EditProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '600px',
      data: dialogData
    });
  }

  deleteProject() {
    const suffix = this.rowsSelectedIds.length === 1 ? 'this item' : 'these items';
    const dialogData = {
      title: 'User confirmation needed',
      message: `Are you sure you want to delete ${suffix}?`,
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(removeProjects({ ids: this.rowsSelectedIds }));
        if (this.rowsSelectedIds.includes(this.projectService.getProjectId())) {
          this.projectService.closeProject();
        }
        this.clearRow();
      }
    })
  }

  exportProject() {
    const dialogData = {
      pks: this.rowsSelectedIds,
      name: this.rowsSelectedIds.length === 1 ? this.rowsSelected[0].name : 'Projects',
      type: 'admin'
    }
    this.dialog.open(ExportProjectDialogComponent, { disableClose: true, autoFocus: false, width: '400px', data: dialogData });
  }
}
