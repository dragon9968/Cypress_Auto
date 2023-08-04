import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DIRECTIONS } from "../../../shared/contants/directions.constant";
import { STATUS } from "../../../shared/contants/status.constant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { Observable, Subscription } from "rxjs";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { ProjectService } from "src/app/project/services/project.service";
import { bulkEditLogicalInterface } from "src/app/store/interface/interface.actions";
import { selectNotification } from "src/app/store/app/app.selectors";

@Component({
  selector: 'app-interface-bulk-edit-dialog',
  templateUrl: './interface-bulk-edit-dialog.component.html',
  styleUrls: ['./interface-bulk-edit-dialog.component.scss']
})
export class InterfaceBulkEditDialogComponent implements OnInit, OnDestroy {
  interfaceBulkEditForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  STATUS = STATUS;
  errorMessages = ErrorMessages;
  isEdgeDirectionChecked = false;
  mapCategory = '';
  filteredStatus!: Observable<any[]>;
  filteredDirections!: Observable<any[]>;
  selectMapOption$ = new Subscription();
  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InterfaceBulkEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService,
    private projectService: ProjectService
  ) {
    this.interfaceBulkEditForm = new FormGroup({
      statusCtr: new FormControl(''),
      directionCtr: new FormControl(''),
      ipAllocationCtr: new FormControl(''),
      dnsServerCtr: new FormControl(''),
      gatewayCtr: new FormControl(''),
      isGatewayCtr: new FormControl(''),
      isNatCtr: new FormControl('')
    });
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe(mapOption => {
      this.isEdgeDirectionChecked = mapOption.isEdgeDirectionChecked
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      }
    });
  }

  get statusCtr() { return this.interfaceBulkEditForm.get('statusCtr'); }
  get directionCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceBulkEditForm.get('directionCtr'), this.DIRECTIONS); }
  get ipAllocationCtr() { return this.interfaceBulkEditForm.get('ipAllocationCtr'); }
  get dnsServerCtr() { return this.interfaceBulkEditForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceBulkEditForm.get('gatewayCtr'); }
  get isGatewayCtr() { return this.interfaceBulkEditForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceBulkEditForm.get('isNatCtr'); }

  ngOnInit(): void {
    this.filteredStatus = this.helpers.filterOptions(this.statusCtr, this.STATUS);
    this.directionCtr.setValidators([autoCompleteValidator(this.DIRECTIONS)]);
    this.filteredDirections = this.helpers.filterOptions(this.directionCtr, this.DIRECTIONS);
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  private _updateInterfaceOnMap(data: any) {
    const ele = this.data.cy.getElementById(data.id);
    ele.data('status', data.status);
    ele.data('direction', data.direction);
    ele.data('ip_allocation', data.ip_allocation);
    ele.data('dns_server', data.dns_server);
    ele.data('gateway', data.gateway);
    ele.data('is_gateway', data.is_gateway);
    ele.data('is_nat', data.is_nat);
  }

  onCancel() {
    this.dialogRef.close();
  }

  updateInterfaceBulk() {
    const ids = this.data.genData.ids;
    const status = this.statusCtr?.value.id;
    const direction =  this.directionCtr?.value.id;
    const ipAllocation = this.ipAllocationCtr?.value !== '' ? this.ipAllocationCtr?.value : undefined;
    const dnsServer = this.dnsServerCtr?.value !== '' ? this.dnsServerCtr?.value : undefined;
    const gateway = this.gatewayCtr?.value !== '' ? this.gatewayCtr?.value : undefined;
    const isGateway =  this.isGatewayCtr?.value !== '' ? this.isGatewayCtr?.value : undefined;
    const isNat = this.isNatCtr?.value !== '' ? this.isNatCtr?.value : undefined;
    if ( status || direction || ipAllocation || dnsServer || gateway || isGateway || isNat ) {
      const jsonDataValue = {
        ids: ids,
        status: status,
        direction: direction,
        ip_allocation: ipAllocation,
        dns_server: dnsServer,
        gateway: gateway,
        is_gateway: isGateway,
        is_nat: isNat
      }
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.store.dispatch(bulkEditLogicalInterface({
        ids: ids,
        data: jsonData
      }));
    } else {
      this.dialogRef.close();
      this.toastr.info('You\'re not updating anything in the bulk edit interfaces');
    }
  }

}
