import { TestBed } from '@angular/core/testing';

import { ProjectTemplateService } from './project-template.service';

describe('ProjectTemplateService', () => {
  let service: ProjectTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
