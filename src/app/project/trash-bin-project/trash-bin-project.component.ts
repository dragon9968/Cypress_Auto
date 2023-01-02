import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedProjects } from 'src/app/store/project/project.actions';
import { selectProjects } from 'src/app/store/project/project.selectors';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-trash-bin-project',
  templateUrl: './trash-bin-project.component.html',
  styleUrls: ['./trash-bin-project.component.scss']
})
export class TrashBinProjectComponent implements OnInit, OnDestroy {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  id: any;
  category: any;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  status = 'delete';
  isLoading = false;
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    { field: 'name'},
    { field: 'description' },
    { field: 'status' },
    { field: 'category' }
  ];

  constructor(
    private projectService: ProjectService,
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
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

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  recoverProject() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Recover project?',
      submitButtonName: 'OK'
    }
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        const jsonData = {
          pk: this.rowsSelectedId,
          status: 'active'
        }
        if (result) {
          this.projectService.deleteOrRecoverProject(jsonData).subscribe({
            next: (rest) => {
              this.toastr.success(`Recover Project successfully`);
              this.projectService.getProjectByStatus(this.status).subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
              this.clearRowSelected();
            },
            error: (error) => {
              this.toastr.error(`Error while Recover Project`);
            }
          })
        }
      });
    }
  }

  permanentDeleteProject() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Project will be permanently deleted. Are you sure?',
      submitButtonName: 'Delete'
    }
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        const jsonData = {
          pk: this.rowsSelectedId,
        }
        if (result) {
          this.isLoading = true;
          this.projectService.permanentDeteleProject(jsonData).subscribe({
            next: (rest) => {
              this.toastr.success(`Permanent delete Project successfully`);
              this.projectService.getProjectByStatus(this.status).subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
              this.isLoading = false;
              this.clearRowSelected();
            },
            error: (error) => {
              this.toastr.error(`Error while Permanent delete Project`);
              this.isLoading = false;
            }
          })
        }
      });
    }
  }

  clearRowSelected() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.deselectAll();
  }
}
