import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLookupNamesDialogComponent } from './add-edit-lookup-names-dialog.component';

describe('AddEditLookupNamesDialogComponent', () => {
  let component: AddEditLookupNamesDialogComponent;
  let fixture: ComponentFixture<AddEditLookupNamesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditLookupNamesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLookupNamesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
