import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapInfoPanelComponent } from './map-info-panel.component';

describe('MapInfoPanelComponent', () => {
  let component: MapInfoPanelComponent;
  let fixture: ComponentFixture<MapInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapInfoPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
