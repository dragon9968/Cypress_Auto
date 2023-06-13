import { TestBed } from '@angular/core/testing';

import { CMInterfaceService } from './cm-interface.service';

describe('CMInterfaceInNodeService', () => {
  let service: CMInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
