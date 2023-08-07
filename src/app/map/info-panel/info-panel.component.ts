import { Store } from "@ngrx/store";
import { ResizeEvent } from 'angular-resizable-element';
import { Subscription } from "rxjs";
import { Component, Input, OnInit } from '@angular/core';
import { NodeService } from "../../core/services/node/node.service";
import { ProjectService } from "../../project/services/project.service";
import { DomainUserService } from "../../core/services/domain-user/domain-user.service";
import { retrievedDomainUsers } from "../../store/domain-user/domain-user.actions";
import { retrievedIsChangeDomainUsers } from "../../store/domain-user-change/domain-user-change.actions";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { LocalStorageKeys } from "../../core/storage/local-storage/local-storage-keys.enum";

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
  selectDomainUser$ = new Subscription();
  isShowMaximize = true
  isShowMinimize = true
  isShowRestoreHeight = false
  infoPanelHeightRestore = '0px'
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
    const MAX_DIMENSIONS_PX = window.screen.height - 230
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
      event.rectangle.height < MIN_DIMENSIONS_PX ||
      event.rectangle.height > MAX_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.isShowMinimize = true;
    this.isShowRestoreHeight = false;
    this.isShowMaximize = true;
    this.style = {
      position: 'absolute',
      top: `${event.rectangle.top - 65}px`,
      height: `${event.rectangle.height}px`
    };
    this.infoPanelHeightRestore = `${event.rectangle.height}px`
    localStorage.setItem(LocalStorageKeys.INFO_PANEL_HEIGHT, this.infoPanelHeightRestore)
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
    this.selectDomainUser$ = this.domainUserService.getAll().subscribe(
      data => this.store.dispatch(retrievedDomainUsers({ data: data.result }))
    );
    this.store.dispatch(retrievedIsChangeDomainUsers({ isChangeDomainUsers: false }));
    const infoPanelHeight = localStorage.getItem(LocalStorageKeys.INFO_PANEL_HEIGHT)
    this.infoPanelHeightRestore = infoPanelHeight ? infoPanelHeight : '300px'
    this.style.height = this.infoPanelHeightRestore
  }

  minimizeInfoPanel() {
    this.isShowMinimize = false;
    this.isShowRestoreHeight = true;
    this.isShowMaximize = true;
    this.style = {
      height: '50px'
    };
  }

  maximizeInfoPanel() {
    this.isShowMinimize = true;
    this.isShowRestoreHeight = true;
    this.isShowMaximize = false;
    this.style = {
      height: `${window.screen.height - 230}px`
    };
  }

  restoreHeight() {
    this.isShowMinimize = true;
    this.isShowRestoreHeight = false;
    this.isShowMaximize = true;
    this.style = {
      height: this.infoPanelHeightRestore
    };
  }

}
