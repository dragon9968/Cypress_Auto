import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnDestroy } from '@angular/core';
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
import { forkJoin, map, Subscription } from "rxjs";
import { retrievedMapEdit } from "src/app/store/map-edit/map-edit.actions";

@Component({
  selector: 'app-interface-bulk-edit-dialog',
  templateUrl: './interface-bulk-edit-dialog.component.html',
  styleUrls: ['./interface-bulk-edit-dialog.component.scss']
})
export class InterfaceBulkEditDialogComponent implements OnDestroy {
  interfaceBulkEditForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  STATUS = STATUS;
  errorMessages = ErrorMessages;
  mapCategory = '';
  collectionId = '0';
  interfaceIds = '0';
  selectInterfaces$ = new Subscription();

  constructor(
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
    });
    this.selectInterfaces$ = this.store.select(selectInterfaces).subscribe(interfaces => {
      this.interfaceIds = interfaces.map((ele: any) => ele.data.id);
    });
  }

  get statusCtr() { return this.interfaceBulkEditForm.get('statusCtr'); }
  get directionCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceBulkEditForm.get('directionCtr'), this.DIRECTIONS); }
  get ipAllocationCtr() { return this.interfaceBulkEditForm.get('ipAllocationCtr'); }
  get dnsServerCtr() { return this.interfaceBulkEditForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceBulkEditForm.get('gatewayCtr'); }
  get isGatewayCtr() { return this.interfaceBulkEditForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceBulkEditForm.get('isNatCtr'); }

  ngOnDestroy(): void {
    this.selectInterfaces$.unsubscribe();
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
      const interfaceEditedData: any[] = [];
      return forkJoin(this.data.genData.ids.map((edgeId: any) => {
        return this.interfaceService.get(edgeId).pipe(map(edgeData => {
          const result = edgeData.result;
          ele.data('name', result.name);
          const ip_str = result.ip ? result.ip : "";
          const ip = ip_str.split(".");
          const last_octet = ip.length == 4 ? "." + ip[3] : "";
          ele.data('ip_last_octet', last_octet);
          interfaceEditedData.push({
            id: result.id,
            order: result.order,
            name: result.name,
            description: result.description,
            status: result.status,
            category: result.category,
            mac_address: result.mac_address,
            port_group: result.port_group.name,
            ip_allocation: result.ip_allocation,
            ip: result.ip,
            netmask: result.netmask?.mask
          });
        }));
      }))
        .subscribe(() => {
          this.interfaceService.getDataByPks({ pks: this.interfaceIds }).subscribe(response => {
            this.store.dispatch(retrievedInterfacesByIds({ data: response.result }));
          })
          this.store.dispatch(retrievedMapEdit({ data: { interfaceEditedData } }));
          this.store.dispatch(retrievedMapSelection({ data: true }));
          this.dialogRef.close();
          this.toastr.success(response.message);
        });
    })
  }

}
