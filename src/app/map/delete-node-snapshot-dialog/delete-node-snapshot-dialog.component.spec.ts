import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteNodeSnapshotDialogComponent } from './delete-node-snapshot-dialog.component';

describe('DeleteNodeSnapshotDialogComponent', () => {
  let component: DeleteNodeSnapshotDialogComponent;
  let fixture: ComponentFixture<DeleteNodeSnapshotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNodeSnapshotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNodeSnapshotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
