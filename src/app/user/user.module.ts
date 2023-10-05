import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagementComponent } from './account-management/account-management.component';
import { UpdatePasswordComponent } from './account-management/update-password/update-password.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { UpdateProfileDetailsComponent } from './account-management/update-profile-details/update-profile-details.component';
import { UpdateMobileComponent } from './account-management/update-mobile/update-mobile.component';
import { CompleteMobileVerificationComponent } from './account-management/complete-mobile-verification/complete-mobile-verification.component';
import { CompleteProfileDetailsComponent } from './account-management/complete-profile-details/complete-profile-details.component';
import { IsProfileCreatedGuard } from '../guard/is-profile-created.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AccountManagementComponent },
      { path: 'update-password', component: UpdatePasswordComponent },
      { path: 'update-profile-details', component: UpdateProfileDetailsComponent, canActivate: [IsProfileCreatedGuard] },
      { path: 'mobile-verification', component: UpdateMobileComponent, canActivate: [IsProfileCreatedGuard] },
      {
        path: 'complete-profile-details',
        children: [
          { path: '', component: CompleteProfileDetailsComponent, canActivate: [IsProfileCreatedGuard] },
          { path: 'mobile-verification', component: CompleteMobileVerificationComponent, canActivate: [IsProfileCreatedGuard] }
        ],
      }
    ]
  }
]

const angularMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule
]

@NgModule({
  declarations: [
    AccountManagementComponent,
    UpdatePasswordComponent,
    UpdateProfileDetailsComponent,
    UpdateMobileComponent,
    CompleteMobileVerificationComponent,
    CompleteProfileDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    angularMaterialModules,
    EffectsModule.forFeature(),
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  exports: [
    RouterModule
  ]
})
export class UserModule { }
