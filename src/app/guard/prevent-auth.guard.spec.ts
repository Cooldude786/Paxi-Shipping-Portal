import { TestBed } from '@angular/core/testing';

import { PreventAuthGuard } from './prevent-auth.guard';

describe('PreventAuthGuard', () => {
  let guard: PreventAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
