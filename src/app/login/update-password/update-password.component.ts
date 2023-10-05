import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { resetPasswordStart } from '../state/auth.actions';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})

export class UpdatePasswordComponent implements OnInit, OnDestroy {
  newHide = true;
  conHide = true;
  updatePasswordForm!: FormGroup;
  headerBackIconLink = '/login/forget-password';
  headerBackIconImg = 'assets/img/icon-left.svg';
  captchaSubscription: Subscription = new Subscription;

  constructor(private _formbuilder: FormBuilder, private _route: ActivatedRoute, private _store: Store<IAppState>, private _helperService: HelperService) {}

  ngOnInit(): void {
    this.updatePasswordForm = this._formbuilder.group({
      new_password: new FormControl<string>('', [
        Validators.required, Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        )
      ]),
      conf_password: new FormControl<string>('', [
        Validators.required
      ]),
      oobCode: new FormControl<string>('', [Validators.required])
    },{
      validators: this.confirmedValidator('new_password', 'conf_password')
    } as AbstractControlOptions);

    this._route.queryParams.subscribe((params: Params) => {
      this.updatePasswordForm.patchValue({ 'oobCode': params['code'] });
    });
  }

  public validationError(controlName: string, errorName: string) {
    return this.updatePasswordForm.controls[controlName].hasError(errorName);
  }

  updatePassword() {
    if (this.updatePasswordForm.invalid) {
      console.log('Invalid form');
      return
    }
    const { new_password, conf_password, oobCode: oob_Code } = this.updatePasswordForm.value;

    this.captchaSubscription = this._helperService.executeRecaptchaV3().subscribe(token => {
      const payload = {
        newPassword: new_password,
        oobCode: oob_Code,
        recaptchaToken: token
      }

      this._store.dispatch(setLoadingSpinner({ status: true }));
      this._store.dispatch(resetPasswordStart(payload));
    });
  }

  confirmedValidator(password:any, confirmPassword:any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['confirmedValidator']) {
          return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ confirmedValidator: true });
      } else {
          confirmPasswordControl.setErrors(null);
      }
    }
  }

  ngOnDestroy(): void {
      this.captchaSubscription.unsubscribe();
  }
}
