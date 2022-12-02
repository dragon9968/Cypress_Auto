import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeletePGDeployDialogComponent } from './add-delete-pg-deploy-dialog.component';

describe('AddDeletePGDeployDialogComponent', () => {
  let component: AddDeletePGDeployDialogComponent;
  let fixture: ComponentFixture<AddDeletePGDeployDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeletePGDeployDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeletePGDeployDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
