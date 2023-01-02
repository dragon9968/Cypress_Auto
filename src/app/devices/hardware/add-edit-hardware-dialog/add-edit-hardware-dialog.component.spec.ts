import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHardwareDialogComponent } from './add-edit-hardware-dialog.component';

describe('AddEditHardwareDialogComponent', () => {
  let component: AddEditHardwareDialogComponent;
  let fixture: ComponentFixture<AddEditHardwareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditHardwareDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditHardwareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
