import { TestBed } from '@angular/core/testing';
import { CMActionsMenuService } from './cm-actions.service';

describe('CMActionsMenuService', () => {
  let service: CMActionsMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMActionsMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
