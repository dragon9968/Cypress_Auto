import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-renderers',
  templateUrl: './action-renderers.component.html',
  styleUrls: ['./action-renderers.component.scss']
})
export class ActionRenderersComponent implements ICellRendererAngularComp {
  params: any;
  isCollapsed: boolean = false;
  label!: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick(event: any) {
    this.isCollapsed = !this.isCollapsed;
    if (this.params.onClick instanceof Function) {
      const params = {
        event: event,
        rowData: this.params,
        position: this.isCollapsed
      }
      this.params.onClick(params);
    }
  }
}
