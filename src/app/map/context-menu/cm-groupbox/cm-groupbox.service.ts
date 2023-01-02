import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CMGroupBoxService {

  constructor(private toastr: ToastrService) { }

  getCollapseMenu(cy: any, activeGBs: any[]) {
    return {
      id: "collapse_groupbox",
      content: "Collapse",
      selector: "node[label='group_box']",
      onClickFunction: (event: any) => {
        this.collapse(cy, activeGBs);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getExpandMenu(cy: any, activeGBs: any[]) {
    return {
      id: "expand_groupbox",
      content: "Expand",
      selector: "node[label='group_box']",
      onClickFunction: (event: any) => {
        this.expand(cy, activeGBs);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getMoveToFrontMenu() {
    return {
      id: "move_to_front",
      content: "Move to Front",
      selector: "node[label='group_box'], node[label='map_background']",
      onClickFunction: (event: any) => {
        const target = event.target;
        this.moveUp(target);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getMoveToBackMenu() {
    return {
      id: "move_to_back",
      content: "Move to Back",
      selector: "node[label='group_box'], node[label='map_background']",
      onClickFunction: (event: any) => {
        const target = event.target;
        this.moveDown(target);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  collapse(cy: any, activeGBs: any[]) {
    activeGBs.map((gb: any) => {
      gb._private['data'] = { ...gb._private['data'] };
      if (gb.data().collapsedChildren) {
        this.toastr.warning("Already Collapsed")
      } else {
        cy.expandCollapse('get').collapseRecursively(gb, {});
        gb.data('width', '90px')
        gb.data('height', '90px')
        gb.data('lastPos', gb.position())
      }
    });
  }

  expand(cy: any, activeGBs: any[]) {
    activeGBs.map((gb: any) => {
      gb._private['data'] = { ...gb._private['data'] };
      if (!(gb.data().collapsedChildren)) {
        this.toastr.warning("Already Expanded")
      } else {
        cy.expandCollapse('get').expandRecursively(gb, {});
        gb.removeData('lastPos');
        gb.removeData('width')
        gb.removeData('height')
      }
    });
  }

  moveUp(target: any) {
    target._private['data'] = { ...target._private['data'] };
    if (target.data('zIndex') != 998) {
      target.data('zIndex', target.data('zIndex') + 1)
    }
  }

  moveDown(target: any) {
    target._private['data'] = { ...target._private['data'] };
    if (target.data('zIndex') != -998) {
      target.data('zIndex', target.data('zIndex') - 1)
    }
  }
}
