import { TestBed } from '@angular/core/testing';

import { CMConnectService } from './cm-connect.service';

describe('CMConnectService', () => {
  let service: CMConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
