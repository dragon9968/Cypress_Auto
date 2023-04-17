import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProjectService } from './services/project.service';
import { selectAllProjects, selectProjects, selectProjectTemplate } from '../store/project/project.selectors';
import { retrievedAllProjects, retrievedProjects, retrievedProjectsTemplate } from '../store/project/project.actions';
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
import { selectUser } from '../store/user/user.selectors';

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
  private selectProjects$ = new Subscription();
  selectProjectTemplate$ = new Subscription();
  selectUser$ = new Subscription();
  selectAllProjects$ = new Subscription();
  rowData$!: Observable<any[]>;
  listUsers!: any[];
  isAdmin = true;
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
      this.selectProjectTemplate$ = this.store.select(selectProjectTemplate).subscribe(templateData => {
        this.processUpdateChangedByField(templateData);
      });
    } else if (this.router.url === this.projectPageUrl) {
      this.selectProjects$ = this.store.select(selectProjects)
      .subscribe((data) => {
        if (data) {
          this.projectService.getShareProject(this.status, 'project').subscribe((resp: any) => {
            const shareProject = resp.result;
            let filteredProjectsByUserId: any[];
            filteredProjectsByUserId = data.filter((val: any) => val.created_by_fk === userId);
            if (shareProject) {
              filteredProjectsByUserId = [...filteredProjectsByUserId, ...shareProject];
            }
            this.processUpdateChangedByField(filteredProjectsByUserId);
          })
        }
      });
    } else {
      this.selectAllProjects$ = this.store.select(selectAllProjects).subscribe((data: any) => {
        if (data) {
          this.processUpdateChangedByField(data);
        }
      })
    }
      iconRegistry.addSvgIcon('export-json', this.helpersService.setIconPath('/assets/icons/export-json-info-panel.svg'));
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(data => this.store.dispatch(retrievedUser({ data: data.result })));
    if (!this.isAdmin && this.router.url === this.projectPageUrl) {
      this.categoryPage = 'project'
      this.projectService.getProjectByStatusAndCategory(this.status, 'project').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
    } else if (!this.isAdmin && this.router.url === this.templatePageUrl) {
      this.categoryPage = 'template'
      this.projectService.getProjectByStatusAndCategory(this.status, 'template').subscribe((data: any) => this.store.dispatch(retrievedProjectsTemplate({ template: data.result })));
    } else {
      this.projectService.getProjectByStatus(this.status).subscribe((data: any) => this.store.dispatch(retrievedAllProjects({ listAllProject: data.result })));
    }
  }

  ngOnDestroy(): void {
    this.selectProjects$.unsubscribe();
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
      const collectionIdSelected = this.gridApi.getSelectedRows()[0]["id"];
      this.projectService.openProject(collectionIdSelected);
    }
  }

  selectedRows() {
    if (this.isAdmin) {
      this.rowsSelected = this.gridApi.getSelectedRows();
      this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
    }
  }

  openProject() {
    const collectionIdSelected = this.gridApi.getSelectedRows()[0]["id"];
    this.projectService.openProject(collectionIdSelected);
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
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
        this.projectService.get(this.rowsSelectedId[0]).subscribe(data => {
          this.projectService.getProjectByStatus(this.status).subscribe(resp => {
            this.store.dispatch(retrievedAllProjects({listAllProject: resp.result}));
            const dialogData = {
              mode: 'update',
              category: data.result.category,
              genData: data.result
            }
            this.dialog.open(EditProjectDialogComponent, {
              hasBackdrop: false,
              autoFocus: false,
              width: '600px',
              data: dialogData
            });
          });
        });
    } else {
      this.toastr.info('Bulk edits do not apply to projects.<br> Please select only one project',
          'Info', { enableHtml: true });
    }
  }

  deleteProject() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { hasBackdrop: false, width: '400px', data: dialogData });
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
            this.projectService.getProjectByStatus(this.status).subscribe((data: any) => this.store.dispatch(retrievedAllProjects({ listAllProject: data.result })));
            this.clearRow();
          })
        }
      })
    }
  }

  exportProject() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        pks: this.rowsSelectedId,
        name: this.rowsSelectedId.length === 1 ? this.rowsSelected[0].name : 'Projects',
        type: 'admin'
      }
      this.dialog.open(ExportProjectDialogComponent, { hasBackdrop: false, autoFocus: false, width: '400px', data: dialogData });
    }
  }

  processUpdateChangedByField(data: any) {
    this.userService.getAll().subscribe(userData => {
      this.listUsers = userData.result;
      let projectData = data.map((item: any) => {
        const fullName = this.listUsers.filter(val => item.changed_by_fk === val.id)[0]
        const changedByValue = fullName.first_name + ' ' + fullName.last_name;
        return Object.assign({}, item, {changed_by: changedByValue})
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
