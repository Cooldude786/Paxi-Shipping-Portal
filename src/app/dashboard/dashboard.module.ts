import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { DASHBOARD_STATE_NAME } from './state/dashboard.selectors';
import { dashboardReducer } from './state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffect } from './state/dashboard.effects';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  {
    path: '',
    data: { animation: 'Component' },
    children: [
      { path: '', component: DashboardComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    InfiniteScrollModule, 
    RouterModule.forChild(routes),
    StoreModule.forFeature(DASHBOARD_STATE_NAME, dashboardReducer),
    EffectsModule.forFeature([DashboardEffect]),
  ]
})
export class DashboardModule {

}
