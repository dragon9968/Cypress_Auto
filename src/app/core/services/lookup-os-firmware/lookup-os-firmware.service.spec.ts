import { TestBed } from '@angular/core/testing';

import { LookupOsFirmwareService } from './lookup-os-firmware.service';

describe('LookupOsFirmwareService', () => {
  let service: LookupOsFirmwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupOsFirmwareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
