import { TestBed } from '@angular/core/testing';

import { CMDisconnectService } from './cm-disconnect.service';

describe('CMDisconnectService', () => {
  let service: CMDisconnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMDisconnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
