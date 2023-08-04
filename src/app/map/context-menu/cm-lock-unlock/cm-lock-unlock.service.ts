import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class CMLockUnlockService {

  constructor(
    private toastr: ToastrService,
    private helpersService: HelpersService,
  ) { }

  getLockMenu(cy: any, activeNodes: any[], activePGs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "lock_node",
      content: "Lock",
      selector: "node",
      onClickFunction: (event: any) => {
        this.lockNodes(cy, activeNodes, activePGs, activeMBs, activeMapLinks);
        this.toastr.success("Locked the nodes");
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockMenu(cy: any, activeNodes: any[], activePGs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "unlock_node",
      content: "Unlock",
      selector: "node",
      onClickFunction: (event: any) => {
        this.unlockNodes(cy, activeNodes, activePGs, activeMBs, activeMapLinks);
        this.toastr.success("Unlocked the nodes");
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  lockNodes(cy: any, selectedNodes: any[], selectedPortGroups: any[], selectedMapImages: any[], selectedMapLinks: any[]) {
    selectedNodes.concat(selectedPortGroups, selectedMapImages, selectedMapLinks).forEach((ele: any) => {
      const selectedEle = cy.getElementById(ele.data.id);
      selectedEle.data('locked', true);
      selectedEle.lock();
      const d = selectedEle.data();
      if (!(d.new)) {
        d.new = false;
        d.updated = true;
        d.deleted = false;
      }
      this.helpersService.addBadge(cy, selectedEle);
    });
  }

  unlockNodes(cy: any, selectedNodes: any[], selectedPortGroups: any[], selectedMapImages: any[], selectedMapLinks: any[]) {
    selectedNodes.concat(selectedPortGroups, selectedMapImages, selectedMapLinks).forEach((ele: any) => {
      const selectedEle = cy.getElementById(ele.data.id);
      selectedEle.data('locked', false);
      selectedEle.unlock();
      const d = selectedEle.data();
      if (!d.new) {
        d.new = false;
        d.updated = true;
        d.deleted = false;
      }
      this.helpersService.removeBadge(selectedEle);
    });
  }
}
