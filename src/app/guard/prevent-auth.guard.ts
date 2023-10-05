import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { IAppState } from "../store/app.state";
import { isAuthenticated } from "../login/state/auth.selectors";
import { map } from "rxjs/operators";

export const PreventAuthPageAccess: CanActivateFn = (route, state) => {
  const store = inject(Store<IAppState>);
  const router = inject(Router);

  return store.select(isAuthenticated).pipe(
    map((authenticate) => {
      if (authenticate) {
        return router.createUrlTree(['dashboard']);
      }
      return true;
    })
  )
}
