import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { NodeService } from 'src/app/core/services/node/node.service';

@Injectable({
  providedIn: 'root'
})
export class CMActionsService {

  constructor(
    private helpers: HelpersService,
    private toastr: ToastrService,
    private nodeService: NodeService,
  ) { }

  getNodeActionsMenu(cy: any, activeNodes: any) {
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
                return of([]);
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
                return of([]);
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

  getPortGroupActionsMenu() {
    return {
      id: "pg_actions",
      content: "Actions",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "randomize_pg_subnet",
          content: "Randomize Subnet",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_pg",
          content: "Validate",
          onClickFunction: (event: any) => { },
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
          onClickFunction: (event: any) => { },
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
