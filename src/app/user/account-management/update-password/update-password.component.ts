import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { updatePasswordStart } from '../../state/user.actions';
import { Observable } from 'rxjs';
import { getUpdatePasswordError } from '../../state/user.selectors';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  currentHide = true;
  newHide = true;
  conHide = true;
  updateForm!: FormGroup;
  updatePasswordErrMsg$?: Observable<string | null>;
  headerBackIconLink = '/account-management';
  headerBackIconImg = 'assets/img/icon-left.svg';
  constructor(private _formbuilder: FormBuilder, private _store: Store<IAppState>) {}

  ngOnInit(): void {
    this.updateForm = this._formbuilder.group({
      current_password: new FormControl<string>('', [
        Validators.required
      ]),
      new_password: new FormControl<string>('', [
        Validators.required, Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        )
      ]),
      conf_password: new FormControl<string>('', [
        Validators.required
      ])
    },{
      validators: [
        this.samePasswordValidator('current_password', 'new_password'),
        this.confirmedValidator('new_password', 'conf_password')
      ]
    } as AbstractControlOptions);

    this.updatePasswordErrMsg$ = this._store.select(getUpdatePasswordError);
  }

  public validationError(controlName: string, errorName: string) {
    return this.updateForm.controls[controlName].hasError(errorName);
  }

  updatePassword() {
    if (this.updateForm.invalid) {
      console.log('Invalid form');
      return
    }
    const { current_password, new_password } = this.updateForm.value;
    console.log(current_password, new_password);

    this._store.dispatch(setLoadingSpinner({ status: true }));
    // this._store.dispatch(updatePasswordStart({ oldPassword: 'xyz786@HJK', newPassword: 'gsdhd' }));
    this._store.dispatch(updatePasswordStart({ oldPassword: current_password, newPassword: new_password }));
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

  samePasswordValidator(currentPassword:any, newPassword:any) {
    return (formGroup: FormGroup) => {
      const oldPasswordControl = formGroup.controls[currentPassword];
      const newPasswordControl = formGroup.controls[newPassword];
      if (oldPasswordControl.errors && !oldPasswordControl.errors['samePasswordValidator']) {
        return;
      }
      if (oldPasswordControl.value === newPasswordControl.value) {
        newPasswordControl.setErrors({ samePasswordValidator: true });
      } else {
        newPasswordControl.setErrors(null);
      }
    }
  }

}
