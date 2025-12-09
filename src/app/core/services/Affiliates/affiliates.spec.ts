import { TestBed } from '@angular/core/testing';

import { Affiliates } from './affiliates';

describe('Affiliates', () => {
  let service: Affiliates;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Affiliates);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
