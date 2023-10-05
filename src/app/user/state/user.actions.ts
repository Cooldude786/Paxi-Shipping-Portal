import { createAction, props } from "@ngrx/store";
import { IProfileCreateDTO } from "src/app/models/Profile.model";
import IGetByGuidRes, { IUpdateProfileDetailsPayload } from "src/app/models/userModule.model";

export const GET_USER_DETAILS_START = '[Account Details] Get User Details Start';
export const GET_USER_DETAILS_SUCCESS = '[Account Details] Get User Details Success';
export const GET_USER_DETAILS_FAIL = '[Account Details] Get User Details Fail';

export const getUserDetailsStart = createAction(GET_USER_DETAILS_START);
export const getUserDetailsSuccess = createAction(GET_USER_DETAILS_SUCCESS, props<{ guidRes: IGetByGuidRes }>());
export const getUserDetailsFail = createAction(GET_USER_DETAILS_FAIL);

export const UPDATE_PASSWORD_START = '[Update Password] Update Password Start';
export const UPDATE_PASSWORD_SUCCESS = '[Update Password] Update Password Success';
export const UPDATE_PASSWORD_FAIL = '[Update Password] Update Password Fail';

export const updatePasswordStart = createAction(UPDATE_PASSWORD_START, props<{ oldPassword: string; newPassword: string }>());
export const updatePasswordSuccess = createAction(UPDATE_PASSWORD_SUCCESS);
export const updatePasswordFail = createAction(UPDATE_PASSWORD_FAIL, props<{ updatePasswordError: string | null }>());

export const UPDATE_PROFILE_START = '[Update Profile Page] Update Profile Start';
export const UPDATE_PROFILE_SUCCESS = '[Update Profile Page] Update Profile Success';

export const updateProfileStart = createAction(UPDATE_PROFILE_START, props<{ payload: IUpdateProfileDetailsPayload, isMobileNew: boolean , newMobile?: string}>());
export const updateProfileSuccess = createAction(UPDATE_PROFILE_SUCCESS, props<{ redirect: boolean }>());

export const UPDATE_PROFILE_SAVE_STATE = '[Update Profile Page] Update Profile Save State';
export const REHYDRATE_PROFILE_SAVE_STATE = '[Update Profile Page] Rehydrate Profile Save State';

export const updateProfileSaveState = createAction(UPDATE_PROFILE_SAVE_STATE, props<{ newMobile: string, redirect: boolean }>());
export const rehydrateProfileSaveState = createAction(REHYDRATE_PROFILE_SAVE_STATE);

export const VERIFY_MOBILE_SESSION_START = '[Verify Mobile Page] Verify Mobile Session Start';
export const VERIFY_MOBILE_SESSION_SUCCESS = '[Verify Mobile Page] Verify Mobile Session Success';
export const VERIFY_MOBILE_SESSION_ACTIVE = '[Verify Mobile Page] Verify Mobile Session Active';

export const RESET_DATA_ON_LOGOUT = '[User] Reset data on logout';

export const verifyMobileSessionStart = createAction(
  VERIFY_MOBILE_SESSION_START,
  props<{ sms: string; commsType: string }>()
);
export const verifyMobileSessionSuccess = createAction(
  VERIFY_MOBILE_SESSION_SUCCESS,
  props<{ sessionId: string }>()
);
export const verifyMobileSessionActive = createAction(
  VERIFY_MOBILE_SESSION_ACTIVE,
  props<{ sessionId: string }>()
);

export const VERIFY_MOBILE_RESEND = '[Verify Mobile Page] Verify Mobile Resend';
export const VERIFY_MOBILE_RESEND_SUCCESS = '[Verify Mobile Page] Verify Mobile Resend Success';

export const verifyMobileResend = createAction(
  VERIFY_MOBILE_RESEND,
  props<{ sessionId: string }>()
);
export const verifyMobileResendSuccess = createAction(
  VERIFY_MOBILE_RESEND_SUCCESS
);

