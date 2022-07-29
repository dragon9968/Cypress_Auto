import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdatePGDialogComponent } from './add-update-pg-dialog.component';

describe('AddUpdatePGDialogComponent', () => {
  let component: AddUpdatePGDialogComponent;
  let fixture: ComponentFixture<AddUpdatePGDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdatePGDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdatePGDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
