import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IRegister } from 'src/app/models/Register.model';
import { IAppState } from 'src/app/store/app.state';
import { registrationFormInitiate, rehydrateRegistrationInitiateData } from '../../state/registration.actions';
import { getAccountType } from '../../state/registration.selectors';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-personal-registration',
  templateUrl: './personal-registration.component.html',
  styleUrls: ['./personal-registration.component.scss'],
})
export class PersonalRegistrationComponent implements OnInit, OnDestroy {
  personalForm!: FormGroup;
  hide = true;
  confirmPasswordHide = true;
  accountTypeSubs: Subscription = new Subscription;
  accountTypePrefrence!: string;
  headerBackIconLink = '/registration';
  headerBackIconImg = 'assets/img/icon-left.svg';
  captchaSubscription: Subscription = new Subscription;

  constructor(private _formbuilder: FormBuilder, private _store: Store<IAppState>, private _helperService: HelperService) {}

  ngOnInit(): void {
    this.personalForm = this._formbuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      )])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required])),
      termsCondition: new FormControl(false, Validators.compose([Validators.requiredTrue]))
    },{
      validators: this.confirmedValidator('password', 'confirmPassword')
    } as AbstractControlOptions);

    // Rehydarting Register Data payload of type page on page relaod
    this._store.dispatch(rehydrateRegistrationInitiateData());
    // Fetching registration type from the state selector
    this.accountTypeSubs = this._store.select(getAccountType).subscribe((data) => {
      if (data) {
        this.accountTypePrefrence = data;
      } else {
        console.error("No data from the redisterPayload state found");
      }
    })
  }

  // convenience getter for easy access to form fields
  get getForm() { return this.personalForm.controls; }

  public validationError = (controlName: string, errorName: string) => {
    return this.personalForm.controls[controlName].hasError(errorName);
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

  onSubmit() {
    if (this.personalForm.invalid) {
      return;
    }

    this.captchaSubscription = this._helperService.executeRecaptchaV3().subscribe(token => {
      const payload: IRegister = {
        email: this.personalForm.value.email,
        password: this.personalForm.value.password,
        accountType: this.accountTypePrefrence,
        validEmail: false,
        recaptchaToken: token
      };
      this._store.dispatch(setLoadingSpinner({ status: true }));
      this._store.dispatch(registrationFormInitiate({ payload }));
    });
  }

  ngOnDestroy(): void {
    this.accountTypeSubs?.unsubscribe();
    this.captchaSubscription.unsubscribe();
  }
}
