import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, of, Subscription } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProjectService } from './services/project.service';
import { selectProjects } from '../store/project/project.selectors';
import { retrievedProjects } from '../store/project/project.actions';

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
      field: 'id',
      hide: true,
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
    private store: Store
  ) {
    this.selectProjects$ = this.store.select(selectProjects)
      .subscribe((data: any) => {
        this.rowData$ = of(data)
      });
  }

  ngOnInit(): void {
    this.projectService.getProjectByStatusAndCategory(this.status, 'project').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
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
