import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPanelRemoteComponent } from './tool-panel-remote.component';

describe('ToolPanelRemoteComponent', () => {
  let component: ToolPanelRemoteComponent;
  let fixture: ComponentFixture<ToolPanelRemoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPanelRemoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPanelRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
