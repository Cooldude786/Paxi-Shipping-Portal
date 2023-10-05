import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { contactNumberValidationSessionStart, getUserDetailsFail, getUserDetailsStart, getUserDetailsSuccess, profileRegistrationFormSave, profileRegistrationFormSubmited, profileRegistrationSuccess, rehydrateProfilePayload, rehydrateProfileSaveState, smsValidationFail, smsValidationResend, smsValidationResendSuccess, smsValidationSessionActive, smsValidationSessionSuccess, smsValidationSuccess, smsValidationVerify, updatePasswordFail, updatePasswordStart, updatePasswordSuccess, updateProfileSaveState, updateProfileStart, updateProfileSuccess, verifyMobileFail, verifyMobileResend, verifyMobileResendSuccess, verifyMobileSessionActive, verifyMobileSessionStart, verifyMobileSessionSuccess, verifyMobileStart, verifyMobileSuccess,resetUserPayload } from "./user.actions";
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { UserModuleService } from "src/app/services/user-module.service";
import IGetByGuidRes from "src/app/models/userModule.model";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/store/app.state";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { HelperService } from "src/app/services/helper.service";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { IWarningResponse } from "src/app/models/ErrorResponse.model";
import { RegisterService } from "src/app/services/register.service";
import { autoLogin } from "src/app/login/state/auth.actions";

