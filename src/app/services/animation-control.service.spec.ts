import { TestBed } from '@angular/core/testing';

import { AnimationControlService } from './animation-control.service';

describe('AnimationControlService', () => {
  let service: AnimationControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
