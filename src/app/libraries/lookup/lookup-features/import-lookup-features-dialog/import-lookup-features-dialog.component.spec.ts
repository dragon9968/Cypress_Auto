import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLookupFeaturesDialogComponent } from './import-lookup-features-dialog.component';

describe('ImportLookupFeaturesDialogComponent', () => {
  let component: ImportLookupFeaturesDialogComponent;
  let fixture: ComponentFixture<ImportLookupFeaturesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportLookupFeaturesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportLookupFeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
