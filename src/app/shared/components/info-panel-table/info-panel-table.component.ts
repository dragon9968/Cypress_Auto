import { Component, Input } from '@angular/core';
import { GridApi, GridReadyEvent } from "ag-grid-community";
import { InfoPanelShowValidationResultsComponent } from '../info-panel-show-validation-results/info-panel-show-validation-results.component';
import { Subscription, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdatePGDialogComponent } from 'src/app/map/add-update-pg-dialog/add-update-pg-dialog.component';
import { NodeBulkEditDialogComponent } from 'src/app/map/bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component';
import { PortGroupBulkEditDialogComponent } from 'src/app/map/bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Store } from '@ngrx/store';
import { InfoPanelService } from 'src/app/core/services/info-panel/info-panel.service';
import { AddUpdateInterfaceDialogComponent } from 'src/app/map/add-update-interface-dialog/add-update-interface-dialog.component';
import { InterfaceBulkEditDialogComponent } from 'src/app/map/bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { DomainService } from 'src/app/core/services/domain/domain.service';
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { ProjectService } from "../../../project/services/project.service";
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';

@Component({
  selector: 'app-info-panel-table',
  templateUrl: './info-panel-table.component.html',
  styleUrls: ['./info-panel-table.component.scss']
})
export class InfoPanelTableComponent {
  @Input() cy: any;
  @Input() infoPanelheight = '300px';
  @Input() gridOptions: any = {};
  @Input() tabName: string = '';
  private gridApi!: GridApi;
  rowsSelected: any[] = [];
  rowsSelectedIds: any[] = [];
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private domainService: DomainService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService,
    private projectService: ProjectService,
    private helpersService: HelpersService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  setRowData(rowData: any[]) {
    this.gridApi?.setRowData(rowData);
  }

  setRowActive(activeEleIds: any[] = []) {
    this.gridApi?.forEachNode(rowNode => {
      if (activeEleIds.includes(rowNode.data.id)) {
        rowNode.setSelected(true);
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  selectedRows() {
    const unSelectedRows = this.rowsSelected
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedIds = this.rowsSelected.map(r => {
      if (this.tabName == 'group') {
        if (this.isGroupBoxesChecked) {
          const groupCy = this.cy.getElementById(r.data.id);
          groupCy.select();
        } else {
          this.cy.nodes().forEach((node: any) => {
            if (node.data().groups && node.data().groups[0]?.id === r.id) {
              node.select();
            }
          });
        }
        return r.id;
      } else if (['node', 'portgroup', 'interface'].includes(this.tabName)) {
        const ele = this.cy.getElementById(r.data?.id);
        if (ele) {
          ele.select();
        }
        return r.id;
      } else {
        return r.id;
      }
    });
    const unSelectedRow = unSelectedRows.filter(val => !this.rowsSelectedIds.includes(val.id))
    unSelectedRow.forEach(r => {
      if (this.tabName === 'group') {
        if (this.isGroupBoxesChecked) {
          const groupCy = this.cy.getElementById(r.data.id);
          groupCy.unselect();
        } else {
          this.cy.nodes().forEach((node: any) => {
            if (node.data().groups[0].id === r.id) {
              node.unselect();
            }
          })
        }
      } else if (['node', 'portgroup', 'interface'].includes(this.tabName)) {
        const ele = this.cy.getElementById(r.data?.id);
        ele.unselect();
      }
    })
  }

  clearTable() {
    this.rowsSelected = [];
    this.rowsSelectedIds = [];
  }

  deselectAll() {
    this.rowsSelected = [];
    this.rowsSelectedIds = [];
    this.gridApi?.deselectAll();
  }

  setSelectedEles(activeEleIds: any[], rowData: any[]) {
    if (activeEleIds.length === 0) {
      this.clearTable();
      this.gridApi.setRowData([]);
    } else {
      this.setRowData(rowData);
      this.setRowActive(activeEleIds);
    }
  }

  getServiceByTab(tabName: string) {
    if (tabName == 'node') {
      return this.nodeService;
    } else if (tabName == 'portgroup') {
      return this.portGroupService;
    } else if (tabName == 'interface') {
      return this.interfaceService;
    } else if (tabName == 'domain') {
      return this.domainService;
    } else {
      return;
    }
  }

  showSingleEditDialogByTab(tabName: string) {
    const dialogData = {
      mode: 'update',
      genData: this.rowsSelected[0],
      cy: this.cy,
      tabName: this.tabName
    }
    if (tabName == 'node') {
      this.dialog.open(AddUpdateNodeDialogComponent,
        { disableClose: true, width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
      );
    } else if (tabName == 'portgroup') {
      this.dialog.open(AddUpdatePGDialogComponent, {
        disableClose: true,
        width: '600px',
        autoFocus: false,
        data: dialogData,
        panelClass: 'custom-node-form-modal'
      });
    } else if (tabName == 'interface') {
      this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    }
  }

  showBulkEditDialogByTab(tabName: string) {
    const dialogData = {
      genData: {
        ids: this.rowsSelectedIds,
        activeEles: this.rowsSelected
      },
      cy: this.cy,
      tabName: this.tabName
    }
    if (tabName == 'node') {
      this.dialog.open(NodeBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    } else if (tabName == 'portgroup') {
      this.dialog.open(PortGroupBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    } else if (tabName == 'interface') {
      this.dialog.open(InterfaceBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    }
  }

  validate() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.getServiceByTab(this.tabName)?.validate({ pks: this.rowsSelectedIds }).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          this.dialog.open(InfoPanelShowValidationResultsComponent, {
            disableClose: true,
            autoFocus: false,
            width: 'auto',
            data: e.error.result
          });
          if (this.tabName == 'domain' && e.error.result.includes('underscore(s) character')) {
            this.domainService.getDomainByProjectId(this.projectService.getProjectId())
              .subscribe((data: any) => this.store.dispatch(retrievedDomains({ data: data.result })));
          }
          return throwError(() => e);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }

  edit() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelected.length == 1) {
        this.showSingleEditDialogByTab(this.tabName);
      } else {
        this.showBulkEditDialogByTab(this.tabName)
      }
    }
  }

  delete() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      let message;
      if (this.tabName == 'node') {
        message = 'Delete node(s) from this project?';
      } else if (this.tabName == 'portgroup') {
        message = 'Delete port_group(s) from this switch?';
      } else if (this.tabName == 'interface') {
        message = 'Delete interface(s) from this project?';
      }
      const dialogData = {
        title: 'User confirmation needed',
        message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          if (this.tabName == 'node') {
            this.helpersService.removeNodesOnMap(this.rowsSelectedIds);
          } else if (this.tabName == 'portgroup') {
            this.helpersService.removePGsOnMap(this.rowsSelectedIds);
          } else if (this.tabName == 'interface') {
            this.helpersService.removeInterfacesOnMap(this.rowsSelectedIds);
          }
          this.clearTable();
        }
      })
    }
  }

  setNodeDataRefresh(tasks: any) {
    tasks.map((taskNew: any) => {
      taskNew.start_time = taskNew.start_time ? taskNew.start_time.replace('T', ' ') : null;
      this.gridApi?.forEachNode(rowNode => {
        if (rowNode.data.id === taskNew.id) {
          rowNode.setData(taskNew);
        }
      })
    })
  }

  getTaskRendered() {
    if (this.gridApi) {
      return this.gridApi.getRenderedNodes().map(rowNode => rowNode.data.id);
    } else {
      return [];
    }
  }
}
