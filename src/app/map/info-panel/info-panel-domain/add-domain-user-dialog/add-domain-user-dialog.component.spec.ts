import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainUserDialogComponent } from './add-domain-user-dialog.component';

describe('AddDomainUserDialogComponent', () => {
  let component: AddDomainUserDialogComponent;
  let fixture: ComponentFixture<AddDomainUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDomainUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDomainUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
