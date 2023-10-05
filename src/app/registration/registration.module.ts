import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationComponent } from './registration/registration.component';
import { PersonalRegistrationComponent } from './registration/personal-registration/personal-registration.component';
import { EmailVerificationComponent } from './registration/personal-registration/email-verification/email-verification.component';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { REGISTRATION_STATE_NAME } from './state/registration.selectors';
import { registrationReducer } from './state/registration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RegistrationEffects } from './state/registration.effects';

const routes: Routes = [
  {
    path: '',
    data: { animation: 'Component' },
    children: [
      { path: '', component: RegistrationComponent },
      {
        path: 'personal',
        children: [
          { path: '', component: PersonalRegistrationComponent },
          { path: 'email-verification', component: EmailVerificationComponent },
        ]
      },
    ]
  },
];

const angularMaterialModules = [
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
]

@NgModule({
  declarations: [
    RegistrationComponent,
    PersonalRegistrationComponent,
    EmailVerificationComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    angularMaterialModules,
    StoreModule.forFeature(REGISTRATION_STATE_NAME, registrationReducer),
    EffectsModule.forFeature([RegistrationEffects]),
  ]
})
export class RegistrationModule { }
