import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { verifyEmailLinkSend } from '../state/auth.actions';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  headerBackIconLink = '/login';
  headerBackIconImg = 'assets/img/icon-left.svg';
  verifyEmailForm!: FormGroup;
  captchaSubscription: Subscription = new Subscription;

  constructor(private _store: Store<IAppState>, private _helperService: HelperService) {}

  ngOnInit(): void {
      this.verifyEmailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
      });
  }

  public validationError(controlName: string, errorName: string) {
    return this.verifyEmailForm.controls[controlName].hasError(errorName);
  }

  // resendLink() {
  //   this._store.dispatch(setLoadingSpinner({ status: true }));
  //   this._store.dispatch(verifyEmailLinkSend({ email: this.verifyEmailForm.value['email'], recaptchaToken: '' }));
  // }

  onSubmit() {
    if (this.verifyEmailForm.invalid) {
      console.log('Invalid Form');
      return;
    }

    this.captchaSubscription = this._helperService.executeRecaptchaV3().subscribe(token => {
      const payload = {
        email: this.verifyEmailForm.value['email'],
        recaptchaToken: token
      };
      this._store.dispatch(setLoadingSpinner({ status: true }));
      this._store.dispatch(verifyEmailLinkSend(payload));
    });
  }

  ngOnDestroy(): void {
    this.captchaSubscription.unsubscribe();
  }
}
