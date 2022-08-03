import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';

@Component({
  selector: 'app-project-actions-cell',
  templateUrl: './project-actions-renderer.component.html',
  styleUrls: ['./project-actions-renderer.component.scss']
})
export class ProjectActionsRenderer implements ICellRendererAngularComp {
  id: any;
  category: any;

  constructor(private router: Router) { }

  agInit(params: ICellRendererParams): void {
    this.id = params.value;
    this.category = 'logical';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  openProject() {
    this.router.navigate(
      [RouteSegments.MAP],
      {
        queryParams: {
          category: this.category,
          collection_id: this.id
        }
      }
    );
  }
}