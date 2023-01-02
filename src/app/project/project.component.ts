import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, of, Subscription } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user/user.service';
import { ProjectService } from './services/project.service';
import { selectProjects } from '../store/project/project.selectors';
import { retrievedProjects } from '../store/project/project.actions';
import { retrievedUserTasks } from '../store/user-task/user-task.actions';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  id: any;
  category: any;
  status = 'active';
  isSubmitBtnDisabled: boolean = true;
  private gridApi!: GridApi;
  private selectProjects$ = new Subscription();
  rowData$!: Observable<any[]>;
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerName: 'No.',
      field: 'id',
      suppressSizeToFit: true,
      width: 60,
      cellClass: 'project-actions'
    },
    { field: 'name'},
    { field: 'description' },
    { field: 'status' },
    { field: 'category' }
  ];

  constructor(
    private projectService: ProjectService,
    private store: Store
  ) {
    this.selectProjects$ = this.store.select(selectProjects)
    .subscribe((data: any) => {
      this.rowData$ = of(data)
    });
  }

  ngOnInit(): void {
    this.projectService.getProjectByStatus(this.status).subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
  }

  ngOnDestroy(): void {
    this.selectProjects$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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
}
