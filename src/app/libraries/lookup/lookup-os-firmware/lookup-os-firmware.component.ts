import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from "rxjs";
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { selectLookupOSFirmwares } from "../../../store/lookup-os-firmware/lookup-os-firmwares.selectors";
import {
  deleteOSFirmwares, exportOSFirmwares,
  loadLookupOSFirmwares
} from "../../../store/lookup-os-firmware/lookup-os-firmwares.actions";
import { AddEditLookupOsFirmwareDialogComponent } from "./add-edit-lookup-os-firmware-dialog/add-edit-lookup-os-firmware-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { selectNotification } from "../../../store/app/app.selectors";
import { ImportLookupOsFirmwareDialogComponent } from "./import-lookup-os-firmware-dialog/import-lookup-os-firmware-dialog.component";

@Component({
  selector: 'app-lookup-os-firmware',
  templateUrl: './lookup-os-firmware.component.html',
  styleUrls: ['./lookup-os-firmware.component.scss']
})
export class LookupOsFirmwareComponent implements OnInit, OnDestroy {
  rowsSelected: any[] = [];
  rowsSelectedId: number[] = [];
  selectLookupOSFirmware$ = new Subscription();
  selectNotification$ = new Subscription();
  quickFilterValue = '';
  rowData$! : Observable<any[]>;
  private gridApi!: GridApi;
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
    {
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    {
      field: 'name',
    },
    {
      field: 'category',
    },
    {
      field: 'version'
    },
  ];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegistry: MatIconRegistry,
    private helpersService: HelpersService,
  ) {
    iconRegistry.addSvgIcon('export-json', this.helpersService.setIconPath('/assets/icons/export-json.svg'));
    this.selectLookupOSFirmware$ = this.store.select(selectLookupOSFirmwares).subscribe(osFirmwares => {
      if (osFirmwares) {
        if (this.gridApi) {
          this.gridApi.setRowData(osFirmwares)
        } else {
          this.rowData$ = of(osFirmwares)
        }
        this.updateRow();
      }
    })
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification) {
        this.helpersService.showNotification(notification);
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadLookupOSFirmwares())
  }

  ngOnDestroy(): void {
    this.selectLookupOSFirmware$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
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

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data
    }
    this.dialog.open(AddEditLookupOsFirmwareDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: 'auto',
      data: dialogData
    });
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }

  addLookupOSFirmware() {
    const dialogData = {
      mode: 'add',
      genData: {
        name: '',
        category: '',
        version: ''
      }
    }
    this.dialog.open(AddEditLookupOsFirmwareDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: 'auto',
      data: dialogData
    });
  }

  updateLookupOSFirmware() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected!', 'Info')
    } else if (this.rowsSelected.length === 1) {
      const dialogData = {
        mode: 'update',
        genData: this.rowsSelected[0]
      }
      this.dialog.open(AddEditLookupOsFirmwareDialogComponent, {
        disableClose: true,
        autoFocus: false,
        width: 'auto',
        data: dialogData
      });
    } else {
      this.toastr.info(
        'Bulk edits do not apply to the OS/Firmware!<br>Please select only one item to edit!',
        'Info',
        {enableHtml: true}
        )
    }
  }

  deleteLookupOSFirmware() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected!', 'Info')
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.store.dispatch(deleteOSFirmwares({pks: this.rowsSelectedId}))
          this.clearRow()
        }
      })
    }
  }

  exportLookupOSFirmware() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.store.dispatch(exportOSFirmwares({pks: this.rowsSelectedId}))
    }
  }

  importLookupOSFirmware() {
    this.dialog.open(ImportLookupOsFirmwareDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
    });
  }
}
