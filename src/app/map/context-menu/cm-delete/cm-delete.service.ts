import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, forkJoin } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { retrievedInterfacesConnectedNode } from 'src/app/store/interface/interface.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/project/services/project.service';

@Injectable({
  providedIn: 'root'
})
export class CMDeleteService {
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();
  public ur: any;

  constructor(
    private store: Store,
    private commonService: CommonService,
    private interfaceService: InterfaceService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private projectService: ProjectService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  getMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[],
          activeMapLinks: any[], isCanWriteOnProject: boolean, mapCategory: string) {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        this.commonService.delete(cy, activeNodes, activePGs, activeEdges, activeGBs, activeMBs, activeMapLinks, mapCategory);
      },
      hasTrailingDivider: true,
      disabled: !isCanWriteOnProject,
    }
  }
}
