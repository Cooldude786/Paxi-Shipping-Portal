import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IParcelHistoryState } from './parcel_history.state';

export const PARCEL_HISTORY_STATE_NAME = 'parcelhistory';

const getParcelHistorydState = createFeatureSelector<IParcelHistoryState>(
  PARCEL_HISTORY_STATE_NAME
);
export const getParcelIDNo = createSelector(getParcelHistorydState, (state) => {
  return state.parcelHistoryPayload.parcelIdNo;
});

export const getParcelHistoryResult = createSelector(getParcelHistorydState , (state) => {
  return state.parcelDetail ? state.parcelDetail : null;
});
