import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DIRECTIONS } from "../../../shared/contants/directions.constant";
import { STATUS } from "../../../shared/contants/status.constant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { selectInterfaces } from "../../../store/map/map.selectors";
import { retrievedInterfacesByIds } from "../../../store/interface/interface.actions";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";

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
  mapCategory = '';
  collectionId = '0';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InterfaceBulkEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private interfaceService: InterfaceService,
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
  get directionCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceBulkEditForm.get('directionCtr'), this.DIRECTIONS); }
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
    const ele = this.data.cy.getElementById(this.data.genData.id);
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
      this.data.genData.ids.map((edgeId: any) => {
        this.interfaceService.get(edgeId).subscribe(edgeData => {
          const data = edgeData.result;
          ele.data('name', data.name);
          const ip_str = edgeData.result.ip ? edgeData.result.ip : "";
          const ip = ip_str.split(".");
          const last_octet = ip.length == 4 ? "." + ip[3] : "";
          ele.data('ip_last_octet', last_octet);
        });
      });
      this.store.select(selectInterfaces).subscribe(interfaces => {
        const interfaceIds = interfaces.map((ele: any) => ele.data.id);
        this.interfaceService.getDataByPks({pks: interfaceIds}).subscribe(response => {
          this.store.dispatch(retrievedInterfacesByIds({data: response.result}));
        })
      })
      this.toastr.success(response.message);
      this.dialogRef.close();
      this.store.dispatch(retrievedMapSelection({ data: true }));
    })
  }

}
