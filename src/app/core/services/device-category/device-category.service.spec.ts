import { TestBed } from '@angular/core/testing';

import { DeviceCategoryService } from './device-category.service';

describe('DeviceCategoryService', () => {
  let service: DeviceCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
