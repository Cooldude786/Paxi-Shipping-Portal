import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAuthError, ILoginPayload } from 'src/app/models/Auth.model';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { login } from '../state/auth.actions';
import { Subscription } from 'rxjs';
import { getAuthError } from '../state/auth.selectors';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  hide = true;
  authErrorSubs:Subscription = new Subscription;
  authError?: IAuthError | null;
  showAlert:boolean = false;
  headerBackIconLink = '/landing-page';
  headerBackIconImg = 'assets/img/icon-left.svg';
  captchaSubscription: Subscription = new Subscription;

  constructor(private _store: Store<IAppState>, private _helperService: HelperService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    // Getting authError from auth state
    this.authErrorSubs = this._store.select(getAuthError).subscribe(
      (err) => {
        if (err) {
          this.authError = err;
          console.log(err);
          this.showAlert = true;
        }
      }
    )
  }

  public validationError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log("Login Form Invalid");
      return;
    }

    this.captchaSubscription = this._helperService.executeRecaptchaV3().subscribe(token => {
      const payload: ILoginPayload = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
        recaptchaToken: token
      }
      this._store.dispatch(setLoadingSpinner({ status: true }));
      this._store.dispatch(login({ payload }));
    });
  }

  ngOnDestroy(): void {
    this.authErrorSubs.unsubscribe();
    this.captchaSubscription.unsubscribe();
  }
}
