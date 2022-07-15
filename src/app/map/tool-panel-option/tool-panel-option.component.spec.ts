import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPanelOptionComponent } from './tool-panel-option.component';

describe('ToolPanelOptionComponent', () => {
  let component: ToolPanelOptionComponent;
  let fixture: ComponentFixture<ToolPanelOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPanelOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPanelOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
