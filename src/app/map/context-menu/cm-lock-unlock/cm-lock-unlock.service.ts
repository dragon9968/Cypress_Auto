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
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockMenu(activeNodes: any[], activePGs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "unlock_node",
      content: "Unlock",
      selector: "node",
      onClickFunction: (event: any) => {
        this.unlockNodes(activeNodes, activePGs, activeMBs, activeMapLinks);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  lockNodes(cy: any, activeNodes: any[], activePGs: any[], activeMBs: any[], activeMapLinks: any[]) {
    activeNodes.concat(activePGs, activeMBs, activeMapLinks).forEach((ele: any) => {
      if (ele.locked()) {
        this.toastr.warning('Already locked');
      }
      ele.data('locked', true);
      ele.lock();
      const d = ele.data();
      if (!(d.new)) {
        d.new = false;
        d.updated = true;
        d.deleted = false;
      }
      this.helpersService.addBadge(cy, ele);
    });
  }

  unlockNodes(activeNodes: any[], activePGs: any[], activeMBs: any[], activeMapLinks: any[]) {
    activeNodes.concat(activePGs, activeMBs, activeMapLinks).forEach((ele: any) => {
      if (!(ele.locked())) {
        this.toastr.warning('Already Unlocked');
      }
      ele.data('locked', false);
      ele.unlock();
      const d = ele.data();
      if (!d.new) {
        d.new = false;
        d.updated = true;
        d.deleted = false;
      }
      this.helpersService.removeBadge(ele);
    });
  }
}
