import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainUserDialogComponent } from './domain-user-dialog.component';

describe('DomainUserDialogComponent', () => {
  let component: DomainUserDialogComponent;
  let fixture: ComponentFixture<DomainUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
