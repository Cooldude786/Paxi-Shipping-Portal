import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ILoginPayload, ILoginResponse, IUser } from "../models/Auth.model";
import { Store } from "@ngrx/store";
import { IAppState } from "../store/app.state";
import { logout, revokeTokenStart } from "../login/state/auth.actions";
import { environment } from '../../environments/environment';
import { resetDashboardPayload } from '../dashboard/state/dashboard.actions'
import { resetUserPayload } from "../user/state/user.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  timeoutInterval: any;

  constructor(private _httpClient: HttpClient, private _store: Store<IAppState>) { }

  login(payload: ILoginPayload): Observable<ILoginResponse> {
    return this._httpClient.post<ILoginResponse>(
      `${environment.apiUrl}/user/login`, payload
    );
  }

  formatUser(data: ILoginResponse) {
    const expirationDate = new Date(new Date(data.expiresIn).toISOString());
    const user = new IUser(data.idToken, data.refreshToken, expirationDate, data.user)
    return user;
  }

  setUserInLocalStorage(user: IUser) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.runTimeoutInterval(user);
  }

  runTimeoutInterval(user: IUser) {
    const todaysDate = new Date().getTime();
    const expirationDate = user.expireDate.getTime();
    const timeInterval = expirationDate - todaysDate;

    this.timeoutInterval = setTimeout(() => {
      // logout functionality or refresh token whatever is your requirement mine is to auto-logout and to use refresh token on extending state monitoring the idle state of user in 'app.component.ts'
      this._store.dispatch(logout());
    }, timeInterval)
  }

  getUserFromLocalStorage() {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (!userData.user.oneProfileGuid) {
        const profileGuid = localStorage.getItem('profileGuid');
        if (profileGuid) {
          userData.user.oneProfileGuid = JSON.parse(profileGuid);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.removeItem('profileGuid');
        }
      }
      const expirationDate = new Date(userData.expiresIn);
      const user = new IUser(userData.idToken, userData.refreshToken, expirationDate, userData.user)

      this.runTimeoutInterval(user);
      return user;
    }
    return null;
  }

  logout() {
    // this._store.dispatch(resetUserPayload());
    this._store.dispatch(resetDashboardPayload());
    localStorage.removeItem('userData');
    localStorage.removeItem('registerParcelPopulate');
    localStorage.removeItem('profileGuid');
    localStorage.removeItem('newMobile');
    localStorage.removeItem('personalData');
    if (this.timeoutInterval) {
      clearTimeout(this.timeoutInterval);
      this.timeoutInterval = null;
    }
  }

  refreshToken(refreshToken: string): Observable<{ idToken: string, refreshToken: string, expiresIn: string }> {
    return this._httpClient.post<{ idToken: string, refreshToken: string, expiresIn: string }>(
      `${environment.apiUrl}/user/refresh`, { refreshToken }
    );
  }

  sendResetPasswordLink(email: string, recaptchaToken: string): Observable<{ status: string }> {
    return this._httpClient.post<{ status: string }>(
      `${environment.apiUrl}/user/reset/password`, {
      email, recaptchaToken
    });
  }

  resetPassword(newPassword: string, oobCode: string, recaptchaToken: string): Observable<{ status: string }> {
    return this._httpClient.put<{ status: string }>(
      `${environment.apiUrl}/user/reset/password`, {
      newPassword,
      oobCode,
      recaptchaToken
    });
  }

  getErrorMessage(message: string) {
    console.log(message);
    switch (message) {
      case 'Firebase: Error (auth/user-not-found).':
        return { message: 'This user does not exist', type: 'email' };
      case 'Firebase: Error (auth/wrong-password).':
        return { message: 'Incorrect password, please try again', type: 'password' };
      case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
        return { message: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.', type: 'generic' };
      case 'USER_DISABLED':
        return { message: 'The user account has been disabled by an administrator.', type: 'generic' };
      case 'The credentials provided are incorrect.':
        return { message: 'The credentials provided are incorrect.', type: 'generic' };
      case 'User not found.':
        return { message: 'The input is not valid, please try again.', type: 'generic' }
      default:
        return { message: 'Unknown error occurred. Please try again.', type: 'generic' };
    }
  }
}

