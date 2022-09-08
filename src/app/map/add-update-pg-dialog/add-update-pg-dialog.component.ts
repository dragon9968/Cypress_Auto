import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { Store } from '@ngrx/store';
import { selectDomains } from 'src/app/store/domain/domain.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-update-pg-dialog',
  templateUrl: './add-update-pg-dialog.component.html',
  styleUrls: ['./add-update-pg-dialog.component.scss']
})
export class AddUpdatePGDialogComponent implements OnInit, OnDestroy {
  pgAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomains$ = new Subscription();
  domains!: any[];
  isViewMode = false;

  constructor(
    private portGroupService: PortGroupService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdatePGDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private store: Store,
  ) {
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
    });
    this.isViewMode = this.data.mode == 'view';
    this.pgAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      vlanCtr: new FormControl('', Validators.required),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      domainCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.domains)]),
      subnetAllocationCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      subnetCtr: new FormControl(''),
    });
  }

  get nameCtr() { return this.pgAddForm.get('nameCtr'); }
  get vlanCtr() { return this.pgAddForm.get('vlanCtr'); }
  get categoryCtr() { return this.pgAddForm.get('categoryCtr'); }
  get domainCtr() { return this.pgAddForm.get('domainCtr'); }
  get subnetAllocationCtr() { return this.pgAddForm.get('subnetAllocationCtr'); }
  get subnetCtr() { return this.pgAddForm.get('subnetCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.vlanCtr?.setValue(this.data.genData.vlan);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.domainCtr?.setValue(this.helpers.getOptionById(this.domains, this.data.genData.domain_id));
    this.subnetAllocationCtr?.setValue(this.data.genData.subnet_allocation);
    this.subnetCtr?.setValue(this.data.genData.subnet);
    this.disableItems(this.subnetAllocationCtr?.value);
  }

  ngOnDestroy(): void {
    this.selectDomains$.unsubscribe();
  }

  private disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_auto') {
      this.subnetCtr?.disable();
    } else {
      this.subnetCtr?.enable();
    }
  }

  onSubnetAllocationChange($event: MatRadioChange) {
    this.disableItems($event.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addPG() {
    const jsonData = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      collection_id: this.data.collectionId,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "height": this.data.selectedDefaultPref.port_group_size,
        "width": this.data.selectedDefaultPref.port_group_size,
        "color": this.data.selectedDefaultPref.port_group_color,
        "text_size": this.data.selectedDefaultPref.text_size,
        "text_color": this.data.selectedDefaultPref.text_color,
        "text_halign": this.data.selectedDefaultPref.text_halign,
        "text_valign": this.data.selectedDefaultPref.text_valign,
        "text_bg_color": this.data.selectedDefaultPref.text_bg_color,
        "text_bg_opacity": this.data.selectedDefaultPref.text_bg_opacity,
      } : undefined,
    }
    this.portGroupService.add(jsonData).subscribe((respData: any) => {
      this.portGroupService.get(respData.id).subscribe(respData => {
        const cyData = respData.result;
        cyData.id = 'pg-' + respData.id;
        cyData.pg_id = respData.id;
        cyData.domain = this.domainCtr?.value.name;
        cyData.height = cyData.logical_map_style.height;
        cyData.width = cyData.logical_map_style.width;
        cyData.text_color = cyData.logical_map_style.text_color;
        cyData.text_size = cyData.logical_map_style.text_size;
        cyData.color = cyData.logical_map_style.color;
        cyData.groups = respData.result.groups;
        this.helpers.addCYNode(this.data.cy, { newNodeData: { ...this.data.newNodeData, ...cyData }, newNodePosition: this.data.newNodePosition });
        this.helpers.reloadGroupBoxes(this.data.cy);
        this.toastr.success('Port Group details added!');
      })
      this.dialogRef.close();
    });
  }

  updatePG() {
    const ele = this.data.cy.getElementById('pg-' + this.data.genData.id);
    const jsonData = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      collection_id: this.data.collectionId,
      logical_map_position: ele.position(),
    }
    this.portGroupService.put(this.data.genData.id, jsonData).subscribe((_respData: any) => {
      this.portGroupService.get(this.data.genData.id).subscribe(pgData => {
        ele.data('subnet', pgData.result.subnet);
        ele.data('groups', pgData.result.groups);
        ele.data('domain', this.domainCtr?.value.id);
        this.helpers.reloadGroupBoxes(this.data.cy);
        this.toastr.success('Port group details updated!');
        this.dialogRef.close();
      })
    });
  }
}