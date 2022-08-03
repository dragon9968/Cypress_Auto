import { TestBed } from '@angular/core/testing';

import { LoginProfileService } from './login-profile.service';

describe('LoginProfileService', () => {
  let service: LoginProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
