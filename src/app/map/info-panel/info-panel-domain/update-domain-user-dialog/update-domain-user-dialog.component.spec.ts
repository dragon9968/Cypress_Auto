import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDomainUserDialogComponent } from './update-domain-user-dialog.component';

describe('UpdateDomainUserDialogComponent', () => {
  let component: UpdateDomainUserDialogComponent;
  let fixture: ComponentFixture<UpdateDomainUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDomainUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDomainUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
