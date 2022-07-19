import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPanelEditComponent } from './tool-panel-edit.component';

describe('ToolPanelEditComponent', () => {
  let component: ToolPanelEditComponent;
  let fixture: ComponentFixture<ToolPanelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPanelEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPanelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
