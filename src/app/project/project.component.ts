import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { retrievedProjects } from '../shared/store/project/project.actions';
import { ProjectActionsRenderer } from '../shared/components/renderers/project-actions-renderer.component';
import { ProjectService } from '../shared/services/project/project.service';
import { selectProjects } from '../shared/store/project/project.selectors';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private selectProjects$ = new Subscription();
  rowData$!: Observable<any[]>;
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
    },
    {
      headerName: '',
      field: 'id',
      suppressSizeToFit: true,
      width: 67,
      cellRenderer: ProjectActionsRenderer,
      cellClass: 'project-actions'
    },
    { field: 'name'},
    { field: 'description' },
    { field: 'lock' },
    { field: 'status' },
    { field: 'category' }
  ];

  constructor(
    private projectService: ProjectService,
    private store: Store,
  ) {
    this.selectProjects$ = this.store.select(selectProjects)
    .subscribe((data: any) => {
      this.rowData$ = of(data)
    })
  }

  ngOnInit(): void {
    this.projectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
  }

  ngOnDestroy(): void {
    this.selectProjects$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }
 
}
