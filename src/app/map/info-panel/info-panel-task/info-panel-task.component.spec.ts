import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelTaskComponent } from './info-panel-task.component';

describe('InfoPanelTaskComponent', () => {
  let component: InfoPanelTaskComponent;
  let fixture: ComponentFixture<InfoPanelTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
