import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { IconService } from 'src/app/core/services/icon/icon.service';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { retrievedMapPref } from 'src/app/store/map-style/map-style.actions';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';
import { ActionsRenderMappreComponent } from './actions-render-mappre/actions-render-mappre.component';
import { AddEditMapprefDialogComponent } from './add-edit-mappref-dialog/add-edit-mappref-dialog.component';

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
  ICON_PATH = ICON_PATH;
  rowData$! : Observable<any[]>;
  private gridApi!: GridApi;
  selectMapPref$ = new Subscription();
  selectIcons$ = new Subscription();
  listIcons!: any[];
  icon_default: any[] = [];

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
      cellRenderer: ActionsRenderMappreComponent,
      cellClass: 'map-preferences-actions',
      sortable: false
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
    private iconService: IconService
  ) {
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((data: any) => {
      this.rowData$ = of(data);
    });
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.listIcons = icons;
    });
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
  }

  ngOnDestroy(): void {
    this.selectMapPref$.unsubscribe();
    this.selectIcons$.unsubscribe();
  }

  ngOnInit(): void {
    this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPref({data: data.result})));
    this.iconService.getAll().subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
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
    const dialogRef = this.dialog.open(AddEditMapprefDialogComponent, {
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  export() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.mapPrefService.export(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Map-Preferences-Export.json', file);
        this.toastr.success(`Exported Preferences as ${'json'.toUpperCase()} file successfully`);
      })
      this.gridApi.deselectAll();
    }
  }
}
