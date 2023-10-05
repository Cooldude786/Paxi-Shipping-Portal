import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  parcelHistoryPageInitiate,
  parcelHistoryPageSuccess
} from './parcel_history.actions';
import { setErrorMessage, setLoadingSpinner} from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { HelperService } from 'src/app/services/helper.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { catchError, exhaustMap, first, map, of, take } from 'rxjs';

@Injectable()
export class ParcelHistoryEffect{
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _helperService: HelperService,
    private _dashboardService: DashboardService
  ){}
  parcelHistoryPageInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(parcelHistoryPageInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._dashboardService.fetchParcelDetail().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return parcelHistoryPageSuccess({ parcelDetail: resp });
          }),
          catchError((errResp: { error: any; }) => {
            this._store.dispatch(setLoadingSpinner({ status: false }));
            const error = this._helperService.formatError(errResp.error);
            return of(setErrorMessage({ message: error }));
          })
        );
      }),
    );
  });
  parcelHistoryPageSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(parcelHistoryPageSuccess),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );
}
