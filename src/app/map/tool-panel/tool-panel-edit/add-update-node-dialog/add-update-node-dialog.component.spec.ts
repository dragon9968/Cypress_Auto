import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateNodeDialogComponent } from './add-update-node-dialog.component';

describe('AddUpdateNodeDialogComponent', () => {
  let component: AddUpdateNodeDialogComponent;
  let fixture: ComponentFixture<AddUpdateNodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateNodeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateNodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
