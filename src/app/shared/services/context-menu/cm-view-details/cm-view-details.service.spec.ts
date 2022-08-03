import { TestBed } from '@angular/core/testing';
import { CMViewDetailsService } from './cm-view-details.service';

describe('CMViewDetailsService', () => {
  let service: CMViewDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMViewDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
