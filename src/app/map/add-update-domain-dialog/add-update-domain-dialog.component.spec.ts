import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDomainDialogComponent } from './add-update-domain-dialog.component';

describe('AddUpdateDomainDialogComponent', () => {
  let component: AddUpdateDomainDialogComponent;
  let fixture: ComponentFixture<AddUpdateDomainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDomainDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
