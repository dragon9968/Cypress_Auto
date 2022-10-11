import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';
import { DIRECTIONS } from 'src/app/shared/contants/directions.constant';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { selectPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-update-interface-dialog',
  templateUrl: './add-update-interface-dialog.component.html',
  styleUrls: ['./add-update-interface-dialog.component.scss']
})
export class AddUpdateInterfaceDialogComponent implements OnInit {
  interfaceAddForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  errorMessages = ErrorMessages;
  portGroups!: any[];
  isViewMode = false;
  selectPortGroups$ = new Subscription();

  constructor(
    private interfaceService: InterfaceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdateInterfaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private store: Store,
  ) {
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe((portGroups: any) => {
      this.portGroups = portGroups;
    });
    this.isViewMode = this.data.mode == 'view';
    this.interfaceAddForm = new FormGroup({
      orderCtr: new FormControl('', Validators.required),
      nameCtr: new FormControl('', Validators.required),
      descriptionCtr: new FormControl('', Validators.required),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      directionCtr: new FormControl(''),
      macAddressCtr: new FormControl(''),
      portGroupCtr: new FormControl('', Validators.required),
      ipAllocationCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      ipCtr: new FormControl('', Validators.required),
      dnsServerCtr: new FormControl(''),
      gatewayCtr: new FormControl(''),
      isGatewayCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      isNatCtr: new FormControl({ value: '', disabled: this.isViewMode }),
    });
  }

  get orderCtr() { return this.interfaceAddForm.get('orderCtr'); }
  get nameCtr() { return this.interfaceAddForm.get('nameCtr'); }
  get descriptionCtr() { return this.interfaceAddForm.get('descriptionCtr'); }
  get categoryCtr() { return this.interfaceAddForm.get('categoryCtr'); }
  get directionCtr() { return this.interfaceAddForm.get('directionCtr'); }
  get macAddressCtr() { return this.interfaceAddForm.get('macAddressCtr'); }
  get portGroupCtr() { return this.interfaceAddForm.get('portGroupCtr'); }
  get ipAllocationCtr() { return this.interfaceAddForm.get('ipAllocationCtr'); }
  get ipCtr() { return this.interfaceAddForm.get('ipCtr'); }
  get dnsServerCtr() { return this.interfaceAddForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceAddForm.get('gatewayCtr'); }
  get isGatewayCtr() { return this.interfaceAddForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceAddForm.get('isNatCtr'); }

  ngOnInit(): void {
    this.orderCtr?.setValue(this.data.genData.order);
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.helpers.setAutoCompleteValue(this.directionCtr, DIRECTIONS, this.data.genData.direction);
    this.macAddressCtr?.setValue(this.data.genData.mac_address);
    this.helpers.setAutoCompleteValue(this.portGroupCtr, this.portGroups, this.data.genData.port_group_id);
    this.ipAllocationCtr?.setValue(this.data.genData.ip_allocation);
    this.ipCtr?.setValue(this.data.genData.ip);
    this.dnsServerCtr?.setValue(this.data.genData.dns_server);
    this.helpers.setAutoCompleteValue(this.gatewayCtr, this.data.gateways, this.data.genData.gateway);
    this.isGatewayCtr?.setValue(this.data.genData.is_gateway);
    this.isNatCtr?.setValue(this.data.genData.is_nat);
    this.disableItems(this.ipAllocationCtr?.value);
  }

  private disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_manual') {
      this.ipCtr?.enable();
    } else {
      this.ipCtr?.disable();
    }
  }

  onIpAllocationChange($event: MatRadioChange) {
    this.disableItems($event.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addInterface() {
    const jsonData = {
      order: this.orderCtr?.value,
      name: this.nameCtr?.value,
      description: this.descriptionCtr?.value,
      category: this.categoryCtr?.value,
      direction: this.directionCtr?.value.id,
      mac_address: this.macAddressCtr?.value,
      port_group_id: this.portGroupCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      ip: this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value?.id,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: this.data.genData.netmask_id,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "width": this.data.selectedDefaultPref.edge_width,
        "color": this.data.selectedDefaultPref.edge_color,
        "text_size": this.data.selectedDefaultPref.text_size,
        "text_color": this.data.selectedDefaultPref.text_color,
        "text_halign": this.data.selectedDefaultPref.text_halign,
        "text_valign": this.data.selectedDefaultPref.text_valign,
        "text_bg_color": this.data.selectedDefaultPref.text_bg_color,
        "text_bg_opacity": this.data.selectedDefaultPref.text_bg_opacity,
      } : undefined,
    }
    this.interfaceService.add(jsonData).subscribe((respData: any) => {
      const id = respData.id
      const ip_str = respData.result.ip ? respData.result.ip : ""
      const ip = ip_str.split(".")
      const last_octet = ip.length == 4 ? "." + ip[3] : ""
      const cyData = respData.result;
      cyData.id = id;
      cyData.interface_id = id;
      cyData.ip_last_octet = last_octet
      cyData.width = cyData.logical_map_style.width;
      cyData.text_color = cyData.logical_map_style.text_color;
      cyData.text_size = cyData.logical_map_style.text_size;
      cyData.color = cyData.logical_map_style.color;
      this.helpers.addCYEdge(this.data.cy, { ...this.data.newEdgeData, ...cyData });
      this.toastr.success('Edge details added!');
      this.dialogRef.close();
    });
  }

  updateInterface() {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    const jsonData = {
      order: this.orderCtr?.value,
      name: this.nameCtr?.value,
      description: this.descriptionCtr?.value,
      category: this.categoryCtr?.value,
      direction: this.directionCtr?.value.id,
      mac_address: this.macAddressCtr?.value,
      port_group_id: this.portGroupCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      ip: this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value?.id,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: this.data.genData.netmask_id,
    }
    this.interfaceService.put(this.data.genData.id, jsonData).subscribe((respData: any) => {
      const ip_str = respData.result.ip ? respData.result.ip : "";
      const ip = ip_str.split(".");
      const last_octet = ip.length == 4 ? "." + ip[3] : "";
      ele.data('ip_last_octet', last_octet);
      this.toastr.success('Edge details updated!');
      this.dialogRef.close();
    });
  }
}
