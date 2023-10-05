import { IParcelHistoryPayload,IParcelHistorySucess } from 'src/app/models/Parcel.model';

export interface IParcelHistoryState{
  parcelHistoryPayload:IParcelHistoryPayload;
  parcelDetail: IParcelHistorySucess[] | null;
}

export const initialState: IParcelHistoryState = {
  parcelHistoryPayload: {
    parcelIdNo: 0,
    customerVisibleOnly: 'Y'
  },
  parcelDetail: null,
}
