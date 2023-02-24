import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LDAPConfigurationComponent } from './ldap-configuration.component';

describe('LDAPConfigurationComponent', () => {
  let component: LDAPConfigurationComponent;
  let fixture: ComponentFixture<LDAPConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LDAPConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LDAPConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
