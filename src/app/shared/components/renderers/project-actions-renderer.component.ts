import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-project-actions-cell',
  templateUrl: './project-actions-renderer.component.html',
  styleUrls: ['./project-actions-renderer.component.scss']
})
export class ProjectActionsRenderer implements ICellRendererAngularComp {
  id: any;
  category: any;

  agInit(params: ICellRendererParams): void {
    this.id = params.value;
    this.category = 'logical';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}