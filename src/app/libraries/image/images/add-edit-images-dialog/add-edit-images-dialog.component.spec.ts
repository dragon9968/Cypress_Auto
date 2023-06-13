import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditImagesDialogComponent } from './add-edit-images-dialog.component';

describe('AddEditImagesDialogComponent', () => {
  let component: AddEditImagesDialogComponent;
  let fixture: ComponentFixture<AddEditImagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditImagesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
