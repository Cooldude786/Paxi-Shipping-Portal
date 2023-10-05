import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { FooterComponent } from './footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UserSidebarComponent } from './header/user-sidebar/user-sidebar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertsComponent } from './alerts/alerts.component';
import { SelectCountryComponent } from './select-country/select-country.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';

const angularMaterialClass = [
  MatCardModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
  MatToolbarModule,
  MatSelectModule,
  MatTableModule,
  MatRadioModule
];

@NgModule({
  declarations: [
    OtpInputComponent,
    HeaderComponent,
    PhoneInputComponent,
    SelectCountryComponent,
    FooterComponent,
    UserSidebarComponent,
    LoadingSpinnerComponent,
    AlertsComponent,
    SubHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    angularMaterialClass
  ],
  exports: [
    OtpInputComponent,
    HeaderComponent,
    PhoneInputComponent,
    SelectCountryComponent,
    FooterComponent,
    UserSidebarComponent,
    LoadingSpinnerComponent,
    AlertsComponent,
    angularMaterialClass,
    SubHeaderComponent
  ]
})
export class SharedModule { }
