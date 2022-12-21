import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUserGuideDialogComponent } from './upload-user-guide-dialog.component';

describe('UploadUserGuideDialogComponent', () => {
  let component: UploadUserGuideDialogComponent;
  let fixture: ComponentFixture<UploadUserGuideDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadUserGuideDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadUserGuideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
