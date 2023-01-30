import { Store } from "@ngrx/store";
import { ResizeEvent } from 'angular-resizable-element';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Component, Input, OnInit } from '@angular/core';
import { NodeService } from "../../core/services/node/node.service";
import { ProjectService } from "../../project/services/project.service";
import { PortGroupService } from "../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../core/services/domain-user/domain-user.service";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { retrievedNodes } from "../../store/node/node.actions";
import { retrievedDomainUsers } from "../../store/domain-user/domain-user.actions";
import { retrievedIsChangeDomainUsers } from "../../store/domain-user-change/domain-user-change.actions";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit{
  isOpenInfoPanel = false;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  selectDomainUser$ = new Subscription();
  collectionId = '0';
  managementCategory = 'management';
  style: any = {
    height: '300px'
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private projectService: ProjectService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService,
    private interfaceService: InterfaceService,
    private domainUserService: DomainUserService,
  ) {}

  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'absolute',
      top: `${event.rectangle.top}px`,
      height: `${event.rectangle.height}px`
    };
  }

  ngOnInit(): void {
    this.collectionId = this.projectService.getCollectionId();
    this.nodeService.getNodesByCollectionId(this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedNodes({ data: data.result }))
    );
    this.selectDomainUser$ = this.domainUserService.getAll().subscribe(
      data => this.store.dispatch(retrievedDomainUsers({ data: data.result }))
    );
    this.infoPanelService.initPortGroupManagementStorage(this.collectionId, this.managementCategory);
    this.infoPanelService.initInterfaceManagementStorage(this.collectionId, this.managementCategory);
    this.store.dispatch(retrievedIsChangeDomainUsers({ isChangeDomainUsers: false }));
  }
}
