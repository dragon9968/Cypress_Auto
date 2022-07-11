import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapToolPanelComponent } from './map-tool-panel.component';

describe('MapToolPanelComponent', () => {
  let component: MapToolPanelComponent;
  let fixture: ComponentFixture<MapToolPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapToolPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapToolPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
