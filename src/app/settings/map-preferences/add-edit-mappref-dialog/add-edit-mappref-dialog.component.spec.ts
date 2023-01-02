import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMapprefDialogComponent } from './add-edit-mappref-dialog.component';

describe('AddEditMapprefDialogComponent', () => {
  let component: AddEditMapprefDialogComponent;
  let fixture: ComponentFixture<AddEditMapprefDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMapprefDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMapprefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
