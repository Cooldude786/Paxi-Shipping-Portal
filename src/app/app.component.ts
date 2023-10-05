import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IAppState } from './store/app.state';
import { getErrorMessage, getLoading } from './store/shared/shared.selector';
import { HelperService } from './services/helper.service';
import { IErrorResponse } from './models/ErrorResponse.model';
import { autoLogin, logout, revokeTokenStart } from './login/state/auth.actions';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { getUserRefreshToken, isAuthenticated } from './login/state/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'paxi-shipper-portal';
  showLoading?: Observable<boolean>;
  errorData?: IErrorResponse;
  errorDataSubs: Subscription = new Subscription;
  isAuthenticatedSubs: Subscription = new Subscription;
  getRefreshTokenSubs: Subscription = new Subscription;
  countdown: number | null = null;
  showWarningPopup: boolean = false;

  constructor(private _store: Store<IAppState>, private _helper: HelperService, private idle: Idle, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.logoutIdleUser(15, 5);
    this.logoutIdleUser();

    // Show loader when triggers by requests in the app.
    this.showLoading = this._store.select(getLoading);

    // Fetching error message from the shared state selector
    this.errorDataSubs = this._store.select(getErrorMessage).subscribe((data) => {
      console.log('Error: ', data);
      if (data) {
        // console.log('Error if: ', data);
        this.errorData = data;
        this._helper.showErrorSnackbar(this.errorData);
      }
    })

    // auto Login on browser refresh
    this._store.dispatch(autoLogin());
  }

  ngOnDestroy(): void {
    this.errorDataSubs.unsubscribe();
    this.isAuthenticatedSubs.unsubscribe();
    this.getRefreshTokenSubs.unsubscribe();
  }

  logoutIdleUser(IdleTime: number = 840, logoutWarningTime: number = 60) {
    // set idle parameters
    this.idle.setIdle(IdleTime); // how long can they be inactive before considered idle, in seconds
    this.idle.setTimeout(logoutWarningTime); // how long can they be idle before considered timed out, in seconds
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // Tracking inactivity of user and if it is for 15 min then logout user.
    this.isAuthenticatedSubs = this._store.select(isAuthenticated).subscribe((isAuth: boolean) => {
      if (isAuth) {
        // do something when the user becomes idle
        this.idle.onIdleStart.subscribe(() => this.showWarningPopup = false);
        // do something when the user is no longer idle
        this.idle.onIdleEnd.subscribe(() => {
          this.showWarningPopup = false;
          // Revoke token here
          this.getRefreshTokenSubs = this._store.select(getUserRefreshToken).subscribe(token => {
            this._store.dispatch(revokeTokenStart({ refreshToken: token as string }));
          });
          this.countdown = null;
          this.cd.detectChanges(); // how do i avoid this kludge?
        });
        // do something when the user has timed out
        this.idle.onTimeout.subscribe(() => {
          this.showWarningPopup = false;
          // Log user out
          this._store.dispatch(logout());
        });
        // do something as the timeout countdown does its thing
        this.idle.onTimeoutWarning.subscribe(seconds => {
          this.showWarningPopup = true;
          this.countdown = seconds;
        });

        this.idle.watch();
      }
    });
  }

}
