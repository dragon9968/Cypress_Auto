import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportImportProjectComponent } from './export-import-project.component';

describe('ExportImportProjectComponent', () => {
  let component: ExportImportProjectComponent;
  let fixture: ComponentFixture<ExportImportProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportImportProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportImportProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