export const VERIFY_MOBILE_START = '[Verify Mobile Page] Verify Mobile Start';
export const VERIFY_MOBILE_SUCCESS = '[Verify Mobile Page] Verify Mobile Success';
export const VERIFY_MOBILE_FAIL = '[Verify Mobile Page] Verify Mobile Fail';

export const verifyMobileStart = createAction(
  VERIFY_MOBILE_START,
  props<{ sessionId: string; pin: string }>()
);
export const verifyMobileSuccess = createAction(
  VERIFY_MOBILE_SUCCESS
);
export const verifyMobileFail = createAction(
  VERIFY_MOBILE_FAIL,
  props<{ validationErr: string }>()
);

export const resetUserPayload = createAction(
  RESET_DATA_ON_LOGOUT,
);

//////////////////////////////////////////////////////////////////////////////
// Create Profile Details actions start



export const PROFILE_REGISTRATION_FORM_SUBMITED = '[Profile Registration Page] Profile Registration Submitted';
export const PROFILE_REGISTRATION_FORM_SAVE = '[Profile Registration Page] Profile Registration Save';

export const CONTACT_NUMBER_VALIDATION_SESSION_START = '[Profile Registration Page] SMS Validation Session Start';
export const SMS_VALIDATION_SESSION_SUCCESS = '[Profile Registration Page] SMS Validation Session Success';
export const SMS_VALIDATION_SESSION_ACTIVE = '[Profile Registration Page] SMS Validation Session Active';
export const SMS_VALIDATION_RESEND = '[Profile Registration Page] SMS Validation Resend';
export const SMS_VALIDATION_RESEND_SUCCESS = '[Profile Registration Page] SMS Validation Resend Success';
export const SMS_VALIDATION_VERIFY = '[Profile Registration Page] SMS Validation Verify';
export const SMS_VALIDATION_SUCCESS = '[Profile Registration Page] SMS Validation Success';
export const SMS_VALIDATION_FAIL = '[Profile Registration Page] SMS Validation Fail';

export const PROFILE_REGISTRATION_SUCCESS = '[Profile Registration Page] Profile Registration Success';


export const profileRegistrationFormSubmited = createAction(PROFILE_REGISTRATION_FORM_SUBMITED, props<{ payload: IProfileCreateDTO }>());
export const profileRegistrationFormSave = createAction(PROFILE_REGISTRATION_FORM_SAVE, props<{ payload: IProfileCreateDTO; redirect: boolean }>());

export const contactNumberValidationSessionStart = createAction(CONTACT_NUMBER_VALIDATION_SESSION_START, props<{ sms: string; commsType: string }>());
export const smsValidationSessionSuccess = createAction(SMS_VALIDATION_SESSION_SUCCESS, props<{ sessionId: string }>());
export const smsValidationSessionActive = createAction(SMS_VALIDATION_SESSION_ACTIVE, props<{ sessionId: string }>());
export const smsValidationResend = createAction(SMS_VALIDATION_RESEND, props<{ sessionId: string }>());
export const smsValidationResendSuccess = createAction(SMS_VALIDATION_RESEND_SUCCESS);
export const smsValidationVerify = createAction(SMS_VALIDATION_VERIFY, props<{ sessionId: string; pin: string }>());
export const smsValidationSuccess = createAction(SMS_VALIDATION_SUCCESS);
export const smsValidationFail = createAction(SMS_VALIDATION_FAIL, props<{ validationErr: string }>());

export const profileRegistrationSuccess = createAction(PROFILE_REGISTRATION_SUCCESS, props<{ profileGuid: string }>());


export const REHYDRATE_PROFILE_UID = '[Registration Page] Rehydrate Profile Uid';
export const rehydrateProfileUid = createAction(REHYDRATE_PROFILE_UID)

export const REHYDRATE_PROFILE_PAYLOAD = '[Registration Page] Rehydrate Profile Payload';
export const rehydrateProfilePayload = createAction(REHYDRATE_PROFILE_PAYLOAD)
