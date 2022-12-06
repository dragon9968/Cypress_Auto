import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforPanelShowValidationNodesComponent } from './infor-panel-show-validation-nodes.component';

describe('InforPanelShowValidationNodesComponent', () => {
  let component: InforPanelShowValidationNodesComponent;
  let fixture: ComponentFixture<InforPanelShowValidationNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforPanelShowValidationNodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforPanelShowValidationNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
