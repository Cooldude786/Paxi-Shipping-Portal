import { Component,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import {
  parcelHistoryPageInitiate
} from '../state/parcel_history.actions';
import { IParcelHistoryPayload,IParcelHistorySucess} from 'src/app/models/Parcel.model';
import { getParcelHistoryResult } from '../state/parcel_history.selectors'
import { getShipperId } from '../../login/state/auth.selectors';

@Component({
  selector: 'app-parcel-history',
  templateUrl: './parcel-history.component.html',
  styleUrls: ['./parcel-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParcelHistoryComponent{
  shipperId!:number;
  trackingDetailURL?: SafeResourceUrl;
  trackingNumber!: string;
  parcelDetail!:IParcelHistorySucess[];
  today = new Date().toJSON();
  constructor(private _store:Store<IAppState>, private route: ActivatedRoute,public sanitizer: DomSanitizer,private _router: Router){
    const payload: IParcelHistoryPayload = {
      parcelIdNo: this.route.snapshot.params['id'],
      customerVisibleOnly: 'Y'
    }
    this._store.dispatch(parcelHistoryPageInitiate({ payload }));
    this._store.select(getParcelHistoryResult).subscribe((data) => {
      if (data != undefined) {
        this.parcelDetail = data;
        this.trackingDetailURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.trackingURL+this.parcelDetail[0].customerRefCode);
      }
    });
    this._store.select(getShipperId).subscribe(
      (shipperId) => {
        if(shipperId){
          this.shipperId = shipperId;
        }
      }
    );
  }
  public menuNavigation(routePath : string){
    this._router.navigate([routePath]);
  }
}
