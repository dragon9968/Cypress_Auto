import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { Observable, of, Subscription, throwError } from "rxjs";
import { DeviceCategoryService } from "../../core/services/device-category/device-category.service";
import { selectDeviceCategories } from "../../store/device-category/device-category.selectors";
import { retrievedDeviceCategories } from "../../store/device-category/device-category.actions";
import { AddUpdateDeviceCategoryDialogComponent } from "./add-update-device-category-dialog/add-update-device-category-dialog.component";
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-device-category',
  templateUrl: './device-category.component.html',
  styleUrls: ['./device-category.component.scss']
})
export class DeviceCategoryComponent implements OnInit, OnDestroy {

  private gridApi!: GridApi;
  selectDeviceCategories$ = new Subscription();
  deviceCategories: any[] = [];
  rowData$!: Observable<any[]>;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];

  gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    rowSelection: 'multiple',
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 52,
      },
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        minWidth: 400,
        flex: 1,
      },
    ]
  };

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private deviceCategoryService: DeviceCategoryService
  ) {
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(data => {
      if (data) {
        this.deviceCategories = data;
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRowActive();
      }
    })
  }

  ngOnInit(): void {
    this.deviceCategoryService.getAll().subscribe(deviceCategories => {
      this.store.dispatch(retrievedDeviceCategories({data: deviceCategories.result}));
    })
  }

  ngOnDestroy(): void {
    this.selectDeviceCategories$.unsubscribe();
  }

  addDeviceCategory() {
    const dialogData = {
      mode: 'add',
      genData: {}
    }
    this.dialog.open(AddUpdateDeviceCategoryDialogComponent, {width: '500px', data: dialogData});
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  selectRow() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(row => row.id);
  }

  clearRow() {
   this.gridApi.deselectAll();
   this.rowsSelected = [];
   this.rowsSelectedId = [];
  }

  updateRowActive() {
    if (this.gridApi && this.rowsSelectedId.length > 0) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  editDeviceCategory() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
        const deviceCategory = this.deviceCategories.find(ele => ele.id === this.rowsSelectedId[0]);
        const dialogData = {
          mode: 'update',
          genData: deviceCategory
        };
        this.dialog.open(AddUpdateDeviceCategoryDialogComponent, {width: '500px', data: dialogData});
    }
    else {
      this.toastr.info('Bulk edits do not apply to device category.<br>Please select only one device category',
        'Info', { enableHtml: true})
    }

  }

  deleteCategory() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `You sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRefConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogRefConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.rowsSelected.map(deviceCategory => {
            this.deviceCategoryService.delete(deviceCategory.id).pipe(
              catchError((response: any) => {
                if (response.status === 400) {
                  const message = response.error.message.split(':')[1].split('.');
                  const messageContent = message[1];
                  const title = message[0];
                  this.toastr.warning(messageContent, title);
                } else {
                  this.toastr.error('Delete device category failed!')
                }
                return throwError(response.error);
              })
            ).subscribe(response => {
              this.toastr.success(`Deleted device category ${ deviceCategory.name }`, 'Success');
              this.deviceCategoryService.getAll().subscribe(response => {
                this.store.dispatch(retrievedDeviceCategories({data: response.result}));
              });
            })
          })
          this.clearRow();
        }
      })
    }
  }
}
