export default interface IGetByGuidRes {
  firstName: string;
  lastName: string,
  contactNumber: string,
  validatedMSISDN: string;
  idType: string;
  idNumber: string;
  country: string;
  marketingConsentPrompted: string;
  marketingConsent: string;
}

export interface IUpdatePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordRes {
  uid: string;
}

export interface IUpdateProfileDetailsPayload {
  oneprofileGuid: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  marketingConsent: string;
}

export interface IUpdateProfileDetailsRes {
  profileGuid: string;
}
