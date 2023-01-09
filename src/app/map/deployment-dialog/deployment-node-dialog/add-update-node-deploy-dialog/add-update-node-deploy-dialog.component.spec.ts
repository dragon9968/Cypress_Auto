import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateNodeDeployDialogComponent } from './add-update-node-deploy-dialog.component';

describe('AddNodeDeployDialogComponent', () => {
  let component: AddUpdateNodeDeployDialogComponent;
  let fixture: ComponentFixture<AddUpdateNodeDeployDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateNodeDeployDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateNodeDeployDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
