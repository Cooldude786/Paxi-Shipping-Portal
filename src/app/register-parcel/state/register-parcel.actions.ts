import { createAction, props } from '@ngrx/store';
import { IRegisterParcel,MapLocation } from '../../models/RegisterParcel.model';
export const REGISTRATION_PARCEL_FORM_INITIATE =
  '[Parcel Registration Page] Register Parcel Form Initiate';
export const REGISTRATION_PARCEL_FORM_SUCCESS =
  '[Parcel Registration Page] Register Parcel Form Success';
export const PARCEL_NUMBER_FORM_INITIATE =
  '[Parcel Number Page] Parcel Number Form Initiate';
export const PARCEL_NUMBER_FORM_SUCCESS =
  '[Parcel Number Page] Parcel Number Form Success';
export const PHONE_VALIDATION_START =
  '[Register Parcel Phone Validation Start] Register Parcel Phone Validation';
export const PHONE_VALIDATION_SUCESS =
  '[Register Parcel Phone Validation Sucess] Register Parcel Phone Validation Sucess';
export const PHONE_VALIDATION_FAIL =
  '[Register Parcel Phone Validation Fail] Register Parcel Phone Validation Fail';
export const CREATE_ORDER =
  '[Register Parcel Save For Later] Create Order Start';
export const CREATE_ORDER_SUCESS =
  '[Register Parcel Save For Later] Create Order Success';
export const UPDATE_ORDER =
  '[Register Parcel Save For Later] Update Order Start';

export const LOAD_LOCATION = '[Register Parcel Page] Load location';
export const LOAD_LOCATION_SUCCESS = '[Register Parcel Page] Load location Sucess';

export const REGISTRATION_PARCEL_SUCCESS = '[Parcel Register Page] Registration Success';

export const REGISTER_PARCEL_REHYDRATE = '[Parcel Number Page] Parcel Number Rehydrate';

export const PRE_REGISTRATION_START = '[Parcel Number Page] Pre-Registration Start';
export const PRE_REGISTRATION_SUCCESS = '[Parcel Number Page] Pre-Registration Success';

export const registerParcelFormRehydrate = createAction(REGISTER_PARCEL_REHYDRATE);

export const registerParcelFormInitiate = createAction(
  REGISTRATION_PARCEL_FORM_INITIATE,
  props<{ payload: IRegisterParcel }>()
);
export const registerParcelFormSuccess = createAction(
  REGISTRATION_PARCEL_FORM_SUCCESS,
  props<{ payload: IRegisterParcel, redirect: boolean }>()
);
export const parcelNumberFormInitiate = createAction(
  PARCEL_NUMBER_FORM_INITIATE,
  props<{ payload: IRegisterParcel }>()
);
export const parcelNumberFormSuccess = createAction(
  PARCEL_NUMBER_FORM_SUCCESS,
  props<{ payload: IRegisterParcel }>()
);
export const phoneVaidationStart = createAction(
  PHONE_VALIDATION_START,
  props<{ phone: number }>()
);
export const phoneVaidationSuccess = createAction(
  PHONE_VALIDATION_SUCESS
);
export const phoneVaidationFail = createAction(
  PHONE_VALIDATION_FAIL,
  props<{ validationErr: string }>()
);
export const createOrder = createAction(
  CREATE_ORDER
);
export const createOrderSucess = createAction(
  CREATE_ORDER_SUCESS,
  props<{ orderIdNo: number }>()
);

export const loadLocation = createAction(
  LOAD_LOCATION
);
export const loadLocationSucess = createAction(
  LOAD_LOCATION_SUCCESS,
  props<{ destination: MapLocation[]}>()
);

export const preRegisterStart = createAction(
  PRE_REGISTRATION_START,
  props<{ parcelNo: string }>()
);

export const preRegisterSuccess = createAction(
  PRE_REGISTRATION_SUCCESS
);

export const updateOrder = createAction(
  UPDATE_ORDER
);
