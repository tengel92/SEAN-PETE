import { TestBed } from '@angular/core/testing';

import { OMProjectSearchService } from './om-project-search.service';

describe('OMProjectSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OMProjectSearchService = TestBed.get(OMProjectSearchService);
    expect(service).toBeTruthy();
  });
});
