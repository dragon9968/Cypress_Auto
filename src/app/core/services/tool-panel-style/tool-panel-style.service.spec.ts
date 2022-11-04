import { TestBed } from '@angular/core/testing';

import { ToolPanelStyleService } from './tool-panel-style.service';

describe('StyleService', () => {
  let service: ToolPanelStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolPanelStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
