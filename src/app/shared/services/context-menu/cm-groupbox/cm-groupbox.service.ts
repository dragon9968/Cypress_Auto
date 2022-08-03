import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMGroupBoxService {

  constructor(private dialog: MatDialog) { }

  getCollapseMenu() {
    return {
      id: "collapse_groupbox",
      content: "Collapse",
      selector: "node[label='group_box']",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  getExpandMenu() {
    return {
      id: "expand_groupbox",
      content: "Expand",
      selector: "node[label='group_box']",
      onClickFunction: (event: any) => { },
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
        if (target.data('zIndex') != 998) {
          target.data('zIndex', target.data('zIndex') + 1)
        }
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
        if (target.data('zIndex') != -998) {
          target.data('zIndex', target.data('zIndex') - 1)
        }
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
