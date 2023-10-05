import { IAuthError, ILoginPayload, IUser } from "src/app/models/Auth.model";

export interface IAuthState {
  payload: ILoginPayload;
  authError: IAuthError | null;
  user: IUser | null;
}

export const initialState: IAuthState = {
  payload: {
    email: '',
    password: '',
    recaptchaToken: '',
  },
  authError: null,
  user: null,
}
