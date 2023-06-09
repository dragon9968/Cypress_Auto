import { Store } from "@ngrx/store";
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { InfoPanelShowValidationResultsComponent } from '../../../shared/components/info-panel-show-validation-results/info-panel-show-validation-results.component';
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CMActionsService {

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService
  ) { }

  getNodeActionsMenu(cy: any, activeNodes: any[], isCanWriteOnProject: boolean) {
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
            const ids = activeNodes.map((ele: any) => ele.data('node_id'));
            this.cloneNodes(cy, ids);
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
        {
          id: "validate_node",
          content: "Validate",
          onClickFunction: (_$event: any) => {
            const pks = activeNodes.map((ele: any) => ele.data('node_id'));
            this.nodeService.validate({ pks }).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
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

  getPortGroupActionsMenu(cy: any, collectionId: string, activePGs: any[]) {
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
            const pks = activePGs.map(pg => pg.data('pg_id'));
            this.infoPanelService.randomizeSubnetPortGroups(pks, collectionId);
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_pg",
          content: "Validate",
          onClickFunction: (event: any) => {
            const pks = activePGs.map((ele: any) => ele.data('pg_id'));
            this.portGroupService.validate({ pks }).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
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

  getEdgeActionsMenu(cy: any, activeEdges: any[]) {
    return {
      id: "edge_actions",
      content: "Actions",
      selector: "edge",
      hasTrailingDivider: true,
      submenu: [
        // {
        //   id: "add_edge_config",
        //   content: "Add Configuration",
        //   selector: "edge",
        //   onClickFunction: (event: any) => { },
        //   hasTrailingDivider: true,
        //   disabled: true,
        // },
        {
          id: "randomize_edge_ip",
          content: "Randomize IP",
          selector: "edge",
          onClickFunction: (event: any) => {
            const listInterfaces = activeEdges.map(edge => edge.data());
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
            const pks = activeEdges.map((ele: any) => ele.data('interface_id'));
            this.interfaceService.validate({ pks }).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                this.dialog.open(InfoPanelShowValidationResultsComponent, {
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

  cloneNodes(cy: any, ids: any[]) {
    const jsonData = { ids }
    this.nodeService.cloneBulk(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(response => {
      const newNodeIds = response.result.map((ele: any) => ele.data.id);
      newNodeIds.map((id: any) => {
        this.nodeService.get(id).subscribe(nodeData => {
          const cyData = nodeData.result;
          cyData.id = 'node-' + id;
          cyData.node_id = id;
          cyData.height = cyData.logical_map_style.height;
          cyData.width = cyData.logical_map_style.width;
          cyData.text_color = cyData.logical_map_style.text_color;
          cyData.text_size = cyData.logical_map_style.text_size;
          cyData.elem_category = "node";
          cyData.icon = ICON_PATH + cyData.icon.photo;
          cyData.type = cyData.role;
          cyData.zIndex = 999;
          cyData['background-image'] = cyData.icon;
          cyData['background-opacity'] = 0;
          cyData.shape = "roundrectangle";
          cyData['text-opacity'] = 1;
          this.helpers.addCYNode(cy, { newNodeData: cyData, newNodePosition: cyData.logical_map_position });
          this.helpers.reloadGroupBoxes(cy);
          // Draw interface related to Nodes
          this.interfaceService.getByNode(id).subscribe((respData: any) => {
            respData.result.map((edgeData: any) => {
              if (edgeData.category !== 'management') {
                const id = edgeData.id;
                const ip_str = edgeData.ip ? edgeData.ip : "";
                const ip = ip_str.split(".");
                const last_octet = ip.length == 4 ? "." + ip[3] : "";
                const cyData = edgeData;
                cyData.id = id;
                cyData.interface_id = id;
                cyData.ip_last_octet = last_octet;
                const logicalMapStyle = cyData.logical_map_style;
                cyData.width = logicalMapStyle.width;
                cyData.text_color = logicalMapStyle.text_color;
                cyData.text_size = logicalMapStyle.text_size;
                cyData.color = logicalMapStyle.color;
                const newEdgeData = {
                  source: 'node-' + edgeData.node_id,
                  target: 'pg-' + edgeData.port_group_id,
                  id: 'new_edge_' + this.helpers.createUUID(),
                  name: "",
                  category: cyData.category,
                  direction: cyData.direction,
                  curve_style: 'bezier',
                  color: logicalMapStyle.color,
                  width: logicalMapStyle.width,
                }
                this.helpers.addCYEdge(cy, { ...newEdgeData, ...cyData });
              }
            })
          });
        });
      });
      response.result.map((ele: any) => {
        this.toastr.success(`Cloned node ${ele.data.name}`, 'Success');
      })
    });
  }
}
