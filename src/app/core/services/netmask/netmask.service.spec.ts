import { TestBed } from '@angular/core/testing';
import { NetMaskService } from './netmask.service';

describe('NetMaskService', () => {
  let service: NetMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetMaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
