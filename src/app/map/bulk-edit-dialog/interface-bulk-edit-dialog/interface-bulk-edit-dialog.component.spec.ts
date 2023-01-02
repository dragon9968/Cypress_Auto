import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceBulkEditDialogComponent } from './interface-bulk-edit-dialog.component';

describe('InterfaceBulkEditDialogComponent', () => {
  let component: InterfaceBulkEditDialogComponent;
  let fixture: ComponentFixture<InterfaceBulkEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceBulkEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceBulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
