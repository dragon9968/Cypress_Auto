import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProjectService } from './services/project.service';
import { selectActiveProjects, selectActiveProjectsTemplates, selectActiveTemplates, selectProject } from '../store/project/project.selectors';
import { AuthService } from '../core/services/auth/auth.service';
import { HelpersService } from '../core/services/helpers/helpers.service';
import { Router } from '@angular/router';
import { RouteSegments } from '../core/enums/route-segments.enum';
import { MatIconRegistry } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ExportProjectDialogComponent } from './export-project-dialog/export-project-dialog.component';
import { UserService } from '../core/services/user/user.service';
import { retrievedUser } from '../store/user/user.actions';
import { LocalStorageKeys } from "../core/storage/local-storage/local-storage-keys.enum";

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
  rowsSelectedId: any[] = [];
  isSubmitBtnDisabled: boolean = true;
  private gridApi!: GridApi;
  selectActiveProjects$ = new Subscription();
  selectActiveTemplates$ = new Subscription();
  selectActiveProjectsTemplates$ = new Subscription();
  rowData$!: Observable<any[]>;
  listUsers!: any[];
  projects!: any[];
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
    private toastr: ToastrService,
    private store: Store,
    private authService: AuthService,
    private helpersService: HelpersService,
    private userService: UserService,
  ) {
    const userId = this.authService.getUserId();
    this.isAdmin = this.router.url === this.projectAdminUrl
    if (this.router.url === this.templatePageUrl) {
      this.selectActiveTemplates$ = this.store.select(selectActiveTemplates).subscribe(activeTemplates => {
        if (activeTemplates) {
          this.projects = activeTemplates;
          this.processUpdateChangedByField(activeTemplates);
        }
      });
    } else if (this.router.url === this.projectPageUrl) {
      this.selectActiveProjects$ = this.store.select(selectActiveProjects).subscribe((activeProjects) => {
        if (activeProjects) {
          this.projectService.getShareProject(this.status, 'project').subscribe((resp: any) => {
            const shareProject = resp.result;
            let filteredProjectsByUserId: any[];
            filteredProjectsByUserId = activeProjects.filter((val: any) => val.created_by_fk === userId);
            if (shareProject) {
              filteredProjectsByUserId = [...filteredProjectsByUserId, ...shareProject];
            }
            this.projects = filteredProjectsByUserId;
            this.processUpdateChangedByField(filteredProjectsByUserId);
          })
        }
      });
    } else {
      this.selectActiveProjectsTemplates$ = this.store.select(selectActiveProjectsTemplates).subscribe(activeProjectsTemplates => {
        if (activeProjectsTemplates) {
          this.projects = activeProjectsTemplates;
          this.processUpdateChangedByField(activeProjectsTemplates);
        }
      })
    }
    iconRegistry.addSvgIcon('export-json', this.helpersService.setIconPath('/assets/icons/export-json.svg'));
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(data => this.store.dispatch(retrievedUser({ data: data.result })));
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
      const project = this.gridApi.getSelectedRows()[0];
      const projectIdSelected = project["id"];
      localStorage.setItem(LocalStorageKeys.MAP_STATE, project["map_state"]);
      this.projectService.openProject(projectIdSelected);
    }
  }

  selectedRows() {
    if (this.isAdmin) {
      this.rowsSelected = this.gridApi.getSelectedRows();
      this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
      if (this.rowsSelectedId.length == 0) {
        this.isDisableEdit = true;
        this.isDisableDelete = true;
        this.isDisableExport = true;
      } else if (this.rowsSelectedId.length == 1) {
        this.isDisableEdit = false;
        this.isDisableDelete = false;
        this.isDisableExport = false;
      } else if (this.rowsSelectedId.length > 1) {
        this.isDisableEdit = true;
        this.isDisableDelete = false;
        this.isDisableExport = false;
      }
    }
  }

  openProject() {
    const project = this.gridApi.getSelectedRows()[0];
    const projectIdSelected = project["id"];
    localStorage.setItem(LocalStorageKeys.MAP_STATE, project["map_state"]);
    this.projectService.openProject(projectIdSelected);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }

  editProject() {
    const selectedProject = this.projects.filter(p => p.id == this.rowsSelectedId[0])[0];
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
    const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
    const dialogData = {
      title: 'User confirmation needed',
      message: `Are you sure you want to delete ${suffix}?`,
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
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
          this.toastr.success('Deleted Project(s) successfully', 'Success');
          this.clearRow();
        })
      }
    })
  }

  exportProject() {
    const dialogData = {
      pks: this.rowsSelectedId,
      name: this.rowsSelectedId.length === 1 ? this.rowsSelected[0].name : 'Projects',
      type: 'admin'
    }
    this.dialog.open(ExportProjectDialogComponent, { disableClose: true, autoFocus: false, width: '400px', data: dialogData });
  }

  processUpdateChangedByField(data: any) {
    this.userService.getAll().subscribe(userData => {
      this.listUsers = userData.result;
      let projectData = data.map((item: any) => {
        const fullName = this.listUsers.find(val => item.changed_by_fk === val.id)
        const changedByValue = fullName?.first_name + ' ' + fullName?.last_name;
        return Object.assign({}, item, { changed_by: changedByValue })
      })

      if (this.gridApi) {
        this.gridApi.setRowData(projectData);
      } else {
        this.rowData$ = of(projectData);
      }
      this.updateRow();
    });
  }

}
