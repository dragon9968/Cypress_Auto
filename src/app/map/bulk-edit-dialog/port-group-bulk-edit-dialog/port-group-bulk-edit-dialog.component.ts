import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { showErrorFromServer } from "src/app/shared/validations/error-server-response.validation";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { PortGroupEditBulkModel } from "../../../core/models/port-group.model";
import { bulkEditPG } from "../../../store/portgroup/portgroup.actions";
import { selectNotification } from "src/app/store/app/app.selectors";

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
  selectNotification$ = new Subscription();
  errors: any[] = [];
  tabName = '';
  filteredDomains!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PortGroupBulkEditDialogComponent>,
    public helpers: HelpersService,

  ) {
    this.portGroupBulkEdit = new FormGroup({
      domainCtr: new FormControl(''),
      vlanCtr: new FormControl('', [
        Validators.min(0),
        Validators.max(4095),
        Validators.pattern('^[0-9]*$'),
        showErrorFromServer(() => this.errors)
      ]),
      categoryCtr: new FormControl(''),
      subnetAllocationCtr: new FormControl(''),
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => {
      this.domains = domains;
      this.domainCtr.setValidators([autoCompleteValidator(this.domains)]);
      this.filteredDomains = this.helpers.filterOptions(this.domainCtr, this.domains);
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      } 
    });
    this.tabName = this.data.tabName;
  }

  get domainCtr() { return this.helpers.getAutoCompleteCtr(this.portGroupBulkEdit.get('domainCtr'), this.domains); }
  get vlanCtr() { return this.portGroupBulkEdit.get('vlanCtr'); }
  get categoryCtr() { return this.portGroupBulkEdit.get('categoryCtr'); }
  get subnetAllocationCtr() { return this.portGroupBulkEdit.get('subnetAllocationCtr'); }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.selectDomains$.unsubscribe();
    this.selectNotification$.unsubscribe();
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

  updatePortGroupBulk() {
    const ids = this.data.genData.ids;
    const domainId = this.domainCtr?.value.id;
    const vlan = this.vlanCtr?.value !== '' ? this.vlanCtr?.value : undefined;
    const category = this.categoryCtr?.value !== '' ? this.categoryCtr?.value: undefined;
    const subnetAllocation = this.subnetAllocationCtr?.value !== '' ? this.subnetAllocationCtr?.value: undefined;
    if (domainId || vlan || category || subnetAllocation) {
      const jsonDataValue: PortGroupEditBulkModel = {
        ids: ids,
        domain_id: domainId,
        vlan: vlan,
        category: category,
        subnet_allocation: subnetAllocation
      }
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.store.dispatch(bulkEditPG({
        ids: ids,
        data: jsonData
      })
        
      )
    } else {
      this.dialogRef.close();
      this.toastr.info('You\'re not updating anything in the bulk edit port groups', 'Info')
    }

  }

  onCancel() {
    this.dialogRef.close();
  }
}
