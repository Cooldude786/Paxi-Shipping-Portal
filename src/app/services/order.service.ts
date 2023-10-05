import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { IRegisterParcel, IParcelSuccess } from '../models/RegisterParcel.model';
import { Observable, Subscription } from 'rxjs';
import { IAppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { getParcelPayload } from '../register-parcel/state/register-parcel.selectors';
import { environment } from '../../environments/environment';
import { getEmail, getGuid, getShipperId } from '../login/state/auth.selectors';
@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnDestroy {
  payloadSubs: Subscription = new Subscription();
  shipperSubs: Subscription = new Subscription();
  guidSubs: Subscription = new Subscription();
  emailSubs: Subscription = new Subscription();

  constructor(private _httpClient: HttpClient, private _store: Store<IAppState>) { }

  createOreder(): Observable<IParcelSuccess> {
    let shipperIdNo: number = 0;
    this.shipperSubs = this._store.select(getShipperId).subscribe((val) => {
      shipperIdNo = val as number
    });
    let payload: IRegisterParcel = {
      shipperIdNo: shipperIdNo,
      orderNumber: '',
      parcelType: '',
      receiverNameSurname: '',
      receiverCell: '',
      description: '',
      destinationNodeCode: '',
      parcelNumber: '',
      orderSourceIdNo: 1

    };
    this.payloadSubs = this._store.select(getParcelPayload).subscribe((data) => {
      payload = {
        shipperIdNo: shipperIdNo,
        orderNumber: '',
        parcelType: '',
        parcelNumber: '',
        orderSourceIdNo: 1,
        receiverNameSurname: data.receiverNameSurname,
        receiverCell: data.receiverCell,
        description: data.description,
        destinationNodeCode: data.destinationNodeCode
      };
    });
    return this._httpClient.post<IParcelSuccess>(
      `${environment.apiUrl}/order`,
      payload
    );
  }

  preRegister(parcelNo: string): Observable<{success: boolean, parcelIdNo: number}> {
    let shipperIdNo: number = 0;
    let guid:string = '';
    let email:string = '';
    this.shipperSubs = this._store.select(getShipperId).subscribe(val => shipperIdNo = val as number);
    this.guidSubs = this._store.select(getGuid).subscribe(val => guid = val as string);
    this.emailSubs = this._store.select(getEmail).subscribe(val => email = val as string);

    const payload = {
      customerRefCode: parcelNo,
      rcvCustomerName: "",
      rcvCustomerCellPhone: "",
      description: "",
      destinationNodeCode: "",
      shipperAccountIdNo: shipperIdNo,
      sendCustomerOneProfileGUID: guid,
      sendCustomerCellphone: '',
      username: email,
      shipperOrderIdNo: 0
    };
    this.payloadSubs = this._store.select(getParcelPayload).subscribe((data) => {
      payload.rcvCustomerName = data.receiverNameSurname;
      payload.rcvCustomerCellPhone = data.receiverCell;
      payload.description = data.description;
      payload.destinationNodeCode = data.destinationNodeCode;
      payload.shipperOrderIdNo = data.shipperOrderIdNo as number;
    });

    return this._httpClient.post<{success: boolean, parcelIdNo: number}>
      (`${environment.apiUrl}/parcel/pre-registration`, payload);
  }

  ngOnDestroy(): void {
    this.payloadSubs?.unsubscribe();
    this.shipperSubs?.unsubscribe();
    this.guidSubs?.unsubscribe();
    this.emailSubs?.unsubscribe();
  }

  updateOrder(): Observable<IParcelSuccess> {
    let payload = {};
    this.payloadSubs = this._store.select(getParcelPayload).subscribe((data) => {
      payload = {
        orderIdNo:data.id,
        receiverNameSurname: data.receiverNameSurname,
        receiverCell: data.receiverCell,
        description: data.description,
        destinationNodeCode: data.destinationNodeCode
      };
    });
    return this._httpClient.put<IParcelSuccess>(
      `${environment.apiUrl}/order`,
      payload
    );
  }

}
