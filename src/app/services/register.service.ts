import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { IRegister, IRegisterSuccess } from '../models/Register.model';
import { Observable, Subscription } from 'rxjs';
import { IAppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { getPayload } from '../registration/state/registration.selectors';
import { IProfile, IProfileCreateSuccess } from '../models/Profile.model';
import { environment } from 'src/environments/environment';
import { getProfileCreatePayload } from '../user/state/user.selectors';

interface IotpSessionResponse {
  sessionId: string;
}

interface IotpResendResponse {
  status: string;
  message: string;
}

interface IotpVerify {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService implements OnInit, OnDestroy {
  validEmailSubs: Subscription = new Subscription();
  payloadSubs: Subscription = new Subscription();

  constructor(
    private _httpClient: HttpClient,
    private _store: Store<IAppState>
  ) { }

  ngOnInit(): void { }

  otpSessionRequest(
    recipient: string,
    commsType: string
  ): Observable<IotpSessionResponse> {
    const payload = {
      recipient: recipient,
      consumer: 'paxi-shipper-portal',
      commsType: commsType,
    };

    return this._httpClient.post<IotpSessionResponse>(
      `${environment.apiUrl}/otp/session`,
      payload
    );
  }

  otpResendRequest(sessionId: string): Observable<IotpResendResponse> {
    return this._httpClient.get<IotpResendResponse>(
      `${environment.apiUrl}/otp/session/${sessionId}/resend`
    );
  }

  otpVerify(sessionId: string, pin: string): Observable<IotpVerify> {
    const payload = {
      pin: pin,
    };
    return this._httpClient.post<IotpVerify>(
      `${environment.verifyURL}/otp/session/${sessionId}/verify`,
      payload
    );
  }

  register(): Observable<IRegisterSuccess> {
    let payload: IRegister = {
      email: '',
      password: '',
      accountType: '',
      recaptchaToken: '',
      validEmail: false,
    };
    this.payloadSubs = this._store.select(getPayload).subscribe((data) => {
      payload = {
        email: data.email,
        password: data.password,
        accountType: data.accountType,
        recaptchaToken: data.recaptchaToken,
        validEmail: data.validEmail
      };
    });

    return this._httpClient.post<IRegisterSuccess>(
      `${environment.apiUrl}/user/register`,
      payload
    );
  }

  registerProfile(): Observable<IProfileCreateSuccess> {
    let payload: IProfile = {
      uid: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      validatedMSISDN: '',
      idType: '',
      country: '',
      marketingConsent: '',
    };

    this.payloadSubs = this._store.select(getProfileCreatePayload).subscribe((data) => {
      if (!data) {
        return;
      }
      payload = {
        uid: data.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
        validatedMSISDN: data.contactNumber,
        idType: data.idType,
        country: data.country,
        marketingConsent: data.marketingConsent,
      };
      if (data.idType === 'I') {
        payload['idNumber'] = data.idNumber
      } else {
        payload['passportNumber'] = data.passportNumber
      }
    });

    return this._httpClient.post<IProfileCreateSuccess>(
      `${environment.apiUrl}/user/profile`,
      payload
    );
  }

  setRegisterDataInLocalStorage(registerData: IRegister) {
    localStorage.setItem('registerData', JSON.stringify(registerData));
  }

  getRegisterDataFromLocalStorage() {
    const registerDataString = localStorage.getItem('registerData');
    if (registerDataString) {
      const userData: IRegister = JSON.parse(registerDataString);
      return userData;
    }
    return {
      email: '',
      password: '',
      accountType: '',
      recaptchaToken: 'not-used-for-now',
      validEmail: false
    };
  }

  removeRegisterDataFromLocalStorage() {
    localStorage.removeItem('registerData');
  }

  setPersonalDataInLocalStorage(PersonalData: IProfile) {
    localStorage.setItem('personalData', JSON.stringify(PersonalData));
  }

  getPersonalDataFromLocalStorage() {
    const profileDataString = localStorage.getItem('personalData');
    if (profileDataString) {
      const profileData: IProfile = JSON.parse(profileDataString);
      return profileData;
    }
    return {
      uid: '',
      profileGuid: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      validatedMSISDN: '',
      idType: '',
      idNumber: '',
      country: '',
      marketingConsent: '',
    }
  }

  removePersonalDataFromLocalStorage() {
    localStorage.removeItem('personalData');
  }

  ngOnDestroy(): void {
    this.payloadSubs.unsubscribe();
  }
}
