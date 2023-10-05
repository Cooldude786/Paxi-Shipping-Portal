import { createAction, props } from '@ngrx/store';
import { IParcelHistoryPayload,IParcelHistorySucess } from '../../models/Parcel.model';

export const PARCEL_HISTORY_PAGE_INITIATE = '[Parcel History Page] Parcel History Page Initiate';

export const PARCEL_HISTORY_PAGE_SUCCESS = '[Parcel History Page] Parcel History Page Success';

export const parcelHistoryPageInitiate = createAction(
  PARCEL_HISTORY_PAGE_INITIATE,
  props<{ payload: IParcelHistoryPayload }>()
);
export const parcelHistoryPageSuccess = createAction(
  PARCEL_HISTORY_PAGE_SUCCESS,
  props<{ parcelDetail: IParcelHistorySucess[] }>()
);
