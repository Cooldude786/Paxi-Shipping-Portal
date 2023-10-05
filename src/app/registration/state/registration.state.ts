import { IRegister } from 'src/app/models/Register.model';

export interface IRegistrationState {
  sessionId: string;
  validationError: string;
  registerPayload: IRegister;
}

export const initialState: IRegistrationState = {
  sessionId: '',
  validationError: '',
  registerPayload: {
    email: '',
    password: '',
    accountType: '',
    recaptchaToken: 'not-used-for-now',
    validEmail: false,
  }
};
