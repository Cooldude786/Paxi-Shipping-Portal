import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { emailValidationResend, emailValidationSessionStart, emailValidationVerify, rehydrateRegistrationFormData } from 'src/app/registration/state/registration.actions';
import { getEmail, getSession, getValidationError } from 'src/app/registration/state/registration.selectors';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  errorMsgList: { type:string, msg:string }[] = [
    { type: 'empty', msg: 'Please enter all the digits to verify?'}
  ]
  errorMsg?: string;
  inputSize = 8;

  emailSubs: Subscription = new Subscription;
  intendedEmail?:string;
  sessionSubs: Subscription = new Subscription;
  sessionId?:string;
  validationSubs: Subscription = new Subscription;
  // var for OTP
  enteredOTP?: string;
  isInvalid:boolean = false;
  otpWidth = 30.88;
  otpHeight = 56;
  // var for mobile & desktop header data
  headerBackIconLink = '/registration/personal';
  headerBackIconImg = 'assets/img/icon-left.svg';

  screenWidth!: number;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 1728) {
      this.otpWidth = 50;
      this.otpHeight = 75;
    } else if (this.screenWidth >= 1200) {
      this.otpWidth = 45;
      this.otpHeight = 70;
    } else {
      this.otpWidth = 30.88;
      this.otpHeight = 56;
      console.log('Host Listener: ', this.screenWidth);
    }
  }

  constructor(private _store: Store<IAppState>) { this.getScreenSize() }

  ngOnInit(): void {
    // Rehydarting Register Data payload of form page on page relaod
    this._store.dispatch(rehydrateRegistrationFormData());
    // Fetching email from the register state selector
    this.emailSubs = this._store.select(getEmail).subscribe((data) => {
      if (data) { this.intendedEmail = data; }
      else { console.error("No Email found in registerPayload state") }
    })
    if (this.intendedEmail) {
      this._store.dispatch(setLoadingSpinner({ status: true }))
      this._store.dispatch(emailValidationSessionStart({ email: this.intendedEmail , commsType: "EMAIL" }))
    }

    // Fetching session from the register state selector
    this.sessionSubs = this._store.select(getSession).subscribe((data) => {
      if (data) { this.sessionId = data; }
    })
  }

  resendOTP() {
    if (this.sessionId) {
      this._store.dispatch(setLoadingSpinner({ status: true }))
      this._store.dispatch(emailValidationResend({ sessionId: this.sessionId }))
    } else {
      alert("Please fill the form first.");
    }
  }

  verifyOTP() {
    if (this.inputSize === this.enteredOTP?.length) {
      if (this.sessionId) {
        this._store.dispatch(setLoadingSpinner({ status: true }))
        this._store.dispatch(emailValidationVerify({ sessionId: this.sessionId, pin: this.enteredOTP }));
        // Fetching validation error from the register state selector
        this.checkValidationErr();
      } else {
        alert("Please fill the form first. Session Id not found.");
      }
    } else {
      this.errorMsgList.map((err)=>{
        if (err.type == 'empty')
          this.errorMsg = err.msg
      })
      this.isInvalid = true
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

  ngOnDestroy(): void {
    this.emailSubs.unsubscribe();
    this.sessionSubs.unsubscribe();
    this.validationSubs.unsubscribe();
  }
}
