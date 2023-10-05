import { createAction, props } from '@ngrx/store';
import { IRegister } from 'src/app/models/Register.model';

export const REGISTRATION_TYPE_INITIATE = '[Registration Page] Registration Type Initiate';
export const REGISTRATION_TYPE_SUCCESS = '[Registration Page] Registration Type Success';
export const REGISTRATION_FORM_INITIATE = '[Registration Page] Registration Form Initiate';
export const REGISTRATION_FORM_SUCCESS = '[Registration Page] Registration Form Success';

export const EMAIL_VALIDATION_SESSION_START = '[Registration Page] Email Validation Session Start';
export const EMAIL_VALIDATION_SESSION_SUCCESS = '[Registration Page] Email Validation Session Success';
export const EMAIL_VALIDATION_SESSION_ACTIVE = '[Registration Page] Email Validation Session Active';
export const EMAIL_VALIDATION_RESEND = '[Registration Page] Email Validation Resend';
export const EMAIL_VALIDATION_RESEND_SUCCESS = '[Registration Page] Email Validation Resend Success';
export const EMAIL_VALIDATION_VERIFY = '[Registration Page] Email Validation Verify';
export const EMAIL_VALIDATION_SUCCESS = '[Registration Page] Email Validation Success';
export const EMAIL_VALIDATION_FAIL = '[Registration Page] Email Validation Fail';

export const REGISTRATION_SUCCESS = '[Registration Page] Registration Success';


export const registrationTypeInitiate = createAction(REGISTRATION_TYPE_INITIATE, props<{ payload: IRegister }>());
export const registrationTypeSuccess = createAction(REGISTRATION_TYPE_SUCCESS, props<{ payload: IRegister; redirect: boolean }>());
export const registrationFormInitiate = createAction(REGISTRATION_FORM_INITIATE, props<{ payload: IRegister }>());
export const registrationFormSuccess = createAction(REGISTRATION_FORM_SUCCESS, props<{ payload: IRegister, redirect: boolean }>());

export const emailValidationSessionStart = createAction(EMAIL_VALIDATION_SESSION_START, props<{ email: string; commsType: string }>());
export const emailValidationSessionSuccess = createAction(EMAIL_VALIDATION_SESSION_SUCCESS, props<{ sessionId: string }>());
export const emailValidationSessionActive = createAction(EMAIL_VALIDATION_SESSION_ACTIVE, props<{ sessionId: string }>());
export const emailValidationResend = createAction(EMAIL_VALIDATION_RESEND, props<{ sessionId: string }>());
export const emailValidationResendSuccess = createAction(EMAIL_VALIDATION_RESEND_SUCCESS);
export const emailValidationVerify = createAction(EMAIL_VALIDATION_VERIFY, props<{ sessionId: string; pin: string }>());
export const emailValidationSuccess = createAction(EMAIL_VALIDATION_SUCCESS, props<{ payload: IRegister }>());
export const emailValidationFail = createAction(EMAIL_VALIDATION_FAIL, props<{ validationErr: string }>());

// export const registrationSuccess = createAction(REGISTRATION_SUCCESS, props<{ uid: string, redirect: boolean }>());
export const registrationSuccess = createAction(REGISTRATION_SUCCESS, props<{ redirect: boolean }>());

export const REHYDRATE_REGISTRATION_INITTIATE_DATA = '[Registration Page] Rehydrate Registration Initiate Data';
export const rehydrateRegistrationInitiateData = createAction(REHYDRATE_REGISTRATION_INITTIATE_DATA)

export const REHYDRATE_REGISTRATION_FORM_DATA = '[Registration Page] Rehydrate Registration Form Data';
export const rehydrateRegistrationFormData = createAction(REHYDRATE_REGISTRATION_FORM_DATA)



