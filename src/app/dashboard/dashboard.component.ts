import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProjectService } from "../project/services/project.service";
import { retrievedDashboard } from "../store/project/project.actions";
import { selectDashboard } from "../store/project/project.selectors";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  projectId = '0';
  project: any;
  selectDashboard$ = new Subscription();
  dashboard: any;
  isLock = true;
  public cards = ['map', 'project-detail'];

  constructor(
    private store: Store,
    private projectService: ProjectService
  ) {
    this.projectId = this.projectService.getProjectId();
    this.projectService.get(+this.projectId).subscribe(projectData => {
      this.project = projectData.result;
      this.store.dispatch(retrievedDashboard({dashboard: projectData.result.dashboard}));
    });
  }

  ngOnInit(): void {
    this.store.select(selectDashboard).subscribe(dashboard => {
      if (dashboard) {
        this.dashboard = dashboard;
      }
    })
  }

  ngOnDestroy(): void {
    this.selectDashboard$.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  lockCard(event: any) {
    this.isLock = event;
  }
}
