import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";

@Component({
  selector: 'app-add-domain-membership-dialog',
  templateUrl: './add-domain-membership-dialog.component.html',
  styleUrls: ['./add-domain-membership-dialog.component.scss']
})
export class AddDomainMembershipDialogComponent implements OnInit {
  domainMemberForm!: FormGroup;
  constructor(
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddDomainMembershipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.domainMemberForm = new FormGroup({
      joinDomain: new FormControl(false),
      ouPath: new FormControl(''),
    })
   }

   get joinDomain() {
    return this.domainMemberForm.get('joinDomain');
   }

   get ouPath() { return this.domainMemberForm.get('ouPath');}

  ngOnInit(): void {
  }

  addDomainMembership() {
    const jsonDataValue = {
      config_type: "domain_membership",
      config_id: this.data.genData.id,
      join_domain: this.joinDomain?.value,
      ou_path: this.ouPath?.value
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).subscribe({
      next: (rest) =>{
        this.toastr.success(`Add Domain Membership successfully`);
        this.dialogRef.close();
        this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
      },
      error:(err) => {
        this.toastr.error(`Error while Add Domain Membership`);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
