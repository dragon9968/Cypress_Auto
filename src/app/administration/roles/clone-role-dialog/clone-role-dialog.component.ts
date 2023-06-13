import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedRole } from 'src/app/store/user/user.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";

@Component({
  selector: 'app-clone-role-dialog',
  templateUrl: './clone-role-dialog.component.html',
  styleUrls: ['./clone-role-dialog.component.scss']
})
export class CloneRoleDialogComponent implements OnInit {
  cloneForm!: FormGroup;
  errorMessages = ErrorMessages;
  constructor(
    private rolesService: RolesService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<CloneRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.cloneForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required])
    })
    this.nameCtr?.setValue(this.data.name)
  }

  get nameCtr () { return this.cloneForm.get('nameCtr') }

  ngOnInit(): void {
  }

  cloneRole() {
    if (this.cloneForm.valid) {
      const jsonDataValue = {
        pk: this.data.pk,
        name: this.nameCtr?.value
      }
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.rolesService.clone(jsonData).subscribe({
        next: () => {
          this.toastr.success(`Clone Role successfully`);
          this.rolesService.getAll().subscribe(data => this.store.dispatch(retrievedRole({ role: data.result })));
          this.dialogRef.close();
        },
        error: () => {
          this.toastr.error(`Error while Clone Roles`);
        }
      })
    }
  }

  onCancel() {
    this.dialogRef.close()
  }

}
