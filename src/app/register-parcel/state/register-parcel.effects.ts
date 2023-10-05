import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  registerParcelFormInitiate,
  registerParcelFormSuccess,
  createOrderSucess,
  createOrder,
  loadLocation,
  loadLocationSucess,
  registerParcelFormRehydrate,
  preRegisterStart,
  preRegisterSuccess,
  updateOrder
} from './register-parcel.actions';
import { exhaustMap, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { setErrorMessage, setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { OrderService } from 'src/app/services/order.service';
import { IRegisterParcel } from 'src/app/models/RegisterParcel.model';

@Injectable()
export class RegisterParcelEffects {
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _router: Router,
    private _helperService: HelperService,
    private _orderService: OrderService
  ) { }
  registerParcelFormInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(registerParcelFormInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setErrorMessage({ message: null }));
        localStorage.setItem('registerParcelPopulates', JSON.stringify(action.payload));
        return of(registerParcelFormSuccess({ payload: action.payload, redirect: true }));
      }),
      catchError((errResp) => {
        const error = this._helperService.formatError(errResp.error);
        return of(setErrorMessage({ message: error }));
      })
    );
  });

  autoRehydrateParcelFormData$ = createEffect(() => {
    return this.action$.pipe(
      ofType(registerParcelFormRehydrate),
      exhaustMap((action) => {
        const getParcelFormInfo = localStorage.getItem('registerParcelPopulates');
        const parcelFormInfo: IRegisterParcel = JSON.parse(getParcelFormInfo ?? '')
        return of(registerParcelFormSuccess({ payload: parcelFormInfo, redirect: false }));
      })
    )
  });

  registerParcelRedirect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(registerParcelFormSuccess),
        exhaustMap((action) => {
          return this._helperService.validatePhone(action.payload.receiverCell).pipe(
            map((resp) => {
              this._store.dispatch(setErrorMessage({ message: null }));
              if (action.redirect) {
                this._router.navigate(['register-parcel/parcel-number']);
              }
            }),
            catchError((errResp) => {
              this._store.dispatch(setErrorMessage({ message: errResp.error.error }));
              return of(setErrorMessage({ message: errResp.error.error }));
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  createOrder$ = createEffect(() => {
    return this.action$.pipe(
      ofType(createOrder),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._orderService.createOreder().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return createOrderSucess({ orderIdNo: resp.orderIdNo });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });
  createOrderSucess$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(createOrderSucess),
        tap((action) => {
          this._store.dispatch(setLoadingSpinner({ status: false }));
          //this._store.dispatch(emailValidationFail({ validationErr: '' }));
          this._store.dispatch(setErrorMessage({ message: null }));
          this._router.navigate(['/dashboard']);
        })
      );
    },
    { dispatch: false }
  );
  loadLocation$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadLocation),
      mergeMap((action) => {
        return this._helperService.getDestinationLocationNew().pipe(
          map((destination) => {
            return loadLocationSucess({ destination });
          })
        )
      })
    )
  });

  preRegistrationStart$ = createEffect(() => {
    return this.action$.pipe(
      ofType(preRegisterStart),
      exhaustMap((action) => {
        return this._orderService.preRegister(action.parcelNo).pipe(
          map((resp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            this._store.dispatch(setErrorMessage({ message: null }));
            return preRegisterSuccess();
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    )
  })

  preRegisterRedirect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(preRegisterSuccess),
      tap((action) => {
        this._router.navigate(['/success/parcel-registered']);
      })
    )
  }, { dispatch: false });

  // Update Order
  updateOrder$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateOrder),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._orderService.updateOrder().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return createOrderSucess({ orderIdNo: resp.orderIdNo });
          }),
          catchError((errResp) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      })
    );
  });
}
