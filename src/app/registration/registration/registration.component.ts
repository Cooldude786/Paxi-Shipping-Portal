import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { registrationTypeInitiate } from '../state/registration.actions';
import { IRegister } from 'src/app/models/Register.model';

interface IRegistrationType {
  value: string;
  title: string;
  label: string;
  disabled?: boolean;
  tooltipVal?: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  headerBackIconLink = '/landing-page';
  headerBackIconImg = 'assets/img/icon-left.svg';
  registrationType: IRegistrationType[] = [
    {
      value: 'PERSONAL',
      title: 'Create Personal Account',
      label: 'I use PAXI to send parcels to friends and family in my personal capacity'
    },
    {
      value: 'BUSINESS',
      title: 'Create Business Account',
      label: 'I have a business or side hustle and use PAXI to send parcels to my customers',
      disabled: true,
      tooltipVal: 'Coming soon'
    },
    {
      value: 'BUSINESSINVITE',
      title: 'Join Business via Invite',
      label: 'I work for a business that uses PAXI and received an invitation from the Business Account',
      disabled: true,
      tooltipVal: 'Coming soon'
    }
  ]

  form = new FormGroup({
    registrationTypeValue: new FormControl('', Validators.required)
  })

  constructor(private _store: Store<IAppState>) { }

  submit() {
    const registrationValue = this.form.value.registrationTypeValue;

    if (registrationValue) {
      const payload: IRegister = {
        email: '',
        password: '',
        accountType: registrationValue,
        // recaptchaToken: 'not-used-for-now',
        validEmail: false
      }
      this._store.dispatch(registrationTypeInitiate({ payload }));
    } else {
      console.log("Please select a registration type");
    }
  }
}
