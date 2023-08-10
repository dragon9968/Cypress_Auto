import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { Subscription, throwError } from "rxjs";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { ProjectService } from "../../../project/services/project.service";
import { PortGroupGetCommonModel } from "../../../core/models/port-group.model";
import { Store } from "@ngrx/store";
import { selectSelectedMapLinks } from "../../../store/map-link/map-link.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMProjectNodeService {

  selectSelectedMapLinks$ = new Subscription();
  mapLinks: any[] = []
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private portGroupService: PortGroupService,
  ) {
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(
      mapLinks => this.mapLinks = mapLinks
    )
  }

  getLinkProjectMenu(queueEdge: Function, cy: any) {
    return {
      id: "link_project",
      content: "Link",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        if (this.mapLinks.length !== 1) {
          this.toastr.warning('Please select only one project to link!', 'Warning')
        } else {
          const mapLink = this.mapLinks[0];
          const projectId = mapLink.project_id
          const linkProjectId = mapLink.linked_project_id
          const mapLinkId = mapLink.id
          const isProjectConnected = cy.edges().some((ele: any) => ele.data("map_link_id") == mapLinkId);
          if (isProjectConnected) {
            this.toastr.warning('The project has been linked', 'Warning');
          } else {
            const jsonData: PortGroupGetCommonModel = {
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
        }
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getCollapseNodeMenu(cy: any) {
    return {
      id: "collapse_node",
      content: "Collapse",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.collapseProjectNode(cy);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getExpandNodeMenu(cy: any) {
    return {
      id: "expand_node",
      content: "Expand",
      selector: "node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.expandProjectNode(cy)
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  collapseProjectNode(cy: any) {
    const mapLinkElement = cy.getElementById(this.mapLinks[0].data.id)
    mapLinkElement._private['data'] = { ...mapLinkElement._private['data'] };
    if (mapLinkElement.data().collapsedChildren) {
      this.toastr.warning("Already Collapsed")
    } else {
      cy.expandCollapse('get').collapseRecursively(mapLinkElement, {});
      mapLinkElement.data('width', '90px');
      mapLinkElement.data('height', '90px');
      mapLinkElement.data('lastPos', mapLinkElement.position());
      mapLinkElement.data('collapsed', true);
      mapLinkElement.data('updated', true);
      mapLinkElement.style({
        'background-opacity': '0',
        'background-color': '#fff',
        'background-image-opacity': 1,
      });
    }
  }

  expandProjectNode(cy: any) {
    const mapLinkElement = cy.getElementById(this.mapLinks[0].data.id)
    mapLinkElement._private['data'] = { ...mapLinkElement._private['data'] };
    if (!(mapLinkElement.data().collapsedChildren)) {
      this.toastr.warning("Already Expanded")
    } else {
      cy.expandCollapse('get').expandRecursively(mapLinkElement, {});
      mapLinkElement.removeData('lastPos');
      mapLinkElement.removeData('width');
      mapLinkElement.removeData('height');
      mapLinkElement.data('updated', true);
      mapLinkElement.data('collapsed', false);
      mapLinkElement.style({
        'background-opacity': '.20',
        'background-color': '#00dcff',
        'background-image-opacity': 0,
      });
    }
  }
}
