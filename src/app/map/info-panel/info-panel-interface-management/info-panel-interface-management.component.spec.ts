import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelInterfaceManagementComponent } from './info-panel-interface-management.component';

describe('InfoPanelInterfaceManagementComponent', () => {
  let component: InfoPanelInterfaceManagementComponent;
  let fixture: ComponentFixture<InfoPanelInterfaceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelInterfaceManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelInterfaceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
