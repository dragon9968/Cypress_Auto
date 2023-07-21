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
import { selectInterfacesConnectedPG } from "../../../../store/interface/interface.selectors";

@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-interface-to-pg-dialog.component.html',
  styleUrls: ['./connect-interface-to-pg-dialog.component.scss']
})
export class ConnectInterfaceToPgDialogComponent implements OnInit, OnDestroy {
  connectInterfaceToPGForm: FormGroup;
  errorMessages = ErrorMessages;
  interfacesConnectedPG: any[] = [];
  selectInterfacesConnectedPG$ = new Subscription();
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
    this.selectInterfacesConnectedPG$ = this.store.select(selectInterfacesConnectedPG).subscribe(interfaces => {
      if (interfaces) {
        this.interfacesConnectedPG = interfaces;
        this.filteredInterfaces = this.helpersService.filterOptions(this.interfaceCtr, this.interfacesConnectedPG);
      }
    })
  }

  get interfaceCtr() { return this.helpersService.getAutoCompleteCtr(this.connectInterfaceToPGForm.get('interfaceCtr'), this.interfacesConnectedPG) }

  ngOnInit(): void {
    this.helpersService.setAutoCompleteValue(this.interfaceCtr, this.interfacesConnectedPG, this.interfacesConnectedPG[0]?.id);
    this.interfaceCtr?.setValue(this.interfacesConnectedPG[0])
    this.interfaceCtr?.setValidators([Validators.required, autoCompleteValidator(this.interfacesConnectedPG)]);
  }

  ngOnDestroy(): void {
    this.selectInterfacesConnectedPG$.unsubscribe();
  }

  disconnectPortGroup() {
    const successMessage = 'Disconnected Interface from Port Group'
    const edgeData = this.interfaceCtr?.value;
    const jsonDataValue = {
      port_group_id: null,
      ip: edgeData?.ip_allocation === 'static_auto' ?  null : edgeData?.ip,
      netmask_id: null,
      task: successMessage
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(edgeData.id, jsonData).subscribe(() => {
      const edge = this.data.cy.getElementById(`interface-${edgeData.id}`);
      this.data.cy.remove(edge);
      this.dialogRef.close();
      this.toastr.success(successMessage, 'Success');
    })
  }
}
