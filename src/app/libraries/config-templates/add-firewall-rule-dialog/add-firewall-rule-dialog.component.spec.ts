import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFirewallRuleDialogComponent } from './add-firewall-rule-dialog.component';

describe('AddFirewallRuleDialogComponent', () => {
  let component: AddFirewallRuleDialogComponent;
  let fixture: ComponentFixture<AddFirewallRuleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFirewallRuleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFirewallRuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
