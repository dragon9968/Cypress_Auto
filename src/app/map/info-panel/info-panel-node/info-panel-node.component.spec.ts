import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelNodeComponent } from './info-panel-node.component';

describe('InfoPanelNodeComponent', () => {
  let component: InfoPanelNodeComponent;
  let fixture: ComponentFixture<InfoPanelNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
