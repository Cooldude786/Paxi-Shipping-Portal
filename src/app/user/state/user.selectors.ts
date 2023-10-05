import { createFeatureSelector, createSelector } from "@ngrx/store";
import IUserModuleSate from "./user.state";

export const USER_STATE_NAME = 'user module';

const getUserModuleState = createFeatureSelector<IUserModuleSate>(USER_STATE_NAME);

export const getMobile = createSelector(getUserModuleState, (state) => {
  return state.guidRes ? state.guidRes.contactNumber : '';
})

export const getSaId = createSelector(getUserModuleState, (state) => {
  return state.guidRes && state.guidRes.idNumber ? state.guidRes.idNumber : '';
})

export const getPassportNumber = createSelector(getUserModuleState, (state) => {
  return state.guidRes && state.guidRes.passportNumber ? state.guidRes.passportNumber : '';
})

export const getFullName = createSelector(getUserModuleState, (state) => {
  return state.guidRes ? `${state.guidRes.firstName} ${state.guidRes.lastName}` : '';
})

export const getUpdatePasswordError = createSelector(getUserModuleState, (state) => {
  return state.updatePasswordError;
})

export const getUserProfileData = createSelector(getUserModuleState, (state) => {
  return state.guidRes;
})

export const getNewMobile = createSelector(getUserModuleState, (state) => {
  return state.newMobile;
})

export const getSession = createSelector(getUserModuleState, (state) => {
  return state.sessionId;
});

export const getMobileValidationError = createSelector(getUserModuleState, (state) => {
  return state.newMobileValidateErr;
});

export const getSMSSession = createSelector(getUserModuleState, (state) => {
  return state.smsSessionId;
});

export const getValidationError = createSelector(getUserModuleState, (state) => {
  return state.validationError;
});

export const getProfileCreatePayload = createSelector(getUserModuleState, (state) => {
  return state.personal;
});


export const getUid = createSelector(getUserModuleState, (state) => {
  return state.personal ? state.personal.uid : null;
});

export const isUid = createSelector(getUserModuleState, (state) => {
  return state.personal?.uid ? true : false;
})