@Injectable()
export class UserModuleEffects {
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _userModuleService: UserModuleService,
    private _helperService: HelperService,
    private _registerService: RegisterService,
    private _router: Router,
  ) { }

  getUserDetailsStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserDetailsStart),
      switchMap((action) => {
        return this._userModuleService.getUserDetailsByUid().pipe(
          map((data) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            const guidRes: IGetByGuidRes = data;
            return getUserDetailsSuccess({ guidRes })
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            if (errResp.error.responseCode == "0001") {
              console.log(errResp.error.responseMessage);
              return of(getUserDetailsFail())
            } else {
              const error = this._helperService.formatError(errResp.error);
              return of(setErrorMessage({ message: error }));
            }
          })
        )
      })
    )
  })

  updatePasswordStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updatePasswordStart),
      switchMap((action) => {
        return this._userModuleService.updatePassword(action.oldPassword, action.newPassword).pipe(
          map((resp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            this._store.dispatch(updatePasswordFail({ updatePasswordError: null }))
            console.log(resp);
            return updatePasswordSuccess();
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            if (errResp.error.responseCode == '0001') {
              console.log(errResp.error.responseMessage);
              return of(updatePasswordFail({ updatePasswordError: errResp.error.responseMessage }));
            } else {
              const error = this._helperService.formatError(errResp.error);
              return of(setErrorMessage({ message: error }));
            }
          })
        )
      })
    )
  })

  updatePasswordSuccessRedirect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updatePasswordSuccess),
      tap((action) => {
        this._router.navigate(['success', 'password-updated']);
      })
    )
  }, { dispatch: false });

  updateProfileStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateProfileStart),
      exhaustMap((action) => {
        console.log(action);

        return this._userModuleService.updateProfileDetails(action.payload).pipe(
          map((resp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            console.log(resp);
            if (action.isMobileNew) {
              this._userModuleService.setNewMobileInLocalStorage(action.newMobile || '')
              return updateProfileSaveState({ newMobile: action.newMobile || '', redirect: true })
            } else {
              return updateProfileSuccess({ redirect: false })
            }
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        )
      })
    )
  })

  rehydrateProfileSaveState$ = createEffect(() => {
    return this.action$.pipe(
      ofType(rehydrateProfileSaveState),
      switchMap((action) => {
        const newMobile = this._userModuleService.getNewMobileInLocalStorage();
        return of(updateProfileSaveState({ newMobile: newMobile || '', redirect: false }))
      })
    )
  })

  updateProfileSaveState$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateProfileSaveState),
      tap((action) => {
        this._router.navigate(['account-management', 'mobile-verification'])
      })
    )
  }, { dispatch: false })

  verifyMobileSessionStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyMobileSessionStart),
      switchMap((action) => {
        return this._userModuleService
          .otpSessionRequest(action.sms, action.commsType)
          .pipe(
            map((resp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              this._store.dispatch(setErrorMessage({ message: null }));
              this._helperService.showSuccessSnackbar('OTP sent, check your sms');
              return verifyMobileSessionSuccess({
                sessionId: resp.sessionId,
              });
            }),
            catchError((errResp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              console.log('contactNumberValidationSessionStart >>> ', errResp);
              if (errResp.error.status == 'FAIL_CREATE_ACTIVE_SESSION') {
                const response: IWarningResponse = {
                  status: errResp.error.status,
                  message: errResp.error.message,
                  data: errResp.error.sessionId,
                };
                // this._helperService.showWarningSnackbar(response);
                return of(
                  verifyMobileSessionActive({ sessionId: response.data })
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

  verifyMobileResend$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyMobileResend),
      switchMap((action) => {
        return this._userModuleService.otpResendRequest(action.sessionId).pipe(
          map((resp) => {
            return verifyMobileResendSuccess();
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('smsValidationResend >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  verifyMobileResendSuccess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(verifyMobileResendSuccess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          this._store.dispatch(setErrorMessage({ message: null }));
          this._helperService.showSuccessSnackbar('OTP sent, check your sms');
        })
      );
    },
    { dispatch: false }
  );

  verifyMobileVerify$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyMobileStart),
      switchMap((action) => {
        return this._userModuleService.otpVerify(action.sessionId, action.pin).pipe(
          map((resp) => {
            console.log(resp);
            this._store.dispatch(setLoadingSpinner({ status: false }));
            if (resp.status == 'VERIFIED') {
              return verifyMobileSuccess();
            } else if (resp.status == 'VERIFICATION_FAIL') {
              return verifyMobileFail({ validationErr: resp.message });
            } else {
              //Handle resp.status cases:
              // FAIL_SESSION_CLOSED_TOO_MANY_RETRIES
              // NOT_IN_STATE_TO_BE_VERIFIED
              // FAIL_SESSION_CLOSED_TIME_OUT
              const error = this._helperService.formatError(resp);
              this._store.dispatch(setErrorMessage({ message: error }));
              this._router.navigate(['/account-management/update-profile-details']);
              this._store.dispatch(setLoadingSpinner({ status: false }));
              return verifyMobileFail({ validationErr: '' });
            }
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('smsValidationVerify >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  verifyMobileSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyMobileSuccess),
      switchMap((action) => {
        return this._userModuleService.updateMobile().pipe(
          map((resp) => {
            this._store.dispatch(verifyMobileFail({ validationErr: '' }));
            this._store.dispatch(setErrorMessage({ message: null }));
            this._userModuleService.clearNewMobileInLocalStorage();
            this._store.dispatch(setLoadingSpinner({ status: false }));
            return updateProfileSuccess({ redirect: true });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('profileUpdateMobileSubmited >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  updateProfileSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateProfileSuccess),
      tap((action) => {
        if (action.redirect) {
          this._router.navigate(['account-management', 'update-profile-details'])
          this._helperService.showSuccessSnackbar('Details saved successfully');
        } else {
          this._helperService.showSuccessSnackbar('Details saved successfully');
        }
      })
    )
  }, { dispatch: false })

  resetDashboardPayload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(resetUserPayload),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );



  //////////////////////////////////////////////////////////////////////////////
  // Create Profile Details Start

  /* NOTE:- Setting profile payload in local storage in the below effect.  */
  profileRegistrationFormSubmited$ = createEffect(() => {
    return this.action$.pipe(
      ofType(profileRegistrationFormSubmited),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        this._registerService.setPersonalDataInLocalStorage(action.payload);
        return of(profileRegistrationFormSave({ payload: action.payload, redirect: true }))
      }),
      catchError((errResp) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        console.log('profileRegistrationFormSubmited >>> ', errResp);
        const error = this._helperService.formatError(errResp.error);
        return of(setErrorMessage({ message: error }));
      })
    );
  });

  autoRehydrateProfilePayload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(rehydrateProfilePayload),
      exhaustMap((action) => {
        const profilePayload = this._registerService.getPersonalDataFromLocalStorage();
        return of(profileRegistrationFormSave({ payload: profilePayload, redirect: false }));
      })
    )
  });

  profileFormRedirect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(profileRegistrationFormSave),
        tap((action) => {
          this._store.dispatch(setErrorMessage({ message: null }));
          if (action.redirect) {
            this._router.navigate(['account-management/complete-profile-details/mobile-verification']);
          }
        })
      );
    },
    { dispatch: false }
  );

  contactNumberValidationSessionStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(contactNumberValidationSessionStart),
      switchMap((action) => {
        return this._registerService
          .otpSessionRequest(action.sms, action.commsType)
          .pipe(
            map((resp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              this._store.dispatch(setErrorMessage({ message: null }));
              this._helperService.showSuccessSnackbar('OTP sent, check your sms');
              return smsValidationSessionSuccess({
                sessionId: resp.sessionId,
              });
            }),
            catchError((errResp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              console.log('contactNumberValidationSessionStart >>> ', errResp);
              if (errResp.error.status == 'FAIL_CREATE_ACTIVE_SESSION') {
                const response: IWarningResponse = {
                  status: errResp.error.status,
                  message: errResp.error.message,
                  data: errResp.error.sessionId,
                };
                // this._helperService.showWarningSnackbar(response);
                return of(
                  smsValidationSessionActive({ sessionId: response.data })
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

  smsValidationResend$ = createEffect(() => {
    return this.action$.pipe(
      ofType(smsValidationResend),
      switchMap((action) => {
        return this._registerService.otpResendRequest(action.sessionId).pipe(
          map((resp) => {
            return smsValidationResendSuccess();
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('smsValidationResend >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  smsValidationResendSuccess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(smsValidationResendSuccess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          this._store.dispatch(setErrorMessage({ message: null }));
          this._helperService.showSuccessSnackbar('OTP sent, check your sms');
        })
      );
    },
    { dispatch: false }
  );

  smsValidationVerify$ = createEffect(() => {
    return this.action$.pipe(
      ofType(smsValidationVerify),
      switchMap((action) => {
        return this._registerService
          .otpVerify(action.sessionId, action.pin)
          .pipe(
            map((resp) => {
              console.log(resp);
              if (resp.status == 'VERIFIED') {
                return smsValidationSuccess();
              }
              if (resp.status == 'VERIFICATION_FAIL') {
                this._store.dispatch(setLoadingSpinner({ status: false }));
                return smsValidationFail({ validationErr: resp.message });
              } else {
                //Handle resp.status cases:
                // FAIL_SESSION_CLOSED_TOO_MANY_RETRIES
                // NOT_IN_STATE_TO_BE_VERIFIED
                // FAIL_SESSION_CLOSED_TIME_OUT
                const error = this._helperService.formatError(resp);
                this._store.dispatch(setErrorMessage({ message: error }));
                this._router.navigate(['/account-management/complete-profile-details']);
                this._store.dispatch(setLoadingSpinner({ status: false }))
                return smsValidationFail({ validationErr: '' });
              }
            }),
            catchError((errResp) => {
              this._store.dispatch(setLoadingSpinner({ status: false }));
              console.log('smsValidationVerify >>> ', errResp);
              const error = this._helperService.formatError(errResp.error);
              return of(setErrorMessage({ message: error }));
            })
          );
      })
    );
  });

  smsValidationSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(smsValidationSuccess),
      mergeMap((action) => {
        return this._registerService.registerProfile().pipe(
          map((resp) => {
            this._store.dispatch(smsValidationFail({ validationErr: '' }));
            this._store.dispatch(setErrorMessage({ message: null }));
            this._registerService.removePersonalDataFromLocalStorage();
            localStorage.setItem('profileGuid', JSON.stringify(resp.profileGuid));
            return profileRegistrationSuccess({ profileGuid: resp.profileGuid });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            console.log('profileRegistrationFormSubmited >>> ', errResp);
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });

  profileRegistrationSuccessRedirect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(profileRegistrationSuccess),
      tap((action) => {
        this._store.dispatch(autoLogin());
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._router.navigate(['/success/profile-created']);
      })
    );
  }, { dispatch: false });


}
