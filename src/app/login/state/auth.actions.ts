import { createAction, props } from "@ngrx/store";
import { IAuthError, ILoginPayload, IUser } from "src/app/models/Auth.model";

export const LOGIN_START = '[Login Page] Login Start';
export const LOGIN_SUCCESS = '[Login Page] Login Success';
export const LOGIN_FAIL = '[Login Page] Login Fail';
export const AUTO_LOGIN_ACTION = '[Auth Page] Auto Login';
export const LOGOUT_ACTION = '[Auth Page] Logout';
export const REVOKE_TOKEN_START = '[Auth Page] Revoke Token Start';
export const REVOKE_TOKEN_SUCCESS = '[Auth Page] Revoke Token Success';

export const login = createAction(LOGIN_START, props<{ payload: ILoginPayload }>());
export const loginFail = createAction(LOGIN_FAIL, props<{ authError: IAuthError | null }>());
export const loginSuccess = createAction(LOGIN_SUCCESS, props<{ user: IUser | null; redirect: boolean }>());
export const autoLogin = createAction(AUTO_LOGIN_ACTION);
export const logout = createAction(LOGOUT_ACTION);
export const revokeTokenStart = createAction(REVOKE_TOKEN_START, props<{refreshToken: string}>());
export const revokeTokenSuccess = createAction(REVOKE_TOKEN_SUCCESS, props<{ user: IUser }>());


export const VERIFY_EMAIL_LINK_SEND = '[Reset Password Page] Verify Email Link Send';
export const VERIFY_EMAIL_LINK_SUCCESS = '[Reset Password Page] Verify Email Link Success';

export const verifyEmailLinkSend = createAction(VERIFY_EMAIL_LINK_SEND, props<{ email: string, recaptchaToken: string }>());
export const verifyEmailLinkSuccess = createAction(VERIFY_EMAIL_LINK_SEND, props<{ showSnackbar: boolean }>());
export const RESET_PASSWORD_START = '[Reset Password Page] Reset Password Start';
export const RESET_PASSWORD_SUCCESS = '[Reset Password Page] Reset Password Success';

export const resetPasswordStart = createAction(RESET_PASSWORD_START, props<{ newPassword: string; oobCode: string, recaptchaToken: string }>());
export const resetPasswordSuccess = createAction(RESET_PASSWORD_SUCCESS, props<{ redirect: boolean }>());
