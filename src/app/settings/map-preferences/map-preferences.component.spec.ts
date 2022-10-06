import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPreferencesComponent } from './map-preferences.component';

describe('MapPreferencesComponent', () => {
  let component: MapPreferencesComponent;
  let fixture: ComponentFixture<MapPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
