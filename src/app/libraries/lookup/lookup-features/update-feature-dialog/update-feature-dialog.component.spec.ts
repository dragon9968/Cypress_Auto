import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFeatureDialogComponent } from './update-feature-dialog.component';

describe('UpdateFeatureDialogComponent', () => {
  let component: UpdateFeatureDialogComponent;
  let fixture: ComponentFixture<UpdateFeatureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFeatureDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
