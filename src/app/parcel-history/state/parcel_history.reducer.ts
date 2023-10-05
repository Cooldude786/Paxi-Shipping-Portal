import { createReducer, on } from '@ngrx/store';
import { initialState } from './parcel_history.state';
import {
  parcelHistoryPageInitiate,parcelHistoryPageSuccess
} from './parcel_history.actions';

export const parcelHistoryReducer = createReducer(
  initialState,
  on(parcelHistoryPageInitiate, (state,action) => {
    return {
      ...state,
      parcelHistoryPayload:action.payload
    }
  }),
  on(parcelHistoryPageSuccess, (state,action) => {
    return {
      ...state,
      parcelDetail: action.parcelDetail
    };
  }),
);
