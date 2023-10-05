import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/store/app.state";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { HelperService } from "src/app/services/helper.service";
import { autoLogin, login, loginFail, loginSuccess, logout, resetPasswordStart, resetPasswordSuccess, revokeTokenStart, revokeTokenSuccess, verifyEmailLinkSend, verifyEmailLinkSuccess } from "./auth.actions";
import { of } from "rxjs";
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { getUserState } from "./auth.selectors";

@Injectable()
export class AuthEffects {
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _authService: AuthService,
    private _helperService: HelperService,
    private _router: Router
  ) { }

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(login),
      exhaustMap((action) => {
        return this._authService.login(action.payload).pipe(
          map((data) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const user = this._authService.formatUser(data);
            this._authService.setUserInLocalStorage(user);
            return loginSuccess({ user, redirect: true });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            if (errResp.error.responseCode == "0001") {
              const errorMessage = this._authService.getErrorMessage(errResp.error.responseMessage);
              return of(loginFail({ authError: errorMessage }));
            } else {
              const error = this._helperService.formatError(errResp.error);
              return of(setErrorMessage({ message: error }));
            }
          })
        )
      })
    )
  });

  authRedirect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(...[loginSuccess]),
      tap((action) => {
        this._store.dispatch(loginFail({ authError: null }));
        this._store.dispatch(setErrorMessage({ message: null }));
        if (action.redirect) {
          this._router.navigate(['/dashboard']);
        }
      })
    )
  }, { dispatch: false });

  autoLogin$ = createEffect(() => {
    return this.action$.pipe(
      ofType(autoLogin),
      exhaustMap((action) => {
        const user = this._authService.getUserFromLocalStorage();
        return of(loginSuccess({ user, redirect: false }));
      })
    )
  });

  revokeToken$ = createEffect(() => {
    return this.action$.pipe(
      ofType(revokeTokenStart),
      exhaustMap((action) => {
        return this._authService.refreshToken(action.refreshToken).pipe(
          map((data) => {
            let payload: any;
            this._store.select(getUserState).subscribe(state => {
              if (state) {
                payload = {...state};
                payload.expiresIn = new Date(new Date().getTime() + (+data.expiresIn * 1000));
                payload.idToken = data.idToken;
                payload.refreshToken = data.refreshToken;
              }
            });
            const user = this._authService.formatUser(payload);
            this._authService.setUserInLocalStorage(user);
            // this._store.dispatch(setLoadingSpinner({ status: false }));
            return revokeTokenSuccess({ user });
          }),
          catchError((errResp) => {
            const error = this._helperService.formatError(errResp.error);
            return of();
            // this._store.dispatch(setLoadingSpinner({ status: false }));
            // return of(setErrorMessage({ message: error }));
          })
        );
      })
    )
  });

  logout$ = createEffect(() => {
    return this.action$.pipe(
      ofType(logout),
      map((action) => {
        this._authService.logout();
        this._router.navigate(['/landing-page']);
      })
    )
  }, { dispatch: false });

  verifyEmailLinkSend$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyEmailLinkSend),
      exhaustMap((action) => {
        return this._authService.sendResetPasswordLink(action.email, action.recaptchaToken).pipe(
          map((resp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            return verifyEmailLinkSuccess({showSnackbar: true});
          }),
          catchError((errResp) => {
            console.log(errResp);

            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        )
      })
    )
  });

  verifyEmailLinkSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyEmailLinkSuccess),
      map((action) => {
        action.showSnackbar && this._helperService.showSuccessSnackbar('Password reset link has been sent to your email.');
      })
    )
  }, { dispatch: false });

  resetPasswordStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(resetPasswordStart),
      exhaustMap((action) => {
        console.log(action);

        return this._authService.resetPassword(action.newPassword, action.oobCode, action.recaptchaToken).pipe(
          map((resp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            return resetPasswordSuccess({ redirect: true });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        )
      })
    )
  });

  resetPasswordRedirect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(...[resetPasswordSuccess]),
      tap((action) => {
        action.redirect && this._router.navigate(['/success/reset-password-successfull']);
      })
    )
  }, { dispatch: false });
}
