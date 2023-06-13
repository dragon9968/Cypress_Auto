import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLookupFeaturesDialogComponent } from './add-edit-lookup-features-dialog.component';

describe('AddEditLookupFeaturesDialogComponent', () => {
  let component: AddEditLookupFeaturesDialogComponent;
  let fixture: ComponentFixture<AddEditLookupFeaturesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditLookupFeaturesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLookupFeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
