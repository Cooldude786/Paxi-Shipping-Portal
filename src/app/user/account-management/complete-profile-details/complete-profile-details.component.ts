import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import { IProfileCreateDTO } from '../../../models/Profile.model';
import { setLoadingSpinner } from '../../../store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/app.state';
import { map, take } from 'rxjs/operators';
import { profileRegistrationFormSubmited, rehydrateProfileUid } from '../../../user/state/user.actions';
import { getUid } from '../../../login/state/auth.selectors';
import { TitleCasePipe } from '@angular/common';

interface IRadio {
  value: string;
  label: string;
}

@Component({
  selector: 'app-complete-profile-details',
  templateUrl: './complete-profile-details.component.html',
  styleUrls: ['./complete-profile-details.component.scss']
})
export class CompleteProfileDetailsComponent {
  identificationType: IRadio[] = [
    { value: 'I', label: 'South African ID' },
    { value: 'P', label: 'Passport' },
  ];
  profileForm!: FormGroup;
  showIdTypeValueErr = false
  showMobileErr = false;
  // var for mobile & desktop header data
  headerBackIconLink = '/dashboard';
  headerBackIconImg = 'assets/img/icon-left.svg';

  footerBtnClass = 'paxi-btn-large paxi-btn-primary paxi-btn-fill';
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    if(window.innerWidth >= 1200) this.footerBtnClass = 'paxi-btn-large paxi-btn-primary';
    else this.footerBtnClass = 'paxi-btn-large paxi-btn-primary paxi-btn-fill';
  }

  titleCasePipe = new TitleCasePipe();
  fetchCountry = '';
  fetchedMobile = '';

  previousUrl?:string;
  currentUrl?:string;
  constructor(private _formbuilder: FormBuilder, private _store: Store<IAppState>) { this.getScreenSize() }

  ngOnInit(): void {
    this.profileForm = this._formbuilder.group({
      uid: ['', Validators.required],
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
      country: ['ZA', Validators.required],
      marketingConsent: new FormControl('Y'),
    },{
      validators: [
        this.notIncludeSpace('firstName'),
        this.notIncludeSpace('lastName'),
      ]
    } as AbstractControlOptions);

    this.profileForm.controls['idTypeValue'].valueChanges.subscribe(value => {
      if (value === this.identificationType[0].value) {
        this.profileForm.controls['idNumber'].setValidators([Validators.required, Validators.pattern(
          /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/
        ), Validators.maxLength(13)])
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

    // Rehydarting uid state on page reload
    this._store.dispatch(rehydrateProfileUid());
    this._store.select(getUid).pipe(
      take(1),
      map((uid) => {
        // console.log(`The UID: ${uid}`);
        this.profileForm.get('uid')?.patchValue(uid);
        // **NOTE:-** Below line is for testing only.
        // this.profileForm.patchValue({ uid: 'value' });
      })
    ).subscribe();

    // console.log('HISTORY API ', document.referrer)

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

    const payload: IProfileCreateDTO = {
      uid: this.profileForm.value.uid,
      firstName: this.profileForm.value.firstName.trim(),
      lastName: this.profileForm.value.lastName.trim(),
      contactNumber: formattedNum,
      idType: this.profileForm.value.idTypeValue,
      country: this.profileForm.value.country,
      marketingConsent: this.profileForm.value.marketingConsent,
    };
    if (this.profileForm.value.idTypeValue == this.identificationType[0].value) {
      payload['idNumber'] = this.profileForm.value.idNumber;
    } else {
      payload['passportNumber'] = this.profileForm.value.passportNumber;
    }
    console.log('Payload Value', payload);

    this._store.dispatch(setLoadingSpinner({ status: true }));
    this._store.dispatch(profileRegistrationFormSubmited({ payload }));
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
    const fetchProfileData = localStorage.getItem('personalData');
    if (!fetchProfileData) return;
    const profileData = JSON.parse(fetchProfileData);

    this.profileForm.patchValue({ firstName: this.titleCasePipe.transform(profileData?.firstName) })
    this.profileForm.patchValue({ lastName: this.titleCasePipe.transform(profileData?.lastName) })
    this.profileForm.patchValue({ idTypeValue: profileData?.idType })
    if (profileData?.idType == 'I') {
      this.profileForm.patchValue({ idNumber: profileData?.idNumber })
      this.profileForm.patchValue({ country: 'ZA' })
    } else {
      this.profileForm.patchValue({ passportNumber: profileData?.passportNumber })
      this.fetchCountry = profileData?.country || 'ZA';
      this.profileForm.patchValue({ country: this.fetchCountry })
    }
    this.fetchedMobile = profileData?.contactNumber.slice(2);
    this.profileForm.patchValue({ contactNumber: this.fetchedMobile })
    this.profileForm.patchValue({ marketingConsent: profileData?.marketingConsent })

    console.log('Populated Form: ', this.profileForm.value);

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
