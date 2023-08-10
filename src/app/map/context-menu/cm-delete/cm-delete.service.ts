import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectSelectedLogicalNodes } from 'src/app/store/node/node.selectors';
import { selectSelectedPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { selectSelectedLogicalInterfaces } from 'src/app/store/interface/interface.selectors';
import { selectSelectedMapLinks } from "../../../store/map-link/map-link.selectors";
import { selectSelectedMapImages } from "../../../store/map-image/map-image.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMDeleteService implements OnDestroy {
  isGroupBoxesChecked!: boolean;
  selectedNodeIds!: any[];
  selectedPGIds!: any[];
  selectedInterfaceIds!: any[];
  selectedMapLinkIds!: any[];
  selectedMapImagesIds!: any[];
  selectMapOption$ = new Subscription();
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectSelectedLogicalInterfaces$ = new Subscription();
  selectSelectedMapLinks$ = new Subscription();
  selectSelectedMapImages$ = new Subscription();
  public ur: any;

  constructor(
    private store: Store,
    private commonService: CommonService,
    private helpersService: HelpersService,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodeIds = selectedNodes.map(n => n.id);
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGIds = selectedPGs.map(pg => pg.id);
      }
    });
    this.selectSelectedLogicalInterfaces$ = this.store.select(selectSelectedLogicalInterfaces).subscribe(selectedInterfaces => {
      if (selectedInterfaces) {
        this.selectedInterfaceIds = selectedInterfaces.map(i => i.id);
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(selectedMapLinks => {
      if (selectedMapLinks) {
        this.selectedMapLinkIds = selectedMapLinks.map(mapLink => mapLink.id);
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapImages).subscribe(selectedMapImages => {
      if (selectedMapImages) {
        this.selectedMapImagesIds = selectedMapImages.map(mapImage => mapImage.id);
      }
    });
  }

  ngOnDestroy(): void {
     this.selectSelectedLogicalNodes$.unsubscribe();
     this.selectSelectedPortGroups$.unsubscribe();
     this.selectSelectedLogicalInterfaces$.unsubscribe();
     this.selectSelectedMapLinks$.unsubscribe();
     this.selectSelectedMapImages$.unsubscribe();
  }

  getMenu(isCanWriteOnProject: boolean) {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        this.helpersService.removeNodesOnMap(this.selectedNodeIds);
        this.helpersService.removePGsOnMap(this.selectedPGIds);
        this.helpersService.removeInterfacesOnMap(this.selectedInterfaceIds);
        this.helpersService.removeMapLinksOnMap(this.selectedMapLinkIds);
        this.helpersService.removeMapImagesOnMap(this.selectedMapImagesIds);
      },
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
    }
  }
}
