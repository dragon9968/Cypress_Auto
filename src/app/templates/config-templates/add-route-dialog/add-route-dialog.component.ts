import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';

@Component({
  selector: 'app-add-route-dialog',
  templateUrl: './add-route-dialog.component.html',
  styleUrls: ['./add-route-dialog.component.scss']
})
export class AddRouteDialogComponent implements OnInit {
  configForm!: FormGroup;
  isViewMode = false;
  constructor(
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddRouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.isViewMode = this.data.mode == 'view';
    this.configForm = new FormGroup({
      route: new FormControl({value: '', disabled: this.isViewMode}),
      nextHop: new FormControl({value: '', disabled: this.isViewMode}),
      interface: new FormControl({value: '', disabled: this.isViewMode})
    });
  }

  get route() {return this.configForm.get('route');}
  get nextHop() {return this.configForm.get('nextHop');}
  get interface() {return this.configForm.get('interface');}

  ngOnInit(): void {
  }

  addRoute() {
    const jsonData = {
      config_type: "static_route",
      config_id: this.data.genData.id, 
      name: this.data.genData.name,
      description: this.data.genData.description,
      route: this.route?.value,
      next_hop: this.nextHop?.value,
      interface: this.interface?.value,
    }
    this.configTemplateService.addConfiguration(jsonData).subscribe({
      next: (rest) =>{
        this.toastr.success(`Add Route successfully`);
        this.dialogRef.close();
        this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
      },
      error:(err) => {
        this.toastr.error(`Error while add Route`);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
