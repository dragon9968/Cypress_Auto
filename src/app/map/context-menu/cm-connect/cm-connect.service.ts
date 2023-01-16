import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from '@angular/core';
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { retrievedInterfacesNotConnectPG } from "../../../store/interface/interface.actions";
import { ConnectInterfaceToPgDialogComponent } from "../cm-dialog/connect-interface-to-pg-dialog/connect-interface-to-pg-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class CMConnectService {

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private interfaceService: InterfaceService
  ) { }

  getNodeConnectMenu(queueEdge: Function, cy: any, activeNodes: any[]) {
    return {
      id: "node_connect",
      content: "Connect",
      selector: "node[icon]",
      hasTrailingDivider: false,
      disabled: false,
      submenu: [
        {
          id: "connect_interface_port_group",
          content: "Connect Interface to Port Group",
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
          },
          hasTrailingDivider: false,
          disabled: false,
        },
      ]
    }
  }
}
