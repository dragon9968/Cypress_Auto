import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { DeviceCategoryService } from "../../core/services/device-category/device-category.service";
import { selectDeviceCategories } from "../../store/device-category/device-category.selectors";
import { retrievedDeviceCategories } from "../../store/device-category/device-category.actions";
import { DeviceCategoryRenderComponent } from "./device-category-render/device-category-render.component";
import { AddUpdateDeviceCategoryDialogComponent } from "./add-update-device-category-dialog/add-update-device-category-dialog.component";

@Component({
  selector: 'app-device-category',
  templateUrl: './device-category.component.html',
  styleUrls: ['./device-category.component.scss']
})
export class DeviceCategoryComponent implements OnInit, OnDestroy {

  private gripApi!: GridApi;
  selectDeviceCategories$ = new Subscription();
  rowData$!: Observable<any[]>;

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
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerName: 'Actions',
        field: 'id',
        suppressSizeToFit: true,
        width: 120,
        cellRenderer: DeviceCategoryRenderComponent
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 400,
        flex: 1,
      },
    ]
  };

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private deviceCategoryService: DeviceCategoryService
  ) {
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(data => {
      this.rowData$ = of(data);
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
    this.gripApi = params.api;
  }
}
