import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainBulkEditDialogComponent } from './domain-bulk-edit-dialog.component';

describe('DomainBulkEditDialogComponent', () => {
  let component: DomainBulkEditDialogComponent;
  let fixture: ComponentFixture<DomainBulkEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainBulkEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainBulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
