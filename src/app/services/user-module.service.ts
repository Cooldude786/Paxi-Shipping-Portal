import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { HttpClient } from '@angular/common/http';
import { getEmail, getGuid } from '../login/state/auth.selectors';
import { Observable, Subscription } from 'rxjs';
import IGetByUidRes, { IUpdatePasswordPayload, IUpdatePasswordRes, IUpdateProfileDetailsPayload, IUpdateProfileDetailsRes } from '../models/userModule.model';
import { environment } from 'src/environments/environment';
import { getNewMobile } from '../user/state/user.selectors';

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
  providedIn: 'root'
})
export class UserModuleService implements OnDestroy {
  uidSubs?: Subscription;
  mobileSubs?: Subscription;

  constructor(private _http: HttpClient, private _store: Store<IAppState>) { }

  getUserDetailsByUid(): Observable<IGetByUidRes> {
    let uid!: string | null;
    this._store.select(getGuid).subscribe((val) => {
      uid = val as string;
    })
    return this._http.get<IGetByUidRes>(`${environment.apiUrl}/user/profile/${uid}`);
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<IUpdatePasswordRes> {
    let email!: string;
    this._store.select(getEmail).subscribe((val) => {
      email = val
    })
    const payload: IUpdatePasswordPayload = {
      email: email,
      oldPassword,
      newPassword
    }

    return this._http.put<IUpdatePasswordRes>(`${environment.apiUrl}/user/password`, payload);
  }

  updateProfileDetails(payload: IUpdateProfileDetailsPayload): Observable<IUpdateProfileDetailsRes> {
    return this._http.put<IUpdateProfileDetailsRes>(`${environment.apiUrl}/user/profile`, payload);
  }

  setNewMobileInLocalStorage(mobile: string) {
    localStorage.setItem('newMobile', JSON.stringify(mobile));
  }

  getNewMobileInLocalStorage() {
    const mobileString = localStorage.getItem('newMobile');
    if (mobileString) {
      return String(JSON.parse(mobileString));
    }
    return null;
  }

  clearNewMobileInLocalStorage() {
    localStorage.removeItem('newMobile');
  }

  otpSessionRequest(recipient: string, commsType: string): Observable<IotpSessionResponse> {
    const payload = {
      recipient: recipient,
      consumer: 'paxi-shipper-portal',
      commsType: commsType,
    };
    return this._http.post<IotpSessionResponse>(`${environment.apiUrl}/otp/session`,payload);
  }

  otpResendRequest(sessionId: string): Observable<IotpResendResponse> {
    return this._http.get<IotpResendResponse>(`${environment.apiUrl}/otp/session/${sessionId}/resend`);
  }

  otpVerify(sessionId: string, pin: string): Observable<IotpVerify> {
    const payload = {
      pin: pin,
    };
    return this._http.post<IotpVerify>(`${environment.verifyURL}/otp/session/${sessionId}/verify`,payload);
  }

  updateMobile(): Observable<IUpdateProfileDetailsRes> {
    let uid = '';
    let mobile = '';
    const uidSubs = this._store.select(getGuid).subscribe((val) => {
      uid = val || '';
    })
    const mobileSubs = this._store.select(getNewMobile).subscribe((val) => {
      mobile = val || '';
    })
    const payload = {
      oneprofileGuid: uid,
      contactNumber: mobile,
      validatedMSISDN: mobile
    }
    console.log('payload from service ', payload);

    return this._http.put<IUpdateProfileDetailsRes>(`${environment.apiUrl}/user/profile`, payload);
  }

  ngOnDestroy(): void {
    this.uidSubs?.unsubscribe();
    this.mobileSubs?.unsubscribe();
  }
}
