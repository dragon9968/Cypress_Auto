import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNodeDeployDialogComponent } from './delete-node-deploy-dialog.component';

describe('DeleteNodeDeployDialogComponent', () => {
  let component: DeleteNodeDeployDialogComponent;
  let fixture: ComponentFixture<DeleteNodeDeployDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNodeDeployDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNodeDeployDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
