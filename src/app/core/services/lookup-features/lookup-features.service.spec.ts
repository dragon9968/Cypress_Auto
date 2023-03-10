import { TestBed } from '@angular/core/testing';

import { LookupFeaturesService } from './lookup-features.service';

describe('LookupFeaturesService', () => {
  let service: LookupFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
