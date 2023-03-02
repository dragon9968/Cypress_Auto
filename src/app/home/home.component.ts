import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ProjectService } from "../project/services/project.service";
import { selectProjects, selectRecentProjects } from "../store/project/project.selectors";
import { retrievedProjects, retrievedRecentProjects } from "../store/project/project.actions";
import { AuthService } from "../core/services/auth/auth.service";
import { HelpersService } from "../core/services/helpers/helpers.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
  ) {
    const accessToken = this.authService.getAccessToken();
    const accessTokenPayload = this.helpersService.decodeToken(accessToken);
    const userId = accessTokenPayload.identity;
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
    if (listProjectId.includes(projectId)) {
      this.projectService.openProject(projectId);
    } else {
      const project = this.recentProjects.filter(val => val.id === projectId);
      const projectName = project.map(el => el.name)
      this.toastr.warning(`The user is not the owner of project ${projectName}. Cannot open the project ${projectName}`)
      this.router.navigate([RouteSegments.PROJECTS])
    }
  }
}
