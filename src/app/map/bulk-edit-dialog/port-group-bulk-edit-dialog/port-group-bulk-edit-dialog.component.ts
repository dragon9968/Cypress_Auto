import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { showErrorFromServer } from "src/app/shared/validations/error-server-response.validation";

@Component({
  selector: 'app-port-group-bulk-edit-dialog',
  templateUrl: './port-group-bulk-edit-dialog.component.html',
  styleUrls: ['./port-group-bulk-edit-dialog.component.scss']
})
export class PortGroupBulkEditDialogComponent implements OnInit, OnDestroy {
  portGroupBulkEdit: FormGroup;
  errorMessages = ErrorMessages;
  domains!: any[];
  selectDomains$ = new Subscription();
  errors: any[] = [];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PortGroupBulkEditDialogComponent>,
    public helpers: HelpersService,
    private portGroupService: PortGroupService
  ) {
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => this.domains = domains);
    this.portGroupBulkEdit = new FormGroup({
      domainCtr: new FormControl('', [autoCompleteValidator(this.domains)]),
      vlanCtr: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        showErrorFromServer(() => this.errors)
      ]),
      categoryCtr: new FormControl(''),
      subnetAllocationCtr: new FormControl(''),
    })
  }

  get domainCtr() { return this.portGroupBulkEdit.get('domainCtr'); }

  get vlanCtr() { return this.portGroupBulkEdit.get('vlanCtr'); }

  get categoryCtr() { return this.portGroupBulkEdit.get('categoryCtr'); }

  get subnetAllocationCtr() { return this.portGroupBulkEdit.get('subnetAllocationCtr'); }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.selectDomains$.unsubscribe();
  }

  updatePortGroupBulk() {
    const jsonData = {
      ids: this.data.genData.ids,
      domain_id: this.domainCtr?.value.id,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      subnet_allocation: this.subnetAllocationCtr?.value
    }
    this.portGroupService.editBulk(jsonData).subscribe(response => {
      this.data.genData.ids.map((portGroupId: any) => {
        this.portGroupService.get(portGroupId).subscribe(pgData => {
          const ele = this.data.cy.getElementById('pg-' + portGroupId);
          ele.data('subnet_allocation', pgData.result.subnet_allocation);
          ele.data('group', pgData.result.groups);
          ele.data('domain', this.domainCtr?.value.id);
          ele.data('vlan', this.vlanCtr?.value);
        })
      })
      this.helpers.reloadGroupBoxes(this.data.cy);
      this.toastr.success(response.message);
      this.dialogRef.close();
      this.store.dispatch(retrievedMapSelection({ data: true }));
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
