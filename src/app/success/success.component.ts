import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

interface ISuccessData {
  type: string;
  isSidebar: boolean;
  backIconRouterLink?: string;
  heading?: string;
  imgPath: string;
  title: string;
  subTitle?: string;
  decription?: string;
  button: string;
  buttonRouterLink: string;
  buttonOptional?: string;
  buttonOptionalRouterLink?: string;
}

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  successDataObj: ISuccessData[] = [
    {
      type: 'reset-password-successfull',
      isSidebar: true,
      imgPath: 'assets/img/success/update-password.svg',
      title: 'Password Updated!',
      button: 'Login',
      buttonRouterLink: '/login'
    },
    {
      type: 'password-updated',
      isSidebar: true,
      heading: 'Account Management',
      imgPath: 'assets/img/success/update-password.svg',
      title: 'Password Updated!',
      button: 'Go to Dashboard',
      buttonRouterLink: '/dashboard'
    },
    {
      type: 'registered',
      isSidebar: false,
      heading: 'Register For You',
      imgPath: 'assets/img/success/success-with-bg.svg',
      title: 'A PAXI Portal Account',
      subTitle: 'For YOU',
      decription: 'You have successfully signed up with a personal PAXI Portal account!',
      button: 'Login',
      buttonRouterLink: '/login'
    },
    {
      type: 'profile-created',
      isSidebar: true,
      heading: 'Account Management',
      imgPath: 'assets/img/success/success-with-bg.svg',
      title: 'Profile Created',
      button: 'Go to Dashboard',
      buttonRouterLink: '/dashboard'
    },
    {
      type: 'parcel-registered',
      isSidebar: false,
      heading: 'Complete',
      imgPath: 'assets/img/success/complete.svg',
      title: 'Complete',
      decription: 'Parcel has been sucessfully registered',
      button: 'Register Another Parcel',
      buttonRouterLink: '/register-parcel',
      buttonOptional: 'Return to Dashboard',
      buttonOptionalRouterLink: '/dashboard'
    }
  ];
  successType = '';
  successData?: ISuccessData;

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this._route.params.subscribe((params: Params) => {
      this.successType = params['type'];
    })
    this.successDataObj.map((obj) => {
      if (obj.type === this.successType) {
        this.successData = obj
      }
    })
    if (this.successData == null) {
      this._router.navigateByUrl('/');
    }
  }
}
