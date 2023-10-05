import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
// slick carousel package for slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingPageComponent,
        data: { animation: 'Component' },
      },
    ]),
    SlickCarouselModule,
    MatButtonModule
  ],
})
export class LandingPageModule {}
