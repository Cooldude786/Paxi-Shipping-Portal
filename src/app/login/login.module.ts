import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LoginComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'update-password', component: UpdatePasswordComponent },
    ],
  }
]

const angularMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
]

@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    UpdatePasswordComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    angularMaterialModules,
    RouterModule.forChild(routes),
    EffectsModule.forFeature(),
  ]

})
export class LoginModule { }
