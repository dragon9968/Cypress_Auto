import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ImageService } from 'src/app/core/services/image/image.service';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';
import { selectMapPrefs } from 'src/app/store/map-pref/map-pref.selectors';
import { AddEditMapprefDialogComponent } from './add-edit-mappref-dialog/add-edit-mappref-dialog.component';
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { catchError } from "rxjs/operators";
import { NgxPermissionsService } from "ngx-permissions";
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { selectAppPref } from 'src/app/store/app-pref/app-pref.selectors';
import { retrievedAppPref } from 'src/app/store/app-pref/app-pref.actions';
import { AppPrefService } from 'src/app/core/services/app-pref/app-pref.service';

@Component({
  selector: 'app-map-preferences',
  templateUrl: './map-preferences.component.html',
  styleUrls: ['./map-preferences.component.scss']
})
export class MapPreferencesComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  quickFilterValue = '';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  id: any;
  ICON_PATH = ICON_PATH;
  rowData$! : Observable<any[]>;
  private gridApi!: GridApi;
  selectMapPrefs$ = new Subscription();
  selectIcons$ = new Subscription();
  selectAppPref$ = new Subscription();
  listIcons!: any[];
  icon_default: any[] = [];
  appPrefDefault: any;

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
      flex: 1,
    },
    {
      headerName: 'Group Box Defaults',
      field: 'group_box_defaults',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
      sortable: false
    },
    {
      headerName: 'Port Group Defaults',
      field: 'port_group_defaults',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
      sortable: false
    },
    {
      headerName: 'Edge Defaults',
      field: 'edge_defaults',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
      sortable: false
    },
    {
      headerName: 'Node Defaults',
      field: 'node_defaults',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
      sortable: false
    },
    {
      headerName: 'Text Defaults',
      field: 'text_defaults',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
      sortable: false
    },
    {
      headerName: 'Zoom Speed',
      field: 'zoom_speed',
      cellRenderer: (param: any) => param.value,
      autoHeight: true,
      flex: 1,
    },
    {
      headerName: 'Icon Img Thumbnail',
      field: 'icon_img_thumbnail',
      cellRenderer: function(param: any) {
        const img = `<img src="${ICON_PATH}${param.value}" alt="Photo" height="40" width="40">`
        return img
      },
      autoHeight: true,
      flex: 1,
      sortable: false
    },
  ];
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private mapPrefService: MapPrefService,
    iconRegistry: MatIconRegistry,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private imageService: ImageService,
    private router: Router,
    private rolesService: RolesService,
    private appPrefService: AppPrefService,
  ) {
    this.selectMapPrefs$ = this.store.select(selectMapPrefs).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.listIcons = icons;
    });

    this.selectAppPref$ = this.store.select(selectAppPref).subscribe((appPref: any) => {
      if (appPref) {
        this.appPrefDefault = appPref;
      }
    });
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
  }

  ngOnDestroy(): void {
    this.selectMapPrefs$.unsubscribe();
    this.selectIcons$.unsubscribe();
    this.selectAppPref$.unsubscribe();
  }

  ngOnInit(): void {
    let isCanReadLibraries = false
    let isCanReadSettings = false
    const permissions = this.rolesService.getUserPermissions();
    if (permissions) {
      for (let p of permissions) {
        if (p === "can_read on Settings") {
          isCanReadSettings = true
        }
        if (p === "can_read on Libraries") {
          isCanReadLibraries = true
        }
      }
    }
    if (!isCanReadLibraries || !isCanReadSettings) {
      console.log('You are not authorized to view this page !')
      this.toastr.warning('Not authorized!', 'Warning');
      this.router.navigate([RouteSegments.ROOT]);
    }
    this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({data: data.result})));
    this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
    this.appPrefService.get("2").subscribe((data: any) => this.store.dispatch(retrievedAppPref({ data: data.result })));
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
    this.id = this.rowsSelectedId[0];
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

  addMapPref() {
    this.icon_default = this.listIcons.filter((icon: any) => icon.name === "Cloud (Black)")
    const dialogData = {
      mode: 'add',
      genData: {
        device:  '',
        template: '',
        serialNumber:  '',
        assetTag: '',
      },
      genIcon: this.icon_default
    }
    this.dialog.open(AddEditMapprefDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  export() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.mapPrefService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Map-Preferences-Export.json', file);
        this.toastr.success(`Exported Preferences as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  onRowDoubleClick(row: RowDoubleClickedEvent) {
    this.mapPrefService.get(row.data.id).subscribe(mapPrefData => {
      const dialogData = {
        autoFocus: false,
        mode: 'view',
        genData: mapPrefData.result
      }
      this.dialog.open(AddEditMapprefDialogComponent, {
        disableClose: true,
        width: '450px',
        data: dialogData
      });
    })
  }

  updateMapPref() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.mapPrefService.get(this.id).subscribe(mapPrefData => {
        const dialogData = {
          mode: 'update',
          genData: mapPrefData.result,
        }
        this.dialog.open(AddEditMapprefDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to map preference.<br>Please select only one map preference',
        'Info', { enableHtml: true});
    }
  }

  deleteMapPref() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `You sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowsSelected.map(mapPref => {
            if (mapPref.id === 1 || this.appPrefDefault?.default_map_pref === mapPref.name) {
              this.toastr.warning(`Cannot not delete ${mapPref.name} preference', 'Warning`)
            } else {
              this.mapPrefService.delete(mapPref.id).pipe(
                catchError(error => {
                  this.toastr.error(`Delete ${mapPref.name} failed`, 'Error');
                  return throwError(() => error);
                })
              ).subscribe(() => {
                this.mapPrefService.getAll().subscribe(
                  (data: any) => this.store.dispatch(retrievedMapPrefs({data: data.result}))
                );
                this.toastr.success(`Delete map preferences ${mapPref.name} successfully`, 'Success');
              })
            }
          });
          this.clearRow();
        }
      });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelectedId = [];
    this.rowsSelected = [];
    this.id = undefined;
  }
}
