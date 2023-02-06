import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneRoleDialogComponent } from './clone-role-dialog.component';

describe('CloneRoleDialogComponent', () => {
  let component: CloneRoleDialogComponent;
  let fixture: ComponentFixture<CloneRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
