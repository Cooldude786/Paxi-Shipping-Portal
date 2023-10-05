import { createReducer, on } from '@ngrx/store';
import { initialState } from './registration.state';
import {
  registrationTypeSuccess,
  emailValidationSessionSuccess,
  registrationFormSuccess,
  emailValidationSessionActive,
  emailValidationFail,
  emailValidationSuccess,
} from './registration.actions';

export const registrationReducer = createReducer(
  initialState,
  on(registrationTypeSuccess, (state, action) => {
    return {
      ...state,
      registerPayload: { ...action.payload },
    };
  }),
  on(registrationFormSuccess, (state, action) => {
    return {
      ...state,
      registerPayload: { ...action.payload },
    };
  }),
  on(emailValidationSessionSuccess, (state, action) => {
    return {
      ...state,
      sessionId: action.sessionId,
    };
  }),

  on(emailValidationSessionActive, (state, action) => {
    return {
      ...state,
      sessionId: action.sessionId,
    };
  }),
  on(emailValidationSuccess, (state, action) => {
    return {
      ...state,
      registerPayload: action.payload,
    };
  }),
  on(emailValidationFail, (state, action) => {
    return {
      ...state,
      validationError: action.validationErr,
    };
  }),
);
