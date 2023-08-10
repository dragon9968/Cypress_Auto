import { Store } from "@ngrx/store";
import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { InfoPanelShowValidationResultsComponent } from '../../../shared/components/info-panel-show-validation-results/info-panel-show-validation-results.component';
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectMapOption } from "src/app/store/map-option/map-option.selectors";
import { PortGroupValidateModel } from "../../../core/models/port-group.model";
import { selectLogicalMapInterfaces } from "src/app/store/interface/interface.selectors";
import { selectSelectedLogicalNodes } from "../../../store/node/node.selectors";
import { cloneNodeById } from "../../../store/node/node.actions";
import { selectSelectedPortGroups } from "src/app/store/portgroup/portgroup.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMActionsService implements OnDestroy {
  selectMapOption$ = new Subscription();
  selectLogicalMapInterfaces$ = new Subscription();
  selectSelectedLogicalNodes = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectedPortGroups!: any[];
  selectSelectedLogicalNodes$ = new Subscription();
  isEdgeDirectionChecked = false;
  logicalMapInterfaces!: any[];
  selectedNodes: any[] = [];
  
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe(mapOption => {
      this.isEdgeDirectionChecked = mapOption?.isEdgeDirectionChecked != undefined ? mapOption.isEdgeDirectionChecked : false;
    });
    this.selectLogicalMapInterfaces$ = this.store.select(selectLogicalMapInterfaces).subscribe(logicalMapInterfaces => {
      if (logicalMapInterfaces) {
        this.logicalMapInterfaces = logicalMapInterfaces;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe((selectedPortGroups: any) => {
      if (selectedPortGroups) {
        this.selectedPortGroups = selectedPortGroups;
      }
    });
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodes = selectedNodes;
      }
    });
   }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectSelectedLogicalNodes.unsubscribe();
    this.selectLogicalMapInterfaces$.unsubscribe();
    this.selectSelectedLogicalNodes$.unsubscribe();
  }

  getNodeActionsMenu(isCanWriteOnProject: boolean) {
    return {
      id: "node_actions",
      content: "Actions",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "clone_node",
          content: "Clone",
          onClickFunction: ($event: any) => {
            const ids = this.selectedNodes.map((node: any) => node.id);
            this.cloneNodes(ids);
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
        {
          id: "validate_node",
          content: "Validate",
          onClickFunction: (_$event: any) => {
            const pks = this.selectedNodes.map((node: any) => node.id);
            this.nodeService.validate({ pks }).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
                  disableClose: true,
                  autoFocus: false,
                  width: 'auto',
                  data: e.error.result
                });
                return throwError(() => e);
              })
            ).subscribe(res => this.toastr.success(res.message));
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ],
      disabled: false,
    }
  }

  getPortGroupActionsMenu(projectId: number) {
    return {
      id: "pg_actions",
      content: "Actions",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "randomize_pg_subnet",
          content: "Randomize Subnet",
          onClickFunction: (event: any) => {
            const pks = this.selectedPortGroups.map(pg => pg.id);
            this.infoPanelService.randomizeSubnetPortGroups(pks, projectId);
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_pg",
          content: "Validate",
          onClickFunction: (event: any) => {
            const jsonData: PortGroupValidateModel = {
              pks: this.selectedPortGroups.map((ele: any) => ele.id)
            }
            this.portGroupService.validate(jsonData).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
                  disableClose: true,
                  autoFocus: false,
                  width: 'auto',
                  data: e.error.result
                });
                return throwError(() => e);
              })
            ).subscribe(respData => {
              this.toastr.success(respData.message);
            });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ],
      disabled: false,
    }
  }

  getEdgeActionsMenu() {
    return {
      id: "edge_actions",
      content: "Actions",
      selector: "edge",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "randomize_edge_ip",
          content: "Randomize IP",
          selector: "edge",
          onClickFunction: (event: any) => {
            const listInterfaces = this.logicalMapInterfaces.filter(i => i.isSelected);
            this.infoPanelService.randomizeIpInterfaces(listInterfaces);
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_edge",
          content: "Validate",
          selector: "edge",
          onClickFunction: (event: any) => {
            const pks = this.logicalMapInterfaces.map((ele: any) => ele.id);
            this.interfaceService.validate({ pks }).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
                  disableClose: true,
                  autoFocus: false,
                  width: 'auto',
                  data: e.error.result
                });
                return throwError(() => e);
              })
            ).subscribe(respData => {
              this.toastr.success(respData.message);
            });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
  }

  cloneNodes(ids: any[]) {
    const jsonData = { ids }
    this.nodeService.cloneBulk(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(response => {
      const newNodes = response.result;
      newNodes.map((node: any) => {
        this.store.dispatch(cloneNodeById({ id: node.node_id }));
      });
    });
  }
}
