import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelPortGroupComponent } from './info-panel-port-group.component';

describe('InfoPanelPortGroupComponent', () => {
  let component: InfoPanelPortGroupComponent;
  let fixture: ComponentFixture<InfoPanelPortGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelPortGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelPortGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
