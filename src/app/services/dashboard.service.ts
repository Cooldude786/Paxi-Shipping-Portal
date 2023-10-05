import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IAppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { IParcelPayload,IParcelListSucess,IParcelHistorySucess,IParcelHistoryPayload } from '../models/Parcel.model';
import { getDashboardResult,getSearchText,getStatusGroup } from '../dashboard/state/dashboard.selectors';
import { environment } from '../../environments/environment';
import { getEmail, getShipperId } from '../login/state/auth.selectors';
import { getParcelIDNo } from '../parcel-history/state/parcel_history.selectors';

@Injectable({
  providedIn: 'root',
})

export class DashboardService implements OnInit, OnDestroy {
  emailSubs: Subscription = new Subscription();
  shipperSubs: Subscription = new Subscription();
  searchSub: Subscription = new Subscription();
  statusSub: Subscription = new Subscription();
  parcelIdNoSub: Subscription = new Subscription();
  totalCount: number = 0;
  constructor( private _httpClient: HttpClient,private _store: Store<IAppState>) {}
  ngOnDestroy(): void {
    this.emailSubs.unsubscribe();
    this.shipperSubs.unsubscribe();
    this.searchSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.parcelIdNoSub.unsubscribe();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  dashboardOrderListing(): Observable<IParcelListSucess> {
    let email: string;
    let payload: IParcelPayload = {
      // shipperIdNo: 136242513523,
      searchTerm:'',
      statusGroup: null,
    }
    this.emailSubs = this._store.select(getEmail).subscribe((val) => {
      payload.username = val
    })
    this.shipperSubs = this._store.select(getShipperId).subscribe((val) => {
      payload.shipperIdNo = val as number
    });
    this.searchSub = this._store.select(getSearchText).subscribe((val) => {
      if(val != ""){
        payload.searchTerm = val as string
      }
    });
    this.statusSub = this._store.select(getStatusGroup).subscribe((val) => {
      if(val){
        if(val.length > 0){
          payload.statusGroup = val
        }else{
          payload.statusGroup = null
        }
      }
    });
    return this._httpClient.post<IParcelListSucess>(
      `${environment.apiUrl}/dashboard/fetch-order-parcel?startIndex=0&pageSize=10&orderType=DESc`,
      payload
    );
  }
  dashboardOrderListing1(): Observable<IParcelListSucess> {
    var startIndex = 0;
    let payload: IParcelPayload = {
      // shipperIdNo: 136242513523,
      searchTerm:'',
      statusGroup: null,
    }
    this.emailSubs = this._store.select(getEmail).subscribe((val) => {
      payload.username = val
    });
    this.shipperSubs = this._store.select(getShipperId).subscribe((val) => {
      payload.shipperIdNo = val as number
    });
    this.searchSub = this._store.select(getSearchText).subscribe((val) => {
      if(val != ""){
        payload.searchTerm = val as string
      }
    });
    this.statusSub = this._store.select(getStatusGroup).subscribe((val) => {
      if(val){
        if(val.length > 0){
          payload.statusGroup = val
        }else{
          payload.statusGroup = null
        }
      }
    });
    this._store.select(getDashboardResult).subscribe((data) => {
      if (data?.results) {
        startIndex = data.results.length + 10;
      }
    });
    this.totalCount = startIndex;
    return this._httpClient.post<IParcelListSucess>(
      `${environment.apiUrl}/dashboard/fetch-order-parcel?startIndex=0&pageSize=${startIndex}&orderType=DESC`,
      payload
    );
  }

  // Fetch single parcel Detail
  fetchParcelDetail(): Observable<IParcelHistorySucess[]> {
    console.log(environment.apiUrl);
    let payload: IParcelHistoryPayload = {
      "parcelIdNo": 0,
      "customerVisibleOnly": "Y"
    }
    this.parcelIdNoSub = this._store.select(getParcelIDNo).subscribe((val) => {
      payload.parcelIdNo = val as number
    });
    return this._httpClient.post<IParcelHistorySucess[]>(
      `${environment.apiUrl}/parcel/tracking`,
      payload
    );
  }
}
