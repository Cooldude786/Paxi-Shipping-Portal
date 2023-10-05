import { IParcelPayload,IParcelListSucess } from 'src/app/models/Parcel.model';

export interface IDashboardState{
  dashboardPayload:IParcelPayload | null;
  result: IParcelListSucess | null;
}

export const initialState: IDashboardState = {
  dashboardPayload: {
    searchTerm: '',
    statusGroup: null,
  },
  result: null,
}
