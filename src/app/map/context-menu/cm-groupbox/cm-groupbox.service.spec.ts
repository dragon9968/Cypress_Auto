import { TestBed } from '@angular/core/testing';
import { CMGroupBoxService } from './cm-groupbox.service';

describe('CMGroupBoxService', () => {
  let service: CMGroupBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMGroupBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
