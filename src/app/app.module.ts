import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppReducer, metaReducers } from './store/app.state';
import { SharedModule } from './shared/shared.module';
import { AuthEffects } from './login/state/auth.effects';
import { SuccessComponent } from './success/success.component';
import { UserModuleEffects } from './user/state/user.effects';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { NgIdleModule } from '@ng-idle/core';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, SuccessComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    SharedModule,
    RecaptchaV3Module,
    NgIdleModule.forRoot(),
    EffectsModule.forRoot([AuthEffects, UserModuleEffects]),
    StoreModule.forRoot(AppReducer, { metaReducers }),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
