import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelShowValidationNodesComponent } from './info-panel-show-validation-nodes.component';

describe('InfoPanelShowValidationNodesComponent', () => {
  let component: InfoPanelShowValidationNodesComponent;
  let fixture: ComponentFixture<InfoPanelShowValidationNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelShowValidationNodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelShowValidationNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
