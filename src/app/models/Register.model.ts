export interface IRegister {
  email: string,
  password: string,
  accountType: string,
  recaptchaToken?: string,
  validEmail: boolean
}

export interface IRegisterSuccess {
  uid: string;
}
