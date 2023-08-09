import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Injectable, OnDestroy } from '@angular/core';
import { InterfaceService } from "../../../core/services/interface/interface.service";
import {
  retrievedIsInterfaceConnectPG,
  retrievedInterfacePkConnectNode,
  retrievedInterfacesBySourceNode,
  retrievedInterfacesConnectedNode,
  retrievedInterfacesNotConnectPG,
  retrievedInterfacesConnectedPG
} from "../../../store/interface/interface.actions";
import { ToastrService } from "ngx-toastr";
import { ProjectService } from "../../../project/services/project.service";
import { retrievedNameNodeBySourceNode } from "src/app/store/node/node.actions";
import { ConnectInterfaceToPgDialogComponent } from "../cm-dialog/connect-interface-to-pg-dialog/connect-interface-to-pg-dialog.component";
import { Subscription } from "rxjs";
import { selectSelectedLogicalNodes } from "../../../store/node/node.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMInterfaceService implements OnDestroy {

  selectSelectedLogicalNodes$ = new Subscription();
  selectedNodes: any[] = [];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(nodes => {
      if (nodes) {
        this.selectedNodes = nodes;
      }
    })
  }

  ngOnDestroy(): void {
     this.selectSelectedLogicalNodes$.unsubscribe();
  }

  getNodeInterfaceMenu(queueEdge: Function, cy: any, isCanWriteOnProject: boolean, mapCategory: any) {
    const connectInterface = {
      id: "connect_interface",
      content: "Connect",
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
      onClickFunction: (event: any) => {
        const nodeId = this.selectedNodes[0].id;
        const nodeName = this.selectedNodes[0].name;
        if (mapCategory == 'logical') {
          this.interfaceService.getByNodeAndNotConnectToPG(nodeId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesNotConnectPG({ interfacesNotConnectPG: response.result }));
            this.store.dispatch(retrievedIsInterfaceConnectPG({ isInterfaceConnectPG: true }))
            queueEdge(event.target, event.position, "wired");
          })
        } else {
          this.interfaceService.getByNodeAndNotConnected(nodeId).subscribe(response => {
            this.interfaceService.getByProjectId(this.projectService.getProjectId()).subscribe(resp => {
              this.store.dispatch(retrievedInterfacesConnectedNode({ interfacesConnectedNode: resp.result }));
              this.store.dispatch(retrievedInterfacesBySourceNode({ interfacesBySourceNode: response.result }));
              this.store.dispatch(retrievedInterfacePkConnectNode({ interfacePkConnectNode: true }))
              this.store.dispatch(retrievedNameNodeBySourceNode({ nameNode: nodeName }));
              queueEdge(event.target, event.position, "wired");
            })
          })
        }
      }
    }

    const disconnectInterfacePortGroup = {
      id: "disconnect_interface_port_group",
      content: "Disconnect",
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
      onClickFunction: (event: any) => {
        const nodeId = this.selectedNodes[0].id;
        const dialogData = {
          mode: 'disconnect',
          nodeId: nodeId,
          queueEdge: queueEdge,
          event: event,
          cy
        }
        this.interfaceService.getByNodeAndConnectedToPG(nodeId).subscribe(response => {
          this.store.dispatch(retrievedInterfacesConnectedPG({interfacesConnectedPG: response.result}))
          this.dialog.open(ConnectInterfaceToPgDialogComponent, { disableClose: true, width: '450px', data: dialogData, autoFocus: false })
        })
      }
    }

    return {
      id: "node_interface",
      content: "Interface",
      selector: "node[icon]",
      hasTrailingDivider: false,
      disabled: false,
      submenu: [
        connectInterface,
        disconnectInterfacePortGroup,
      ]
    }
  }

  // getPortGroupInterfaceMenu(queueEdge: Function) {
  //   return {
  //     id: "pg_interface",
  //     content: "Interface",
  //     selector: "node[elem_category='port_group']",
  //     hasTrailingDivider: false,
  //     submenu: [
  //       {
  //         id: "add_interface",
  //         content: "New",
  //         selector: "node[label!='group_box']",
  //         onClickFunction: (event: any) => {
  //           queueEdge(event.target, event.position, "wired");
  //         },
  //         hasTrailingDivider: true,
  //         disabled: false,
  //       },
  //     ]
  //   }
  // }
}
