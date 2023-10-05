import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IRegistrationState } from './registration.state';

export const REGISTRATION_STATE_NAME = 'register';

const getRegisterState = createFeatureSelector<IRegistrationState>(
  REGISTRATION_STATE_NAME
);

export const getAccountType = createSelector(getRegisterState, (state) => {
  return state.registerPayload?.accountType;
});

export const getEmail = createSelector(getRegisterState, (state) => {
  return state.registerPayload?.email;
});

export const getSession = createSelector(getRegisterState, (state) => {
  return state.sessionId;
});

export const getValidationError = createSelector(getRegisterState, (state) => {
  return state.validationError;
});

export const getPayload = createSelector(getRegisterState, (state) => {
  return state.registerPayload;
});

export const getRegisterPayload = createSelector(getRegisterState, (state) => {
  return state.registerPayload;
})


