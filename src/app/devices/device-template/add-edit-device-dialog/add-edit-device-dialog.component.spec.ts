import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDeviceDialogComponent } from './add-edit-device-dialog.component';

describe('AddEditDeviceDialogComponent', () => {
  let component: AddEditDeviceDialogComponent;
  let fixture: ComponentFixture<AddEditDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDeviceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
