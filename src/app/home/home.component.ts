import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ProjectService } from "../project/services/project.service";
import { selectActiveProjects, selectRecentProjects, selectSharedProjects } from "../store/project/project.selectors";
import { loadRecentProjects } from "../store/project/project.actions";
import { AuthService } from "../core/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ImportProjectDialogComponent } from 'src/app/project/import-project-dialog/import-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  routeSegments = RouteSegments;
  recentProjects: any[] = [];
  selectRecentProjects = new Subscription();
  selectActiveProjects$ = new Subscription();
  selectSharedProjects$ = new Subscription();
  activeProjects: any[] = [];
  sharedProjects: any[] = [];
  status = 'active';
  constructor(
    private authService: AuthService,
    private store: Store,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    
    this.selectRecentProjects = this.store.select(selectRecentProjects).subscribe(recentProjects => {
      if (recentProjects) {
        this.recentProjects = recentProjects;
      }
    });
    this.selectSharedProjects$ = this.store.select(selectSharedProjects).subscribe(sharedProjects => {
      if (sharedProjects) {
        this.sharedProjects = sharedProjects;
      }
    });
    this.selectActiveProjects$ = this.store.select(selectActiveProjects).subscribe(activeProjects => {
      if (activeProjects) {
        this.activeProjects = activeProjects.filter((p: any) => p.created_by_fk === this.authService.getUserId());
      }
    });
  }

  importProject() {
    this.dialog.open(ImportProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadRecentProjects());
  }

  ngOnDestroy(): void {
    this.selectRecentProjects.unsubscribe();
    this.selectActiveProjects$.unsubscribe();
    this.selectSharedProjects$.unsubscribe();
  }

  openProject(projectId: any, projectName: string) {
    const project = (this.activeProjects.concat(this.sharedProjects)).find(val => val.id == projectId);
    if (!!project) {
      this.projectService.openProject(projectId, project.map_state);
    } else {
      this.toastr.warning(`The user doesn't has access to the project ${projectName}`)
      this.router.navigate([RouteSegments.PROJECTS])
    }
  }
}
