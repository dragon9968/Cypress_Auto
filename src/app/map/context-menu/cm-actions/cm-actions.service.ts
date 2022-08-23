import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';

@Injectable({
  providedIn: 'root'
})
export class CMActionsService {

  constructor(
    private helpers: HelpersService,
    private toastr: ToastrService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
  ) { }

  getNodeActionsMenu(cy: any, activeNodes: any[]) {
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
            const data = $event.target.data();
            this.nodeService.clone(data.node_id).pipe(
              catchError((error: any) => {
                this.toastr.error(error.message);
                return throwError(() => error);
              })
            ).subscribe(clonedRes => {
              const id = clonedRes.result.id;
              this.nodeService.get(id).subscribe(nodeData => {
                const cyData = nodeData.result;
                cyData.id = 'node-' + id;
                cyData.node_id = id;
                cyData.height = cyData.logical_map_style.height;
                cyData.width = cyData.logical_map_style.width;
                cyData.text_color = cyData.logical_map_style.text_color;
                cyData.text_size = cyData.logical_map_style.text_size;
                cyData.elem_category = "node";
                cyData.icon = '/static/img/uploads/' + cyData.icon.photo;
                cyData.type = cyData.role;
                cyData.zIndex = 999;
                cyData['background-image'] = '/static/img/uploads/' + cyData.icon.photo;
                cyData['background-opacity'] = 0;
                cyData.shape = "roundrectangle";
                cyData['text-opacity'] = 1;
                this.helpers.addCYNode(cy, { newNodeData: cyData });
                this.toastr.success(clonedRes.message);
              });
            });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_node",
          content: "Validate",
          onClickFunction: (_$event: any) => {
            const pks = activeNodes.map((ele: any) => ele.data('node_id'));
            this.nodeService.validate({ pks }).pipe(
              catchError((error: any) => {
                this.toastr.error(error.message);
                return throwError(() => error);
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
            const data = event.target.data();
            this.portGroupService.randomizeSubnet(data.pg_id, collectionId).pipe(
              catchError((error: any) => {
                this.toastr.error(error.message);
                return throwError(() => error);
              })
            ).subscribe(respData => {
              const ele = cy.getElementById('pg-' + data.pg_id);
              ele.data('subnet', respData.result.subnet);
              ele.data('name', respData.result.name);
              this.toastr.success(respData.message);
              // this.info_panel.updateRow(data.pg_id, 'port_group');
            });
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
              catchError((error: any) => {
                this.toastr.error(error.message);
                return throwError(() => error);
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

  getEdgeActionsMenu(cy: any) {
    return {
      id: "edge_actions",
      content: "Actions",
      selector: "edge",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "add_edge_config",
          content: "Add Configuration",
          selector: "edge",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: true,
        },
        {
          id: "randomize_edge_ip",
          content: "Randomize IP",
          selector: "edge",
          onClickFunction: (event: any) => {
            const data = event.target.data();
            this.interfaceService.randomizeIP(data.interface_id).pipe(
              catchError((error: any) => {
                this.toastr.error(error.message);
                return throwError(() => error);
              })
            ).subscribe(respData => {
              const ele = cy.getElementById(data.interface_id);
              const ip_str = respData.result.ip ? respData.result.ip : ""
              const ip = ip_str.split(".")
              const last_octet = ip.length == 4 ? "."+ip[3] : ""
              ele.data('ip_last_octet', last_octet)
              this.toastr.success(respData.message);
            });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_edge",
          content: "Validate",
          selector: "edge",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
  }
}
