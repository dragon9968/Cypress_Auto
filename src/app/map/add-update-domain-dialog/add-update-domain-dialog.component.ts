import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DomainService } from "../../core/services/domain/domain.service";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { selectDomains } from "../../store/domain/domain.selectors";
import { retrievedDomains } from "../../store/domain/domain.actions";
import { validateNameExist } from "../../shared/validations/name-exist.validation";


@Component({
  selector: 'app-add-update-domain-dialog',
  templateUrl: './add-update-domain-dialog.component.html',
  styleUrls: ['./add-update-domain-dialog.component.scss']
})
export class AddUpdateDomainDialogComponent implements OnInit {
  domainAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomains$ = new Subscription();
  domains!: any[];
  isViewMode = false;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public helpers: HelpersService,
    private domainService: DomainService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateDomainDialogComponent>,
  ) {
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any[]) => {
      this.domains = domains;
    })
    this.isViewMode = this.data.mode == 'view';
    this.domainAddForm = new FormGroup({
      nameCtr: new FormControl({
        value: '',
        disabled: this.isViewMode
      }, [Validators.required, validateNameExist(() => this.domains, this.data.mode, this.data.genData.id)]),
      adminUserCtr: new FormControl({value: '', disabled: this.isViewMode}),
      adminPasswordCtr: new FormControl({value: '', disabled: this.isViewMode})
    })
  }

  get nameCtr() { return this.domainAddForm.get('nameCtr'); }
  get adminUserCtr() { return this.domainAddForm.get('adminUserCtr'); }
  get adminPasswordCtr() { return this.domainAddForm.get('adminPasswordCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.adminUserCtr?.setValue(this.data.genData.admin_user);
    this.adminPasswordCtr?.setValue(this.data.genData.admin_password);
  }

  addDomain() {
    const jsonData = {
      name: this.nameCtr?.value,
      collection_id: this.data.genData.collection_id,
      admin_user: this.adminUserCtr?.value,
      admin_password: this.adminPasswordCtr?.value
    }
    this.domainService.add(jsonData).subscribe(response => {
      this.toastr.success(`Added domain ${response.result.name}`);
      this.dialogRef.close();
      this.domainService.getDomainByCollectionId(response.result.collection_id).subscribe((data: any) => this.store.dispatch(retrievedDomains({data: data.result})));
    })
  }

  updateDomain() {
    const jsonData = {
      name: this.nameCtr?.value,
      admin_user: this.adminUserCtr?.value,
      admin_password: this.adminPasswordCtr?.value
    }
    this.domainService.put(this.data.genData.id, jsonData).subscribe(
      (response: any) => {
        this.toastr.success(`Updated domain ${response.result.name}`);
        this.dialogRef.close();
        this.domainService.getDomainByCollectionId(response.result.collection).subscribe((data: any) => this.store.dispatch(retrievedDomains({data: data.result})));
      }
    )
  }

  onCancel() {
    this.dialogRef.close();
  }
}
