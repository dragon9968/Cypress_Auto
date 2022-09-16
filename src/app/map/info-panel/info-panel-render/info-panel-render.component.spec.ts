import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelRenderComponent } from './info-panel-render.component';

describe('InfoPanelRenderComponent', () => {
  let component: InfoPanelRenderComponent;
  let fixture: ComponentFixture<InfoPanelRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelRenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
