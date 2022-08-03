import { TestBed } from '@angular/core/testing';
import { CMGoToTableMenuService } from './cm-go-to-table.service';

describe('CMGoToTableMenuService', () => {
  let service: CMGoToTableMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMGoToTableMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
