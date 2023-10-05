import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { getToken } from '../login/state/auth.selectors';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private _store: Store<IAppState>) {}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._store.select(getToken).pipe(
      take(1),
      exhaustMap((token) => {

        if (!token) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(modifiedRequest);
      })
    )
  }
}
