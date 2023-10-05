import { createReducer, on } from '@ngrx/store';
import { initialState } from './dashboard.state';
import {
  dashboardPageSuccess,
  dashboardPageSearchInitiate,
  dashboardPageSearchSuccess,
  dashboardPageFilterInitiate,
  dashboardPageFilterSuccess,
  dashboardPageScrollInitiate,
  dashboardPageScrollSuccess,
  resetDashboardPayload
} from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialState,
  on(dashboardPageSuccess, (state,action) => {
    return {
      ...state,
      result: action.result
    };
  }),
  on(dashboardPageSearchInitiate, (state,action) => {
    return {
      ...state,
      dashboardPayload:action.payload
    }
  }),
  on(dashboardPageSearchSuccess, (state,action) => {
    return {
      ...state,
      result: action.result
    };
  }),
  on(dashboardPageFilterInitiate,(state,action) => {
    return {
      ...state,
      dashboardPayload:{...action.payload}
    }
  }),
  on(dashboardPageFilterSuccess, (state,action) => {
    return {
      ...state,
      result: action.result
    };
  }),
  on(dashboardPageScrollInitiate, (state,action) => {
    return {
      ...state,
      dashboardPayload:action.payload
    }
  }),
  on(dashboardPageScrollSuccess, (state,action) => {
    return {
      ...state,
      result: action.result
    }
  }),
  on(resetDashboardPayload, (state) => {
    return {
      ...state,
      dashboardPayload:null,
    }
  })
);
