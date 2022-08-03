import { TestBed } from '@angular/core/testing';
import { CMMapService } from './cm-map.service';

describe('CMMapService', () => {
  let service: CMMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
