import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { LookupNamesService } from 'src/app/core/services/lookup-names/lookup-names.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedLookupNames } from 'src/app/store/lookup-names/lookup-names.actions';
import { selectLookupNames } from 'src/app/store/lookup-names/lookup-names.selectors';
import { AddEditLookupNamesDialogComponent } from './add-edit-lookup-names-dialog/add-edit-lookup-names-dialog.component';
import { ImportLookupNamesDialogComponent } from './import-lookup-names-dialog/import-lookup-names-dialog.component';

@Component({
  selector: 'app-lookup-names',
  templateUrl: './lookup-names.component.html',
  styleUrls: ['./lookup-names.component.scss']
})
export class LookupNamesComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  selectLookupNames$ = new Subscription();
  private gridApi!: GridApi;
  rowData$! : Observable<any[]>;
  quickFilterValue = '';

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
      sort: 'asc',
    },
    {
      field: 'category',
    },
  ];
  constructor(
    private lookupNamesService: LookupNamesService,
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    ) {
      this.selectLookupNames$ = this.store.select(selectLookupNames).subscribe(data => {
        if (data) {
          if (this.gridApi) {
            this.gridApi.setRowData(data);
          } else {
            this.rowData$ = of(data);
          }
          this.updateRow();
        }
      })

      iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
     }

  ngOnInit(): void {
    this.lookupNamesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupNames({ data: data.result })))
  }

  
  ngOnDestroy(): void {
    this.selectLookupNames$.unsubscribe();
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

  updateRow() {
    if (this.gridApi && this.rowsSelectedId.length > 0) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  addLookupNames() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        category: '',
      }
    }
    this.dialog.open(AddEditLookupNamesDialogComponent, {
      hasBackdrop: false,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  updateLookupNames() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.lookupNamesService.get(this.rowsSelectedId[0]).subscribe(lookupData => {
        const dialogData = {
          mode: 'update',
          genData: lookupData.result
        }
        this.dialog.open(AddEditLookupNamesDialogComponent, {
          hasBackdrop: false,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to Lookup Names.<br> Please select only one piece of Lookup Names.',
        'Info', { enableHtml: true });
    }
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.lookupNamesService.get(row.data.id).subscribe(lookupNamesData => {
      const dialogData = {
        mode: 'view',
        genData: lookupNamesData.result
      }
      this.dialog.open(AddEditLookupNamesDialogComponent, {
        hasBackdrop: false,
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { hasBackdrop: false, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(this.rowsSelectedId.map(id => {
            return this.lookupNamesService.delete(id).pipe(
              catchError((response: any) => {
                if (response.status == 400) {
                  this.toastr.error(response.error.message.split(':')[1], 'Error');
                } else {
                  this.toastr.error('Delete Lookup Names failed', 'Error');
                }
                return throwError(() => response.error);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted Lookup Names(s) successfully', 'Success');
            this.lookupNamesService.getAll().subscribe(
              data => this.store.dispatch(retrievedLookupNames({data: data.result}))
            );
            this.clearRow();
          })
        }
      })
    }
  }

  exportLookupNames() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      const fileName = 'LookupNames-Export.json';
      this.lookupNamesService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported LookupNames as JSON file successfully`);
      });
    }
  }

  importLookupNames() {
    const dialogRef = this.dialog.open(ImportLookupNamesDialogComponent, {
      hasBackdrop: false,
      autoFocus: false,
      width: '450px',
    });
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }

}
