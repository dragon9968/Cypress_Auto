import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRoleDialogComponent } from './export-role-dialog.component';

describe('ExportRoleDialogComponent', () => {
  let component: ExportRoleDialogComponent;
  let fixture: ComponentFixture<ExportRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
