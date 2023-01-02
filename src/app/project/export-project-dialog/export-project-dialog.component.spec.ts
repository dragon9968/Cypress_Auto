import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProjectDialogComponent } from './export-project-dialog.component';

describe('ExportProjectDialogComponent', () => {
  let component: ExportProjectDialogComponent;
  let fixture: ComponentFixture<ExportProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportProjectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
