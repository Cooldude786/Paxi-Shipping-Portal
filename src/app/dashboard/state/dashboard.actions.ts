import { createAction, props } from '@ngrx/store';
import { IParcelPayload,IParcelListSucess } from '../../models/Parcel.model';

export const DASHBOARD_PAGE_INITIATE = '[Dashboard Page] Dashboard Page Initiate';

export const DASHBOARD_PAGE_SUCCESS = '[Dashboard Page] Dashboard Page Success';

export const DASHBOARD_PAGE_SEARCH_INITIATE = '[Dashboard Page] Dashboard Page Search Initiate';

export const DASHBOARD_PAGE_SEARCH_SUCCESS = '[Dashboard Page] Dashboard Page Search Success';

export const DASHBOARD_PAGE_GROUP_FILTER_INITIATE = '[Dashboard Page] Dashboard Page Group Filter Initiate';

export const DASHBOARD_PAGE_GROUP_FILTER_SUCCESS = '[Dashboard Page] Dashboard Page Group Filter Success';

export const DASHBOARD_PAGE_SCROLL_INITIATE = '[Dashboard Page] Dashboard Page Scroll Initiate';

export const DASHBOARD_PAGE_SCROLL_SUCCESS = '[Dashboard Page] Dashboard Page Scroll Success';

export const RESET_DATA_ON_LOGOUT = '[Dashboard Page] Reset data on logout';

export const dashboardPageInitiate = createAction(
  DASHBOARD_PAGE_INITIATE,
  props<{ payload: IParcelPayload }>()
);
export const dashboardPageSuccess = createAction(
  DASHBOARD_PAGE_SUCCESS,
  props<{ result: IParcelListSucess }>()
);
export const dashboardPageSearchInitiate = createAction(
  DASHBOARD_PAGE_SEARCH_INITIATE,
  props<{ payload: IParcelPayload }>()
);
export const dashboardPageSearchSuccess = createAction(
  DASHBOARD_PAGE_SEARCH_SUCCESS,
  props<{ result: IParcelListSucess }>()
);
export const dashboardPageFilterInitiate = createAction(
  DASHBOARD_PAGE_GROUP_FILTER_INITIATE,
  props<{ payload: IParcelPayload }>()
);
export const dashboardPageFilterSuccess = createAction(
  DASHBOARD_PAGE_GROUP_FILTER_SUCCESS,
  props<{ result: IParcelListSucess }>()
);
export const dashboardPageScrollInitiate = createAction(
  DASHBOARD_PAGE_SCROLL_INITIATE,
  props<{ payload: IParcelPayload }>()
);
export const dashboardPageScrollSuccess = createAction(
  DASHBOARD_PAGE_SCROLL_SUCCESS,
  props<{ result: IParcelListSucess }>()
);
export const resetDashboardPayload = createAction(
  RESET_DATA_ON_LOGOUT,
);
