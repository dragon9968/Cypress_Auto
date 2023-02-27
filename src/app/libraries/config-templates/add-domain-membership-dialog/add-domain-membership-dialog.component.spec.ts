import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainMembershipDialogComponent } from './add-domain-membership-dialog.component';

describe('AddDomainMembershipDialogComponent', () => {
  let component: AddDomainMembershipDialogComponent;
  let fixture: ComponentFixture<AddDomainMembershipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDomainMembershipDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDomainMembershipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
