import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { selectNotification } from 'src/app/store/app/app.selectors';
import { addNodePgToGroup } from 'src/app/store/group/group.actions';
import { selectGroups } from 'src/app/store/group/group.selectors';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Component({
  selector: 'app-add-node-pg-to-groupbox-dialog',
  templateUrl: './add-node-pg-to-groupbox-dialog.component.html',
  styleUrls: ['./add-node-pg-to-groupbox-dialog.component.scss']
})
export class AddNodePgToGroupboxDialogComponent implements OnInit, OnDestroy {
  addGroupForm!: FormGroup;
  selectGroup$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectNotification$ = new Subscription();
  errorMessages = ErrorMessages;
  ICON_PATH = ICON_PATH;
  groups: any[] = [];
  filteredGroups: any[] = [];
  groupCategoryId: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddNodePgToGroupboxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private store: Store,
  ) {

    this.addGroupForm = new FormGroup({
      selectGroupCtr: new FormControl()
    })

    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });

    this.selectGroup$ = this.store.select(selectGroups).subscribe(groups => {
      this.groups = groups.filter((val: any) => val.category === this.groupCategoryId)
      this.selectGroupCtr.setValidators([Validators.required, autoCompleteValidator(this.groups)]);
      this.filteredGroups = this.helpers.filterOptions(this.selectGroupCtr, this.groups);
    });

    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      }
    });
  }

  get selectGroupCtr() { return this.helpers.getAutoCompleteCtr(this.addGroupForm.get('selectGroupCtr'), this.groups); }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectGroup$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  addGroup() {
    let listNode = this.selectGroupCtr?.value.nodes.map((node: any) => node.id);
    let listPg = this.selectGroupCtr?.value.port_groups.map((pg: any) => pg.id);
    this.data.genData.nodeIds.forEach((el: any) => {
      if (!listNode.includes(el)) {
        listNode.push(el)
      }
    })
    this.data.genData.pgIds.forEach((el: any) => {
      if (!listPg.includes(el)) {
        listPg.push(el)
      }
    })
    const successMessage = 'Add node/port group to group successfully'
    const jsonData = {
      name: this.selectGroupCtr?.value.name,
      category: this.selectGroupCtr?.value.category,
      description: this.selectGroupCtr?.value.description,
      nodes: listNode,
      port_groups: listPg,
      map_images: this.selectGroupCtr?.value.map_images.length > 0 ? this.selectGroupCtr?.value.map_images : [],
      logical_map: {},
      physical_map: {},
      task: successMessage
    }
    this.store.dispatch(addNodePgToGroup({
      id: this.selectGroupCtr?.value.id,
      data: jsonData,
      projectId: Number(this.data.projectId)
    }))
  }

  onCancel() {
    this.dialogRef.close();
  }

}



