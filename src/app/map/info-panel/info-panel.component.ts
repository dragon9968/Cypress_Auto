import { Store } from "@ngrx/store";
import { ResizeEvent } from 'angular-resizable-element';
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnInit } from '@angular/core';
import { NodeService } from "../../core/services/node/node.service";
import { PortGroupService } from "../../core/services/portgroup/portgroup.service";
import { DomainUserService } from "../../core/services/domain-user/domain-user.service";
import { retrievedNodes } from "../../store/node/node.actions";
import { retrievedPortGroups } from "../../store/portgroup/portgroup.actions";
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
  style: any = {
    height: '300px'
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private portGroupService: PortGroupService,
    private nodeService: NodeService,
    private domainUserService: DomainUserService
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
      position: 'fixed',
      top: `${event.rectangle.top}px`,
      height: `${event.rectangle.height}px`
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.portGroupService.getByCollectionId(this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedPortGroups({data: data.result}))
    );
    this.nodeService.getNodesByCollectionId(this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedNodes({data: data.result}))
    );
    this.selectDomainUser$ = this.domainUserService.getAll().subscribe(
      data => this.store.dispatch(retrievedDomainUsers({data: data.result}))
    );
    this.store.dispatch(retrievedIsChangeDomainUsers({isChangeDomainUsers: false}));
  }

}
