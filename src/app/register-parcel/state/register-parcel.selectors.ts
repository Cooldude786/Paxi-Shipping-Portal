import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IRegisterParcelState } from './register-parcel.state';

export const REGISTER_PARCEL_STATE_NAME = 'register-parcel';

const getParcelRegisterState = createFeatureSelector<IRegisterParcelState>(
    REGISTER_PARCEL_STATE_NAME
);
export const getParcelPayload = createSelector(getParcelRegisterState, (state) => {
    return state.parcelPayload;
});
export const getLocationData = createSelector(getParcelRegisterState , (state) => {
    return state.destination ? state.destination : [];
});