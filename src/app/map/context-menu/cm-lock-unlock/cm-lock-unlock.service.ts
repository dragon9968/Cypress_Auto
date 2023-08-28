import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectSelectedLogicalNodes, selectSelectedPhysicalNodes } from "../../../store/node/node.selectors";
import { selectSelectedPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectSelectedMapImages } from "../../../store/map-image/map-image.selectors";
import { selectSelectedMapLinks } from "../../../store/map-link/map-link.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMLockUnlockService implements OnDestroy {

  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectSelectedMapImages$ = new Subscription();
  selectSelectedMapLinks$ = new Subscription();

  selectedNodes: any[] = [];
  selectedLogicalNodes: any[] = [];
  selectedPhysicalNodes: any[] = [];
  selectedPortGroups: any[] = [];
  selectedMapImages: any[] = [];
  selectedMapLinks: any[] = [];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private helpersService: HelpersService,
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(nodes => {
      if (nodes) {
        this.selectedLogicalNodes = nodes;
      }
    });
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedPhysicalNodes).subscribe(nodes => {
      if (nodes) {
        this.selectedPhysicalNodes = nodes;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(portGroups => {
      if (portGroups) {
        this.selectedPortGroups = portGroups;
      }
    });
    this.selectSelectedMapImages$ = this.store.select(selectSelectedMapImages).subscribe(mapImages => {
      if (mapImages) {
        this.selectedMapImages = mapImages;
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(mapLinks => {
      if (mapLinks) {
        this.selectedMapLinks = mapLinks;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectSelectedPortGroups$.unsubscribe();
    this.selectSelectedMapImages$.unsubscribe();
    this.selectSelectedMapLinks$.unsubscribe();
  }

  getLockMenu(cy: any, mapCategory: any) {
    return {
      id: "lock_node",
      content: "Lock",
      selector: "node",
      onClickFunction: (event: any) => {
        this.lockNodes(cy, mapCategory);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockMenu(cy: any, mapCategory: any) {
    return {
      id: "unlock_node",
      content: "Unlock",
      selector: "node",
      onClickFunction: (event: any) => {
        this.unlockNodes(cy, mapCategory);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  lockNodes(cy: any, mapCategory: any) {
    this.selectedNodes = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes;
    this.selectedNodes.concat(this.selectedPortGroups, this.selectedMapImages, this.selectedMapLinks).forEach((ele: any) => {
      const selectedEle = cy.getElementById(ele.data.id);
      if (selectedEle.locked()) {
        this.toastr.warning('Already locked');
      } else {
        selectedEle.data('locked', true);
        selectedEle.lock();
        const d = selectedEle.data();
        d.updated = true;
        this.helpersService.addBadge(cy, selectedEle);
        this.toastr.success("Locked the nodes");
      }
    });
  }

  unlockNodes(cy: any, mapCategory: any) {
    this.selectedNodes = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes;
    this.selectedNodes.concat(this.selectedPortGroups, this.selectedMapImages, this.selectedMapLinks).forEach((ele: any) => {
      const selectedEle = cy.getElementById(ele.data.id);
      if (!selectedEle.locked()) {
        this.toastr.warning('Already Unlocked');
      } else {
        selectedEle.data('locked', false);
        selectedEle.unlock();
        const d = selectedEle.data();
        d.updated = true;
        this.helpersService.removeBadge(selectedEle);
        this.toastr.success("Unlocked the nodes");
      }
    });
  }
}
