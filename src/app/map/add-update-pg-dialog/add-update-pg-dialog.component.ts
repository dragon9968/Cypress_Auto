import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { selectDomains } from 'src/app/store/domain/domain.selectors';
import { showErrorFromServer } from "../../shared/validations/error-server-response.validation";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { selectPortGroupsManagement } from "../../store/portgroup/portgroup.selectors";
import { retrievedPortGroupsManagement } from "../../store/portgroup/portgroup.actions";
import { PortGroupAddModel, PortGroupGetRandomModel, PortGroupPutModel } from "../../core/models/port-group.model";

@Component({
  selector: 'app-add-update-pg-dialog',
  templateUrl: './add-update-pg-dialog.component.html',
  styleUrls: ['./add-update-pg-dialog.component.scss']
})
export class AddUpdatePGDialogComponent implements OnInit, OnDestroy {
  pgAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomains$ = new Subscription();
  selectPortGroupsManagement$ = new Subscription();
  portGroupsManagement: any[] = [];
  domains!: any[];
  isViewMode = false;
  tabName = '';
  errors: any[] = [];
  filteredDomains!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdatePGDialogComponent>,
    public helpers: HelpersService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService,
  ) {
    this.pgAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      vlanCtr: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(4095),
        Validators.pattern('^[0-9]*$'),
        showErrorFromServer(() => this.errors)
      ]),
      categoryCtr: new FormControl(''),
      domainCtr: new FormControl(''),
      subnetAllocationCtr: new FormControl(''),
      subnetCtr: new FormControl('', [
        Validators.required,
        showErrorFromServer(() => this.errors)])
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
      this.domainCtr.setValidators([Validators.required, autoCompleteValidator(this.domains)]);
      this.filteredDomains = this.helpers.filterOptions(this.domainCtr, this.domains);
    });
    this.selectPortGroupsManagement$ = this.store.select(selectPortGroupsManagement).subscribe(
      portGroupsManagement => this.portGroupsManagement = portGroupsManagement
    )
    this.isViewMode = this.data.mode == 'view';
    this.tabName = this.data.tabName;
  }

  get nameCtr() { return this.pgAddForm.get('nameCtr'); }
  get vlanCtr() { return this.pgAddForm.get('vlanCtr'); }
  get categoryCtr() { return this.pgAddForm.get('categoryCtr'); }
  get domainCtr() { return this.helpers.getAutoCompleteCtr(this.pgAddForm.get('domainCtr'), this.domains); }
  get subnetAllocationCtr() { return this.pgAddForm.get('subnetAllocationCtr'); }
  get subnetCtr() { return this.pgAddForm.get('subnetCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.vlanCtr?.setValue(this.data.genData.vlan);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.helpers.setAutoCompleteValue(this.domainCtr, this.domains, this.data.genData.domain_id);
    this.subnetAllocationCtr?.setValue(this.data.genData.subnet_allocation);
    this.subnetCtr?.setValue(this.data.genData.subnet);
    this._disableItems(this.subnetAllocationCtr?.value);
  }

  ngOnDestroy(): void {
    this.selectDomains$.unsubscribe();
    this.selectPortGroupsManagement$.unsubscribe();
  }

  private _disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_auto') {
      this.subnetCtr?.disable();
    } else {
      this.subnetCtr?.enable();
    }
  }

  private _updatePGOnMap(data: any) {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    ele.data('name', data.name);
    ele.data('vlan', data.vlan);
    ele.data('category', data.category);
    ele.data('subnet_allocation', data.subnet_allocation);
    ele.data('subnet', data.subnet);
    ele.data('groups', data.groups);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('interfaces', data.interfaces);
  }

  onSubnetAllocationChange($event: MatRadioChange) {
    this._disableItems($event.value);
    this._changeSubnet()
  }

  onCategoryChange($event: MatRadioChange) {
    this.subnetCtr?.setErrors(null);
    this._changeSubnet()
  }

  onCancel() {
    this.dialogRef.close();
  }

  addPG() {
    const jsonDataValue: PortGroupAddModel = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      project_id: this.data.projectId,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "height": this.data.selectedMapPref.port_group_size,
        "width": this.data.selectedMapPref.port_group_size,
        "color": this.data.selectedMapPref.port_group_color,
        "text_size": this.data.selectedMapPref.text_size,
        "text_color": this.data.selectedMapPref.text_color,
        "text_halign": this.data.selectedMapPref.text_halign,
        "text_valign": this.data.selectedMapPref.text_valign,
        "text_bg_color": this.data.selectedMapPref.text_bg_color,
        "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity,
      } : undefined,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.portGroupService.add(jsonData).pipe(
      catchError(err => {
        const errorMessage = err.error.message;
        if (err.status === 422) {
          if (errorMessage.subnet) {
            this.subnetCtr?.setErrors({
              serverError: errorMessage.subnet
            });
            this.errors.push({ 'valueCtr': this.subnetCtr?.value, 'error': errorMessage.subnet });
          }
          if (errorMessage.vlan) {
            this.vlanCtr?.setErrors({
              serverError: errorMessage.vlan
            });
            this.errors.push({ 'valueCtr': this.vlanCtr?.value, 'error': errorMessage.vlan });
          }
        }
        return throwError(() => err);
      })
    ).subscribe((respData: any) => {
      this.portGroupService.get(respData.id).subscribe(respData => {
        const portGroup = respData.result;
        if (portGroup.category === 'management') {
          const newPGsManagement = this.infoPanelService.getNewPortGroupsManagement([portGroup]);
          this.store.dispatch(retrievedPortGroupsManagement({ data: newPGsManagement }));
        } else {
          const cyData = portGroup;
          cyData.id = 'pg-' + respData.id;
          cyData.pg_id = respData.id;
          cyData.domain = this.domainCtr?.value.name;
          cyData.height = cyData.logical_map_style.height;
          cyData.width = cyData.logical_map_style.width;
          cyData.text_color = cyData.logical_map_style.text_color;
          cyData.text_size = cyData.logical_map_style.text_size;
          cyData.color = cyData.logical_map_style.color;
          this.helpers.addCYNode(this.data.cy, { newNodeData: { ...this.data.newNodeData, ...cyData }, newNodePosition: this.data.newNodePosition });
          cyData.groups = portGroup.groups;
          this.helpers.reloadGroupBoxes(this.data.cy);
        }
        this.toastr.success('Port Group details added!');
      })
      this.dialogRef.close();
    });
  }

  updatePG() {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    const jsonDataValue: PortGroupPutModel = {
      name: this.nameCtr?.value,
      vlan: this.vlanCtr?.value,
      category: this.categoryCtr?.value,
      domain_id: this.domainCtr?.value.id,
      subnet_allocation: this.subnetAllocationCtr?.value,
      subnet: this.subnetCtr?.value,
      project_id: this.data.genData.project_id,
      logical_map_position: ele.position(),
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.portGroupService.put(this.data.genData.pg_id, jsonData).pipe(
      catchError(err => {
        const errorMessage = err.error.message;
        if (err.status === 422) {
          if (errorMessage.subnet) {
            this.subnetCtr?.setErrors({
              serverError: errorMessage.subnet
            });
            this.errors.push({ 'valueCtr': this.subnetCtr?.value, 'error': errorMessage.subnet });
          }
          if (errorMessage.vlan) {
            this.vlanCtr?.setErrors({
              serverError: errorMessage.vlan
            });
            this.errors.push({ 'valueCtr': this.vlanCtr?.value, 'error': errorMessage.vlan });
          }
        }
        return throwError(() => err);
      })
    ).subscribe((_respData: any) => {
      this.portGroupService.get(this.data.genData.pg_id).subscribe(pgData => {
        const portGroup = pgData.result;
        if (portGroup.category === 'management') {
          const newPGsManagement = this.infoPanelService.getNewPortGroupsManagement([portGroup]);
          this.store.dispatch(retrievedPortGroupsManagement({ data: newPGsManagement }));
        } else {
          this._updatePGOnMap(portGroup);
          this.helpers.updateNodesOnGroupStorage(portGroup, 'port_groups');
          this.helpers.reloadGroupBoxes(this.data.cy);
          this.store.dispatch(retrievedMapSelection({ data: true }));
        }
        this.dialogRef.close();
        this.toastr.success('Port group details updated!');
      });
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }

  private _changeSubnet() {
    if (this.subnetAllocationCtr?.value == 'static_auto') {
      const jsonData: PortGroupGetRandomModel = {
        project_id: this.data.genData.project_id,
        category: this.categoryCtr?.value
      }
      this.portGroupService.getRandomSubnet(jsonData).pipe(
        catchError(error => {
          this.toastr.error('Get random subnet for the port group failed!', 'Error')
          return throwError(() => error)
        })
      ).subscribe(response => {
        this.subnetCtr?.setValue(response.result)
      })
    }
  }
}
