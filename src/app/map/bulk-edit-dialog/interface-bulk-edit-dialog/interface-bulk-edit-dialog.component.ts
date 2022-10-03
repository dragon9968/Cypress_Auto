import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DIRECTIONS } from "../../../shared/contants/directions.contant";
import { STATUS } from "../../../shared/contants/status.contant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";

@Component({
  selector: 'app-interface-bulk-edit-dialog',
  templateUrl: './interface-bulk-edit-dialog.component.html',
  styleUrls: ['./interface-bulk-edit-dialog.component.scss']
})
export class InterfaceBulkEditDialogComponent implements OnInit {
  interfaceBulkEditForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  STATUS = STATUS;
  errorMessages = ErrorMessages;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InterfaceBulkEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private interfaceService: InterfaceService
  ) {
    this.interfaceBulkEditForm = new FormGroup({
      statusCtr: new FormControl(''),
      directionCtr: new FormControl('', [autoCompleteValidator(this.DIRECTIONS)]),
      ipAllocationCtr: new FormControl(''),
      dnsServerCtr: new FormControl(''),
      gatewayCtr: new FormControl(''),
      isGatewayCtr: new FormControl(''),
      isNatCtr: new FormControl('')
    })
  }

  get statusCtr() { return this.interfaceBulkEditForm.get('statusCtr'); }
  get directionCtr() { return this.interfaceBulkEditForm.get('directionCtr'); }
  get ipAllocationCtr() { return this.interfaceBulkEditForm.get('ipAllocationCtr'); }
  get dnsServerCtr() { return this.interfaceBulkEditForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceBulkEditForm.get('gatewayCtr'); }
  get isGatewayCtr() { return this.interfaceBulkEditForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceBulkEditForm.get('isNatCtr'); }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  updateInterfaceBulk() {
    const jsonData = {
      ids: this.data.genData.ids,
      status: this.statusCtr?.value.id,
      direction: this.directionCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value
    }
    this.interfaceService.editBulk(jsonData).subscribe(response => {
      this.toastr.success(response.message);
      this.dialogRef.close();
    })
  }

}
