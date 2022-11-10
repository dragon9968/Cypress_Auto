import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTemplateDialogComponent } from './add-edit-template-dialog.component';

describe('AddEditTemplateDialogComponent', () => {
  let component: AddEditTemplateDialogComponent;
  let fixture: ComponentFixture<AddEditTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTemplateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
