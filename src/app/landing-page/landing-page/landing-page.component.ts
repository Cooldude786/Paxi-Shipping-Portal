import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ISlide {
  title: String;
  content: String;
  image: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  slides:ISlide[] = [
    {
      title: 'Send it quickly',
      content: 'With the new pre-register feature, you can fill out everything you need to right from your phone. Skip the wait!',
      image: 'assets/img/landing-page/slider-1.svg'
    },
    {
      title: 'Send it far.',
      content: 'With over 2800 PAXI Points across South Africa, you can send your parcel to every corner of the country with ease!',
      image: 'assets/img/landing-page/slider-2.svg'
    },
    {
      title: 'Trusted',
      content: 'Monitor all your parcels on our Portal Dashboard until they reach their destination and get collected!',
      image: 'assets/img/landing-page/slider-3.svg'
    },
  ];

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots" : true,
    "showArrow" : false,
    "autoplay": true,
    "autoplaySpeed" : 2000,
    "pauseOnHover" : false,
    "infinite" : true,
    "responsive" : [
      {
        "breakpoint" : 375,
        "settings" : {
          "infinite" : true,
          "slidesToShow" : 1,
          "slidesToScroll" : 1
        }
      },
    ]
  };

  constructor(private _router: Router) {}

  redirect(val: String) {
    if (val == 'signup'){
      this._router.navigateByUrl("/registration")
    }

    if (val == 'login') {
      this._router.navigate(["/login"]);
    }
    return;
  }
}
