import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { selectDeletedProjects } from 'src/app/store/project/project.selectors';
import { ProjectService } from '../services/project.service';
import { loadProjects } from 'src/app/store/project/project.actions';

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
  isSubmitBtnDisabled: boolean = true;
  private gridApi!: GridApi;
  private selectDeletedProjects$ = new Subscription();
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
    { field: 'name' },
    { field: 'description' },
    { field: 'status' },
    { field: 'category' }
  ];

  constructor(
    private projectService: ProjectService,
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    const userId = this.authService.getUserId();
    this.selectDeletedProjects$ = this.store.select(selectDeletedProjects)
      .subscribe((data: any) => {
        const filteredProjectsByUserId = data?.filter((val: any) => val.created_by_fk === userId);
        this.rowData$ = of(filteredProjectsByUserId);
      });
  }

  ngOnInit(): void {
    this.store.dispatch(loadProjects());
  }

  ngOnDestroy(): void {
    this.selectDeletedProjects$.unsubscribe();
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        const jsonData = {
          pk: this.rowsSelectedId,
          status: 'active'
        }
        if (result) {
          this.projectService.deleteOrRecoverProject(jsonData).subscribe({
            next: (rest) => {
              this.toastr.success(`Recover Project successfully`);
              this.store.dispatch(loadProjects());
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
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        const jsonData = {
          pk: this.rowsSelectedId,
        }
        if (result) {
          this.projectService.permanentDeleteProject(jsonData).subscribe({
            next: (rest) => {
              this.toastr.success(`Permanent delete Project successfully`);
              this.store.dispatch(loadProjects());
              this.clearRowSelected();
            },
            error: (error) => {
              this.toastr.error(`Error while Permanent delete Project`);

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
