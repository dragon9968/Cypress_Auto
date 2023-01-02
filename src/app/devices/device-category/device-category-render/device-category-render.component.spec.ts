import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCategoryRenderComponent } from './device-category-render.component';

describe('DeviceCategoryRenderComponent', () => {
  let component: DeviceCategoryRenderComponent;
  let fixture: ComponentFixture<DeviceCategoryRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceCategoryRenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCategoryRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
