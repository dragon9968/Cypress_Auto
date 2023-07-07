import { Store } from "@ngrx/store";
import { ResizeEvent } from 'angular-resizable-element';
import { Subscription } from "rxjs";
import { Component, Input, OnInit } from '@angular/core';
import { NodeService } from "../../core/services/node/node.service";
import { ProjectService } from "../../project/services/project.service";
import { DomainUserService } from "../../core/services/domain-user/domain-user.service";
import { retrievedNodes } from "../../store/node/node.actions";
import { retrievedDomainUsers } from "../../store/domain-user/domain-user.actions";
import { retrievedIsChangeDomainUsers } from "../../store/domain-user-change/domain-user-change.actions";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { retrievedInterfaceByProjectIdAndCategory } from "../../store/interface/interface.actions";

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
  projectId = '0';
  style: any = {
    height: '300px'
  };

  constructor(
    private store: Store,
    private nodeService: NodeService,
    private projectService: ProjectService,
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
      top: `${event.rectangle.top - 65}px`,
      height: `${event.rectangle.height}px`
    };
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
    this.nodeService.getNodesByProjectId(this.projectId).subscribe(
      (data: any) => this.store.dispatch(retrievedNodes({ data: data.result }))
    );
    this.selectDomainUser$ = this.domainUserService.getAll().subscribe(
      data => this.store.dispatch(retrievedDomainUsers({ data: data.result }))
    );
    this.store.dispatch(retrievedIsChangeDomainUsers({ isChangeDomainUsers: false }));
    this.interfaceService.getByProjectIdAndCategory(this.projectId, 'logical', 'all')
      .subscribe(res => {
        this.store.dispatch(retrievedInterfaceByProjectIdAndCategory({data: res.result}))
    })
  }
}
