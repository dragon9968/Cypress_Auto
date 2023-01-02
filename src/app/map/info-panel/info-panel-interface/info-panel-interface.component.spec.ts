import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelInterfaceComponent } from './info-panel-interface.component';

describe('InfoPanelInterfaceComponent', () => {
  let component: InfoPanelInterfaceComponent;
  let fixture: ComponentFixture<InfoPanelInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelInterfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
