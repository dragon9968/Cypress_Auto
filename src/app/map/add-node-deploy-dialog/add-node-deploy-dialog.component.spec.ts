import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNodeDeployDialogComponent } from './add-node-deploy-dialog.component';

describe('AddNodeDeployDialogComponent', () => {
  let component: AddNodeDeployDialogComponent;
  let fixture: ComponentFixture<AddNodeDeployDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNodeDeployDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNodeDeployDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
