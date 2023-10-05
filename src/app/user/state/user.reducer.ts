import { createReducer, on } from "@ngrx/store";
import { initialState } from "./user.state";
import { getUserDetailsSuccess, profileRegistrationFormSave, profileRegistrationSuccess, smsValidationFail, smsValidationSessionActive, smsValidationSessionSuccess, updatePasswordFail, updateProfileSaveState, verifyMobileFail, verifyMobileSessionActive, verifyMobileSessionSuccess,resetUserPayload } from "./user.actions";

export const userModuleReducer = createReducer(
  initialState,
  on(getUserDetailsSuccess, (state, action) => {
    return {
      ...state,
      guidRes: action.guidRes,
    }
  }),
  on(updatePasswordFail, (state, action) => {
    return {
      ...state,
      updatePasswordError: action.updatePasswordError,
    }
  }),
  on(updateProfileSaveState, (state, action) => {
    return {
      ...state,
      newMobile: action.newMobile,
    }
  }),
  on(verifyMobileSessionSuccess, (state, action) => {
    return {
      ...state,
      sessionId: action.sessionId,
    }
  }),
  on(verifyMobileSessionActive, (state, action) => {
    return {
      ...state,
      sessionId: action.sessionId,
    }
  }),
  on(verifyMobileFail, (state, action) => {
    return {
      ...state,
      newMobileValidateErr: action.validationErr,
    }
  }),

  on(resetUserPayload, (state) => {
    return {
      ...state,
      guidRes:null,
    }
  }),

  ////////////////////////////////////
  // Create Profile
  on(profileRegistrationFormSave, (state, action) => {
    return {
      ...state,
      personal: action.payload,
    };
  }),
  on(smsValidationSessionSuccess, (state, action) => {
    return {
      ...state,
      smsSessionId: action.sessionId,
    };
  }),
  on(smsValidationSessionActive, (state, action) => {
    return {
      ...state,
      smsSessionId: action.sessionId,
    };
  }),
  on(smsValidationFail, (state, action) => {
    return {
      ...state,
      validationError: action.validationErr,
    };
  }),
  on(profileRegistrationSuccess, (state, action) => {
    return {
      ...state,
      profileGuid: action.profileGuid
    };
  }),
)
