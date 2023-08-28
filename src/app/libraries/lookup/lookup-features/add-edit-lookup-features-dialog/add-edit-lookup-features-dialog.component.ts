import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { LookupFeaturesService } from 'src/app/core/services/lookup-features/lookup-features.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedLookupFeatures } from 'src/app/store/lookup-features/lookup-features.actions';
import { selectLookupFeatures } from 'src/app/store/lookup-features/lookup-features.selectors';

@Component({
  selector: 'app-add-edit-lookup-features-dialog',
  templateUrl: './add-edit-lookup-features-dialog.component.html',
  styleUrls: ['./add-edit-lookup-features-dialog.component.scss']
})
export class AddEditLookupFeaturesDialogComponent implements OnInit, OnDestroy {
  isViewMode = false;
  errorMessages = ErrorMessages;
  lookupFeaturesForm!: FormGroup;
  selectLookupFeatures$ = new Subscription();
  listFeatures!: any[];
  constructor(
    private toastr: ToastrService,
    private lookupFeaturesService: LookupFeaturesService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditLookupFeaturesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.selectLookupFeatures$ = this.store.select(selectLookupFeatures).subscribe((data: any) => {
      this.listFeatures = data
    });
    this.lookupFeaturesForm = new FormGroup({
      nameCtr: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required, validateNameExist(() => this.listFeatures, this.data.mode, this.data.genData.id)]),
      displayNameCtr: new FormControl({value: '', disabled: this.isViewMode}),
      platformCtr: new FormControl({value: '', disabled: this.isViewMode}),
    });
  }

  get nameCtr() { return this.lookupFeaturesForm.get('nameCtr'); }
  get displayNameCtr() { return this.lookupFeaturesForm.get('displayNameCtr'); }
  get platformCtr() { return this.lookupFeaturesForm.get('platformCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.displayNameCtr?.setValue(this.data.genData.display_name);
    this.platformCtr?.setValue(this.data.genData.platform);
  }

  ngOnDestroy(): void {
    this.selectLookupFeatures$.unsubscribe();
  }

  addLookupFeatures() {
    const jsonData = {
      name: this.nameCtr?.value,
      display_name: this.displayNameCtr?.value,
      platform: this.platformCtr?.value,
    }
    this.lookupFeaturesService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData=> {
      this.toastr.success(`Add Lookup Features successfully`);
      this.lookupFeaturesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupFeatures({ data: data.result })));
      this.dialogRef.close();
    });

  }

  updateLookupFeatures() {
    const jsonData = {
      name: this.nameCtr?.value,
      display_name: this.displayNameCtr?.value,
      platform: this.platformCtr?.value,
    }
    this.lookupFeaturesService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData=> {
      this.toastr.success(`Update Lookup Features successfully`);
      this.lookupFeaturesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupFeatures({ data: data.result })));
      this.dialogRef.close();
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.nameCtr?.enable();
    this.displayNameCtr?.enable();
    this.platformCtr?.enable();
  }

  onCancel() {
    this.dialogRef.close()
  }
}
