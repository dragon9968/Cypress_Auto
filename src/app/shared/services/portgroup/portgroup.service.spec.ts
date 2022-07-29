import { TestBed } from '@angular/core/testing';
import { PortGroupService } from './portgroup.service';

describe('PortGroupService', () => {
  let service: PortGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
