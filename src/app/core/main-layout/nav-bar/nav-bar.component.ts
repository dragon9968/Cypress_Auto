import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { interval, Subject, Subscription } from 'rxjs';
import { EditProjectDialogComponent } from 'src/app/project/edit-project-dialog/edit-project-dialog.component';
import { ProjectService } from 'src/app/project/services/project.service';
import { retrievedSearchText } from 'src/app/store/map-option/map-option.actions';
import { selectIsMapOpen } from 'src/app/store/map/map.selectors';
import { PermissionLevels } from '../../enums/permission-levels.enum';
import { RouteSegments } from '../../enums/route-segments.enum';
import { AuthService } from '../../services/auth/auth.service';
import { selectIsOpen } from 'src/app/store/project/project.selectors';
import { retrievedIsOpen, retrievedProjects } from 'src/app/store/project/project.actions';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ExportProjectDialogComponent } from 'src/app/project/export-project-dialog/export-project-dialog.component';
import { ImportProjectDialogComponent } from 'src/app/project/import-project-dialog/import-project-dialog.component';
import { HelpersService } from "../../services/helpers/helpers.service";
import { takeUntil } from "rxjs/operators";
import { AppPreferencesComponent } from 'src/app/settings/app-preferences/app-preferences.component';
import { AppPrefService } from '../../services/app-pref/app-pref.service';
import { MapPrefService } from '../../services/map-pref/map-pref.service';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';

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
  searchText = '';
  isMapOpen = false;
  isOpen!: boolean;
  isLoading = false;
  status = 'active';
  selectIsMapOpen$ = new Subscription();
  destroy$: Subject<boolean> = new Subject<boolean>();

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
    iconRegistry: MatIconRegistry,
  ) {
    this.selectIsMapOpen$ = this.store.select(selectIsMapOpen).subscribe((isMapOpen: boolean) => {
      this.isMapOpen = isMapOpen;
      if (isMapOpen) {
        this.searchByInterval();
      }
    });
    this.selectIsOpen$ = this.store.select(selectIsOpen).subscribe(isOpen => {
      this.isOpen = isOpen
    });
    iconRegistry.addSvgIcon('plant-tree-icon', this.helpersService.setIconPath('/assets/icons/plant-tree-icon.svg'));
    iconRegistry.addSvgIcon('icons8-trash-can', this.helpersService.setIconPath('/assets/icons/icons8-trash-can.svg'));
  }

  ngOnInit(): void {
    if (this.projectService.getCollectionId()) {
      this.store.dispatch(retrievedIsOpen({data: true}));
    }
  }

  ngOnDestroy(): void {
    this.selectIsMapOpen$.unsubscribe();
    this.selectIsOpen$.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.projectService.closeProject();
    this.store.dispatch(retrievedIsOpen({data: false}));
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
    this.store.dispatch(retrievedIsOpen({data: false}));
    this.router.navigate([RouteSegments.ROOT]);
  }

  editProject() {
    const collectionId = this.projectService.getCollectionId()
    this.projectService.get(collectionId).subscribe(data => {
      const dialogData = {
        mode: 'update',
        genData: data.result
      }
      const dialogRef = this.dialog.open(EditProjectDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
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
        pk: this.projectService.getCollectionId(),
        status: 'delete'
      }
      if (result) {
        this.projectService.deleteOrRecoverProject(jsonData).subscribe({
          next: (rest) => {
            this.toastr.success(`Delete Project successfully`);
            this.projectService.closeProject();
            this.store.dispatch(retrievedIsOpen({data: false}));
            this.projectService.getProjectByStatus(this.status).subscribe(
              (data: any) => this.store.dispatch(retrievedProjects({ data: data.result }))
            );
            this.router.navigate([RouteSegments.PROJECTS]);
          },
          error: (error) => {
            this.toastr.error(`Error while delete Project`);
          }
        })
      }
    });
  }

  exportProject() {
    const collectionId = this.projectService.getCollectionId()
    const dialogData = {
      pk: collectionId
    }
    const dialogRef = this.dialog.open(ExportProjectDialogComponent, {
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  importProject() {
    const dialogRef = this.dialog.open(ImportProjectDialogComponent, {
      autoFocus: false,
      width: '450px',
    });
  }

  cloneProject() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Clone this project?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      const jsonData = {
        pk: this.projectService.getCollectionId(),
      }
      if (result) {
        this.isLoading = true;
        this.projectService.cloneProject(jsonData).subscribe({
          next: (rest) => {
            this.toastr.success(`Clone Project successfully`);
            this.projectService.getProjectByStatus('active').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
            this.router.navigate([RouteSegments.PROJECTS]);
            this.isLoading = false;
          },
          error: (error) => {
            this.toastr.error(`Error while Clone Project`);
            this.isLoading = false;
          }
        })
      }
    });
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
      this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({data: data.result})));
      const dialogRef = this.dialog.open(AppPreferencesComponent, {
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    })
  }
}
