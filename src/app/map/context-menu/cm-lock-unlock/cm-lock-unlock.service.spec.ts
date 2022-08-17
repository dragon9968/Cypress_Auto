import { TestBed } from '@angular/core/testing';
import { CMLockUnlockMenuService } from './cm-lock-unlock.service';

describe('CMLockUnlockMenuService', () => {
  let service: CMLockUnlockMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMLockUnlockMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
