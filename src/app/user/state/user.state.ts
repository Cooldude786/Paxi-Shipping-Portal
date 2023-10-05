import { IProfile } from "src/app/models/Profile.model";

export default interface IUserModuleSate {
  guidRes: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    validatedMSISDN: string;
    idType: string;
    idNumber?: string;
    passportNumber?: string;
    country: string;
    marketingConsentPrompted: string;
    marketingConsent: string;
  } | null;
  updatePasswordError: string | null;
  newMobile?: string;
  sessionId?: string;
  newMobileValidateErr?: string;
  smsSessionId: string;
  validationError: string;
  personal?: IProfile;
  profileGuid: string;
}

export const initialState: IUserModuleSate = {
  guidRes: null,
  updatePasswordError: null,
  smsSessionId: '',
  validationError: '',
  profileGuid: ''
}
