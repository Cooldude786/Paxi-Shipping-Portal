export interface IProfile {
  uid: string;
  profileGuid?: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  validatedMSISDN?: string;
  idType: string;
  idNumber?: string;
  passportNumber?: string;
  country: string;
  marketingConsent: string;
}

export interface IProfileCreateDTO {
  uid: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  idType: string;
  idNumber?: string;
  passportNumber?: string;
  country: string;
  marketingConsent: string;
}

export interface IProfileCreateSuccess {
  profileGuid: string;
}
