import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelGroupComponent } from './info-panel-group.component';

describe('InfoPanelGroupComponent', () => {
  let component: InfoPanelGroupComponent;
  let fixture: ComponentFixture<InfoPanelGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
