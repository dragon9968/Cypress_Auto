import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGroupDialogComponent } from './add-update-group-dialog.component';

describe('AddUpdateGroupDialogComponent', () => {
  let component: AddUpdateGroupDialogComponent;
  let fixture: ComponentFixture<AddUpdateGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateGroupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
