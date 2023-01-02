import { TestBed } from '@angular/core/testing';

import { DomainUserService } from './domain-user.service';

describe('DomainUserService', () => {
  let service: DomainUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
