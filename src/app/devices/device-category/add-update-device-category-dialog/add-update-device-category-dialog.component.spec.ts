import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDeviceCategoryDialogComponent } from './add-update-device-category-dialog.component';

describe('AddUpdateDeviceCategoryDialogComponent', () => {
  let component: AddUpdateDeviceCategoryDialogComponent;
  let fixture: ComponentFixture<AddUpdateDeviceCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDeviceCategoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDeviceCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
