import { TestBed } from '@angular/core/testing';

import { IsProfileCreatedGuard } from './is-profile-created.guard';

describe('IsProfileCreatedGuard', () => {
  let guard: IsProfileCreatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsProfileCreatedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
