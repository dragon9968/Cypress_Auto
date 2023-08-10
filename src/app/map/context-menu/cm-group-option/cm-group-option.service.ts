import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNodePgToGroupboxDialogComponent } from '../../add-node-pg-to-groupbox-dialog/add-node-pg-to-groupbox-dialog.component';
import { selectSelectedLogicalNodes } from 'src/app/store/node/node.selectors';
import { selectSelectedPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmGroupOptionService implements OnDestroy {
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectedNodes: any[] = [];
  selectedPGs: any[] = [];

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodes = selectedNodes;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGs = selectedPGs;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectSelectedPortGroups$.unsubscribe();
  }

  getNodePgGroupMenu(cy: any, projectId: any, isCanWriteOnProject: boolean) {
    return {
      id: "group",
      content: "Group",
      selector: "node[icon], node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "add_node_pg_to_group",
          content: "Add",
          onClickFunction: ($event: any) => {
            const dialogData = {
              genData: {
                nodeIds: this.selectedNodes.map((ele: any) => ele.id),
                selectedNodes: this.selectedNodes.map((ele: any) => ele.data()),
                pgIds: this.selectedPGs.map((ele: any) => ele.id),
                selectedPGs: this.selectedPGs.map((ele: any) => ele.data())
              },
              cy,
              projectId
            }
            this.dialog.open(AddNodePgToGroupboxDialogComponent, {
              disableClose: true,
              autoFocus: false,
              width: '400px',
              data: dialogData,
            });
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
        {
          id: "delete_node_pg_from_group",
          content: "Delete",
          onClickFunction: ($event: any) => {
            this.selectedNodes.forEach(node => {
              node.move({ parent: null })
            })
            this.selectedPGs.forEach(pg => {
              pg.move({ parent: null })
            })
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
      ],
      disabled: false,
    }
  }
}
