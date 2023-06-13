import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertNodeSnapshotDialogComponent } from './revert-node-snapshot-dialog.component';

describe('RevertNodeSnapshotDialogComponent', () => {
  let component: RevertNodeSnapshotDialogComponent;
  let fixture: ComponentFixture<RevertNodeSnapshotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertNodeSnapshotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevertNodeSnapshotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
