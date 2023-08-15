import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of, Subscription, throwError } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { selectDomains } from 'src/app/store/domain/domain.selectors';
import { showErrorFromServer } from "../../shared/validations/error-server-response.validation";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { addNewPG, updatePG } from "../../store/portgroup/portgroup.actions";
import { PortGroupAddModel, PortGroupGetRandomModel, PortGroupPutModel } from "../../core/models/port-group.model";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { selectLogicalNodes } from "../../store/node/node.selectors";
import { AgGridAngular } from 'ag-grid-angular';
import { HistoryService } from 'src/app/core/services/history/history.service';
import { RemoteCategories } from 'src/app/core/enums/remote-categories.enum';
import { selectIsConfiguratorConnect, selectIsDatasourceConnect, selectIsHypervisorConnect } from 'src/app/store/server-connect/server-connect.selectors';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { selectNotification } from 'src/app/store/app/app.selectors';
import { ipSubnetValidation } from "../../shared/validations/ip-subnet.validation";

@Component({
  selector: 'app-add-update-pg-dialog',
  templateUrl: './add-update-pg-dialog.component.html',
  styleUrls: ['./add-update-pg-dialog.component.scss']
})
export class AddUpdatePGDialogComponent implements OnInit, OnDestroy {
  @ViewChild("agGridInterfaces") agGridInterfaces!: AgGridAngular;
  @ViewChild("agGridHistory") agGridHistory!: AgGridAngular;
  private gridApiInterface!: GridApi;
  private gridApiHistory!: GridApi;
  pgAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomains$ = new Subscription();
  selectNodes$ = new Subscription();
  selectIsHypervisorConnect$ = new Subscription();
  selectIsDatasourceConnect$ = new Subscription();
  selectIsConfiguratorConnect$ = new Subscription();
  selectNotification$ = new Subscription();
  connectionCategory = '';
  nodes: any[] = [];
  domains!: any[];
  isViewMode = false;
  tabName = '';
  errors: any[] = [];
  filteredDomains!: Observable<any[]>;
  rowDataInterface$!: Observable<any[]>;
  rowDataHistory$!: Observable<any[]>
  public gridOptionsInterfaces: GridOptions = {
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
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerName: 'Name',
        maxWidth: 100,
        flex: 1,
      },
      {
        field: 'ip',
        headerName: 'IP Address',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'port_group.subnet',
        headerName: 'Subnet',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'node_name',
        headerName: 'Node',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'description',
        flex: 1,
      }
    ]
  };
  //  Grid option for history table
  public gridOptionsHistory: GridOptions = {
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
        field: 'id',
        hide: true,
        flex: 1,
        getQuickFilterText: () => ''
      },
      { field: 'task',
        flex: 1,
      },
      {
        field: 'category',
        flex: 1,
      },
      {
        field: 'date_time',
        headerName: 'Date Time',
        flex: 1,
        cellRenderer: (dateTime: any) => new Date(dateTime.value).toLocaleString(),
      },
      { field: 'item_id', headerName: 'Item Id', flex: 1,},
      { field: 'user_id', headerName: 'User Id', flex: 1,},
    ]
  };
  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdatePGDialogComponent>,
    public helpers: HelpersService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private historyService: HistoryService,
    private serverConnectionService: ServerConnectService
  ) {
    this.pgAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      vlanCtr: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(4095),
        Validators.pattern('^[0-9]*$'),
        showErrorFromServer(() => this.errors)
      ]),
      categoryCtr: new FormControl(''),
      domainCtr: new FormControl(''),
      subnetAllocationCtr: new FormControl(''),
      subnetCtr: new FormControl('', [
        Validators.required,
        ipSubnetValidation(true),
        showErrorFromServer(() => this.errors)]),
      uuidCtr: new FormControl(''),
      switchCtr: new FormControl('')
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      }
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
      this.domainCtr.setValidators([Validators.required, autoCompleteValidator(this.domains)]);
      this.filteredDomains = this.helpers.filterOptions(this.domainCtr, this.domains);
    });
    this.isViewMode = this.data.mode == 'view';
    this.tabName = this.data.tabName;
    this.selectNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => this.nodes = nodes)
    if (this.isViewMode) {
      this.interfaceService.getByPortGroup(this.data.genData.id).subscribe(response => {
        const interfaceData = response.result;
        const interfaceDataWithNode = interfaceData.map((edge: any) => {
          edge['node_name'] = this.nodes.find((node: any) => node.id == edge.node_id)?.name
          return edge
        })
        if (this.agGridInterfaces) {
          this.agGridInterfaces.api.setRowData(interfaceDataWithNode);
        } else {
          this.rowDataInterface$ = of(interfaceDataWithNode);
        }
      })
      this.historyService.getByItemId(this.data.genData.id).subscribe(resp => {
        const historyData = resp.result;
        if (this.agGridHistory) {
          this.agGridHistory.api.setRowData(historyData);
        } else {
          this.rowDataHistory$ = of(historyData);
        }
      })
    }

    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      if (isHypervisorConnect) {
        this.connectionCategory = RemoteCategories.HYPERVISOR
      }
    })

    this.selectIsDatasourceConnect$ = this.store.select(selectIsDatasourceConnect).subscribe(isDatasourceConnect => {
      if (isDatasourceConnect) {
        this.connectionCategory = RemoteCategories.DATASOURCE
      }
    })

    this.selectIsConfiguratorConnect$ = this.store.select(selectIsConfiguratorConnect).subscribe(isConfiguratorConnect => {
      if (isConfiguratorConnect) {
        this.connectionCategory = RemoteCategories.CONFIGURATOR
      }
    })

    if (this.data.mode === 'view') {
      const connection = this.serverConnectionService.getConnection(this.connectionCategory);
      const connectionId = connection ? connection?.id : 0;
      this.portGroupService.getDeployData(this.data.genData.id, connectionId).subscribe(resp => {
        const deployData = resp.result;
        this.switchCtr?.setValue(deployData?.dvswitch_name);
        this.switchCtr?.setValue(deployData?.uuid);
      });
    }
  }

  onGridReadyInterface(params: GridReadyEvent) {
    this.gridApiInterface = params.api;
  }

  onGridReadyHistory(params: GridReadyEvent) {
    this.gridApiHistory = params.api;
    this.gridApiHistory.sizeColumnsToFit();
  }

  get nameCtr() { return this.pgAddForm.get('nameCtr'); }
  get vlanCtr() { return this.pgAddForm.get('vlanCtr'); }
  get categoryCtr() { return this.pgAddForm.get('categoryCtr'); }
  get domainCtr() { return this.helpers.getAutoCompleteCtr(this.pgAddForm.get('domainCtr'), this.domains); }
  get subnetAllocationCtr() { return this.pgAddForm.get('subnetAllocationCtr'); }
  get subnetCtr() { return this.pgAddForm.get('subnetCtr'); }
  get uuidCtr() { return this.pgAddForm.get('uuidCtr'); }
  get switchCtr() { return this.pgAddForm.get('switchCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.vlanCtr?.setValue(this.data.genData.vlan);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.helpers.setAutoCompleteValue(this.domainCtr, this.domains, this.data.genData.domain_id);
    this.subnetAllocationCtr?.setValue(this.data.genData.subnet_allocation);
    this.subnetCtr?.setValue(this.data.genData.subnet);
    this._disableItems(this.subnetAllocationCtr?.value);
  }

  ngOnDestroy(): void {
    this.selectDomains$.unsubscribe();
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectIsDatasourceConnect$.unsubscribe();
    this.selectIsConfiguratorConnect$.unsubscribe();
    this.selectNotification$.unsubscribe();
    this.selectNodes$.unsubscribe();
  }

  private _disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_auto') {
      this.subnetCtr?.disable();
    } else {
      this.subnetCtr?.enable();
    }
  }

  onSubnetAllocationChange($event: MatRadioChange) {
    this._disableItems($event.value);
    this._changeSubnet()
  }

  onCategoryChange($event: MatRadioChange) {
    this.subnetCtr?.setErrors(null);
    this._changeSubnet()
  }

  onCancel() {
    this.dialogRef.close();
  }

  addPG() {
    const jsonDataValue: PortGroupAddModel = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      project_id: this.data.projectId,
      logical_map: (this.data.mode == 'add') ? {
        map_style: {
          "height": this.data.selectedMapPref.port_group_size,
          "width": this.data.selectedMapPref.port_group_size,
          "color": this.data.selectedMapPref.port_group_color,
          "text_size": this.data.selectedMapPref.text_size,
          "text_color": this.data.selectedMapPref.text_color,
          "text_halign": this.data.selectedMapPref.text_halign,
          "text_valign": this.data.selectedMapPref.text_valign,
          "text_bg_color": this.data.selectedMapPref.text_bg_color,
          "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity,
        },
        position: this.data.newNodePosition
      } : undefined,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(addNewPG({ portGroup: jsonData }))
  }

  updatePG() {
    const ele = this.data.cy.getElementById(this.data.genData.data.id);
    const jsonDataValue: PortGroupPutModel = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      project_id: this.data.genData.project_id,
      logical_map: {
        ...ele.data('logical_map'),
        position: ele.position()
      }
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(updatePG({
      id: this.data.genData.id,
      data: jsonData,
    }));
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }

  private _changeSubnet() {
    if (this.subnetAllocationCtr?.value == 'static_auto') {
      const jsonData: PortGroupGetRandomModel = {
        project_id: this.data.genData.project_id,
        category: this.categoryCtr?.value
      }
      this.portGroupService.getRandomSubnet(jsonData).pipe(
        catchError(error => {
          this.toastr.error('Get random subnet for the port group failed!', 'Error')
          return throwError(() => error)
        })
      ).subscribe(response => {
        this.subnetCtr?.setValue(response.result)
      })
    }
  }
}
