import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParcelHistoryComponent } from './parcel-history/parcel-history.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { PARCEL_HISTORY_STATE_NAME } from './state/parcel_history.selectors';
import { parcelHistoryReducer } from './state/parcel_history.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ParcelHistoryEffect } from './state/parcel_history.effects';

const routes: Routes = [
  {
    path: ':id',
    data: { animation: 'Component' },
    children: [
      { path: '', component: ParcelHistoryComponent },
      {
        path: 'parcel-number/:id',
        children: [
          { path: '', component: ParcelHistoryComponent },
          { path: 'parcel-number', component: ParcelHistoryComponent }
        ]
      }
    ],
  },
];

@NgModule({
  declarations: [
    ParcelHistoryComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(PARCEL_HISTORY_STATE_NAME, parcelHistoryReducer),
    EffectsModule.forFeature([ParcelHistoryEffect]),
  ]
})
export class ParcelHistoryModule { }
