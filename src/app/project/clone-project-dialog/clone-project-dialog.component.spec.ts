import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneProjectDialogComponent } from './clone-project-dialog.component';

describe('CloneProjectDialogComponent', () => {
  let component: CloneProjectDialogComponent;
  let fixture: ComponentFixture<CloneProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneProjectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
