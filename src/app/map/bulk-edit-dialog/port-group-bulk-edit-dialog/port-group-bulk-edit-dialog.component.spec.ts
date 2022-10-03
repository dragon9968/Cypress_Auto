import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortGroupBulkEditDialogComponent } from './port-group-bulk-edit-dialog.component';

describe('PortGroupBulkEditDialogComponent', () => {
  let component: PortGroupBulkEditDialogComponent;
  let fixture: ComponentFixture<PortGroupBulkEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortGroupBulkEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortGroupBulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
