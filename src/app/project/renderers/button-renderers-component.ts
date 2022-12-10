import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button mat-icon-button type="button" color="primary" (click)="onClick($event)">
      <mat-icon>delete</mat-icon>
    </button>
    `
})

export class ButtonRenderersComponent implements ICellRendererAngularComp {
  params: any;
  label!: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick(event: any) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data
      }
      this.params.onClick(params);
    }
  }
}