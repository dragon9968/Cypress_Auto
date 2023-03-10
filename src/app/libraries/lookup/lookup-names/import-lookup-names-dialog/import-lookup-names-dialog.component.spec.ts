import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLookupNamesDialogComponent } from './import-lookup-names-dialog.component';

describe('ImportLookupNamesDialogComponent', () => {
  let component: ImportLookupNamesDialogComponent;
  let fixture: ComponentFixture<ImportLookupNamesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportLookupNamesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportLookupNamesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
