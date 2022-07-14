import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPanelStyleComponent } from './tool-panel-style.component';

describe('ToolPanelStyleComponent', () => {
  let component: ToolPanelStyleComponent;
  let fixture: ComponentFixture<ToolPanelStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPanelStyleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPanelStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
