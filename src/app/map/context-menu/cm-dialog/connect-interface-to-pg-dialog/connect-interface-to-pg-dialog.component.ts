import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../../core/services/interface/interface.service";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { retrievedInterfacePkConnectPG } from "../../../../store/interface/interface.actions";
import { selectInterfacesNotConnectPG } from "../../../../store/interface/interface.selectors";


@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-interface-to-pg-dialog.component.html',
  styleUrls: ['./connect-interface-to-pg-dialog.component.scss']
})
export class ConnectInterfaceToPgDialogComponent implements OnInit, OnDestroy {
  connectInterfaceToPGForm: FormGroup;
  errorMessages = ErrorMessages;
  interfacesNotConnectPG: any[] = [];
  selectInterfacesNotConnectPG = new Subscription();
  filteredInterfaces!: Observable<any[]>;
  nodeId = 0;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ConnectInterfaceToPgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpersService: HelpersService,
    private interfaceService: InterfaceService
  ) {
    this.connectInterfaceToPGForm = new FormGroup({
      interfaceCtr: new FormControl('')
    })
    this.nodeId = this.data.nodeId;
    this.selectInterfacesNotConnectPG = this.store.select(selectInterfacesNotConnectPG).subscribe(interfaces => {
      if (interfaces) {
        this.interfacesNotConnectPG = interfaces;
      }
    })
  }

  get interfaceCtr() { return this.helpersService.getAutoCompleteCtr(this.connectInterfaceToPGForm.get('interfaceCtr'), this.interfacesNotConnectPG) }

  ngOnInit(): void {
    this.interfaceCtr.setValidators([Validators.required, autoCompleteValidator(this.interfacesNotConnectPG)]);
    this.filteredInterfaces = this.helpersService.filterOptions(this.interfaceCtr, this.interfacesNotConnectPG);
  }

  ngOnDestroy(): void {
    this.selectInterfacesNotConnectPG.unsubscribe();
  }

  connectToPortGroup() {
    const interfacePk = this.interfaceCtr?.value?.id;
    this.store.dispatch(retrievedInterfacePkConnectPG({ interfacePkConnectPG: interfacePk }))
    this.data.queueEdge(this.data.event.target, this.data.event.position, "wired");
    this.dialogRef.close();
  }

  disconnectPortGroup() {
    const edgeData = this.interfaceCtr?.value;
    const jsonDataValue = {
      order: edgeData?.order,
      name: edgeData?.name,
      description: edgeData?.description,
      category: edgeData?.category,
      direction: edgeData?.direction,
      mac_address: edgeData?.mac_address,
      port_group_id: null,
      ip_allocation: edgeData?.ip_allocation,
      ip: edgeData?.ip_allocation === 'static_auto' ?  null : edgeData?.ip,
      dns_server: edgeData?.dns_server,
      gateway: edgeData?.gateway,
      is_gateway: edgeData?.is_gateway,
      is_nat: edgeData?.is_nat,
      node_id: edgeData?.node_id,
      netmask_id: null,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(edgeData.id, jsonData).subscribe(() => {
      const edge = this.data.cy.getElementById(edgeData.id);
      this.data.cy.remove(edge);
      this.dialogRef.close();
      this.toastr.success('Disconnected Interface from Port Group', 'Success');
    })
  }
}
