import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { HardwareService } from 'src/app/core/services/hardware/hardware.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedHardwares } from 'src/app/store/hardware/hardware.actions';
import { selectHardwares } from 'src/app/store/hardware/hardware.selectors';
import { ActionsRenderHardwareComponent } from './actions-render-hardware/actions-render-hardware.component';
import { AddEditHardwareDialogComponent } from './add-edit-hardware-dialog/add-edit-hardware-dialog.component';

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
      headerName: '',
      field: 'id',
      suppressSizeToFit: true,
      width: 160,
      cellRenderer: ActionsRenderHardwareComponent,
      cellClass: 'hardware-actions'
    },
    { field: 'device.name'},
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
    private hardwareService: HardwareService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
    
  ) {
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((data: any) => {
      this.rowData$ = of(data);
    });
    iconRegistry.addSvgIcon('export-csv', this._setPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this._setPath('/assets/icons/export-json.svg'));
   }

  ngOnInit(): void {
    this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectHardwares$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  private _setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
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
    const dialogRef = this.dialog.open(AddEditHardwareDialogComponent, {
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
        else if (format === 'csv') {
          file = new Blob([response], {type: 'text/csv;charset=utf-8;'});
        }
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported Hardware as ${format.toUpperCase()} file successfully`);
      });
    }
  }

  deleteHardware() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'You sure you want to delete this item?'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          for (var ids in this.rowsSelectedId) {
            this.hardwareService.delete(this.rowsSelectedId[ids]).subscribe({
              next: (rest) =>{
                this.toastr.success(`delete Hardware successfully`);
                this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
              },
              error:(err) => {
                this.toastr.error(`Error while delete Hardware`);
              }
            });
          }
        }
      }) 
    }
  }
}
