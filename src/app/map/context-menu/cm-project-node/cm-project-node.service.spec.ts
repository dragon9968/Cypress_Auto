import { TestBed } from '@angular/core/testing';

import { CMProjectNodeService } from './cm-project-node.service';

describe('CMProjectNodeService', () => {
  let service: CMProjectNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMProjectNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
