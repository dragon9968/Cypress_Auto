import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRoleDialogComponent } from './import-role-dialog.component';

describe('ImportRoleDialogComponent', () => {
  let component: ImportRoleDialogComponent;
  let fixture: ComponentFixture<ImportRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
