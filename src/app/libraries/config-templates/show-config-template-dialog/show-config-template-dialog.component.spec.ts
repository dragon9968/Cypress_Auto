import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowConfigTemplateDialogComponent } from './show-config-template-dialog.component';

describe('ShowConfigTemplateDialogComponent', () => {
  let component: ShowConfigTemplateDialogComponent;
  let fixture: ComponentFixture<ShowConfigTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowConfigTemplateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowConfigTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
