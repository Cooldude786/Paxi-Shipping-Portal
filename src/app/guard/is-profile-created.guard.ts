import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { getGuid } from '../login/state/auth.selectors';
import { map, take } from 'rxjs/operators';

export const IsProfileCreatedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<IAppState>);
  const router = inject(Router);
  const url = state.url;
  const guid = store.select(getGuid).pipe(
    take(1),
    map(guid => !!guid)
  )

  guid.subscribe(isGuid => {
    if (isGuid) {
      if (url === '/account-management/complete-profile-details' || url === '/account-management/complete-profile-details/mobile-verification') {
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    } else {
      if (url === '/account-management/complete-profile-details' || url === '/account-management/complete-profile-details/mobile-verification') {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    }
  });

  // If no NavigationEnd event, allow navigation
  return true;
}
