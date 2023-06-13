import { TestBed } from '@angular/core/testing';

import { CmGroupOptionService } from './cm-group-option.service';

describe('CmGroupOptionService', () => {
  let service: CmGroupOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmGroupOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
