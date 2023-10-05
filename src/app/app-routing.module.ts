import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PreventAuthPageAccess } from './guard/prevent-auth.guard';
import { AuthGuard } from './guard/auth.guard';
import { SuccessComponent } from './success/success.component';
import { IsProfileCreatedGuard } from './guard/is-profile-created.guard';

const routes: Routes = [
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
    canActivate: [PreventAuthPageAccess]
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
    canActivate: [PreventAuthPageAccess]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(
        (m) => m.LoginModule
      ),
    canActivate: [PreventAuthPageAccess]
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'register-parcel',
    loadChildren: () =>
      import('./register-parcel/register-parcel.module').then(
        (m) => m.RegisterParcelModule
      ),
    canActivate: [AuthGuard, IsProfileCreatedGuard]
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'account-management',
    loadChildren: () =>
      import('./user/user.module').then(
        (m) => m.UserModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'parcel-history',
    loadChildren: () =>
      import('./parcel-history/parcel-history.module').then(
        (m) => m.ParcelHistoryModule
      ),
    canActivate: [AuthGuard, IsProfileCreatedGuard]
  },
  {
    path: 'success/:type',
    component: SuccessComponent
  },
  {
    path: '',
    redirectTo: '/landing-page',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
