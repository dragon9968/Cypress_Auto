import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ProjectService } from "../project/services/project.service";
import { selectActiveProjects, selectRecentProjects } from "../store/project/project.selectors";
import { loadProjects, retrievedRecentProjects } from "../store/project/project.actions";
import { AuthService } from "../core/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ImportProjectDialogComponent } from 'src/app/project/import-project-dialog/import-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageKeys } from "../core/storage/local-storage/local-storage-keys.enum";

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
  listShare: any[] = [];
  listProject: any[] = [];
  status = 'active';
  constructor(
    private authService: AuthService,
    private store: Store,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    const userId = this.authService.getUserId();
    this.selectRecentProjects = this.store.select(selectRecentProjects).subscribe(recentProjects => {
      if (recentProjects) {
        this.recentProjects = recentProjects;
      }
    });
    this.selectActiveProjects$ = this.store.select(selectActiveProjects)
      .subscribe((data) => {
        if (data) {
          this.listProject = data.filter((val: any) => val.created_by_fk === userId);
          this.projectService.getShareProject('active', 'project').subscribe((resp: any) => {
            const shareProject = resp.result;
            if (shareProject) {
              this.listProject = [...this.listProject, ...shareProject];
            }
          })
        }
      });
  }

  importProject() {
    const dialogRef = this.dialog.open(ImportProjectDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
    });
  }

  ngOnInit(): void {
    this.projectService.getRecentProjects().subscribe(response => {
      this.store.dispatch(retrievedRecentProjects({ recentProjects: response.result }));
    })
  }

  ngOnDestroy(): void {
    this.selectRecentProjects.unsubscribe();
    this.selectActiveProjects$.unsubscribe();
  }

  openProject(projectId: any, projectName: string) {
    const project = this.listProject.find(val => val.id == projectId);
    if (!!project) {
      this.projectService.openProject(projectId, project.map_state);
    } else {
      this.toastr.warning(`The user doesn't has access to the project ${projectName}`)
      this.router.navigate([RouteSegments.PROJECTS])
    }
  }
}
