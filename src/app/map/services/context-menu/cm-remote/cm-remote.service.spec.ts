import { TestBed } from '@angular/core/testing';
import { CMRemoteMenuService } from './cm-remote.service';

describe('CMRemoteMenuService', () => {
  let service: CMRemoteMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMRemoteMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
