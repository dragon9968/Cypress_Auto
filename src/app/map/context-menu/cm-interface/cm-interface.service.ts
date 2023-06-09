import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from '@angular/core';
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { retrievedInterfacesNotConnectPG } from "../../../store/interface/interface.actions";
import { ConnectInterfaceToPgDialogComponent } from "../cm-dialog/connect-interface-to-pg-dialog/connect-interface-to-pg-dialog.component";
import { ToastrService } from "ngx-toastr";
import { ProjectService } from "../../../project/services/project.service";

@Injectable({
  providedIn: 'root'
})
export class CMInterfaceService {

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService
  ) { }

  getNodeInterfaceMenu(queueEdge: Function, cy: any, activeNodes: any[], isCanWriteOnProject: boolean) {
    const addInterface = {
      id: "add_new_interface",
      content: "New",
      onClickFunction: (event: any) => {
        queueEdge(event.target, event.position, "wired");
      },
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
    }

    const connectInterfaceToPortGroup = {
      id: "connect_interface_port_group",
      content: "Connect",
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
      onClickFunction: (event: any) => {
        const nodeId = activeNodes[0].data('node_id');
        const dialogData = {
          mode: 'connect',
          nodeId: nodeId,
          queueEdge: queueEdge,
          event: event,
          cy
        }
        this.interfaceService.getByNodeAndNotConnectToPG(nodeId).subscribe(response => {
          this.store.dispatch(retrievedInterfacesNotConnectPG({ interfacesNotConnectPG: response.result }));
          this.dialog.open(ConnectInterfaceToPgDialogComponent, { width: '450px', data: dialogData })
        })
      }
    }

    const disconnectInterfacePortGroup = {
      id: "disconnect_interface_port_group",
      content: "Disconnect",
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
      onClickFunction: (event: any) => {
        const nodeId = activeNodes[0].data('node_id');
        const dialogData = {
          mode: 'disconnect',
          nodeId: nodeId,
          queueEdge: queueEdge,
          event: event,
          cy
        }
        this.interfaceService.getByNodeAndConnectedToPG(nodeId).subscribe(response => {
          this.store.dispatch(retrievedInterfacesNotConnectPG({ interfacesNotConnectPG: response.result }));
          this.dialog.open(ConnectInterfaceToPgDialogComponent, { width: '450px', data: dialogData })
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
        addInterface,
        connectInterfaceToPortGroup,
        disconnectInterfacePortGroup
      ]
    }
  }

  getPortGroupInterfaceMenu(queueEdge: Function) {
    return {
      id: "pg_interface",
      content: "Interface",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: false,
      submenu: [
        {
          id: "add_interface",
          content: "New",
          selector: "node[label!='group_box']",
          onClickFunction: (event: any) => {
            queueEdge(event.target, event.position, "wired");
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
  }
}
