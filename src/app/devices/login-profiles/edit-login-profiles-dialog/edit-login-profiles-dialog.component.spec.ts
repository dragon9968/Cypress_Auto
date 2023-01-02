import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoginProfilesDialogComponent } from './edit-login-profiles-dialog.component';

describe('EditLoginProfilesDialogComponent', () => {
  let component: EditLoginProfilesDialogComponent;
  let fixture: ComponentFixture<EditLoginProfilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoginProfilesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoginProfilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
