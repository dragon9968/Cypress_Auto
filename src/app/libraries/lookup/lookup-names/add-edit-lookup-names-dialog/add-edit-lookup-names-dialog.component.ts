import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { LookupNamesService } from 'src/app/core/services/lookup-names/lookup-names.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedLookupNames } from 'src/app/store/lookup-names/lookup-names.actions';
import { selectLookupNames } from 'src/app/store/lookup-names/lookup-names.selectors';

@Component({
  selector: 'app-add-edit-lookup-names-dialog',
  templateUrl: './add-edit-lookup-names-dialog.component.html',
  styleUrls: ['./add-edit-lookup-names-dialog.component.scss']
})
export class AddEditLookupNamesDialogComponent implements OnInit {
  isViewMode = false;
  lookupNamesForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectLookupNames$ = new Subscription();
  listNames!: any;
  constructor(
    private lookupNamesService: LookupNamesService,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddEditLookupNamesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 

    this.isViewMode = this.data.mode == 'view';
    this.selectLookupNames$ = this.store.select(selectLookupNames).subscribe((data: any) => {
      this.listNames = data
    });

    this.lookupNamesForm = new FormGroup({
      nameCtr: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required, validateNameExist(() => this.listNames, this.data.mode, this.data.genData.id)]),
      categoryCtr: new FormControl({value: '', disabled: this.isViewMode}),
    })
  }

  get nameCtr() { return this.lookupNamesForm.get('nameCtr')}
  get categoryCtr() { return this.lookupNamesForm.get('categoryCtr')}

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.categoryCtr?.setValue(this.data.genData.category);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addLookupNames() {
    if (this.lookupNamesForm.valid) {
      const jsonData = {
        name: this.nameCtr?.value,
        category: this.categoryCtr?.value
      }
      this.lookupNamesService.add(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(respData=> {
        this.toastr.success(`Add Lookup Names successfully`);
        this.lookupNamesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupNames({ data: data.result })));
        this.dialogRef.close();
      });
    }
  }

  updateLookupNames() {
    const jsonData = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value,
    }
    this.lookupNamesService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData=> {
      this.toastr.success(`Update Lookup Names successfully`);
      this.lookupNamesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupNames({ data: data.result })));
      this.dialogRef.close();
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.nameCtr?.enable();
    this.categoryCtr?.enable();
  }

}
