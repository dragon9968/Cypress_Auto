import { TestBed } from '@angular/core/testing';

import { ConfigTemplateService } from './config-template.service';

describe('ConfigTemplateService', () => {
  let service: ConfigTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
