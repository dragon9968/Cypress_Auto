import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { selectProjects } from '../store/project/project.selectors';
import { retrievedProjects } from '../store/project/project.actions';
import { ProjectService } from './services/project.service';
import { Router } from '@angular/router';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';

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
      width: 67,
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
    private router: Router,
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
    var rows = this.gridApi.getSelectedRows();
    if (rows.length == 1) {
      this.isSubmitBtnDisabled = false;
    } else {
      this.isSubmitBtnDisabled = true;
    }
  }

  openMapProject() {
    var rows = this.gridApi.getSelectedRows()[0];
    this.router.navigate(
      [RouteSegments.MAP],
      {
        queryParams: {
          category: 'logical',
          collection_id: rows["id"]
        }
      }
    );
    return rows;
  }

  onRowDoubleClicked() {
    this.openMapProject();
  }

  openProject() {
    this.openMapProject();
  }
}
