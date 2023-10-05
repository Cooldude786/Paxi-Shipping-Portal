import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from 'src/app/login/state/auth.actions';
import { getShipperId, isAuthenticated, getEmail } from 'src/app/login/state/auth.selectors';
import { IAppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { getUserDetailsStart } from 'src/app/user/state/user.actions';
import { getFullName } from 'src/app/user/state/user.selectors';
​
@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {
  isAuthenticated$?: Observable<boolean>;
  shipperId$?: Observable<number | null>;
  fullName$?: Observable<string>;
  email$?: Observable<string>;
  nav: string = "";
  constructor(private _router: Router, private _store:Store<IAppState>) { }
​
  ngOnInit(): void {
    this.nav = this._router.url;
    console.log(this.nav);

    this.isAuthenticated$ = this._store.select(isAuthenticated);
    this.shipperId$ = this._store.select(getShipperId);
    this._store.dispatch(getUserDetailsStart());
    this.fullName$ = this._store.select(getFullName);
    this.email$ = this._store.select(getEmail);
  }
​
  public isMenuOpen: boolean = false;
  public onSidenavClick(): void {
    this.isMenuOpen = false;
  }
  public menuNavigation(routePath : string){
    this.isMenuOpen = false;
    this._router.navigate([routePath]);
  }
​
  logout(event: Event) {
    event.preventDefault();
    this._store.dispatch(logout());
  }
}
