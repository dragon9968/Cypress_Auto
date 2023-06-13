import { TestBed } from '@angular/core/testing';

import { LookupNamesService } from './lookup-names.service';

describe('LookupNamesService', () => {
  let service: LookupNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
