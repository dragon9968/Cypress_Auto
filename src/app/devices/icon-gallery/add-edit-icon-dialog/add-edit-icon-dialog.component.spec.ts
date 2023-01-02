import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIconDialogComponent } from './add-edit-icon-dialog.component';

describe('AddEditIconDialogComponent', () => {
  let component: AddEditIconDialogComponent;
  let fixture: ComponentFixture<AddEditIconDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditIconDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIconDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
