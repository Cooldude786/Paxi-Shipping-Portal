import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  dashboardPageInitiate,
  dashboardPageSuccess,
  dashboardPageSearchInitiate,
  dashboardPageSearchSuccess,
  dashboardPageFilterInitiate,
  dashboardPageFilterSuccess,
  dashboardPageScrollInitiate,
  dashboardPageScrollSuccess,
  resetDashboardPayload
} from './dashboard.actions';
import { setErrorMessage, setLoadingSpinner} from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { HelperService } from 'src/app/services/helper.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { catchError, exhaustMap, first, map, of, take } from 'rxjs';

@Injectable()
export class DashboardEffect{
  constructor(
    private action$: Actions,
    private _store: Store<IAppState>,
    private _helperService: HelperService,
    private _dashboardService: DashboardService
  ){}
  dashboardPageInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._dashboardService.dashboardOrderListing().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return dashboardPageSuccess({ result: resp });
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
  dashboardPageSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageSuccess),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );

  dashboardPageSearchInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageSearchInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._dashboardService.dashboardOrderListing().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return dashboardPageSearchSuccess({ result: resp });
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
  dashboardPageSearchSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageSearchSuccess),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );
  dashboardPageFilterInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageFilterInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._dashboardService.dashboardOrderListing().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return dashboardPageFilterSuccess({ result: resp });
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
  dashboardPageFilterSucess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageFilterSuccess),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );

  // Scroll
  dashboardPageScrollInitiate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageScrollInitiate),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: true }));
        return this._dashboardService.dashboardOrderListing1().pipe(
          map((resp) => {
            this._store.dispatch(setErrorMessage({ message: null }));
            return dashboardPageScrollSuccess({ result: resp });
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
  dashboardPageScrollSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(dashboardPageScrollSuccess),
      exhaustMap((action) => {
        this._store.dispatch(setLoadingSpinner({ status: false }));
        this._store.dispatch(setErrorMessage({ message: null }));
        return "";
      }),
    )
  },
  {dispatch:false}
  );

  resetDashboardPayload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(resetDashboardPayload),
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
