import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConfigTemplateComponent } from './add-edit-config-template.component';

describe('AddEditConfigTemplateComponent', () => {
  let component: AddEditConfigTemplateComponent;
  let fixture: ComponentFixture<AddEditConfigTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConfigTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditConfigTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
