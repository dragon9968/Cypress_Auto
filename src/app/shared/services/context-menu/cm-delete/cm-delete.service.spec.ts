import { TestBed } from '@angular/core/testing';
import { CMDeleteService } from './cm-delete.service';

describe('CMDeleteService', () => {
  let service: CMDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
