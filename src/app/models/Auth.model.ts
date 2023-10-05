export interface ILoginPayload {
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface IAuthError {
  message: string;
  type: string;
}

export interface ILoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: Date;
  user: {
    uid: string;
    oneProfileGuid: string;
    emailValidated: boolean;
    cellphoneValidated: boolean;
    shipperAccounts: [{
      shipperId: number;
      role: string;
    }]
    email: string;
  }
}

export class IUser {
  constructor(
    private idToken: string,
    private refreshToken: string,
    private expiresIn: Date,
    private user: {
      uid: string;
      oneProfileGuid: string;
      emailValidated: boolean;
      cellphoneValidated: boolean;
      shipperAccounts: [{
        shipperId: number;
        role: string;
      }]
      email: string;
    },
  ) { }

  get expireDate() {
    return this.expiresIn;
  }

  get userToken() {
    const todaysDate = new Date().getTime();
    const timeInterval = this.expiresIn.getTime() - todaysDate;
    if (timeInterval <= 0) {
      return null;
    }
    return this.idToken;
  }

  get guid() {
    return this.user.oneProfileGuid;
  }

  get email() {
    return this.user.email;
  }

  get shipperId() {
    return this.user.shipperAccounts[0].shipperId;
  }

  get uid() {
    return this.user.uid;
  }

  get userRefreshToken() {
    return this.refreshToken;
  }
}
