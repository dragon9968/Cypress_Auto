import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelShowValidationResultsComponent } from './info-panel-show-validation-results.component';

describe('InfoPanelShowValidationResultsComponent', () => {
  let component: InfoPanelShowValidationResultsComponent;
  let fixture: ComponentFixture<InfoPanelShowValidationResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelShowValidationResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelShowValidationResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
