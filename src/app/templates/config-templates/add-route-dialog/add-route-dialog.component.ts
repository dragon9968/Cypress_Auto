import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';

@Component({
  selector: 'app-add-route-dialog',
  templateUrl: './add-route-dialog.component.html',
  styleUrls: ['./add-route-dialog.component.scss']
})
export class AddRouteDialogComponent implements OnInit {
  configForm!: FormGroup;
  isViewMode = false;
  errorMessages = ErrorMessages;

  constructor(
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public helpers: HelpersService,
    public dialogRef: MatDialogRef<AddRouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.configForm = new FormGroup({
      routeCtr: new FormControl({ value: '', disabled: this.isViewMode }, [Validators.required]),
      nextHopCtr: new FormControl({ value: '', disabled: this.isViewMode }, [Validators.required]),
      interfaceCtr: new FormControl({ value: '', disabled: this.isViewMode })
    });
  }

  get routeCtr() {return this.configForm.get('routeCtr');}
  get nextHopCtr() {return this.configForm.get('nextHopCtr');}
  get interfaceCtr() {return this.configForm.get('interfaceCtr');}

  ngOnInit(): void {
  }

  addRoute() {
    const jsonData = {
      config_type: "static_route",
      config_id: this.data.genData.id,
      name: this.data.genData.name,
      description: this.data.genData.description,
      route: this.routeCtr?.value,
      next_hop: this.nextHopCtr?.value,
      interface: this.interfaceCtr?.value,
    }
    this.configTemplateService.addConfiguration(jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Add Route successfully`);
        this.dialogRef.close();
        this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({ data: data.result })));
      },
      error: (err) => {
        this.toastr.error(`Error while add Route`);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
