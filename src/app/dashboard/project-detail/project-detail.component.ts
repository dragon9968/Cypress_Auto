import { MatIconRegistry } from "@angular/material/icon";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from "../../core/services/user/user.service";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ProjectService } from "../../project/services/project.service";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent {
  @Input() isLock!: boolean;
  @Output() disableCard = new EventEmitter<any>();
  isMaximize = true;
  isExpand = false;
  collectionId = 0;
  project: any;
  user: any;
  name = '';
  description = '';
  creator = '';
  shared = '';
  vmTotal = 0;
  hwTotal = 0;
  switchesTotal = 0;
  firewallTotal = 0;
  routersTotal = 0;
  linuxServersTotal = 0;
  linuxClientsTotal = 0;
  windowServersTotal = 0;
  windowClientsTotal = 0;
  portGroupsTotal = 0;
  domainsTotal = 0;
  domainUsersTotal = 0;


  constructor(
    private iconRegistry: MatIconRegistry,
    private userService: UserService,
    private helpersService: HelpersService,
    private projectService: ProjectService,
  ) {
    this.iconRegistry.addSvgIcon('hw', this.helpersService.setIconPath('/assets/icons/dashboard/hw.svg'));
    this.iconRegistry.addSvgIcon('vm', this.helpersService.setIconPath('/assets/icons/dashboard/vm.svg'));
    this.iconRegistry.addSvgIcon('plus', this.helpersService.setIconPath('/assets/icons/dashboard/plus.svg'));
    this.iconRegistry.addSvgIcon('minus', this.helpersService.setIconPath('/assets/icons/dashboard/minus.svg'));
    this.iconRegistry.addSvgIcon('domain', this.helpersService.setIconPath('/assets/icons/dashboard/domain.svg'));
    this.iconRegistry.addSvgIcon('router', this.helpersService.setIconPath('/assets/icons/dashboard/routers.svg'));
    this.iconRegistry.addSvgIcon('switch', this.helpersService.setIconPath('/assets/icons/dashboard/switches.svg'));
    this.iconRegistry.addSvgIcon('firewall', this.helpersService.setIconPath('/assets/icons/dashboard/firewall.svg'));
    this.iconRegistry.addSvgIcon('port-group', this.helpersService.setIconPath('/assets/icons/dashboard/port-group.svg'));
    this.iconRegistry.addSvgIcon('domain-user', this.helpersService.setIconPath('/assets/icons/dashboard/domain-user.svg'));
    this.iconRegistry.addSvgIcon('linux-client', this.helpersService.setIconPath('/assets/icons/dashboard/linux-client.svg'));
    this.iconRegistry.addSvgIcon('linux-server', this.helpersService.setIconPath('/assets/icons/dashboard/linux-server.svg'));
    this.iconRegistry.addSvgIcon('windows-client', this.helpersService.setIconPath('/assets/icons/dashboard/windows-client.svg'));
    this.iconRegistry.addSvgIcon('windows-server', this.helpersService.setIconPath('/assets/icons/dashboard/windows-server.svg'));
    this.collectionId = this.projectService.getCollectionId();
    this.projectService.get(+this.collectionId).subscribe(projectData => {
      this.project = projectData.result;
      this.name = this.project.name;
      this.description = this.project.description;
      const sharedList = this.project.share?.map((ele: any) => `${ele.first_name} ${ele.last_name}`);
      this.shared = `[${sharedList.join(', ')}]`;
    });
    this.userService.getCreatorProject(this.collectionId).subscribe(userData => {
      this.user = userData.result;
      this.creator = `${this.user.first_name} ${this.user.last_name}`;
    });
    this.projectService.getDeviceCount(this.collectionId).subscribe(data => {
      const deviceCount = data.result;
      this.vmTotal = deviceCount.vm;
      this.hwTotal = deviceCount.hw;
      this.switchesTotal = deviceCount.switch;
      this.portGroupsTotal = deviceCount.port_group;
      this.domainsTotal = deviceCount.domain;
      this.routersTotal = deviceCount.router;
      this.firewallTotal = deviceCount.firewall;
      this.linuxServersTotal = deviceCount.linux_server;
      this.linuxClientsTotal = deviceCount.linux_client;
      this.windowServersTotal = deviceCount.windows_server;
      this.windowClientsTotal = deviceCount.windows_client;
      this.domainUsersTotal = deviceCount.user;
    })
  }

  toggleCardLock() {
    this.isLock = !this.isLock;
    this.disableCard.emit(this.isLock);
  }

  expandCard() {
    this.isExpand = !this.isExpand;
  }
}
