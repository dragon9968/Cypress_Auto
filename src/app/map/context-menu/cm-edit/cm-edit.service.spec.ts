import { TestBed } from '@angular/core/testing';
import { CMEditService } from './cm-edit.service';

describe('CMEditService', () => {
  let service: CMEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
