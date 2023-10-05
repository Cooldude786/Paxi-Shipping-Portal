import { IRegisterParcel, MapLocation } from 'src/app/models/RegisterParcel.model';

export interface IRegisterParcelState {
  validationError: string;
  parcelPayload: IRegisterParcel;
  destination: MapLocation[];
}

export const initialState: IRegisterParcelState = {
  validationError: '',
  parcelPayload: {
    shipperIdNo:0,
    orderNumber:'',
    parcelType: '',
    receiverNameSurname: '',
    receiverCell: '',
    description: '',
    destinationNodeCode:'',
    parcelNumber:'',
    orderSourceIdNo:1
  },
  destination:[]
};