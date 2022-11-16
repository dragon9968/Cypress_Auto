import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-actions-cell',
  templateUrl: './project-actions-renderer.component.html',
  styleUrls: ['./project-actions-renderer.component.scss']
})
export class ProjectActionsRendererComponent implements ICellRendererAngularComp {
  id: any;
  category: any;

  constructor(private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService
    ) { }

  agInit(params: ICellRendererParams): void {
    this.id = params.value;
    this.category = 'logical';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  deleteProject() {
  }

}
