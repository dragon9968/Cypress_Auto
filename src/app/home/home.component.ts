import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ProjectService } from "../project/services/project.service";
import { selectRecentProjects } from "../store/project/project.selectors";
import { retrievedRecentProjects } from "../store/project/project.actions";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  routeSegments = RouteSegments;
  recentProjects: any[] = [];
  selectRecentProjects = new Subscription();
  constructor(
    private store: Store,
    private projectService: ProjectService
  ) {
    this.selectRecentProjects = this.store.select(selectRecentProjects).subscribe(recentProjects => {
      if (recentProjects) {
        this.recentProjects = recentProjects;
      }
    })
  }

  ngOnInit(): void {
    this.projectService.getRecentProjects().subscribe(response => {
      this.store.dispatch(retrievedRecentProjects({ recentProjects: response.result }));
    })
  }

  ngOnDestroy(): void {
    this.selectRecentProjects.unsubscribe();
  }

  openProject(projectId: any) {
    this.projectService.openProject(projectId);
  }
}
