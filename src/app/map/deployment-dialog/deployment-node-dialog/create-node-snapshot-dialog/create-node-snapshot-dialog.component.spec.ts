import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNodeSnapshotDialogComponent } from './create-node-snapshot-dialog.component';

describe('CreateNodeSnapshotDialogComponent', () => {
  let component: CreateNodeSnapshotDialogComponent;
  let fixture: ComponentFixture<CreateNodeSnapshotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNodeSnapshotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNodeSnapshotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
