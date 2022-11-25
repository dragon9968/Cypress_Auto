import { TestBed } from '@angular/core/testing';

import { AppPrefService } from './app-pref.service';

describe('AppPrefService', () => {
  let service: AppPrefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppPrefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
