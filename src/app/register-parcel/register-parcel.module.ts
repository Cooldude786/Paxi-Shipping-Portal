import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterParcelComponent } from './register-parcel/register-parcel.component';
import { ParcelNumberComponent } from './register-parcel/parcel-number/parcel-number.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { NgFor, AsyncPipe} from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialogModule} from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { REGISTER_PARCEL_STATE_NAME } from './state/register-parcel.selectors';
import { registerParcelReducer } from './state/register-parcel.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RegisterParcelEffects } from './state/register-parcel.effects';

const routes: Routes = [
  {
    path: '',
    data: { animation: 'Component' },
    children: [
      { path: '', component: RegisterParcelComponent },
      {
        path: 'parcel-number',
        children: [
          { path: '', component: ParcelNumberComponent },
          { path: 'parcel-number', component: ParcelNumberComponent }
        ]
      },
    ],
  },
];
const angularMaterialModules = [
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatAutocompleteModule,
  MatDialogModule
]

@NgModule({
  declarations: [
    RegisterParcelComponent,
    ParcelNumberComponent,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgFor,
    AsyncPipe,
    angularMaterialModules,
    StoreModule.forFeature(REGISTER_PARCEL_STATE_NAME, registerParcelReducer),
    EffectsModule.forFeature([RegisterParcelEffects]),
  ]
})
export class RegisterParcelModule { }
