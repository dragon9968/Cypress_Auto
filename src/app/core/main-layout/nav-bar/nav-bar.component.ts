import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { interval, Subject, Subscription, throwError } from 'rxjs';
import { EditProjectDialogComponent } from 'src/app/project/edit-project-dialog/edit-project-dialog.component';
import { ProjectService } from 'src/app/project/services/project.service';
import { retrievedSearchText } from 'src/app/store/map-option/map-option.actions';
import { selectIsMapOpen } from 'src/app/store/map/map.selectors';
import { PermissionLevels } from '../../enums/permission-levels.enum';
import { RouteSegments } from '../../enums/route-segments.enum';
import { AuthService } from '../../services/auth/auth.service';
import { selectIsOpen, selectProjectName, selectProjects } from 'src/app/store/project/project.selectors';
import {
  retrievedAllProjects,
  retrievedIsOpen,
  retrievedProjectName,
  retrievedProjects,
  retrievedVMStatus
} from 'src/app/store/project/project.actions';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ExportProjectDialogComponent } from 'src/app/project/export-project-dialog/export-project-dialog.component';
import { ImportProjectDialogComponent } from 'src/app/project/import-project-dialog/import-project-dialog.component';
import { HelpersService } from "../../services/helpers/helpers.service";
import { catchError, takeUntil } from "rxjs/operators";
import { AppPreferencesComponent } from 'src/app/settings/app-preferences/app-preferences.component';
import { AppPrefService } from '../../services/app-pref/app-pref.service';
import { MapPrefService } from '../../services/map-pref/map-pref.service';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';
import { UserService } from '../../services/user/user.service';
import {
  selectIsConfiguratorConnect,
  selectIsHypervisorConnect,
  selectIsDatasourceConnect
} from 'src/app/store/server-connect/server-connect.selectors';
import { ServerConnectService } from '../../services/server-connect/server-connect.service';
import { ServerConnectDialogComponent } from 'src/app/map/tool-panel/tool-panel-remote/server-connect-dialog/server-connect-dialog.component';
import { retrievedServerConnect} from 'src/app/store/server-connect/server-connect.actions';
import { AboutComponent } from 'src/app/help/about/about.component';
import { ValidateProjectDialogComponent } from 'src/app/project/validate-project-dialog/validate-project-dialog.component';
import { retrievedUserProfile } from 'src/app/store/user-profile/user-profile.actions';
import { CloneProjectDialogComponent } from 'src/app/project/clone-project-dialog/clone-project-dialog.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LDAPConfigurationComponent } from 'src/app/administration/ldap-configuration/ldap-configuration.component';
import { LdapConfigService } from '../../services/ldap-config/ldap-config.service';
import { RemoteCategories } from "../../enums/remote-categories.enum";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchbar') searchbar!: ElementRef;
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;
  selectIsOpen$ = new Subscription();
  selectProjectName$ = new Subscription();
  searchText = '';
  isMapOpen = false;
  isOpen!: boolean;
  status = 'active';
  selectIsMapOpen$ = new Subscription();
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectIsHypervisorConnect$ = new Subscription();
  selectIsDatasourceConnect$ = new Subscription();
  selectIsConfiguratorConnect$ = new Subscription();
  isHypervisorConnect = false;
  isDatasourceConnect = false;
  isConfiguratorConnect = false;
  collectionId: any;
  projectName: any;
  username: any;
  userId: any;
  categoryProject: any;
  isSmallScreen!: boolean;
  selectProjects$ = new Subscription();
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
    private userService: UserService,
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
    this.authService.updateUserId(this.userId)
    this.selectIsMapOpen$ = this.store.select(selectIsMapOpen).subscribe((isMapOpen: boolean) => {
      this.isMapOpen = isMapOpen;
      if (isMapOpen) {
        this.searchByInterval();
      }
    });
    this.selectIsOpen$ = this.store.select(selectIsOpen).subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        this.collectionId = this.projectService.getCollectionId();
        this.projectService.get(this.collectionId).subscribe(projectData => {
          this.categoryProject = projectData.result.category
          const sharedProjectId = projectData.result.share.map((val: any) => val.id)
          if (projectData.result.created_by_fk != this.userId && !sharedProjectId.includes(this.userId) && this.router.url === '/map') {
            this.toastr.warning(`The user is not the owner of project ${projectData.result.name}. Cannot open the project ${projectData.result.name}`);
            this.projectService.closeProject();
            this.store.dispatch(retrievedProjectName({ projectName: undefined }));
            this.store.dispatch(retrievedIsOpen({ data: false }));
            this.router.navigate([RouteSegments.PROJECTS]);
          } else {
            this.store.dispatch(retrievedProjectName({ projectName: projectData.result.name }));
          }
        });
      }
    });
    this.selectProjectName$ = this.store.select(selectProjectName).subscribe(
      projectName => this.projectName = projectName
    )
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      this.isHypervisorConnect = isHypervisorConnect;
    })
    this.selectIsDatasourceConnect$ = this.store.select(selectIsDatasourceConnect).subscribe(isDatasourceConnect => {
      this.isDatasourceConnect = isDatasourceConnect;
    })
    this.selectIsConfiguratorConnect$ = this.store.select(selectIsConfiguratorConnect).subscribe(isConfiguratorConnect => {
      this.isConfiguratorConnect = isConfiguratorConnect
    })
    this.userService.get_profile().subscribe(respData => {
      this.username = respData.result.username;
      this.store.dispatch(retrievedUserProfile({ data: respData.result }));
    });
    iconRegistry.addSvgIcon('plant-tree-icon', this.helpersService.setIconPath('/assets/icons/plant-tree-icon.svg'));
    iconRegistry.addSvgIcon('icons8-trash-can', this.helpersService.setIconPath('/assets/icons/icons8-trash-can.svg'));
  }

  ngOnInit(): void {
    this.collectionId = this.projectService.getCollectionId();
    this.helpersService.initialConnectionStatus();
    if (this.collectionId) {
      this.store.dispatch(retrievedIsOpen({ data: true }));
    }
    this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({ data: data.result })));
    this.breakpointObserver.observe(['(max-width: 1365px)']).subscribe((state: BreakpointState) =>{
      if (state.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.selectIsMapOpen$.unsubscribe();
    this.selectIsOpen$.unsubscribe();
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectIsDatasourceConnect$.unsubscribe();
    this.selectIsConfiguratorConnect$.unsubscribe();
    this.selectProjectName$.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.projectService.closeProject();
    this.store.dispatch(retrievedIsOpen({ data: false }));
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
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
    this.store.dispatch(retrievedProjectName({ projectName: undefined }));
    this.store.dispatch(retrievedIsOpen({ data: false }));
    this.router.navigate([RouteSegments.ROOT]);
  }

  getCollectionId() {
    this.collectionId = this.projectService.getCollectionId();
  }

  editProject() {
    this.projectService.getProjectByStatus(this.status).subscribe(data => {
      this.store.dispatch(retrievedAllProjects({listAllProject: data.result}));
      this.projectService.get(this.collectionId).subscribe(resp => {
        const dialogData = {
          mode: 'update',
          category: resp.result.category,
          genData: resp.result
        }
        const dialogRef = this.dialog.open(EditProjectDialogComponent, {
          autoFocus: false,
          width: 'auto',
          data: dialogData
        });
      });
    });
  }

  deleteProject() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Project will be moved to trash. Are you sure?',
      submitButtonName: 'Delete'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      const jsonData = {
        pk: this.collectionId,
        status: 'delete'
      }
      if (result) {
        this.projectService.deleteOrRecoverProject(jsonData)
          .pipe(
            catchError(error => {
              this.toastr.error('Delete project failed!', 'Error');
              return throwError(() => error);
            })
          )
          .subscribe( rest => {
            const category = rest.result.category;
            this.toastr.success(`Delete Project successfully`);
            this.projectService.closeProject();
            this.store.dispatch(retrievedIsOpen({ data: false }));
            this.projectService.getProjectByStatusAndCategory(this.status, category).subscribe(
              (data: any) => this.store.dispatch(retrievedProjects({ data: data.result }))
            );
            if (category === 'project') {
              this.router.navigate([RouteSegments.PROJECTS]);
            } else {
              this.router.navigate([RouteSegments.PROJECTS_TEMPLATES]);
            }
          })
      }
    });
  }

  exportProject() {
    this.projectService.get(this.collectionId).subscribe(data => {
      const dialogData = {
        pks: [this.collectionId],
        category: data.result.category,
        type: 'user'
      }
      this.dialog.open(ExportProjectDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  importProject() {
    const dialogRef = this.dialog.open(ImportProjectDialogComponent, {
      autoFocus: false,
      width: '450px',
    });
  }

  cloneProject() {
    this.projectService.get(this.collectionId).subscribe(data => {
      const dialogData = {
        genData: data.result,
        category: data.result.category
      }
      this.dialog.open(CloneProjectDialogComponent, {
        autoFocus: false,
        width: '400px',
        data: dialogData
      });
    })
  }

  searchByInterval() {
    interval(3000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.isMapOpen) {
        this.search();
      } else {
        this.close();
        this.destroy$.next(true);
      }
    })
  }

  openAppPref() {
    this.appPrefService.get('2').subscribe(data => {
      const dialogData = {
        mode: 'update',
        genData: data.result
      }
      this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({ data: data.result })));
      const dialogRef = this.dialog.open(AppPreferencesComponent, {
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
    this.dialog.open(ServerConnectDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
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
    this.dialog.open(AboutComponent, { width: '600px', autoFocus: false });
  }

  openProject(collectionId: string) {
    this.projectService.getProjectByStatus(this.status).subscribe((data: any) => {
      if (data.result) {
          this.projectService.getShareProject('active', 'project').subscribe((resp: any) => {
            const shareProject = resp.result;
            this.listProject = data.result.filter((val: any) => val.created_by_fk === this.userId);
            if (shareProject) {
              this.listProject = [...this.listProject, ...shareProject];
            }
            const listProjectId = this.listProject.map(val => val.id)
            if (listProjectId.includes(collectionId)) {
              this.projectService.openProject(collectionId);
            } else {
              this.projectService.closeProject();
              this.store.dispatch(retrievedProjectName({ projectName: undefined }));
              this.store.dispatch(retrievedIsOpen({ data: false }));
              this.toastr.warning(`The user is not the owner of project. Cannot open the project`)
              this.router.navigate([RouteSegments.PROJECTS])
            }
          })
        }
    });
  }

  validateProject() {
    const dialogData = {
      pk: this.collectionId
    }
    this.projectService.validateProject(dialogData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        this.dialog.open(ValidateProjectDialogComponent, {
          autoFocus: false,
          width: 'auto',
          data: e.error.result
        });
        return throwError(() => e);
      })
    ).subscribe(response => {
      this.toastr.success(response.message);
    });
  }

  openAdminConfig() {
    this.ldapConfigService.getAll().subscribe(data => {
      const dialogData = {
        genData: data.result
      }
      this.dialog.open(LDAPConfigurationComponent, { width: '600px', autoFocus: false, data: dialogData });
    })
  }
}
