import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelPortGroupManagementComponent } from './info-panel-port-group-management.component';

describe('InfoPanelPortGroupManagementComponent', () => {
  let component: InfoPanelPortGroupManagementComponent;
  let fixture: ComponentFixture<InfoPanelPortGroupManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelPortGroupManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelPortGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
