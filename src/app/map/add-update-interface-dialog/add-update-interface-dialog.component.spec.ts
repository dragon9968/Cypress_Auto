import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateInterfaceDialogComponent } from './add-update-interface-dialog.component';

describe('AddUpdateInterfaceDialogComponent', () => {
  let component: AddUpdateInterfaceDialogComponent;
  let fixture: ComponentFixture<AddUpdateInterfaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInterfaceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateInterfaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
