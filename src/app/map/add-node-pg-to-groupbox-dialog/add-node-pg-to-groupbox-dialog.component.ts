import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin, map, of } from 'rxjs';
import { GroupService } from 'src/app/core/services/group/group.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { loadGroups } from 'src/app/store/group/group.actions';
import { selectGroups } from 'src/app/store/group/group.selectors';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Component({
  selector: 'app-add-node-pg-to-groupbox-dialog',
  templateUrl: './add-node-pg-to-groupbox-dialog.component.html',
  styleUrls: ['./add-node-pg-to-groupbox-dialog.component.scss']
})
export class AddNodePgToGroupboxDialogComponent implements OnInit {
  addGroupForm!: FormGroup;
  selectGroup$ = new Subscription();
  selectMapOption$ = new Subscription();
  errorMessages = ErrorMessages;
  ICON_PATH = ICON_PATH;
  groups: any[] = [];
  filteredGroups: any[] = [];
  groupCategoryId: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddNodePgToGroupboxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private store: Store,
    private toastr: ToastrService,
    private groupService: GroupService
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
  }

  get selectGroupCtr() { return this.helpers.getAutoCompleteCtr(this.addGroupForm.get('selectGroupCtr'), this.groups); }

  ngOnInit(): void {
  }

  private _updateNodeOnMap(data: any) {
    const ele = this.data.cy.getElementById('node-' + data.id);
    ele.data('icon', ICON_PATH + data.icon?.photo);
    ele.data('icon_id', data.icon?.id);
    ele.data('device', data.device);
    ele.data('device_id', data.device_id);
    ele.data('template', data.template);
    ele.data('template_id', data.template_id);
    ele.data('folder', data.folder);
    ele.data('parent_folder', data.parent_folder);
    ele.data('role', data.role);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('login_profile_id', data.login_profile_id);
    ele.data('login_profile_show', data.login_profile_show);
    ele.data('configs', data.configs);
    ele.data('configuration_show', data.configuration_show);
    ele.data('groups', data.groups);
  }

  private _updatePGOnMap(data: any) {
    const ele = this.data.cy.getElementById('pg-' + data.id);
    ele.data('vlan', data.vlan);
    ele.data('category', data.category);
    ele.data('subnet_allocation', data.subnet_allocation);
    ele.data('groups', data.groups);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('subnet', data.subnet);
  }

  addGroup() {
    const activeNodeLength = this.data.genData.selectedNodes.length;
    const activePgLength = this.data.genData.selectedPGs.length;
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

    const updateNodeOnMap = activeNodeLength > 0 ? forkJoin(this.data.genData.selectedNodes.map((node: any) => {
      return this.nodeService.get(node.node_id).pipe(map(nodeData => { this._updateNodeOnMap(nodeData.result); }));
    })) : of(null)

    const updatePgOnMap = activePgLength > 0 ? forkJoin(this.data.genData.selectedPGs.map((pg: any) => {
      return this.portGroupService.get(pg.pg_id).pipe(map(pgData => { this._updatePGOnMap(pgData.result); }));
    })) : of(null)
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

    this.groupService.put(this.selectGroupCtr?.value.id, jsonData).subscribe(response => {
      this.toastr.success(`Updated for the ${response.result} successfully`);
      return forkJoin({
        node: updateNodeOnMap,
        port_group: updatePgOnMap,
      }).subscribe(() => {
        this.store.dispatch(loadGroups({ projectId: this.data.project }));
        this.helpers.reloadGroupBoxes();
        this.dialogRef.close();
        this.toastr.success(successMessage, 'Success');
      })
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

}



