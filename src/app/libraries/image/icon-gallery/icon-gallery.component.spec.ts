import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGalleryComponent } from './icon-gallery.component';

describe('IconGalleryComponent', () => {
  let component: IconGalleryComponent;
  let fixture: ComponentFixture<IconGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
