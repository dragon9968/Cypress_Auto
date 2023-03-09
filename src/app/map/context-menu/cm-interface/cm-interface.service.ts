import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from '@angular/core';
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { retrievedInterfacesNotConnectPG } from "../../../store/interface/interface.actions";
import { ConnectInterfaceToPgDialogComponent } from "../cm-dialog/connect-interface-to-pg-dialog/connect-interface-to-pg-dialog.component";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
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
    private interfaceService: InterfaceService,
    private portGroupService: PortGroupService
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

  getLinkProjectMenu(queueEdge: Function, cy: any, activeNodes: any[]) {
    return {
      id: "link_project",
      content: "Link",
      selector: "node[category='project']",
      onClickFunction: (event: any) => {
        const projectId = activeNodes[0].data('collection_id')
        const linkProjectId = activeNodes[0].data('link_project_id')
        this.projectService.get(projectId).subscribe(response => {
          const project = response.result;
          const linkedProject = project.link_projects;
          const isProjectLinked = linkedProject.some((ele: any) => ele.id == linkProjectId);
          if (isProjectLinked) {
            this.toastr.warning('The project has been linked', 'Warning');
          } else {
            const jsonData = {
              project_id: projectId,
              linked_project_id: linkProjectId,
            }
            this.portGroupService.getPortGroupCommon(jsonData).pipe(
              catchError(err => {
                this.toastr.error('Get port group common failed!', 'Error');
                return throwError(() => err);
              })
            ).subscribe(response => {
              const portGroupIds = response.result;
              if (portGroupIds.length === 0) {
                this.toastr.warning('The projects have no common connection point', 'Waring');
              } else {
                const nodeId = activeNodes[0].data('node_id');
                cy.elements().filter(`[node_id != ${nodeId}]`).forEach((ele: any) => {
                  ele.style('opacity', 0.1);
                  ele.unselect();
                })
                cy.nodes().filter('[pg_id]').forEach((ele: any) => {
                  if (!(portGroupIds.includes(ele.data('pg_id')))) {
                    ele.style('opacity', 0.1);
                    ele.unselect();
                  } else {
                    ele.style('opacity', 1.0);
                    ele.select();
                  }
                })
                queueEdge(event.target, event.position, "wired");
              }
            })
          }
        })
      },
      hasTrailingDivider: true,
      disabled: false,
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
