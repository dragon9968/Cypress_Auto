import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { HardwareService } from 'src/app/core/services/hardware/hardware.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedHardwares } from 'src/app/store/hardware/hardware.actions';
import { selectHardwares } from 'src/app/store/hardware/hardware.selectors';
import { AddEditHardwareDialogComponent } from './add-edit-hardware-dialog/add-edit-hardware-dialog.component';
import { NodeService } from "../../core/services/node/node.service";
import { catchError } from "rxjs/operators";
import { DeviceService } from "../../core/services/device/device.service";
import { TemplateService } from "../../core/services/template/template.service";
import { retrievedDevices } from "../../store/device/device.actions";
import { retrievedTemplates } from "../../store/template/template.actions";

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  quickFilterValue = '';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  rowData$! : Observable<any[]>;
  private gridApi!: GridApi;
  selectHardwares$ = new Subscription();
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
      field: 'device.name',
    },
    {
      headerName: 'Template Name',
      field: 'template.display_name',
      suppressSizeToFit: true,
    },
    {
      headerName: 'Serial Number',
      field: 'serial_number'},
    {
      headerName: 'Asset Tag',
      field: 'asset_tag'}
  ];
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private deviceService: DeviceService,
    private templateService: TemplateService,
    private hardwareService: HardwareService,
  ) {
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv-info-panel.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
   }

  ngOnInit(): void {
    this.deviceService.getAll().subscribe(data => this.store.dispatch(retrievedDevices({data: data.result})))
    this.templateService.getAll().subscribe(data => this.store.dispatch(retrievedTemplates({data: data.result})))
    this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectHardwares$.unsubscribe();
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

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  addHardware() {
    const dialogData = {
      mode: 'add',
      genData: {
        device:  '',
        template: '',
        serialNumber:  '',
        assetTag: '',
      }
    }
    this.dialog.open(AddEditHardwareDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  exportHardware(format: string) {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      const fileName = format === 'json' ? 'Hardware-Export.json' : 'Hardware-Export.csv';
      this.hardwareService.export(format, this.rowsSelectedId).subscribe(response => {
        if (format === 'json') {
          file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        }
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported Hardware as ${format.toUpperCase()} file successfully`);
      });
    }
  }

  deleteHardware() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(this.rowsSelectedId.map(id => {
            return this.hardwareService.delete(id).pipe(
              catchError((response: any) => {
                if (response.status == 400) {
                  this.toastr.error(response.error.message.split(':')[1], 'Error');
                } else {
                  this.toastr.error('Delete hardware failed', 'Error');
                }
                return throwError(() => response.error);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted hardware(s) successfully', 'Success');
            this.hardwareService.getAll().subscribe(
              data => this.store.dispatch(retrievedHardwares({data: data.result}))
            );
            this.clearRow();
          })
        }
      })
    }
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.hardwareService.get(row.data.id).subscribe(hardwareData => {
      const dialogData = {
        mode: 'view',
        genData: hardwareData.result
      }
      this.dialog.open(AddEditHardwareDialogComponent, {
        disableClose: true,
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  updateHardware() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.hardwareService.get(this.rowsSelectedId[0]).subscribe(hardwareData => {
        const dialogData = {
          mode: 'update',
          genData: hardwareData.result
        }
        this.dialog.open(AddEditHardwareDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to hardware.<br> Please select only one piece of hardware.',
        'Info', { enableHtml: true });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }
}
