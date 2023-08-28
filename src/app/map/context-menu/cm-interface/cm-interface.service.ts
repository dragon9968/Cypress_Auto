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
import { ConnectInterfaceToPgDialogComponent } from "../cm-dialog/connect-interface-to-pg-dialog/connect-interface-to-pg-dialog.component";
import { Subscription } from "rxjs";
import { selectSelectedLogicalNodes, selectSelectedPhysicalNodes } from "../../../store/node/node.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMInterfaceService implements OnDestroy {

  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPhysicalNodes$ = new Subscription();
  selectedLogicalNodes: any[] = [];
  selectedPhysicalNodes: any[] = [];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedLogicalNodes => {
      if (selectedLogicalNodes) {
        this.selectedLogicalNodes = selectedLogicalNodes;
      }
    })
    this.selectSelectedPhysicalNodes$ = this.store.select(selectSelectedPhysicalNodes).subscribe(selectedPhysicalNodes => {
      if (selectedPhysicalNodes) {
        this.selectedPhysicalNodes = selectedPhysicalNodes;
      }
    });
  }

  ngOnDestroy(): void {
     this.selectSelectedLogicalNodes$.unsubscribe();
     this.selectSelectedPhysicalNodes$.unsubscribe();
  }

  getNodeInterfaceMenu(queueEdge: Function, cy: any, isCanWriteOnProject: boolean, mapCategory: any) {
    const connectInterface = {
      id: "connect_interface",
      content: "Connect",
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
      onClickFunction: (event: any) => {
        const nodeData = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes
        const nodeId = nodeData[0].id;
        if (mapCategory == 'logical') {
          this.interfaceService.getByNodeAndNotConnectToPG(nodeId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesNotConnectPG({ interfacesNotConnectPG: response.result }));
            this.store.dispatch(retrievedIsInterfaceConnectPG({ isInterfaceConnectPG: true }))
            queueEdge(event.target, event.position, "wired");
          })
        } else {
          this.interfaceService.getByNodeAndNotConnected(nodeId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesBySourceNode({ interfacesBySourceNode: response.result }));
            this.store.dispatch(retrievedInterfacePkConnectNode({ interfacePkConnectNode: true }))
            queueEdge(event.target, event.position, "wired");
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
        const nodeData = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes
        const nodeId = nodeData[0].id;
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
}
