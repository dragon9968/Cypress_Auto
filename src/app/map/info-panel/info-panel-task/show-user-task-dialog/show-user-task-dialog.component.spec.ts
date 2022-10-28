import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserTaskDialogComponent } from './show-user-task-dialog.component';

describe('ShowUserTaskDialogComponent', () => {
  let component: ShowUserTaskDialogComponent;
  let fixture: ComponentFixture<ShowUserTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowUserTaskDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUserTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
