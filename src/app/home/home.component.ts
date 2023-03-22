import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ProjectService } from "../project/services/project.service";
import { selectProjects, selectRecentProjects } from "../store/project/project.selectors";
import { retrievedProjectName, retrievedProjects, retrievedRecentProjects } from "../store/project/project.actions";
import { AuthService } from "../core/services/auth/auth.service";
import { HelpersService } from "../core/services/helpers/helpers.service";
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
  selectProjects$ = new Subscription();
  listShare: any[] = [];
  listProject: any[] = [];
  constructor(
    private authService: AuthService,
    private helpersService: HelpersService,
    private store: Store,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    const accessToken = this.authService.getAccessToken();
    const accessTokenPayload = this.helpersService.decodeToken(accessToken);
    const userId = accessTokenPayload.sub;
    this.selectRecentProjects = this.store.select(selectRecentProjects).subscribe(recentProjects => {
      if (recentProjects) {
        this.recentProjects = recentProjects;
      }
    })
    this.selectProjects$ = this.store.select(selectProjects)
      .subscribe((data) => {
        if (data) {
          this.projectService.getShareProject('active', 'project').subscribe((resp: any) => {
            const shareProject = resp.result;
            this.listProject = data.filter((val: any) => val.created_by_fk === userId);
            if (shareProject) {
              this.listProject = [...this.listProject, ...shareProject];
            }
          })
        }
      });
  }

  importProject() {
    const dialogRef = this.dialog.open(ImportProjectDialogComponent, {
      autoFocus: false,
      width: '450px',
    });
  }

  ngOnInit(): void {
    this.projectService.getRecentProjects().subscribe(response => {
      this.store.dispatch(retrievedRecentProjects({ recentProjects: response.result }));
    })
    this.projectService.getProjectByStatusAndCategory('active', 'project').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
  }

  ngOnDestroy(): void {
    this.selectRecentProjects.unsubscribe();
    this.selectProjects$.unsubscribe();
  }

  openProject(projectId: any) {
    const listProjectId = this.listProject.map(val => val.id)
    const project = this.recentProjects.filter(val => val.id === projectId);
    const projectName = project.map(el => el.name)
    if (listProjectId.includes(projectId)) {
      this.projectService.openProject(projectId);
      this.store.dispatch(retrievedProjectName({ projectName: projectName }));
    } else {
      this.toastr.warning(`The user is not the owner of project ${projectName}. Cannot open the project ${projectName}`)
      this.router.navigate([RouteSegments.PROJECTS])
    }
  }
}
