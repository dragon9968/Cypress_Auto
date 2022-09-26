import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelDomainComponent } from './info-panel-domain.component';

describe('InfoPanelDomainComponent', () => {
  let component: InfoPanelDomainComponent;
  let fixture: ComponentFixture<InfoPanelDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPanelDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPanelDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
