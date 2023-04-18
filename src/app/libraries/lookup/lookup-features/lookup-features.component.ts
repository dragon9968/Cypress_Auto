import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { LookupFeaturesService } from 'src/app/core/services/lookup-features/lookup-features.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedLookupFeatures } from 'src/app/store/lookup-features/lookup-features.actions';
import { selectLookupFeatures } from 'src/app/store/lookup-features/lookup-features.selectors';
import { AddEditLookupFeaturesDialogComponent } from './add-edit-lookup-features-dialog/add-edit-lookup-features-dialog.component';
import { ImportLookupFeaturesDialogComponent } from './import-lookup-features-dialog/import-lookup-features-dialog.component';
import { UpdateFeatureDialogComponent } from './update-feature-dialog/update-feature-dialog.component';

@Component({
  selector: 'app-lookup-features',
  templateUrl: './lookup-features.component.html',
  styleUrls: ['./lookup-features.component.scss']
})
export class LookupFeaturesComponent implements OnInit, OnDestroy {
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  selectLookupFeatures$ = new Subscription();
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
      headerName: "Display Name",
      field: 'display_name',
    },
    {
      field: 'platform'
    },
  ];
  constructor(
    private lookupFeaturesService: LookupFeaturesService,
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
  ) {
    this.selectLookupFeatures$ = this.store.select(selectLookupFeatures).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
   }

  ngOnDestroy(): void {
    this.selectLookupFeatures$.unsubscribe();
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

  ngOnInit(): void {
    this.lookupFeaturesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupFeatures({ data: data.result })));
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.lookupFeaturesService.get(row.data.id).subscribe(data => {
      const dialogData = {
        mode: 'view',
        genData: data.result
      }
      this.dialog.open(AddEditLookupFeaturesDialogComponent, {
        disableClose: true,
        autoFocus: false,
        width: 'auto',
        data: dialogData
      });
    })
  }

  addLookupFeatures() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        description: '',
        platform:  '',
        display_name: '',
        feature_name: ''
      }
    }
    this.dialog.open(AddEditLookupFeaturesDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  updateLookupFeatures() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.lookupFeaturesService.get(this.rowsSelectedId[0]).subscribe(data => {
        const dialogData = {
          mode: 'update',
          genData: data.result
        }
        this.dialog.open(AddEditLookupFeaturesDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to Lookup Features.<br> Please select only one piece of Lookup Features.',
        'Info', { enableHtml: true });
    }
  }

  deleteLookupFeatures() {
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
            return this.lookupFeaturesService.delete(id).pipe(
              catchError((response: any) => {
                if (response.status == 400) {
                  this.toastr.error(response.error.message.split(':')[1], 'Error');
                } else {
                  this.toastr.error('Delete Lookup Features failed', 'Error');
                }
                return throwError(() => response.error);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted Lookup Features(s) successfully', 'Success');
            this.lookupFeaturesService.getAll().subscribe(
              data => this.store.dispatch(retrievedLookupFeatures({data: data.result}))
            );
            this.clearRow();
          })
        }
      })
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }

  exportLookupFeatures() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      const fileName = 'LookupFeatures-Export.json';
      this.lookupFeaturesService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported LookupFeatures as JSON file successfully`);
      });
    }
  }

  importLookupFeatures() {
    const dialogRef = this.dialog.open(ImportLookupFeaturesDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
    });
  }

  // updateFeature() {
  //   if (this.rowsSelectedId.length === 0) {
  //     this.toastr.info('No row selected');
  //   } else if (this.rowsSelectedId.length === 1) {
  //     const dialogData = {
  //       pk: this.rowsSelectedId[0]
  //     }
  //     this.dialog.open(UpdateFeatureDialogComponent, {
  //       autoFocus: false,
  //       width: '450px',
  //       data: dialogData
  //     });
  //   } else {
  //     this.toastr.info('Bulk edits do not apply to Lookup Features.<br> Please select only one piece of Lookup Features.',
  //       'Info', { enableHtml: true });
  //   }
  // }
}
