import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import { IProfileCreateDTO } from 'src/app/models/Profile.model';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { map, take } from 'rxjs/operators';
import { getUserDetailsStart, updateProfileStart } from '../../state/user.actions';
import { getUserProfileData } from '../../state/user.selectors';
import { TitleCasePipe } from '@angular/common';
import { IUpdateProfileDetailsPayload } from 'src/app/models/userModule.model';
import { getGuid } from 'src/app/login/state/auth.selectors';

interface IRadio {
  value: string;
  label: string;
}

@Component({
  selector: 'app-update-profile-details',
  templateUrl: './update-profile-details.component.html',
  styleUrls: ['./update-profile-details.component.scss']
})
export class UpdateProfileDetailsComponent {
  identificationType: IRadio[] = [
    { value: 'I', label: 'South African ID' },
    { value: 'P', label: 'Passport' },
  ];
  profileForm!: FormGroup;
  showIdTypeValueErr = false
  showMobileErr = false;

  titleCasePipe = new TitleCasePipe();
  fetchCountry = '';
  fetchedMobile = '';

  // var for mobile & desktop header data
  headerBackIconLink = '/registration';
  headerBackIconImg = 'assets/img/icon-left.svg';

  constructor(private _formbuilder: FormBuilder, private _store: Store<IAppState>) {}

  ngOnInit(): void {
    this.profileForm = this._formbuilder.group({
      guid: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(74), Validators.pattern(
        /^[^0-9@#$%^&*()\[\]{}_+=<>\\\/?,.]+$/
      )])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(74), Validators.pattern(
        /^[^0-9@#$%^&*()\[\]{}_+=<>\\\/?,.]+$/
      )])),
      idTypeValue: new FormControl('',
        Validators.compose([Validators.required])
      ),
      idNumber: new FormControl(''),
      passportNumber: new FormControl(''),
      contactNumber: new FormControl('', Validators.compose([Validators.required,Validators.pattern(
        '^((\\0-?)|0)?[0-9]{9}$'
      )])),
      country: ['', Validators.required],
      marketingConsent: new FormControl('', Validators.required),
    },{
      validators: [
        this.notIncludeSpace('firstName'),
        this.notIncludeSpace('lastName'),
      ]
    } as AbstractControlOptions);

    this.profileForm.controls['idTypeValue'].disable();
    this.profileForm.controls['idNumber'].disable();
    this.profileForm.controls['passportNumber'].disable();
    this.profileForm.controls['country'].disable();

    this.profileForm.controls['idTypeValue'].valueChanges.subscribe(value => {
      if (value === this.identificationType[0].value) {
        this.profileForm.controls['idNumber'].setValidators([Validators.required, Validators.pattern(
          /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/
        )])
        this.profileForm.controls['idNumber'].updateValueAndValidity()
      } else {
        this.profileForm.controls['idNumber'].clearValidators()
        this.profileForm.controls['idNumber'].updateValueAndValidity()
      }
      if (value === this.identificationType[1].value) {
        if (this.profileForm.value.country == 'ZA') {
          this.profileForm.controls['passportNumber'].setValidators([Validators.required, Validators.pattern(
            /^[a-zA-Z0-9]{9}$/
          )])
        } else {
          this.profileForm.controls['passportNumber'].setValidators([Validators.required, Validators.pattern(
            /^(?!.*(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7})))/
          )])
        }
        this.profileForm.controls['passportNumber'].updateValueAndValidity()
      } else {
        this.profileForm.controls['passportNumber'].clearValidators()
        this.profileForm.controls['passportNumber'].updateValueAndValidity()
      }
    });

    this.profileForm.controls['country'].valueChanges.subscribe(value => {
      if (this.profileForm.value.idTypeValue === this.identificationType[1].value) {
        if (value == 'ZA') {
          this.profileForm.controls['passportNumber'].setValidators([Validators.required, Validators.pattern(
            /^[a-zA-Z0-9]{9}$/
          )])
        } else {
          this.profileForm.controls['passportNumber'].setValidators([Validators.required, Validators.pattern(
            /^(?!.*(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7})))/
          )])
        }
        this.profileForm.controls['passportNumber'].updateValueAndValidity()
      } else {
        this.profileForm.controls['passportNumber'].clearValidators()
        this.profileForm.controls['passportNumber'].updateValueAndValidity()
      }
    });

    this.fetchAndUpdateForm();
  }

  // convenience getter for easy access to form fields
  get getForm() {
    return this.profileForm.controls;
  }

  public validationError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    if (this.profileForm.invalid) {
      if (this.profileForm.get('idTypeValue')?.invalid) {
        this.showIdTypeValueErr = true
      }
      if (this.profileForm.get('contactNumber')?.invalid) {
        this.showMobileErr = true;
      }
      console.log('not valid');
      return;
    }
    this.showIdTypeValueErr = false
    this.showMobileErr = false;
    const slicedNum = (this.profileForm.value.contactNumber);
    const formattedNum = '27' + (slicedNum*1).toString();
    const isMobileNew = formattedNum != this.fetchedMobile ? true : false;
    const payload: IUpdateProfileDetailsPayload = {
      oneprofileGuid: this.profileForm.value.guid,
      firstName: this.profileForm.value.firstName.trim(),
      lastName: this.profileForm.value.lastName.trim(),
      marketingConsent: this.profileForm.value.marketingConsent,
    };

    if (!isMobileNew) {
      payload['contactNumber'] = formattedNum;
    }
    // -------------Dispatch action here----------------
    this._store.dispatch(setLoadingSpinner({ status: true }));
    if (!isMobileNew) {
      this._store.dispatch(updateProfileStart({ payload, isMobileNew }));
    } else {
      this._store.dispatch(updateProfileStart({ payload, isMobileNew, newMobile: formattedNum }));
    }
  }

  receiveMobile(value: string) {
    if (value.length > 0) {
      this.profileForm.patchValue({ contactNumber: value });
    } else {
      console.log('false triggerred');
    }
  }

  receiveCountryCode(value: string) {
    if (value) {
      this.fetchCountry = value;
      this.profileForm.patchValue({ country: value });
    } else {
      console.log('No country code received');
    }
  }

  fetchAndUpdateForm() {
    this._store.dispatch(setLoadingSpinner({ status: true }));
    this._store.dispatch(getUserDetailsStart());
    this._store.select(getUserProfileData).subscribe((data) => {
      this.profileForm.patchValue({ firstName: this.titleCasePipe.transform(data?.firstName) })
      this.profileForm.patchValue({ lastName: this.titleCasePipe.transform(data?.lastName) })
      this.profileForm.patchValue({ idTypeValue: data?.idType })
      if (data?.idType == 'I') {
        this.profileForm.patchValue({ idNumber: data?.idNumber })
        this.profileForm.patchValue({ country: 'ZA' })
      } else {
        this.profileForm.patchValue({ passportNumber: data?.passportNumber })
        this.fetchCountry = data?.country || '';
        this.profileForm.patchValue({ country: this.fetchCountry })
      }
      this.fetchedMobile = data?.contactNumber.slice(2) || '';
      this.profileForm.patchValue({ contactNumber: this.fetchedMobile })
      this.profileForm.patchValue({ marketingConsent: data?.marketingConsent })
    })

    this._store.select(getGuid).subscribe((guid) => {
      this.profileForm.patchValue({ guid: guid });
    })
  }

  notIncludeSpace(firstName:any){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[firstName];
      const reg = new RegExp(/^[^.\s]/);
      if(control.value != ""){
        if(!reg.test(control.value)){
          return control.setErrors({ notIncludeSpace: true });
        }
      }
    };
  }
}
