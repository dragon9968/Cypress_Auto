import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateProjectDialogComponent } from './validate-project-dialog.component';

describe('ValidateProjectDialogComponent', () => {
  let component: ValidateProjectDialogComponent;
  let fixture: ComponentFixture<ValidateProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateProjectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
