import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRolesServicesDialogComponent } from './add-edit-roles-services-dialog.component';

describe('AddEditRolesServicesDialogComponent', () => {
  let component: AddEditRolesServicesDialogComponent;
  let fixture: ComponentFixture<AddEditRolesServicesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRolesServicesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRolesServicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
