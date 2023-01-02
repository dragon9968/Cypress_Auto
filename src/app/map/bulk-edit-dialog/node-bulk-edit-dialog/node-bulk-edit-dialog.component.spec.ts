import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeBulkEditDialogComponent } from './node-bulk-edit-dialog.component';

describe('NodeBulkEditDialogComponent', () => {
  let component: NodeBulkEditDialogComponent;
  let fixture: ComponentFixture<NodeBulkEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeBulkEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeBulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
