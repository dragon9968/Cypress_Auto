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

  getLinkProjectMenu(queueEdge: Function, cy: any, activeMapLinks: any[]) {
    return {
      id: "link_project",
      content: "Link",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        const projectId = activeMapLinks[0].data('project_id')
        const linkProjectId = activeMapLinks[0].data('linked_project_id')
        const mapLinkId = activeMapLinks[0].data('map_link_id')
        const isProjectConnected = cy.edges().some((ele: any) => ele.data("map_link_id") == mapLinkId);
        if (isProjectConnected) {
          this.toastr.warning('The project has been linked', 'Warning');
        } else {
          const jsonData = {
            project_id: projectId,
            linked_project_id: linkProjectId
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
              const mapLinkId = activeMapLinks[0].data('map_link_id');
              cy.elements().filter(`[map_link_id != ${mapLinkId}]`).forEach((ele: any) => {
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
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getCollapseNodeMenu(cy: any, activeMapLinks: any[]) {
    return {
      id: "collapse_node",
      content: "Collapse",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.collapseProjectNode(cy, activeMapLinks);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getExpandNodeMenu(cy: any, activeMapLinks: any[]) {
    return {
      id: "expand_node",
      content: "Expand",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.expandProjectNode(cy, activeMapLinks)
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  collapseProjectNode(cy: any, activeMapLinks: any[]) {
    activeMapLinks.map((node: any) => {
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

  expandProjectNode(cy: any, activeMapLinks: any[]) {
    activeMapLinks.map((node: any) => {
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
