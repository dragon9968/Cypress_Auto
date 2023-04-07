import { TestBed } from '@angular/core/testing';

import { MapLinkService } from './map-link.service';

describe('MapLinkService', () => {
  let service: MapLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
