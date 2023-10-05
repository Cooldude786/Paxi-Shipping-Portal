import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Subscription, map, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import IUserModuleSate from '../../state/user.state';
import { rehydrateProfileSaveState, verifyMobileResend, verifyMobileSessionStart, verifyMobileStart } from '../../state/user.actions';
import { getMobileValidationError, getNewMobile, getSession } from '../../state/user.selectors';

@Component({
  selector: 'app-update-mobile',
  templateUrl: './update-mobile.component.html',
  styleUrls: ['./update-mobile.component.scss']
})
export class UpdateMobileComponent {
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

  errorMsg?: string;
  inputSize = 6;
  otpSentStatus: boolean = false;
  intendedPhone: string = '';
  originalOTP: string = '';
  enteredOTP?: string;
  isInvalid: boolean = false;

  payloadSubs: Subscription = new Subscription;
  sessionSubs: Subscription = new Subscription;
  sessionId?:string;
  validationSubs: Subscription = new Subscription;

  // var for mobile & desktop header data
  headerBackIconLink = '/account-management/update-profile-details';
  headerBackIconImg = 'assets/img/icon-left.svg';

  constructor(
    private _store: Store<IUserModuleSate>
  ) {}

  ngOnInit(): void {
    // Rehydarting profile payload state on page reload
    this._store.dispatch(rehydrateProfileSaveState());

    this.payloadSubs = this._store
      .select(getNewMobile)
      .pipe(
        take(1),
        map((res) => {
          console.log(res);

          this._store.dispatch(setLoadingSpinner({ status: true }));
          this.intendedPhone = res || '';

          this._store.dispatch(verifyMobileSessionStart({ sms: this.intendedPhone,commsType: 'SMS' }));
        })
      )
      .subscribe();

    // Fetching session from the register state selector
    this.sessionSubs = this._store.select(getSession).subscribe((data) => {
      if (data) { this.sessionId = data; }
    })

  }

  resendOTP() {
    if (this.sessionId) {
      this._store.dispatch(setLoadingSpinner({ status: true }))
      this._store.dispatch(verifyMobileResend({ sessionId: this.sessionId }))
    } else {
      alert("Please fill add the new mobile in a form first.");
    }
  }

  verifyOTP() {
    if (this.inputSize === this.enteredOTP?.length) {
      if (this.sessionId) {
        this._store.dispatch(setLoadingSpinner({ status: true }))
        this._store.dispatch(verifyMobileStart({ sessionId: this.sessionId, pin: this.enteredOTP }));
        // Fetching validation error from the user module state selector
        this.checkValidationErr();
      } else {
        alert("Please add new mobile to form first. Session Id not found.");
      }
    } else {
      this.errorMsgList.map((err) => {
        if (err.type == 'empty') this.errorMsg = err.msg;
      });
      this.isInvalid = true;
    }
  }

  checkValidationErr() {
    this.validationSubs = this._store.select(getMobileValidationError).subscribe((data) => {
      if (data) {
        // this.errorMsg = data;
        this.errorMsg = 'The OTP is not valid, please try again.';
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
        this.errorMsg = '';
      }
    })
  }

  ngOnDestroy(): void {
    this.payloadSubs.unsubscribe();
    this.sessionSubs.unsubscribe();
    this.validationSubs.unsubscribe();
  }
}
