import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRegistrationState } from '../../../registration/state/registration.state';
import { getProfileCreatePayload, getSMSSession, getValidationError } from '../../../user/state/user.selectors';
import { Subscription, map, take } from 'rxjs';
import {
  contactNumberValidationSessionStart,
  rehydrateProfilePayload,
  smsValidationResend,
  smsValidationVerify,
} from '../../../user/state/user.actions';
import { setLoadingSpinner } from '../../../store/shared/shared.actions';

@Component({
  selector: 'app-complete-mobile-verification',
  templateUrl: './complete-mobile-verification.component.html',
  styleUrls: ['./complete-mobile-verification.component.scss']
})
export class CompleteMobileVerificationComponent {
  errorMsgList: {
    type: string;
    msg: string;
  }[] = [
    {
      type: 'incorrect',
      msg: 'Incorrect OTP. Please try again or request another code.',
    },
    {
      type: 'empty',
      msg: 'Please enter all the digits to verify?',
    },
  ];

  // var for OTP
  errorMsg?: string;
  inputSize = 6;
  otpSentStatus: boolean = false;
  intendedPhone: string = '';
  originalOTP: string = '';
  enteredOTP?: string;
  isInvalid: boolean = false;
  otpWidth = 40.88;
  otpHeight = 56;

  payloadSubs: Subscription = new Subscription;
  sessionSubs: Subscription = new Subscription;
  sessionId?:string;
  validationSubs: Subscription = new Subscription;
  // var for mobile & desktop header data
  headerBackIconLink = '/account-management/complete-profile-details';
  headerBackIconImg = 'assets/img/icon-left.svg';

  screenWidth!: number;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.getInnerwidth();
  }
  constructor(private _store: Store<IRegistrationState>) {this.getScreenSize()}

  ngOnInit(): void {
    // Rehydarting profile payload state on page reload
    this._store.dispatch(rehydrateProfilePayload());

    this.payloadSubs = this._store
      .select(getProfileCreatePayload)
      .pipe(
        take(1),
        map((personalDetails) => {
          if (!personalDetails) return;
          this._store.dispatch(setLoadingSpinner({ status: true }));
          this.intendedPhone = personalDetails.contactNumber;

          this._store.dispatch(
            contactNumberValidationSessionStart({
              sms: this.intendedPhone,
              commsType: 'SMS',
            })
          );
        })
      )
      .subscribe();

    // Fetching session from the user module state selector
    this.sessionSubs = this._store.select(getSMSSession).subscribe((data) => {
      if (data) { this.sessionId = data; }
    });
  }

  resendOTP() {
    if (this.sessionId) {
      this._store.dispatch(setLoadingSpinner({ status: true }))
      this._store.dispatch(smsValidationResend({ sessionId: this.sessionId }))
    } else {
      alert("Please fill the form first.");
    }
  }

  verifyOTP() {
    if (this.inputSize === this.enteredOTP?.length) {
      if (this.sessionId) {
        this._store.dispatch(setLoadingSpinner({ status: true }))
        this._store.dispatch(smsValidationVerify({ sessionId: this.sessionId, pin: this.enteredOTP }));
        // Fetching validation error from the user module state selector
        this.checkValidationErr();
      } else {
        alert("Please fill the form first. Session Id not found.");
      }
    } else {
      this.errorMsgList.map((err) => {
        if (err.type == 'empty') this.errorMsg = err.msg;
      });
      this.isInvalid = true;
    }
  }

  checkValidationErr() {
    this.validationSubs = this._store.select(getValidationError).subscribe((data) => {
      if (data) {
        // this.errorMsg = data;
        this.errorMsg = 'The OTP is not valid, please try again.';
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
        this.errorMsg = '';
      }
    });
  }

  // below Fn is for UI purpose only
  getInnerwidth() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 1728) {
      this.otpWidth = 60;
      this.otpHeight = 70;
    } else if (this.screenWidth >= 1200) {
      this.otpWidth = 55;
      this.otpHeight = 65;
    } else {
      this.otpWidth = 40.88;
      this.otpHeight = 56;
    }
  }

  ngOnDestroy(): void {
    this.payloadSubs.unsubscribe();
    this.sessionSubs.unsubscribe();
    this.validationSubs.unsubscribe();
  }
}
