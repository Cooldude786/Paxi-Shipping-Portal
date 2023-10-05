import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/app.state';
import { getUserDetailsStart } from '../state/user.actions';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { Observable } from 'rxjs';
import { getEmail, getShipperId } from 'src/app/login/state/auth.selectors';
import { getMobile, getPassportNumber, getSaId } from '../state/user.selectors';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
  shipperId$?: Observable<number | null>;
  email$?: Observable<string>;
  mobile$?: Observable<string>;
  saId$?: Observable<string>;
  passportNumber$?: Observable<string>;

  constructor(private _store: Store<IAppState>) {}

  ngOnInit(): void {
    this._store.dispatch(setLoadingSpinner({ status: true }));
    this._store.dispatch(getUserDetailsStart());
    this.shipperId$ = this._store.select(getShipperId);
    this.email$ = this._store.select(getEmail);
    this.mobile$ = this._store.select(getMobile);
    this.saId$ = this._store.select(getSaId);
    this.passportNumber$ = this._store.select(getPassportNumber);
  }
}
