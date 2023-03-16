import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { ProjectService } from "../../../project/services/project.service";

@Injectable({
  providedIn: 'root'
})
export class CMProjectNodeService {

  constructor(
    private toastr: ToastrService,
    private projectService: ProjectService,
    private portGroupService: PortGroupService,
  ) { }

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

  getCollapseNodeMenu(cy: any, activeNodes: any[]) {
    return {
      id: "collapse_node",
      content: "Collapse",
      selector: "node[category='project']",
      onClickFunction: (event: any) => {
        this.collapseProjectNode(cy, activeNodes);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getExpandNodeMenu(cy: any, activeNodes: any[]) {
    return {
      id: "expand_node",
      content: "Expand",
      selector: "node[category='project']",
      onClickFunction: (event: any) => {
        this.expandProjectNode(cy, activeNodes)
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  collapseProjectNode(cy: any, activeNodes: any[]) {
    activeNodes.map((node: any) => {
      node._private['data'] = { ...node._private['data'] };
      if (node.data().collapsedChildren) {
        this.toastr.warning("Already Collapsed")
      } else {
        cy.expandCollapse('get').collapseRecursively(node, {});
        node.data('width', '90px');
        node.data('height', '90px');
        node.data('lastPos', node.position());
        node.data('collapsed', true);
        node.data('updated', true);
        node.data('deleted', false);
        node.data('new', false);
        node.style({
          'background-opacity': '0',
          'background-color': '#fff',
          'background-image-opacity': 1,
        });
      }
    });
  }

  expandProjectNode(cy: any, activeNodes: any[]) {
    activeNodes.map((node: any) => {
      node._private['data'] = { ...node._private['data'] };
      if (!(node.data().collapsedChildren)) {
        this.toastr.warning("Already Expanded")
      } else {
        cy.expandCollapse('get').expandRecursively(node, {});
        node.removeData('lastPos');
        node.removeData('width');
        node.removeData('height');
        node.data('new', false);
        node.data('updated', true);
        node.data('deleted', false);
        node.data('collapsed', false);
        node.style({
          'background-opacity': '.20',
          'background-color': '#00dcff',
          'background-image-opacity': 0,
        });
      }
    });
  }
}
