import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IDashboardState } from './dashboard.state';

export const DASHBOARD_STATE_NAME = 'dashboard';

const getDashboardState = createFeatureSelector<IDashboardState>(
  DASHBOARD_STATE_NAME
);
export const getDashboardPayload = createSelector(getDashboardState, (state) => {
  return state.dashboardPayload;
});

export const getDashboardResult = createSelector(getDashboardState , (state) => {
  return state.result ? state.result : null;
});

export const getSearchText = createSelector(getDashboardState, (state) => {
  return state.dashboardPayload?.searchTerm;
});
export const getStatusGroup = createSelector(getDashboardState, (state) => {
  return state.dashboardPayload?.statusGroup;
});
