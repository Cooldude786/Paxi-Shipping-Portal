import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  registrationTypeInitiate,
  registrationTypeSuccess,
  emailValidationSessionStart,
  emailValidationSessionSuccess,
  registrationFormSuccess,
  registrationFormInitiate,
  emailValidationSessionActive,
  emailValidationResend,
  emailValidationResendSuccess,
  emailValidationVerify,
  emailValidationSuccess,
  emailValidationFail,
  registrationSuccess,
  rehydrateRegistrationInitiateData,
  rehydrateRegistrationFormData,
} from './registration.actions';
import { exhaustMap, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { RegisterService } from 'src/app/services/register.service';
import { setErrorMessage, setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { Router } from '@angular/router';
import { IWarningResponse } from 'src/app/models/ErrorResponse.model';
import { HelperService } from 'src/app/services/helper.service';
import { getRegisterPayload } from './registration.selectors';
import { IRegister } from 'src/app/models/Register.model';
import { IProfile } from 'src/app/models/Profile.model';

@Injectable()
export class RegistrationEffects {
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _router: Router,
    private _registerService: RegisterService,
    private _helperService: HelperService
  ) {}

  /* NOTE:- Setting step1 of registration in local storage in the below effect.  */
  registrationTypeInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(registrationTypeInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setErrorMessage({ message: null }));
        this._registerService.setRegisterDataInLocalStorage(action.payload)
        return of(registrationTypeSuccess({ payload: action.payload, redirect: true }));
      }),
      catchError((errResp) => {
        const error = this._helperService.formatError(errResp.error);
        return of(setErrorMessage({ message: error }));
      })
    );
  });

  autoRehydrateRegisterInitiateData$ = createEffect(() => {
    return this.action$.pipe(
      ofType(rehydrateRegistrationInitiateData),
      exhaustMap((action) => {
        const registrationTypeData = this._registerService.getRegisterDataFromLocalStorage();
        return of(registrationTypeSuccess({ payload: registrationTypeData, redirect: false }));
      })
    )
  });

  registrationTypeRedirect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(registrationTypeSuccess),
        tap((action) => {
          this._store.dispatch(setErrorMessage({ message: null }));
          if (action.redirect) {
            if (action.payload.accountType == 'PERSONAL') {
              this._router.navigate(['/registration/personal']);
            }
            if (action.payload.accountType == 'BUSINESS') {
              console.log(action.payload.accountType);
            }
            if (action.payload.accountType == 'BUSINESSINVITE') {
              console.log(action.payload.accountType);
            }
          }
        })
      );
    },
    { dispatch: false }
  );

  /* NOTE:- Setting step2 of registration in local storage in the below effect.  */
  registrationFormInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(registrationFormInitiate),
      switchMap((action) => {
        this._store.dispatch(setErrorMessage({ message: null }));
        this._registerService.setRegisterDataInLocalStorage(action.payload);
        return of(registrationFormSuccess({ payload: action.payload, redirect: true }));
      }),
      catchError((errResp) => {
        const error = this._helperService.formatError(errResp.error);
        return of(setErrorMessage({ message: error }));
      })
    );
  });

  autoRehydrateRegistrationFormData$ = createEffect(() => {
    return this.action$.pipe(
      ofType(rehydrateRegistrationFormData),
      exhaustMap((action) => {
        const registrationTypeData = this._registerService.getRegisterDataFromLocalStorage();
        return of(registrationFormSuccess({ payload: registrationTypeData, redirect: false }));
      })
    )
  });

  registrationFormRedirect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(registrationFormSuccess),
        tap((action) => {
          this._store.dispatch(setErrorMessage({ message: null }));
          if (action.redirect) {
            this._router.navigate([
              '/registration/personal/email-verification',
            ]);
          }
        })
      );
    },
    { dispatch: false }
  );

  emailValidationSessionRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(emailValidationSessionStart),
      switchMap((action) => {
        return this._registerService
          .otpSessionRequest(action.email, action.commsType)
          .pipe(
            map((resp) => {
              return emailValidationSessionSuccess({
                sessionId: resp.sessionId,
              });
            }),
            catchError((errResp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              console.log('emailValidationSessionSuccess >>> ', errResp);
              if (errResp.error.status == 'FAIL_CREATE_ACTIVE_SESSION') {
                const response: IWarningResponse = {
                  status: errResp.error.status,
                  message: errResp.error.message,
                  data: errResp.error.sessionId,
                };
                // this._helperService.showWarningSnackbar(response);
                return of(
                  emailValidationSessionActive({ sessionId: response.data })
                );
              } else {
                const error = this._helperService.formatError(errResp.error);
                return of(setErrorMessage({ message: error }));
              }
            })
          );
      })
    );
  });

  emailValidationSessionSuccess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(emailValidationSessionSuccess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          this._store.dispatch(setErrorMessage({ message: null }));
          this._helperService.showSuccessSnackbar('OTP sent, check your email');
        })
      );
    },
    { dispatch: false }
  );

  emailValidationResend$ = createEffect(() => {
    return this.action$.pipe(
      ofType(emailValidationResend),
      switchMap((action) => {
        return this._registerService.otpResendRequest(action.sessionId).pipe(
          map((resp) => {
            return emailValidationResendSuccess();
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('emailValidationResend >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  emailValidationResendSuccess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(emailValidationResendSuccess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          this._store.dispatch(setErrorMessage({ message: null }));
          this._helperService.showSuccessSnackbar('OTP sent, check your email');
        })
      );
    },
    { dispatch: false }
  );

  emailValidationVerify$ = createEffect(() => {
    return this.action$.pipe(
      ofType(emailValidationVerify),
      switchMap((action) => {
        return this._registerService
          .otpVerify(action.sessionId, action.pin)
          .pipe(
            map((resp) => {
              console.log(resp);
              this._store.dispatch(setLoadingSpinner({ status: false }));

              if(resp.status == 'VERIFIED'){ // Only continue process if validation has passed, don't fail open.
                let registerPayload : IRegister = {
                  email: '',
                  password: '',
                  accountType: '',
                  recaptchaToken: '',
                  validEmail: false
                }
                this._store.select(getRegisterPayload).subscribe((payload) => {
                  registerPayload = {...payload}
                  registerPayload.validEmail = true
                })
                return emailValidationSuccess({ payload: registerPayload });
              }
              else if (resp.status == 'VERIFICATION_FAIL') {
                return emailValidationFail({ validationErr: resp.message });
              } else {
                //Handle resp.status cases:
                // FAIL_SESSION_CLOSED_TOO_MANY_RETRIES
                // NOT_IN_STATE_TO_BE_VERIFIED
                // FAIL_SESSION_CLOSED_TIME_OUT
                const error = this._helperService.formatError(resp);
                this._store.dispatch(setErrorMessage({ message: error }));
                this._registerService.removeRegisterDataFromLocalStorage();
                this._router.navigate(['/landing-page']);
                return emailValidationFail({ validationErr: '' });
              }
            }),
            catchError((errResp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              console.log('emailValidationVerify >>> ', errResp);
              const error = this._helperService.formatError(errResp.error);
              return of(setErrorMessage({ message: error }));
            })
          );
      })
    );
  });

  /* NOTE:- Setting uid in local storage in the below effect.  */
  emailValidationSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(emailValidationSuccess),
      mergeMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._registerService.register().pipe(
          map((resp) => {
            console.log(resp);
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            this._registerService.removeRegisterDataFromLocalStorage();
            // const profilePayload: IProfile = {
            //   uid: resp.uid,
            //   firstName: '',
            //   lastName: '',
            //   contactNumber: '',
            //   idType: '',
            //   idNumber: '',
            //   country: '',
            //   marketingConsent: ''
            // }
            // this._registerService.setPersonalDataInLocalStorage(profilePayload)
            // return registrationSuccess({ uid: resp.uid, redirect: true });
            return registrationSuccess({ redirect: true });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('registrationSuccess >>> ', errResp);
            if (errResp.error.responseCode == "0001") {
              this._registerService.removeRegisterDataFromLocalStorage();
              this._router.navigate(['/login']).then(() => {
                const error = this._helperService.formatError(errResp.error);
                return of(setErrorMessage({ message: error }));
              })
            }
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  registrationSuccess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(registrationSuccess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          this._store.dispatch(emailValidationFail({ validationErr: '' }));
          this._store.dispatch(setErrorMessage({ message: null }));
          if (action.redirect) {
            this._router.navigate(['/success/registered']);
            // this._router.navigate(['/registration/profile-details']);
          }
        })
      );
    },
    { dispatch: false }
  );

}
