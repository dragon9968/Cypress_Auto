import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, throwError } from 'rxjs';
import { EditProjectDialogComponent } from 'src/app/project/edit-project-dialog/edit-project-dialog.component';
import { ProjectService } from 'src/app/project/services/project.service';
import { retrievedSearchText } from 'src/app/store/map-option/map-option.actions';
import { selectIsMapOpen } from 'src/app/store/map/map.selectors';
import { PermissionLevels } from '../../enums/permission-levels.enum';
import { RouteSegments } from '../../enums/route-segments.enum';
import { AuthService } from '../../services/auth/auth.service';
import { selectProject, selectProjectCategory, selectProjectName } from 'src/app/store/project/project.selectors';
import {
  closeProject,
  loadProjects,
  removeProjects,
  retrievedVMStatus,
  validateProject
} from 'src/app/store/project/project.actions';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ExportProjectDialogComponent } from 'src/app/project/export-project-dialog/export-project-dialog.component';
import { ImportProjectDialogComponent } from 'src/app/project/import-project-dialog/import-project-dialog.component';
import { HelpersService } from "../../services/helpers/helpers.service";
import { AppPreferencesComponent } from 'src/app/settings/app-preferences/app-preferences.component';
import { AppPrefService } from '../../services/app-pref/app-pref.service';
import { MapPrefService } from '../../services/map-pref/map-pref.service';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';
import {
  selectIsConfiguratorConnect,
  selectIsHypervisorConnect,
  selectIsDatasourceConnect
} from 'src/app/store/server-connect/server-connect.selectors';
import { ServerConnectService } from '../../services/server-connect/server-connect.service';
import { ServerConnectDialogComponent } from 'src/app/map/tool-panel/tool-panel-remote/server-connect-dialog/server-connect-dialog.component';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { AboutComponent } from 'src/app/help/about/about.component';
import { CloneProjectDialogComponent } from 'src/app/project/clone-project-dialog/clone-project-dialog.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LDAPConfigurationComponent } from 'src/app/administration/ldap-configuration/ldap-configuration.component';
import { LdapConfigService } from '../../services/ldap-config/ldap-config.service';
import { selectUserProfile } from 'src/app/store/user-profile/user-profile.selectors';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchbar') searchbar!: ElementRef;
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;
  selectProjectName$ = new Subscription();
  searchText = '';
  isMapOpen = false;
  status = 'active';
  selectIsMapOpen$ = new Subscription();
  selectIsHypervisorConnect$ = new Subscription();
  selectIsDatasourceConnect$ = new Subscription();
  selectIsConfiguratorConnect$ = new Subscription();
  selectProjectCategory$ = new Subscription();
  selectProject$ = new Subscription();
  selectUser$ = new Subscription();
  isHypervisorConnect = false;
  isDatasourceConnect = false;
  isConfiguratorConnect = false;
  projectId = 0;
  projectName!: string;
  projectCategory!: string;
  project: any;
  username: any;
  userId: any;
  categoryProject: any;
  isSmallScreen!: boolean;
  listShare: any[] = [];
  listProject: any[] = [];

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private mapPrefService: MapPrefService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store,
    private helpersService: HelpersService,
    private appPrefService: AppPrefService,
    private iconRegistry: MatIconRegistry,
    private serverConnectionService: ServerConnectService,
    private serverConnectService: ServerConnectService,
    public breakpointObserver: BreakpointObserver,
    private ldapConfigService: LdapConfigService,
  ) {
    this.iconRegistry.addSvgIcon('connected', this.helpersService.setIconPath('/assets/icons/nav/connected.svg'));
    this.iconRegistry.addSvgIcon('disconnected', this.helpersService.setIconPath('/assets/icons/nav/disconnected.svg'));
    const accessToken = this.authService.getAccessToken();
    const accessTokenPayload = this.helpersService.decodeToken(accessToken);
    this.userId = accessTokenPayload.sub;
    this.authService.updateUserId(this.userId);

    this.selectProject$ = this.store.select(selectProject).subscribe(project => {
      if (project) {
        this.project = project;
      }
    });
    this.selectIsMapOpen$ = this.store.select(selectIsMapOpen).subscribe(isMapOpen => {
      this.isMapOpen = isMapOpen;
      if (isMapOpen && this.project) {
        this.projectId = this.projectService.getProjectId();
        if (this.isHypervisorConnect || this.isConfiguratorConnect) {
          this.store.dispatch(retrievedVMStatus({ vmStatus: this.project.configuration.vm_status }));
        }
        const sharedUserIds = this.project?.share.map((val: any) => val.id);
        if (this.project.created_by_fk != this.userId && !sharedUserIds.includes(this.userId) && this.router.url === '/map') {
          this.toastr.warning(`The user is not the owner of project ${this.project.name}. Cannot open the project ${this.project.name}`);
          this.projectService.closeProject();
          this.router.navigate([RouteSegments.PROJECTS]);
        }
      }
    });
    this.selectProjectName$ = this.store.select(selectProjectName).subscribe(projectName => this.projectName = projectName);
    this.selectProjectCategory$ = this.store.select(selectProjectCategory).subscribe(projectCategory => this.projectCategory = projectCategory);
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      this.isHypervisorConnect = isHypervisorConnect;
    })
    this.selectIsDatasourceConnect$ = this.store.select(selectIsDatasourceConnect).subscribe(isDatasourceConnect => {
      this.isDatasourceConnect = isDatasourceConnect;
    })
    this.selectIsConfiguratorConnect$ = this.store.select(selectIsConfiguratorConnect).subscribe(isConfiguratorConnect => {
      this.isConfiguratorConnect = isConfiguratorConnect
    });
    this.selectUser$ = this.store.select(selectUserProfile).subscribe((user: any) => {
      if (user) {
        this.username = user.username;
      }
    });

    this.selectProjectCategory$ = this.store.select(selectProjectCategory).subscribe(projectCategory => {
      this.categoryProject = projectCategory
    })
    iconRegistry.addSvgIcon('plant-tree-icon', this.helpersService.setIconPath('/assets/icons/plant-tree-icon.svg'));
    iconRegistry.addSvgIcon('icons8-trash-can', this.helpersService.setIconPath('/assets/icons/icons8-trash-can.svg'));
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
    this.store.dispatch(loadProjects());
    this.helpersService.initialConnectionStatus();
    this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({ data: data.result })));
    this.breakpointObserver.observe(['(max-width: 1365px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectIsMapOpen$.unsubscribe();
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectIsDatasourceConnect$.unsubscribe();
    this.selectIsConfiguratorConnect$.unsubscribe();
    this.selectProjectName$.unsubscribe();
    this.selectProjectCategory$.unsubscribe();
    this.selectProject$.unsubscribe();
    this.selectUser$.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  userProfile() {
    this.router.navigate([RouteSegments.ROOT, RouteSegments.USER_PROFILE]);
  }

  close() {
    this.searchText = '';
    this.store.dispatch(retrievedSearchText({ data: this.searchText }));
  }

  search() {
    this.store.dispatch(retrievedSearchText({ data: this.searchText }));
  }

  closeProject() {
    this.projectService.closeProject();
    this.router.navigate([RouteSegments.ROOT]);
  }

  getProjectId() {
    this.projectId = this.projectService.getProjectId();
  }

  editProject() {
    const dialogData = {
      mode: 'update',
      category: this.project.category,
      genData: this.project
    }
    this.dialog.open(EditProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: 'auto',
      data: dialogData
    });
  }

  deleteProject() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Project will be moved to trash. Are you sure?',
      submitButtonName: 'Delete'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const projectCategory = this.projectCategory;
        this.store.dispatch(removeProjects({ ids: [this.projectId] }));
        this.projectService.closeProject();
        if (projectCategory === 'project') {
          this.router.navigate([RouteSegments.PROJECTS]);
        } else {
          this.router.navigate([RouteSegments.PROJECTS_TEMPLATES]);
        }
      }
    });
  }

  exportProject() {
    this.projectService.get(this.projectId).subscribe(data => {
      const dialogData = {
        pks: [this.projectId],
        category: data.result.category,
        type: 'user'
      }
      this.dialog.open(ExportProjectDialogComponent, {
        disableClose: true,
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  importProject() {
    const dialogRef = this.dialog.open(ImportProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
    });
  }

  cloneProject() {
    const dialogData = {
      genData: {
        name: this.projectName
      },
      category: this.categoryProject
    }
    this.dialog.open(CloneProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '400px',
      data: dialogData
    });
  }

  openAppPref() {
    this.appPrefService.getByCategory('app').subscribe(data => {
      const dialogData = {
        mode: 'update',
        genData: data.result[0]
      }
      this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({ data: data.result })));
      const dialogRef = this.dialog.open(AppPreferencesComponent, {
        disableClose: true,
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    })
  }

  openConnectServerForm(connectionCategory: string) {
    const dialogData = {
      connectionCategory: connectionCategory
    }
    this.dialog.open(ServerConnectDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

  disconnectServer(category: string) {
    const connection = this.serverConnectService.getConnection(category);
    const jsonData = {
      pk: connection.id,
    }
    this.serverConnectionService.disconnect(category, jsonData)
      .subscribe({
        next: response => {
          this.serverConnectService.removeConnection(category);
          this.helpersService.changeConnectionStatus(category, false);
          this.store.dispatch(retrievedVMStatus({ vmStatus: undefined }));
          this.toastr.info(`Disconnected from ${connection.name} server!`, 'Info');
        },
        error: err => {
          this.toastr.error('Could not to disconnect from server', 'Error');
          return throwError(() => err.error.message);
        }
      })
  }

  openAboutModal() {
    this.dialog.open(AboutComponent, { disableClose: true, width: '600px', autoFocus: false });
  }

  openProject(projectId: number) {
    this.projectService.getProjectByStatus(this.status).subscribe((data: any) => {
      if (data.result) {
        this.projectService.getShareProject('active', 'project').subscribe((resp: any) => {
          const shareProject = resp.result;
          this.listProject = data.result.filter((val: any) => val.created_by_fk === this.userId);
          if (shareProject) {
            this.listProject = [...this.listProject, ...shareProject];
          }
          const listProjectId = this.listProject.map(val => val.id);
          if (listProjectId.includes(projectId)) {
            const project = this.listProject.find(p => p.id == projectId);
            this.projectService.openProject(projectId, project.map_state);
          } else {
            this.projectService.closeProject();
            this.toastr.warning(`The user is not the owner of project. Cannot open the project`)
            this.router.navigate([RouteSegments.PROJECTS])
          }
        })
      }
    });
  }

  validateProject() {
    this.store.dispatch(validateProject({ id: this.projectId }));
  }

  openAdminConfig() {
    this.ldapConfigService.getAll().subscribe(data => {
      const dialogData = {
        genData: data.result
      }
      this.dialog.open(LDAPConfigurationComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    })
  }

  searchTextChange($event: any) {
    const value = $event.target.value == '' && this.close()
  }
}
