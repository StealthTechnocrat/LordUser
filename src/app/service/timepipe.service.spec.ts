import { TestBed } from '@angular/core/testing';

import { TimepipeService } from './timepipe.service';

describe('TimepipeService', () => {
  let service: TimepipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimepipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
