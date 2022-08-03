import { TestBed } from '@angular/core/testing';
import { MapPrefService } from './map-pref.service';

describe('MapPrefService', () => {
  let service: MapPrefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPrefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
