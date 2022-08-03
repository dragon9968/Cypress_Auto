import { TestBed } from '@angular/core/testing';
import { CMAddMenuService } from './cm-add.service';

describe('CMAddMenuService', () => {
  let service: CMAddMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMAddMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
